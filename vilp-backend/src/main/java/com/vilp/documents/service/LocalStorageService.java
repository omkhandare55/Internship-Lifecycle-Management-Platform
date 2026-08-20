package com.vilp.documents.service;

import com.vilp.exception.AuthException;
import com.vilp.exception.ResourceNotFoundException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;

@Service
@ConditionalOnMissingBean(SupabaseStorageService.class)
@Slf4j
public class LocalStorageService implements StorageService {

    @Value("${app.storage.local-dir:./uploads}")
    private String uploadDir;

    private Path rootLocation;

    private static final List<String> ALLOWED_MIME_TYPES = List.of(
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
            "image/jpeg",
            "image/png"
    );

    @PostConstruct
    public void init() {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rootLocation);
            log.info("Storage directory initialized at {}", this.rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directory", e);
        }
    }

    @Override
    public String store(MultipartFile file, String subDirectory) throws IOException {
        if (file.isEmpty()) {
            throw new AuthException("EMPTY_FILE", "Failed to store empty file");
        }

        String mimeType = file.getContentType();
        if (mimeType == null || !ALLOWED_MIME_TYPES.contains(mimeType.toLowerCase())) {
            throw new AuthException("INVALID_FILE_TYPE", "File type not supported. Allowed: PDF, DOCX, JPG, PNG");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "document");
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex >= 0) {
            extension = originalFilename.substring(dotIndex);
        }

        String storageFileName = UUID.randomUUID().toString() + extension;
        Path targetDir = this.rootLocation.resolve(subDirectory).normalize();
        Files.createDirectories(targetDir);

        Path targetLocation = targetDir.resolve(storageFileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return subDirectory + "/" + storageFileName;
    }

    @Override
    public Resource loadAsResource(String storageKey) {
        try {
            Path filePath = this.rootLocation.resolve(storageKey).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found or unreadable: " + storageKey);
            }
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Error loading file: " + storageKey);
        }
    }

    @Override
    public void delete(String storageKey) {
        try {
            Path filePath = this.rootLocation.resolve(storageKey).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.warn("Failed to delete file at {}", storageKey, e);
        }
    }
}
