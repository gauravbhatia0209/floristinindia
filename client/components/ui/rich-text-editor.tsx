import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Eraser,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

function exec(cmd: string, value?: string) {
  try {
    document.execCommand(cmd, false, value);
  } catch {}
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "",
  className = "",
}: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState<string>(value || "");

  useEffect(() => {
    setHtml(value || "");
  }, [value]);

  const handleInput = () => {
    const newHtml = ref.current?.innerHTML || "";
    setHtml(newHtml);
    onChange(newHtml);
  };

  const handlePaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const addLink = () => {
    const url = window.prompt("Enter URL", "https://");
    if (!url) return;
    exec("createLink", url);
    handleInput();
  };

  const clearFormatting = () => {
    exec("removeFormat");
    handleInput();
  };

  return (
    <Card className={className}>
      <CardContent className="p-2">
        <div className="flex flex-wrap gap-1 mb-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => {
              exec("bold");
              handleInput();
            }}
            aria-label="Bold"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => {
              exec("italic");
              handleInput();
            }}
            aria-label="Italic"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => {
              exec("underline");
              handleInput();
            }}
            aria-label="Underline"
          >
            <Underline className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => {
              exec("insertUnorderedList");
              handleInput();
            }}
            aria-label="Bulleted list"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => {
              exec("insertOrderedList");
              handleInput();
            }}
            aria-label="Numbered list"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={addLink}
            aria-label="Link"
          >
            <LinkIcon className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => {
              exec("undo");
              handleInput();
            }}
            aria-label="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => {
              exec("redo");
              handleInput();
            }}
            aria-label="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={clearFormatting}
            aria-label="Clear formatting"
          >
            <Eraser className="w-4 h-4" />
          </Button>
        </div>
        <div
          ref={ref}
          className="min-h-[120px] rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring prose max-w-none"
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          onPaste={handlePaste}
          data-placeholder={placeholder}
          dangerouslySetInnerHTML={{ __html: html || "" }}
        />
        <style>{`
          [contenteditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: rgba(0,0,0,0.4);
          }
        `}</style>
      </CardContent>
    </Card>
  );
}
