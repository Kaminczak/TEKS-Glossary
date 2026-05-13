export default function EditorToolbar({ editor }) {
  if (!editor) return null;

  const btn = (active, title, onClick) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-white"
          : "text-text-muted hover:bg-surface-bright hover:text-text"
      }`}
    >
      {title}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-surface-dim">
      {btn(editor.isActive("bold"), "B", () => editor.chain().focus().toggleBold().run())}
      {btn(editor.isActive("italic"), "I", () => editor.chain().focus().toggleItalic().run())}
      <div className="w-px bg-border mx-1" />
      {btn(
        editor.isActive("heading", { level: 2 }),
        "H2",
        () => editor.chain().focus().toggleHeading({ level: 2 }).run()
      )}
      {btn(
        editor.isActive("heading", { level: 3 }),
        "H3",
        () => editor.chain().focus().toggleHeading({ level: 3 }).run()
      )}
      <div className="w-px bg-border mx-1" />
      {btn(editor.isActive("bulletList"), "• List", () =>
        editor.chain().focus().toggleBulletList().run()
      )}
      {btn(editor.isActive("orderedList"), "1. List", () =>
        editor.chain().focus().toggleOrderedList().run()
      )}
      <div className="w-px bg-border mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        title="Clear formatting"
        className="px-2 py-1 rounded text-sm text-text-muted hover:bg-surface-bright hover:text-text transition-colors"
      >
        Clear
      </button>
    </div>
  );
}
