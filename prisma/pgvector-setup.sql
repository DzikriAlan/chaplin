-- Run once before prisma generate
CREATE EXTENSION IF NOT EXISTS vector;

-- Migrate existing text embeddings (stored as JSON arrays) to vector type
ALTER TABLE "document_chunks"
  ALTER COLUMN "embedding" TYPE vector(1024)
  USING CASE WHEN "embedding" IS NULL THEN NULL ELSE "embedding"::vector(1024) END;

-- Add embedding column to knowledge_base
ALTER TABLE "knowledge_base"
  ADD COLUMN IF NOT EXISTS "embedding" vector(1024);

-- HNSW indexes for fast cosine similarity search (no minimum row count needed)
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx
  ON "document_chunks" USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS knowledge_base_embedding_idx
  ON "knowledge_base" USING hnsw (embedding vector_cosine_ops);
