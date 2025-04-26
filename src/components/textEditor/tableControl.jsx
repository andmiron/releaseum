import { useRichTextEditorContext, RichTextEditor } from "@mantine/tiptap";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import {
  TbTablePlus,
  TbTableMinus,
  TbTableRow,
  TbTableExport,
  TbTableDown,
  TbTableColumn,
} from "react-icons/tb";

export function TableControl() {
  const { editor } = useRichTextEditorContext();

  return (
    <RichTextEditor.ControlsGroup>
      <RichTextEditor.Control
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
        aria-label="Insert table"
        title="Insert table"
      >
        <TbTablePlus size={16} />
      </RichTextEditor.Control>

      <RichTextEditor.Control
        onClick={() => editor.chain().focus().deleteTable().run()}
        aria-label="Delete table"
        title="Delete table"
      >
        <TbTableMinus size={16} />
      </RichTextEditor.Control>

      <RichTextEditor.Control
        onClick={() => editor.chain().focus().addRowAfter().run()}
        aria-label="Add row"
        title="Add row"
      >
        <TbTableDown size={16} />
      </RichTextEditor.Control>

      <RichTextEditor.Control
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        aria-label="Add column"
        title="Add column"
      >
        <TbTableExport size={16} />
      </RichTextEditor.Control>

      <RichTextEditor.Control
        onClick={() => editor.chain().focus().deleteRow().run()}
        aria-label="Delete row"
        title="Delete row"
      >
        <TbTableRow size={16} />
      </RichTextEditor.Control>

      <RichTextEditor.Control
        onClick={() => editor.chain().focus().deleteColumn().run()}
        aria-label="Delete column"
        title="Delete column"
      >
        <TbTableColumn size={16} />
      </RichTextEditor.Control>
    </RichTextEditor.ControlsGroup>
  );
}
