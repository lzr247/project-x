import { faBold, faItalic, faListOl, faListUl } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  maxLength?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const stripHtml = (html: string): string => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
};

const RichTextEditor = ({
  content,
  onChange,
  placeholder = "Write something...",
  maxLength,
  onKeyDown,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        code: false,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (maxLength) {
        const plainText = stripHtml(html);
        if (plainText.length > maxLength) return;
      }
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const charCount = stripHtml(editor.getHTML()).length;

  const ToolbarButton = ({
    isActive,
    onClick,
    icon,
  }: {
    isActive: boolean;
    onClick: () => void;
    icon: typeof faBold;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded p-1.5 transition-colors ${
        isActive ? "bg-accent/20 text-accent" : "text-content-muted hover:bg-surface-hover hover:text-content"
      }`}
    >
      <FontAwesomeIcon icon={icon} className="text-xs" />
    </button>
  );

  return (
    <div
      className="focus-within:ring-accent/20 rounded-lg border border-border-strong bg-surface-card transition-all focus-within:border-accent focus-within:ring-2"
      onKeyDown={onKeyDown}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b border-border px-2 py-1">
        <ToolbarButton
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={faBold}
        />
        <ToolbarButton
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={faItalic}
        />
        <div className="mx-1 h-4 w-px bg-border" />
        <ToolbarButton
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={faListUl}
        />
        <ToolbarButton
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={faListOl}
        />
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="tiptap-editor px-3 py-2 text-sm text-content" />

      {/* Char count */}
      {maxLength && (
        <div className="border-t border-border px-3 py-1 text-right text-xs text-content-muted">
          {charCount}/{maxLength}
        </div>
      )}
    </div>
  );
};

export { stripHtml };
export default RichTextEditor;
