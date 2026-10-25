

-- Execute on the PostgreSQL database before deploying the secured backend.
ALTER TABLE professores
    ADD COLUMN IF NOT EXISTS senha_hash VARCHAR(255);

CREATE UNIQUE INDEX IF NOT EXISTS ux_professores_email_admin
    ON professores (LOWER(email))
    WHERE senha_hash IS NOT NULL;
