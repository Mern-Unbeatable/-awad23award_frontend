import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useState, useMemo } from 'react';
import {
  Type,
  Bold,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  List,
  ListOrdered,
} from 'lucide-react';

interface BlogEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Sticky offset so the toolbar sits under the page chrome bar (CSS length). */
  toolbarStickyTop?: string;
}

type HeadingLevel = 'paragraph' | 1 | 2 | 3;

function headingLabel(level: HeadingLevel) {
  if (level === 'paragraph') return 'Body';
  return `H${level}`;
}

export function BlogEditor({
  value,
  onChange,
  placeholder = 'Write the article body the way readers will see it…',
  toolbarStickyTop = '0px',
}: BlogEditorProps) {
  const [headingOpen, setHeadingOpen] = useState(false);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-[#36BFFB] underline underline-offset-2',
            rel: 'noopener noreferrer',
            target: '_blank',
          },
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({ placeholder }),
    ],
    [placeholder],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: value || '',
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      onChange(html === '<p></p>' ? '' : html);
    },
    editorProps: {
      attributes: {
        class:
          'blog-editor-content min-h-[320px] sm:min-h-[420px] outline-none px-1 py-2 text-[16px] leading-relaxed text-[#374151] focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || '';
    const normalized = current === '<p></p>' ? '' : current;
    if (next !== normalized) {
      editor.commands.setContent(next || '', { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const activeHeading: HeadingLevel = editor.isActive('heading', { level: 1 })
    ? 1
    : editor.isActive('heading', { level: 2 })
      ? 2
      : editor.isActive('heading', { level: 3 })
        ? 3
        : 'paragraph';

  function setHeading(level: HeadingLevel) {
    if (level === 'paragraph') {
      editor!.chain().focus().setParagraph().run();
    } else {
      editor!.chain().focus().toggleHeading({ level }).run();
    }
    setHeadingOpen(false);
  }

  const toolBtn = 'inline-flex items-center justify-center h-8 w-8 rounded-lg transition-colors cursor-pointer';
  const toolBtnIdle = `${toolBtn} text-slate-500 hover:text-slate-900 hover:bg-slate-100`;
  const toolBtnActive = `${toolBtn} text-slate-900 bg-sky-50 ring-1 ring-[#38BDF8]/40`;

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-2xs">
      <div
        className="sticky z-10 bg-white/95 backdrop-blur-sm px-3 sm:px-4 py-2.5 flex flex-wrap items-center gap-1 border-b border-slate-100"
        style={{ top: toolbarStickyTop }}
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => setHeadingOpen((o) => !o)}
            className="flex items-center gap-1.5 bg-slate-900 text-white rounded-lg px-3 py-1.5 text-[12px] font-semibold cursor-pointer"
          >
            <Type className="w-3.5 h-3.5" />
            <span>{headingLabel(activeHeading)}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>
          {headingOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-10 cursor-default"
                aria-label="Close heading menu"
                onClick={() => setHeadingOpen(false)}
              />
              <div className="absolute top-full left-0 mt-1 z-20 min-w-37.5 rounded-xl border border-slate-200 bg-white shadow-lg py-1">
                {(
                  [
                    ['paragraph', 'Body text'],
                    [2, 'Section heading'],
                    [3, 'Subheading'],
                    [1, 'Display title'],
                  ] as const
                ).map(([level, label]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setHeading(level as HeadingLevel)}
                    className={`w-full text-start px-3 py-2 text-[13px] hover:bg-slate-50 cursor-pointer ${
                      activeHeading === level ? 'font-semibold text-[#36BFFB]' : 'text-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="h-4 w-px bg-slate-200 mx-1.5" />

        <button type="button" title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? toolBtnActive : toolBtnIdle}>
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? toolBtnActive : toolBtnIdle}>
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1.5" />

        <button type="button" title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? toolBtnActive : toolBtnIdle}>
          <List className="w-4 h-4" />
        </button>
        <button type="button" title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? toolBtnActive : toolBtnIdle}>
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1.5" />

        <button type="button" title="Align left" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? toolBtnActive : toolBtnIdle}>
          <AlignLeft className="w-4 h-4" />
        </button>
        <button type="button" title="Align center" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? toolBtnActive : toolBtnIdle}>
          <AlignCenter className="w-4 h-4" />
        </button>
        <button type="button" title="Align right" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? toolBtnActive : toolBtnIdle}>
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 sm:px-8 py-5 bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
