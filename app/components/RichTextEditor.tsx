import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { Bold, Italic, Underline, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Debounced change handler
  const debouncedOnChange = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (val: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        onChange(val);
      }, 500); // 500ms debounce
    };
  }, [onChange]);

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      debouncedOnChange(e.currentTarget.innerHTML);
    },
    [debouncedOnChange],
  );

  const execCommand = (command: string) => {
    document.execCommand(command, false, undefined);
    editorRef.current?.focus();
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border-2 border-black/10 dark:border-white/10 rounded-none overflow-hidden focus-within:border-accent transition-colors bg-white dark:bg-card">
      <div className="bg-black/5 dark:bg-white/5 border-b-2 border-black/10 dark:border-white/10 px-2 py-1.5 flex gap-1 items-center">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("bold");
          }}
          className="h-9 w-9 text-black dark:text-white hover:bg-accent hover:text-black rounded-none transition-colors border-none"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("italic");
          }}
          className="h-9 w-9 text-black dark:text-white hover:bg-accent hover:text-black rounded-none transition-colors border-none"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("underline");
          }}
          className="h-9 w-9 text-black dark:text-white hover:bg-accent hover:text-black rounded-none transition-colors border-none"
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-black/10 dark:bg-white/10 mx-1"></div>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("insertUnorderedList");
          }}
          className="h-9 w-9 text-black dark:text-white hover:bg-accent hover:text-black rounded-none transition-colors border-none"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        className="p-3 min-h-[80px] max-h-[300px] overflow-y-auto text-sm outline-none dark:text-slate-200 [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 whitespace-pre-wrap"
        contentEditable
        onInput={handleInput}
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
      />
    </div>
  );
};
