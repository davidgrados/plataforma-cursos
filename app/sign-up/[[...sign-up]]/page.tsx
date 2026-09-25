import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <SignUp signInUrl="/sign-in" />
      <p className="max-w-sm text-center text-xs leading-relaxed text-slate-500">
        Al crear tu cuenta aceptas nuestros{' '}
        <Link href="/terminos" className="font-semibold text-sky-700 underline">
          Términos y Condiciones
        </Link>{' '}
        y nuestra{' '}
        <Link href="/privacidad" className="font-semibold text-sky-700 underline">
          Política de Privacidad
        </Link>
        . Si eres menor de 14 años, necesitarás la autorización de tu madre, padre o tutor.
      </p>
    </div>
  );
}
