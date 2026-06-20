-- Supabase schema — run this in the SQL editor on your Supabase project
-- Equivalent to Prisma models: UserBalance, FaqManager, VectorsSop, UsageLog

-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- ── user_balances ─────────────────────────────────────────────────────────
CREATE TABLE public.user_balances (
  id              TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id         TEXT        NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  balance         INTEGER     NOT NULL DEFAULT 19000,
  file_size_bytes BIGINT      NOT NULL DEFAULT 0,
  plan            TEXT        NOT NULL DEFAULT 'starter',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_balances: own row"
  ON public.user_balances FOR ALL
  USING (user_id = auth.uid()::text);

-- ── faq_manager ───────────────────────────────────────────────────────────
-- question: max 250 chars (enforced at API level)
-- answer  : max 1000 chars (enforced at API level)
-- max 50 FAQ per user (enforced at API level)
CREATE TABLE public.faq_manager (
  id         TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id    TEXT        NOT NULL REFERENCES public.user_balances(user_id) ON DELETE CASCADE,
  question   TEXT        NOT NULL,
  answer     TEXT        NOT NULL,
  embedding  VECTOR(1024),
  is_active  BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX faq_manager_user_id ON public.faq_manager (user_id);
CREATE INDEX faq_manager_embedding ON public.faq_manager
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

ALTER TABLE public.faq_manager ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faq_manager: own rows"
  ON public.faq_manager FOR ALL
  USING (user_id = auth.uid()::text);

-- ── vectors_sop ───────────────────────────────────────────────────────────
-- Stores chunked text from PDF / Google Drive, vectorised via Jina
-- source_type: 'pdf' | 'gdrive'
-- Total file size per user: max 5 MB (enforced at API level)
CREATE TABLE public.vectors_sop (
  id          TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id     TEXT        NOT NULL REFERENCES public.user_balances(user_id) ON DELETE CASCADE,
  source_type TEXT        NOT NULL CHECK (source_type IN ('pdf', 'gdrive')),
  source_name TEXT        NOT NULL,
  source_url  TEXT,
  chunk_index INTEGER     NOT NULL DEFAULT 0,
  content     TEXT        NOT NULL,
  embedding   VECTOR(1024),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX vectors_sop_user_id ON public.vectors_sop (user_id);
CREATE INDEX vectors_sop_embedding ON public.vectors_sop
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

ALTER TABLE public.vectors_sop ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vectors_sop: own rows"
  ON public.vectors_sop FOR ALL
  USING (user_id = auth.uid()::text);

-- ── usage_logs ────────────────────────────────────────────────────────────
-- activity_type: 'chat' (-50) | 'sync' (-500) | 'topup' (positive deduction = credit)
CREATE TABLE public.usage_logs (
  id             TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id        TEXT        NOT NULL REFERENCES public.user_balances(user_id) ON DELETE CASCADE,
  activity_type  TEXT        NOT NULL,
  sender_name    TEXT,
  deduction      INTEGER     NOT NULL,
  balance_before INTEGER     NOT NULL,
  balance_after  INTEGER     NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX usage_logs_user_created ON public.usage_logs (user_id, created_at DESC);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "usage_logs: own rows"
  ON public.usage_logs FOR ALL
  USING (user_id = auth.uid()::text);

-- ── updated_at trigger ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER user_balances_updated_at
  BEFORE UPDATE ON public.user_balances
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER faq_manager_updated_at
  BEFORE UPDATE ON public.faq_manager
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
