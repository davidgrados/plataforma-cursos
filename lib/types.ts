// ============================================================
//  Tipos compartidos entre frontend y API
// ============================================================

export type LessonType = 'chapter' | 'practice' | 'exam';

export interface Course {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  created_at?: string;
  /** Nº de módulos (0 = curso aún en preparación / "próximamente") */
  module_count?: number;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  order_num: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  slug: string;
  module_id: number;
  title: string;
  type: LessonType;
  content_md: string;
  initial_fs: string;
  check_logic?: string | null;
  order_num: number;
  // Relaciones opcionales resueltas por la API
  module?: Module;
  course?: Course;
  completed?: boolean;
}

export interface CourseDetail extends Course {
  modules: Module[];
}

// ------------------------------------------------------------
//  Sistema de archivos virtual (JSON)
// ------------------------------------------------------------
export type FSNode = string | FSDir;
export interface FSDir {
  [name: string]: FSNode;
}

export interface ExecResult {
  output: string;
  fs: FSDir;
  cwd: string;
  clear: boolean;
}

export interface CheckResult {
  passed: boolean;
  message: string;
}

export interface TerminalResponse {
  output?: string;
  current_path: string;
  clear?: boolean;
  passed?: boolean;
  message?: string;
}
