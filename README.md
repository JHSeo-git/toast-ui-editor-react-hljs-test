# Toast Editor Code Highlight Test w/ React, Typescript

## 개요

React, Typescript 를 이용하여 tui-editor를 사용할 시에 이미 개발되어있는 [React 용 highlight syntax lib](https://github.com/nhn/tui.editor/tree/master/plugins/code-syntax-highlight)를 썼으나 적용이 잘 안되는 문제가 있어서 해결해보고자 이것저것 시도 해봄.

- https://github.com/nhn/tui.editor/tree/master/plugins/code-syntax-highlight#import-all-languages
- https://github.com/nhn/tui.editor/issues/909
- https://github.com/nhn/tui.editor/issues/1089

## 해결방법

toast-ui 에서 제공하던 `@toast-ui/editor-plugin-code-syntax-highlight`를 무조건 써야된다는 생각아래에 진행하다보니 진전이 없었다.
그런데 [여기서 힌트](https://github.com/nhn/tui.editor/issues/1007)를 얻고 새롭게 plugin을 만들어서 넣어보고자 했다.

Editor를 Render하는 방법이 2가지가 있어서 2가지 모두 적용해보았다.

- `@toast-ui/editor`를 이용한 명령형 Render
- `@toast-ui/react-editor`를 이용한 선언형 Render

![image](https://user-images.githubusercontent.com/61136724/113263105-5632ea00-930c-11eb-80bd-76133cd4d123.png)

### `@toast-ui/editor`를 이용한 명령형 Render

ref를 통해서 element를 지정하고 생성하면 Render가 된다.
(querySelector를 통해 el를 dom에서 직접 가져와도 상관없다.)

```ts
import "codemirror/lib/codemirror.css";
import "highlight.js/styles/github.css";
import "@toast-ui/editor/dist/toastui-editor.css"; // 마지막
import "./App.css";

import { useEffect, useRef } from "react";
import Editor, { EditorOptions } from "@toast-ui/editor";
import hljs from "highlight.js";

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
      <div ref={editorRef}></div>
    </div>
  );
}
```

### `@toast-ui/react-editor`를 이용한 명령형 Render

toast-ui에서 제공하는 React용 컴포넌트 lib를 직접 render

```typescript
import "codemirror/lib/codemirror.css";
import "highlight.js/styles/github.css";
import "@toast-ui/editor/dist/toastui-editor.css"; // 마지막

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
```
