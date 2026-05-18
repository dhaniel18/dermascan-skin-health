-- ============================================================
-- Migration: Add AI research audit log + security hardening
-- ============================================================

-- Audit log for every AI ingredient research call
CREATE TABLE IF NOT EXISTS ai_research_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  resolved_id     TEXT,
  success         BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_arl_user    ON ai_research_log (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_arl_created ON ai_research_log (created_at DESC);

-- RLS: users can only see their own logs
ALTER TABLE ai_research_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "arl_self" ON ai_research_log
  USING (auth.uid() = user_id);

-- Persist rate limit counters in DB for cross-isolate enforcement
CREATE TABLE IF NOT EXISTS rate_limit_counters (
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint     TEXT NOT NULL,
  count        INT  NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY  (user_id, endpoint)
);

ALTER TABLE rate_limit_counters ENABLE ROW LEVEL SECURITY;
-- Only the service role (Edge Function) can write to this table
CREATE POLICY "rlc_service_only" ON rate_limit_counters
  USING (false); -- no direct client access

-- Security: track failed login attempts
CREATE TABLE IF NOT EXISTS security_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,  -- login_failed | rate_limited | invalid_input | suspicious
  ip_hash    TEXT,           -- hashed IP, never raw
  metadata   JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_se_created ON security_events (created_at DESC);
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "se_no_client_access" ON security_events USING (false);
