-- ============================================================
-- Migration: corrige tipos INT → BIGINT na tabela alunos
-- e nas FK columns de enderecosalunos que referenciam alunos.id
-- Execute UMA VEZ no banco recodedb antes de iniciar a aplicação
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Altera alunos.id para BIGINT (compatível com JPA Long)
ALTER TABLE alunos MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;

-- 2. Altera colunas FK de alunos nas outras tabelas
ALTER TABLE alunos    MODIFY COLUMN cursoid  BIGINT DEFAULT NULL;
ALTER TABLE alunos    MODIFY COLUMN escolaid BIGINT DEFAULT NULL;

SET FOREIGN_KEY_CHECKS = 1;
