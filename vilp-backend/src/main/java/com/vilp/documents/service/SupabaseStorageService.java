package com.vilp.documents.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.classic.methods.HttpDelete;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.io.entity.ByteArrayEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Supabase Storage Service
 * Replaces LocalStorageService for production deployments.
 * Active when SUPABASE_URL environment variable is set.
 *
 * Files are stored in the configured bucket under the path:
 *   {entityType}/{entityId}/{uuid}.{ext}
 *
 * Generates public signed URLs for download (1 hour expiry).
 */
@Service
@ConditionalOnProperty(name = "app.supabase.url", matchIfMissing = false)
@Slf4j
public class SupabaseStorageService implements StorageService {

    @Value("${app.supabase.url}")
    private String supabaseUrl;

    @Value("${app.supabase.service-role-key}")
    private String serviceRoleKey;

    @Value("${app.supabase.storage-bucket:vilp-documents}")
    private String bucket;

    private static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    private static final List<String> ALLOWED_MIME_TYPES = List.of(
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
            "image/jpeg",
            "image/png"
    );

    @Override
    public String store(MultipartFile file, String subDirectory) throws IOException {
        if (file.isEmpty()) {
            throw new com.vilp.exception.AuthException("EMPTY_FILE", "Cannot upload an empty file");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new com.vilp.exception.AuthException("FILE_TOO_LARGE", "File exceeds maximum allowed size of 10 MB");
        }
        String mimeType = file.getContentType();
        if (mimeType == null || !ALLOWED_MIME_TYPES.contains(mimeType.toLowerCase())) {
            throw new com.vilp.exception.AuthException("INVALID_FILE_TYPE",
                    "File type not allowed. Permitted: PDF, DOCX, JPG, PNG");
        }

        String originalFilename = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "document");
        String extension = "";
        int dotIdx = originalFilename.lastIndexOf('.');
        if (dotIdx >= 0) extension = originalFilename.substring(dotIdx);

        String storageKey = subDirectory + "/" + UUID.randomUUID() + extension;
        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + storageKey;

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost post = new HttpPost(uploadUrl);
            post.setHeader("Authorization", "Bearer " + serviceRoleKey);
            post.setHeader("apikey", serviceRoleKey);
            post.setHeader("x-upsert", "false");
            post.setEntity(new ByteArrayEntity(file.getBytes(),
                    ContentType.create(mimeType)));

            httpClient.execute(post, response -> {
                int status = response.getCode();
                if (status < 200 || status >= 300) {
                    throw new IOException("Supabase upload failed with HTTP " + status);
                }
                return null;
            });
        }

        log.info("Uploaded to Supabase Storage: {}/{}", bucket, storageKey);
        return storageKey;
    }

    @Override
    public Resource loadAsResource(String storageKey) {
        // Return a download redirect URL as a ByteArrayResource wrapping the URL bytes
        // Callers should use getSignedUrl() for actual download — this is a fallback
        String downloadUrl = supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + storageKey;
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet get = new HttpGet(downloadUrl);
            get.setHeader("Authorization", "Bearer " + serviceRoleKey);
            get.setHeader("apikey", serviceRoleKey);
            return httpClient.execute(get, response -> {
                int status = response.getCode();
                if (status < 200 || status >= 300) {
                    throw new com.vilp.exception.ResourceNotFoundException("File not found in Supabase Storage: " + storageKey);
                }
                byte[] bytes = response.getEntity().getContent().readAllBytes();
                return new ByteArrayResource(bytes);
            });
        } catch (IOException e) {
            throw new com.vilp.exception.ResourceNotFoundException("Failed to load file: " + storageKey);
        }
    }

    @Override
    public void delete(String storageKey) {
        String deleteUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + storageKey;
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpDelete delete = new HttpDelete(deleteUrl);
            delete.setHeader("Authorization", "Bearer " + serviceRoleKey);
            delete.setHeader("apikey", serviceRoleKey);
            httpClient.execute(delete, response -> null);
            log.info("Deleted from Supabase Storage: {}", storageKey);
        } catch (IOException e) {
            log.warn("Failed to delete file from Supabase Storage: {}", storageKey, e);
        }
    }

    /**
     * Generates a signed download URL valid for the specified number of seconds.
     * Use this in DocumentController instead of serving bytes directly.
     */
    public String getSignedUrl(String storageKey, int expiresInSeconds) {
        String signUrl = supabaseUrl + "/storage/v1/object/sign/" + bucket + "/" + storageKey;
        String body = "{\"expiresIn\": " + expiresInSeconds + "}";

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost post = new HttpPost(signUrl);
            post.setHeader("Authorization", "Bearer " + serviceRoleKey);
            post.setHeader("apikey", serviceRoleKey);
            post.setHeader("Content-Type", "application/json");
            post.setEntity(new ByteArrayEntity(body.getBytes(), ContentType.APPLICATION_JSON));

            return httpClient.execute(post, response -> {
                String responseBody = new String(response.getEntity().getContent().readAllBytes());
                // Parse signedURL from JSON: {"signedURL": "...", "token": "..."}
                int start = responseBody.indexOf('"', responseBody.indexOf("signedURL") + 9) + 1;
                int end = responseBody.indexOf('"', start);
                if (start > 0 && end > start) {
                    return supabaseUrl + responseBody.substring(start, end);
                }
                throw new IOException("Could not parse signed URL from Supabase response");
            });
        } catch (IOException e) {
            log.error("Failed to generate signed URL for {}: {}", storageKey, e.getMessage());
            // Fallback to public URL (works for public buckets)
            return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + storageKey;
        }
    }
}
