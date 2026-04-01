import * as Monaco from "monaco-editor";

// FreeLang 언어 ID
export const FREELANG_LANGUAGE_ID = "freelang";

// Monaco Editor에 FreeLang 문법 등록
export function registerFreeLangLanguage() {
  // 언어 정의
  Monaco.languages.register({ id: FREELANG_LANGUAGE_ID });

  // 토큰화
  Monaco.languages.setMonarchTokensProvider(FREELANG_LANGUAGE_ID, {
    tokenizer: {
      root: [
        // 주석
        [/\/\/.*$/, "comment"],
        [/\/\*/, "comment", "@comment"],

        // 문자열
        [/"(?:\\.|[^"\\])*"/, "string"],
        [/'(?:\\.|[^'\\])*'/, "string"],

        // 숫자
        [/\b\d+\b/, "number"],
        [/\b\d+\.\d+\b/, "number"],

        // 키워드
        [
          /\b(var|let|fn|return|if|else|elif|while|for|in|range|true|false|void|class|struct|enum|match)\b/,
          "keyword",
        ],

        // 내장 함수
        [
          /\b(println|print|input|len|str|int|float|bool|upper|lower|trim|split|join|abs|min|max|sum|avg|sort|reverse|map|filter|reduce)\b/,
          "function",
        ],

        // 타입
        [/\b(i32|i64|f32|f64|str|bool|void|null)\b/, "type"],

        // 연산자
        [/[+\-*/%=<>!&|^~?:]/, "operator"],

        // 괄호
        [/[{}()\[\]]/, "bracket"],

        // 한글 식별자 (U+AC00~U+D7A3)
        [/[\uAC00-\uD7A3_a-zA-Z][\uAC00-\uD7A3_a-zA-Z0-9]*/, "identifier"],

        // 영문 식별자
        [/[a-zA-Z_][a-zA-Z0-9_]*/, "identifier"],

        // 공백
        [/\s+/, "whitespace"],
      ],

      comment: [
        [/[^*/]+/, "comment"],
        [/\*\//, "comment", "@pop"],
        [/[*/]/, "comment"],
      ],
    },
  });

  // 테마 적용 (VS Code 다크 테마)
  Monaco.editor.defineTheme("freelang-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "#6a9955" },
      { token: "string", foreground: "#ce9178" },
      { token: "number", foreground: "#b5cea8" },
      { token: "keyword", foreground: "#569cd6" },
      { token: "type", foreground: "#4ec9b0" },
      { token: "function", foreground: "#dcdcaa" },
      { token: "identifier", foreground: "#9cdcfe" },
      { token: "operator", foreground: "#d4d4d4" },
    ],
    colors: {
      "editor.background": "#1e1e1e",
      "editor.foreground": "#d4d4d4",
      "editor.lineNumbersBackground": "#1e1e1e",
      "editor.lineNumbersForeground": "#858585",
      "editor.selectionBackground": "#264f78",
      "editor.selectionForeground": "#ffffff",
      "editor.lineHighlightBackground": "#2d2d3033",
      "editor.lineHighlightBorder": "#464647",
      "editorCursor.foreground": "#aeafad",
      "editorWhitespace.foreground": "#3e3e42",
      "editorBracketMatch.background": "#0e639c",
      "editorBracketMatch.border": "#888888",
    },
  });

  // 괄호 매칭
  Monaco.languages.setLanguageConfiguration(FREELANG_LANGUAGE_ID, {
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"],
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    indentationRules: {
      increaseIndentPattern: /^.*(\{[^}]*|\([^)]*|\[[^\]]*|fn\s+\w+\s*\(|if\s|else|for|while).*$/,
      decreaseIndentPattern: /^(.*\*\/)?\s*[\}\]\)]/,
    },
  });

  // 자동완성
  Monaco.languages.registerCompletionItemProvider(
    FREELANG_LANGUAGE_ID,
    {
      provideCompletionItems: (model, position) => {
        const suggestions: Monaco.languages.CompletionItem[] = [
          // 키워드
          { label: "var", kind: Monaco.languages.CompletionItemKind.Keyword },
          { label: "let", kind: Monaco.languages.CompletionItemKind.Keyword },
          { label: "fn", kind: Monaco.languages.CompletionItemKind.Keyword },
          { label: "if", kind: Monaco.languages.CompletionItemKind.Keyword },
          { label: "else", kind: Monaco.languages.CompletionItemKind.Keyword },
          { label: "while", kind: Monaco.languages.CompletionItemKind.Keyword },
          { label: "for", kind: Monaco.languages.CompletionItemKind.Keyword },
          { label: "return", kind: Monaco.languages.CompletionItemKind.Keyword },

          // 내장 함수
          {
            label: "println",
            kind: Monaco.languages.CompletionItemKind.Function,
            insertText: "println(${1:})",
            insertTextRules: Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "print",
            kind: Monaco.languages.CompletionItemKind.Function,
            insertText: "print(${1:})",
            insertTextRules: Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "len",
            kind: Monaco.languages.CompletionItemKind.Function,
            insertText: "len(${1:})",
            insertTextRules: Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: "str",
            kind: Monaco.languages.CompletionItemKind.Function,
            insertText: "str(${1:})",
            insertTextRules: Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },

          // 상수
          { label: "true", kind: Monaco.languages.CompletionItemKind.Constant },
          { label: "false", kind: Monaco.languages.CompletionItemKind.Constant },
          { label: "null", kind: Monaco.languages.CompletionItemKind.Constant },
        ];

        return { suggestions };
      },
    }
  );

  // Hover 제공자 (향후 확장)
  Monaco.languages.registerHoverProvider(FREELANG_LANGUAGE_ID, {
    provideHover: (model, position) => {
      // 현재는 기본 구현, 향후 문서 추가 가능
      return null;
    },
  });
}

// FreeLang 에러 마커 (컴파일 에러 표시)
export function setDiagnostics(
  editor: Monaco.editor.IStandaloneCodeEditor,
  errors: Array<{ line: number; message: string }>
) {
  const model = editor.getModel();
  if (!model) return;

  const markers: Monaco.editor.IMarkerData[] = errors.map((error) => ({
    startLineNumber: error.line,
    startColumn: 1,
    endLineNumber: error.line,
    endColumn: 1000,
    message: error.message,
    severity: Monaco.MarkerSeverity.Error,
  }));

  Monaco.editor.setModelMarkers(model, "freelang", markers);
}

// FreeLang 데코레이션 (커서 위치, 선택 영역 등)
export function createRemoteCursorDecoration(
  line: number,
  column: number,
  color: string = "#569cd6"
): Monaco.editor.IModelDecoration[] {
  return [
    {
      range: new Monaco.Range(line, column, line, column + 1),
      options: {
        glyphMarginClassName: "remote-cursor",
        glyphMarginHoverMessage: { value: "Remote cursor" },
        inlineClassName: `remote-cursor-${color}`,
        stickiness: Monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
      },
    },
  ];
}

export default {
  registerFreeLangLanguage,
  setDiagnostics,
  createRemoteCursorDecoration,
};
