-- ============================================================
--  Esquema de base de datos D1 (SQLite)
--  Plataforma multi-curso con laboratorio Linux interactivo
-- ============================================================

PRAGMA foreign_keys = ON;

-- Cursos (nivel superior)
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,               -- opcional, portada del curso
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Módulos (pertenecen a un curso)
CREATE TABLE IF NOT EXISTS modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  order_num INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Lecciones (capítulos, prácticas, exámenes)
CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  module_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('chapter','practice','exam')),
  content_md TEXT NOT NULL,          -- Markdown
  initial_fs TEXT NOT NULL,          -- JSON del sistema de archivos inicial
  check_logic TEXT,                  -- Código JS (string) para validar el ejercicio
  order_num INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- Usuarios (sincronizados con Clerk)
CREATE TABLE IF NOT EXISTS users (
  clerk_id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'student',       -- 'admin' o 'student'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sesión de terminal (progreso por usuario/lección)
CREATE TABLE IF NOT EXISTS user_sessions (
  clerk_id TEXT NOT NULL,
  lesson_id INTEGER NOT NULL,
  current_path TEXT DEFAULT '/home/student',
  virtual_fs TEXT NOT NULL,          -- JSON del estado actual del FS
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (clerk_id, lesson_id),
  FOREIGN KEY (clerk_id) REFERENCES users(clerk_id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- Progreso de ejercicios completados
CREATE TABLE IF NOT EXISTS user_progress (
  clerk_id TEXT NOT NULL,
  lesson_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at DATETIME,
  PRIMARY KEY (clerk_id, lesson_id),
  FOREIGN KEY (clerk_id) REFERENCES users(clerk_id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_sessions_lesson ON user_sessions(lesson_id);
