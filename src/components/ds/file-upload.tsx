import { useRef, useState } from "react";
import { Bold, File, Italic, Link2, List, Paperclip, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MockFile {
  id: string;
  name: string;
  size: string;
  progress: number;
}

export function FileUpload({
  label = "Attachments",
  hint = "PDF, PNG, MP4 up to 100 MB",
}: {
  label?: string | undefined;
  hint?: string | undefined;
}) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<MockFile[]>([
    { id: "f1", name: "problem-statement.pdf", size: "1.8 MB", progress: 100 },
    { id: "f2", name: "brand-kit.zip", size: "12.4 MB", progress: 64 },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addMock = () =>
    setFiles((prev) => [
      ...prev,
      {
        id: `f${prev.length + 1}`,
        name: `attachment-${prev.length + 1}.pdf`,
        size: "2.1 MB",
        progress: 100,
      },
    ]);

  return (
    <div className="space-y-3">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addMock();
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed border-input bg-surface/60 px-6 py-8 text-center transition-colors",
          dragging && "border-primary bg-accent",
        )}
      >
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
          <Upload className="h-[1.05rem] w-[1.05rem]" />
        </span>
        <p className="mt-3 text-sm font-medium">Drag & drop files, or browse</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        <input ref={inputRef} type="file" className="hidden" aria-hidden tabIndex={-1} />
        <Button variant="outline" size="sm" className="mt-4" onClick={addMock}>
          <Paperclip className="h-3.5 w-3.5" />
          Browse files
        </Button>
      </div>

      <ul className="space-y-2">
        {files.map((file) => (
          <li
            key={file.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                <File className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{file.name}</p>
                {file.progress < 100 ? (
                  <Progress value={file.progress} className="mt-1.5 h-1" />
                ) : (
                  <p className="text-xs text-muted-foreground">{file.size} · Uploaded</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              aria-label={`Remove ${file.name}`}
              onClick={() => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RichTextEditor({
  label = "Description",
  placeholder = "Describe the event, eligibility, rules and rewards…",
  defaultValue = "",
}: {
  label?: string | undefined;
  placeholder?: string | undefined;
  defaultValue?: string | undefined;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="overflow-hidden rounded-lg border border-input bg-surface">
        <div className="flex items-center gap-1 border-b border-border bg-muted/40 px-2 py-1.5">
          {[Bold, Italic, List, Link2].map((Icon, i) => (
            <Button
              key={i}
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground"
              aria-label={["Bold", "Italic", "Bulleted list", "Insert link"][i]}
            >
              <Icon className="h-3.5 w-3.5" />
            </Button>
          ))}
          <span className="ml-auto text-[11px] uppercase tracking-wide text-muted-foreground">
            Rich text · placeholder
          </span>
        </div>
        <textarea
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={7}
          className="w-full resize-y bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
