import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import EditorToolbar from "./EditorToolbar";

/**
 * TipTap rich text editor.
 *
 * Props:
 *   content      - HTML string to load into the editor
 *   onContentSet - called when content is programmatically set
 *   editable     - boolean (default true)
 *   placeholder  - placeholder text
 */
export default function RichTextEditor({
  content = "",
  onContentSet,
  editable = true,
  placeholder = "Generated content will appear here...",
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    editable,
    editorProps: {
      attributes: {
        class: "tiptap-output min-h-[300px] px-4 py-3 focus:outline-none",
      },
    },
  });

  // When content prop changes (stream complete), push it into the editor
  useEffect(() => {
    if (!editor || !content) return;
    // Only set if it differs from current content to avoid cursor jumps
    if (editor.getHTML() !== content) {
      editor.commands.setContent(content, false);
      onContentSet?.();
    }
  }, [content, editor, onContentSet]);

  // Sync editable flag
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editable, editor]);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-surface shadow-card">
      {editable && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
