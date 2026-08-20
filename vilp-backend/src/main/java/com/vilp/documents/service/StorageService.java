package com.vilp.documents.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface StorageService {
    String store(MultipartFile file, String subDirectory) throws IOException;
    Resource loadAsResource(String storageKey);
    void delete(String storageKey);
}
