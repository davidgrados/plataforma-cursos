import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <SignIn signUpUrl="/sign-up" />
      <p className="max-w-sm text-center text-xs leading-relaxed text-slate-500">
        La cuenta es <strong>opcional</strong>: sirve para guardar tu progreso. Al iniciar sesión
        aceptas nuestros{' '}
        <Link href="/terminos" className="font-semibold text-sky-700 underline">
          Términos y Condiciones
        </Link>{' '}
        y nuestra{' '}
        <Link href="/privacidad" className="font-semibold text-sky-700 underline">
          Política de Privacidad
        </Link>
        .
      </p>
    </div>
  );
}
