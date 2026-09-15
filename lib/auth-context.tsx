'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
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

// ------------------------------------------------------------
//  Token de sesión de Clerk.
//
//  La API verifica este token en el servidor (con la clave secreta),
//  por lo que el navegador NO puede hacerse pasar por otro usuario.
// ------------------------------------------------------------
let tokenGetter: (() => Promise<string | null>) | null = null;
let tokenCache: { valor: string; expira: number } | null = null;

/** Devuelve un token de sesión válido (se reutiliza mientras no caduque). */
export async function getAuthToken(): Promise<string | null> {
  if (!tokenGetter) return null;
  const ahora = Date.now();
  if (tokenCache && tokenCache.expira > ahora + 5_000) return tokenCache.valor;
  try {
    const token = await tokenGetter();
    if (token) {
      // Los tokens de Clerk duran ~60 s: lo guardamos un poco menos.
      tokenCache = { valor: token, expira: ahora + 45_000 };
    }
    return token;
  } catch {
    return null;
  }
}

/** Puente que expone el estado de Clerk a través del contexto propio. */
export function ClerkAuthBridge({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded, getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  useEffect(() => {
    tokenGetter = () => getTokenRef.current();
    return () => {
      tokenGetter = null;
      tokenCache = null;
    };
  }, []);

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
