package com.vilp.documents.repository;

import com.vilp.documents.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {

    List<Document> findByEntityTypeAndEntityId(String entityType, UUID entityId);

    List<Document> findByUploadedById(UUID uploadedById);

    Page<Document> findByStatus(String status, Pageable pageable);

    List<Document> findByEntityTypeAndEntityIdAndDocumentType(String entityType, UUID entityId, String documentType);
}
