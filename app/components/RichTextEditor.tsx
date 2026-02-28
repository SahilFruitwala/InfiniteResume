import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string) => {
    document.execCommand(command, false, undefined);
    editorRef.current?.focus();
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-slate-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-slate-800 focus-within:border-slate-800 transition-all bg-white">
      <div className="bg-slate-50 border-b border-slate-300 px-2 py-1 flex gap-1">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }}
          className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition-colors"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }}
          className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition-colors"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('underline'); }}
          className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition-colors"
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand('insertUnorderedList'); }}
          className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition-colors"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
      </div>
      <div
        ref={editorRef}
        className="p-3 min-h-[80px] max-h-[300px] overflow-y-auto text-sm outline-none [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 whitespace-pre-wrap"
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
      />
    </div>
  );
};
