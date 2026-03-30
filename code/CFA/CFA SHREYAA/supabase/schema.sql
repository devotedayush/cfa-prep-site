-- Profiles & Settings
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  exam_date DATE,
  target_study_hours NUMERIC,
  preferred_pacing TEXT DEFAULT 'balanced', 
  created_at TIMESTAMP DEFAULT NOW()
);

-- Syllabus Hierarchy
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  weight_percentage NUMERIC
);

CREATE TABLE topics (
  id SERIAL PRIMARY KEY,
  subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  priority_weight NUMERIC DEFAULT 1.0,
  time_estimate_minutes INT
);

CREATE TABLE subtopics (
  id SERIAL PRIMARY KEY,
  topic_id INT REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'not started',
  self_confidence NUMERIC(2,1), 
  ai_mastery NUMERIC(2,1),      
  time_spent_minutes INT DEFAULT 0,
  last_studied_date DATE,
  revision_due_date DATE,
  times_revised INT DEFAULT 0
);

-- Logging & Assessment Records
CREATE TABLE progress_records (
  id SERIAL PRIMARY KEY,
  subtopic_id INT REFERENCES subtopics(id),
  user_id UUID REFERENCES auth.users(id),
  studied_date DATE DEFAULT NOW(),
  time_spent_minutes INT,
  confidence_rating INT,
  is_revision BOOLEAN DEFAULT FALSE,
  notes TEXT,
  felt_difficulty TEXT 
);

CREATE TABLE ai_assessments (
  id SERIAL PRIMARY KEY,
  subtopic_id INT REFERENCES subtopics(id),
  user_id UUID REFERENCES auth.users(id),
  taken_at TIMESTAMP DEFAULT NOW(),
  generated_mcqs JSONB,
  user_answers JSONB,   
  score_percentage NUMERIC,
  ai_mastery_estimate NUMERIC(2,1),
  error_categories JSONB, 
  explanation_summary TEXT,
  recommended_action TEXT
);

CREATE TABLE mock_tests (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  taken_at DATE DEFAULT NOW(),
  total_score NUMERIC,
  time_taken_minutes INT,
  notes TEXT
);

CREATE TABLE mock_section_scores (
  id SERIAL PRIMARY KEY,
  mock_id INT REFERENCES mock_tests(id) ON DELETE CASCADE,
  subject_id INT REFERENCES subjects(id),
  score NUMERIC
);

-- RLS (Row Level Security) - Simplistic single-user isolation
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- For the topics and subjects, typically global to all users if it's general CFA data
-- but we'll assume here everything is either global or user-scoped. 
-- For a single-user app, we might disable RLS to avoid hassle, or apply simplest user scoped rules.
