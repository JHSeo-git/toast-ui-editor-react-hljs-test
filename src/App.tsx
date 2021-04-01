import "codemirror/lib/codemirror.css";
import "highlight.js/styles/github.css";
import "@toast-ui/editor/dist/toastui-editor.css"; // 마지막
import "./App.css";

import { useEffect, useRef } from "react";
import Editor, { EditorOptions } from "@toast-ui/editor";
import hljs from "highlight.js";
import ReactEditor from "./ReactEditor";

function registerCodeBlockReplacer(editor: Editor, hljs: HLJSApi) {
  const { codeBlockManager } = Object.getPrototypeOf(editor).constructor;
  const languages = hljs.listLanguages();

  editor.setCodeBlockLanguages(languages);
  languages.forEach((type) => {
    const convertor = (codeText: string) =>
      hljs.highlight(type, codeText).value;
    const aliases = hljs.getLanguage(type)?.aliases || [];
    const langTypes = [type, ...aliases];

    langTypes.forEach((lang) => {
      codeBlockManager.setReplacer(lang, convertor);
    });
  });
}

function App() {
  const editorRef = useRef<HTMLDivElement>(null);
  const onChange = () => {};

  useEffect(() => {
    if (!editorRef.current) return;
    const el = editorRef.current;
    const options: EditorOptions = {
      el,
      initialValue: undefined,
      previewStyle: "vertical",
      height: "100%",
      initialEditType: "markdown",
      hideModeSwitch: true,
      events: {
        change: onChange,
      },
    };
    const editorComponent = new Editor(options);
    registerCodeBlockReplacer(editorComponent, hljs);
  }, []);

  return (
    <div className="wrapper">
      {/* <div ref={editorRef}></div> */}
      <ReactEditor />
    </div>
  );
}

export default App;
