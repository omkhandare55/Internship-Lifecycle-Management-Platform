#!/usr/bin/env bash
# VILP Database Backup Utility
# Takes a timestamped pg_dump from PostgreSQL container

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="vilpdb_backup_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "Starting VILP database snapshot..."
docker exec -t vilp-postgres pg_dump -U vilpuser -d vilpdb | gzip > "${BACKUP_DIR}/${FILENAME}"

echo "Database backup created successfully: ${BACKUP_DIR}/${FILENAME}"
