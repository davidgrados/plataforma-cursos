'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'easymde/dist/easymde.min.css';

// react-simplemde-editor necesita el DOM: se carga solo en cliente.
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] animate-pulse rounded-xl border border-ink-700 bg-ink-900" />
  ),
});

interface Props {
  value: string;
  onChange: (value: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
}

export default function MarkdownEditor({ value, onChange, onUploadImage }: Props) {
  const options = useMemo(
    () => ({
      spellChecker: false,
      autofocus: false,
      placeholder: 'Escribe el contenido de la lección en Markdown…',
      status: ['lines', 'words'] as string[],
      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'quote',
        'unordered-list',
        'ordered-list',
        'code',
        '|',
        'link',
        'image',
        {
          name: 'upload-image',
          action: (editor: any) => {
            if (!onUploadImage) return;
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;
              try {
                const url = await onUploadImage(file);
                const cm = editor.codemirror;
                cm.replaceSelection(`![imagen](${url})`);
              } catch (e) {
                alert((e as Error).message);
              }
            };
            input.click();
          },
          className: 'fa fa-upload',
          title: 'Subir imagen (R2)',
        },
        '|',
        'preview',
        'side-by-side',
        'fullscreen',
        '|',
        'guide',
      ] as any,
    }),
    [onUploadImage],
  );

  return <SimpleMDE value={value} onChange={onChange} options={options} />;
}
