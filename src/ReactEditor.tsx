import { Editor } from "@toast-ui/react-editor";
import ToastEditor from "@toast-ui/editor";
import hljs from "highlight.js";

export type ReactEditorProps = {};

function ReactEditor(props: ReactEditorProps) {
  const onChange = () => {};

  const syntaxHighlightPlugIn = () => {
    const languages = hljs.listLanguages();
    languages.forEach((type) => {
      const convertor = (codeText: string) =>
        hljs.highlight(codeText, { language: type }).value;
      const aliases = hljs.getLanguage(type)?.aliases || [];
      const langTypes = [type, ...aliases];

      langTypes.forEach((lang) => {
        ToastEditor.codeBlockManager.setReplacer(lang, convertor);
      });
    });
  };

  return (
    <Editor
      initialEditType="markdown"
      previewStyle="vertical"
      height="100%"
      hideModeSwitch={true}
      events={{
        change: onChange,
      }}
      plugins={[syntaxHighlightPlugIn]}
    />
  );
}

export default ReactEditor;
