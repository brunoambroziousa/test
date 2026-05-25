import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocation } from "../ToolInvocation";

afterEach(() => {
  cleanup();
});

test("renders 'Creating' label and basename for str_replace_editor create", () => {
  render(
    <ToolInvocation
      toolName="str_replace_editor"
      state="result"
      args={{ command: "create", path: "/components/Counter.jsx" }}
    />
  );

  expect(screen.getByText("Creating")).toBeDefined();
  expect(screen.getByText("Counter.jsx")).toBeDefined();
});

test("renders 'Editing' label for str_replace_editor str_replace", () => {
  render(
    <ToolInvocation
      toolName="str_replace_editor"
      state="result"
      args={{ command: "str_replace", path: "/components/Counter.jsx" }}
    />
  );

  expect(screen.getByText("Editing")).toBeDefined();
  expect(screen.getByText("Counter.jsx")).toBeDefined();
});

test("renders 'Editing' label for str_replace_editor insert", () => {
  render(
    <ToolInvocation
      toolName="str_replace_editor"
      state="result"
      args={{ command: "insert", path: "/App.jsx" }}
    />
  );

  expect(screen.getByText("Editing")).toBeDefined();
  expect(screen.getByText("App.jsx")).toBeDefined();
});

test("renders 'Viewing' label for str_replace_editor view", () => {
  render(
    <ToolInvocation
      toolName="str_replace_editor"
      state="result"
      args={{ command: "view", path: "/App.jsx" }}
    />
  );

  expect(screen.getByText("Viewing")).toBeDefined();
  expect(screen.getByText("App.jsx")).toBeDefined();
});

test("renders 'Renaming' label and old → new for file_manager rename", () => {
  render(
    <ToolInvocation
      toolName="file_manager"
      state="result"
      args={{
        command: "rename",
        path: "/components/Old.jsx",
        new_path: "/components/New.jsx",
      }}
    />
  );

  expect(screen.getByText("Renaming")).toBeDefined();
  expect(screen.getByText("Old.jsx → New.jsx")).toBeDefined();
});

test("renders 'Deleting' label and basename for file_manager delete", () => {
  render(
    <ToolInvocation
      toolName="file_manager"
      state="result"
      args={{ command: "delete", path: "/components/Counter.jsx" }}
    />
  );

  expect(screen.getByText("Deleting")).toBeDefined();
  expect(screen.getByText("Counter.jsx")).toBeDefined();
});

test("shows pending spinner while state is not 'result'", () => {
  render(
    <ToolInvocation
      toolName="str_replace_editor"
      state="call"
      args={{ command: "create", path: "/App.jsx" }}
    />
  );

  expect(screen.getByTestId("tool-invocation-status-pending")).toBeDefined();
  expect(screen.queryByTestId("tool-invocation-status-done")).toBeNull();
});

test("shows done indicator when state is 'result'", () => {
  render(
    <ToolInvocation
      toolName="str_replace_editor"
      state="result"
      args={{ command: "create", path: "/App.jsx" }}
    />
  );

  expect(screen.getByTestId("tool-invocation-status-done")).toBeDefined();
  expect(screen.queryByTestId("tool-invocation-status-pending")).toBeNull();
});

test("falls back to raw tool name for an unknown tool", () => {
  render(
    <ToolInvocation
      toolName="mystery_tool"
      state="result"
      args={{ command: "doit", path: "/x" }}
    />
  );

  expect(screen.getByText("mystery_tool")).toBeDefined();
});

test("falls back to raw tool name when args are missing (partial-call)", () => {
  render(
    <ToolInvocation toolName="str_replace_editor" state="partial-call" />
  );

  expect(screen.getByText("str_replace_editor")).toBeDefined();
  expect(screen.getByTestId("tool-invocation-status-pending")).toBeDefined();
});

test("falls back to raw tool name when command is unknown", () => {
  render(
    <ToolInvocation
      toolName="str_replace_editor"
      state="result"
      args={{ command: "undo_edit", path: "/App.jsx" }}
    />
  );

  expect(screen.getByText("str_replace_editor")).toBeDefined();
});

test("uses last path segment for nested paths", () => {
  render(
    <ToolInvocation
      toolName="str_replace_editor"
      state="result"
      args={{ command: "create", path: "/src/components/deep/Widget.jsx" }}
    />
  );

  expect(screen.getByText("Widget.jsx")).toBeDefined();
});

test("exposes full path via title attribute", () => {
  const { container } = render(
    <ToolInvocation
      toolName="str_replace_editor"
      state="result"
      args={{ command: "create", path: "/src/components/Counter.jsx" }}
    />
  );

  const chip = container.firstChild as HTMLElement;
  expect(chip.getAttribute("title")).toBe("/src/components/Counter.jsx");
});
