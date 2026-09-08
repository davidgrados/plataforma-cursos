import { error, getClerkId, getEnv, json, readJson, type Env } from '@/lib/cloudflare';
import { ensureUser, markCompleted, saveSession } from '@/lib/d1';
import { executeCommand, runCheckLogic } from '@/lib/terminal';

// ============================================================
//  API del terminal simulado.
//
//  GET  /api/terminal?lesson_id=N  -> restaura el current_path
//  POST /api/terminal              -> { lesson_id, command?, action? }
//    action: 'exec'   (default) ejecuta un comando
//            'verify' valida el ejercicio (check_logic)
//            'reset'  restaura el FS inicial de la lecciÃ³n
// ============================================================

const HOME = '/home/student';

async function loadState(env: Env, clerkId: string, lessonId: number) {
  const session = await env.DB.prepare(
    'SELECT * FROM user_sessions WHERE clerk_id = ? AND lesson_id = ?',
  )
    .bind(clerkId, lessonId)
    .first();

  const lesson = await env.DB.prepare('SELECT * FROM lessons WHERE id = ?')
    .bind(lessonId)
    .first();

  const fs = session ? JSON.parse(session.virtual_fs) : JSON.parse(lesson.initial_fs);
  const cwd = session ? session.current_path : HOME;
  return { fs, cwd, lesson };
}

export async function GET(request: Request) {
  const env = await getEnv();
  const clerkId = getClerkId(request);
  if (!clerkId) return error('No autenticado', 401);
  await ensureUser(env, clerkId);

  const url = new URL(request.url);
  const lessonId = Number(url.searchParams.get('lesson_id'));
  if (!lessonId) return error('Falta el parÃ¡metro lesson_id');

  const { cwd } = await loadState(env, clerkId, lessonId);
  return json({ current_path: cwd });
}

export async function POST(request: Request) {
  const env = await getEnv();
  const clerkId = getClerkId(request);
  if (!clerkId) return error('No autenticado', 401);
  await ensureUser(env, clerkId);

  const body = await readJson(request);
  const lessonId = Number(body.lesson_id);
  const action = body.action || 'exec';

  if (!lessonId) return error('Falta lesson_id');

  const { fs, cwd, lesson } = await loadState(env, clerkId, lessonId);
  if (!lesson) return error('LecciÃ³n no encontrada', 404);

  // --- Reiniciar sesiÃ³n ---
  if (action === 'reset') {
    const freshFs = JSON.parse(lesson.initial_fs);
    await saveSession(env, clerkId, lessonId, freshFs, HOME);
    return json({
      output: 'SesiÃ³n reiniciada. Estado del sistema de archivos restaurado.',
      current_path: HOME,
    });
  }

  // --- Verificar ejercicio ---
  if (action === 'verify') {
    const result = runCheckLogic(fs, cwd, lesson.check_logic);
    if (result.passed) {
      await markCompleted(env, clerkId, lessonId);
    }
    return json({ ...result, current_path: cwd });
  }

  // --- Ejecutar comando ---
  const result = executeCommand(fs, cwd, body.command || '');
  await saveSession(env, clerkId, lessonId, result.fs, result.cwd);
  return json({
    output: result.output,
    current_path: result.cwd,
    clear: result.clear,
  });
}
