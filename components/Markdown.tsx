'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Volume2 } from 'lucide-react';
import 'highlight.js/styles/github.css';

function speak(text: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    } catch {
      /* ignore */
    }
  }
}

/**
 * Renderiza contenido Markdown (GFM + resaltado).
 * Si `speakEnabled` es true, cada fragmento de texto entre backticks
 * (código en línea) muestra un botón 🔊 para escuchar su pronunciación.
 */
export default function Markdown({ content, speakEnabled = false }: { content: string; speakEnabled?: boolean }) {
  const components = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code({ className, children, ...props }: any) {
      const isInline = !className;
      const text = String(children ?? '').replace(/\n$/, '');
      if (speakEnabled && isInline && text.trim()) {
        return (
          <span className="inline-flex items-center gap-1 align-baseline">
            <code className="rounded bg-sky-100 px-1 py-0.5 text-sky-800" {...props}>
              {children}
            </code>
            <button
              type="button"
              title="Escuchar pronunciación (inglés)"
              aria-label="Escuchar"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                speak(text);
              }}
              className="inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent text-white transition hover:brightness-90"
            >
              <Volume2 className="h-2.5 w-2.5" />
            </button>
          </span>
        );
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-headings:text-slate-900 prose-a:text-sky-700 prose-code:text-sky-800 prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:border prose-pre:border-slate-200 prose-img:rounded-xl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
