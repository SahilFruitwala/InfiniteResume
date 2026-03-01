import React, { useRef, useEffect } from "react";
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

  const execCommand = (command: string) => {
    document.execCommand(command, false, undefined);
    editorRef.current?.focus();
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-slate-300 dark:border-border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-accent focus-within:border-accent transition-all bg-white dark:bg-background">
      <div className="bg-slate-50 dark:bg-card border-b border-slate-300 dark:border-border px-2 py-1 flex gap-1 items-center">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("bold");
          }}
          className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-muted rounded transition-colors"
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
          className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-muted rounded transition-colors"
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
          className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-muted rounded transition-colors"
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-slate-300 dark:bg-border mx-1"></div>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand("insertUnorderedList");
          }}
          className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-muted rounded transition-colors"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        className="p-3 min-h-[80px] max-h-[300px] overflow-y-auto text-sm outline-none dark:text-slate-200 [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 whitespace-pre-wrap"
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
      />
    </div>
  );
};
