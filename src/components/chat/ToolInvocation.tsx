"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocationProps {
  toolName: string;
  state: string;
  args?: any;
}

function basename(path?: string): string {
  if (!path) return "";
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? path;
}

function describe(
  toolName: string,
  args: any
): { label: string; target?: string; fullPath?: string } {
  if (toolName === "str_replace_editor") {
    const path = args?.path;
    switch (args?.command) {
      case "create":
        return { label: "Creating", target: basename(path), fullPath: path };
      case "str_replace":
      case "insert":
        return { label: "Editing", target: basename(path), fullPath: path };
      case "view":
        return { label: "Viewing", target: basename(path), fullPath: path };
    }
  }

  if (toolName === "file_manager") {
    const path = args?.path;
    const newPath = args?.new_path;
    switch (args?.command) {
      case "rename":
        return {
          label: "Renaming",
          target: `${basename(path)} → ${basename(newPath)}`,
          fullPath: path,
        };
      case "delete":
        return { label: "Deleting", target: basename(path), fullPath: path };
    }
  }

  return { label: toolName };
}

export function ToolInvocation({ toolName, state, args }: ToolInvocationProps) {
  const { label, target, fullPath } = describe(toolName, args);
  const done = state === "result";

  return (
    <div
      className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200"
      title={fullPath}
    >
      {done ? (
        <div
          data-testid="tool-invocation-status-done"
          className="w-2 h-2 rounded-full bg-emerald-500"
        />
      ) : (
        <Loader2
          data-testid="tool-invocation-status-pending"
          className="w-3 h-3 animate-spin text-blue-600"
        />
      )}
      <span className="text-neutral-700">{label}</span>
      {target && (
        <span className="font-mono text-neutral-900">{target}</span>
      )}
    </div>
  );
}
