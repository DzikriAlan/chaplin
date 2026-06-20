DROP TABLE IF EXISTS "chat_cache";

CREATE TABLE "chat_cache" (
  "id"           TEXT          PRIMARY KEY,
  "questionHash" TEXT          UNIQUE NOT NULL,
  "question"     TEXT          NOT NULL,
  "answer"       TEXT          NOT NULL,
  "sources"      JSONB,
  "embedding"    vector(1024),
  "createdAt"    TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS chat_cache_embedding_idx
  ON "chat_cache" USING hnsw ("embedding" vector_cosine_ops);
