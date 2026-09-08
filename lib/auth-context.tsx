'use client';

import { createContext, useContext } from 'react';
import { useAuth } from '@clerk/nextjs';

// Modo vista previa: si no hay clave pública de Clerk configurada, la app
// funciona sin autenticación con un usuario fijo (para ver el curso localmente).
export const PREVIEW_MODE = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
export const PREVIEW_USER_ID = 'preview_student';

interface AuthState {
  userId: string | null;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthState>({ userId: null, isLoaded: true });

/** Hook unificado: devuelve el userId (de Clerk o del modo vista previa). */
export function useAuthUser(): AuthState {
  return useContext(AuthContext);
}

/** Puente que expone el estado de Clerk a través del contexto propio. */
export function ClerkAuthBridge({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded } = useAuth();
  return (
    <AuthContext.Provider value={{ userId: userId ?? null, isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Proveedor del modo vista previa (sin Clerk): usuario fijo. */
export function PreviewAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={{ userId: PREVIEW_USER_ID, isLoaded: true }}>
      {children}
    </AuthContext.Provider>
  );
}
