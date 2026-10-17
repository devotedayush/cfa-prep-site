-- Remove the abandoned single-user prototype tables (empty, RLS-disabled,
-- superseded by the study_* tables). CASCADE clears their FKs/sequences.
drop table if exists public.mock_section_scores cascade;
drop table if exists public.mock_tests cascade;
drop table if exists public.progress_records cascade;
drop table if exists public.ai_assessments cascade;
drop table if exists public.subtopics cascade;
drop table if exists public.topics cascade;
drop table if exists public.subjects cascade;
