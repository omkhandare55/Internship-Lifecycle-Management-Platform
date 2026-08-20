# Backend Dockerfile — Multi-stage build
# Stage 1: Build with Maven
# Stage 2: Run with JRE 21 slim

FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy POM first (Docker layer cache optimization)
COPY pom.xml .

# Download dependencies (cached layer unless pom.xml changes)
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src/ src/
RUN mvn clean package -DskipTests -B

# ─── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Add curl for healthcheck & non-root user with full permissions on /app and /app/uploads
RUN apk add --no-cache curl && \
    addgroup -S vilp && adduser -S vilp -G vilp && \
    mkdir -p /app/uploads && \
    chown -R vilp:vilp /app

USER vilp

# Copy built JAR
COPY --chown=vilp:vilp --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
