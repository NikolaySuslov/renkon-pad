export function basicSetup() { return (() => [
  //   lineNumbers(),
  //   highlightActiveLineGutter(),
  window.CodeMirror.view.highlightSpecialChars(),
  window.CodeMirror.commands.history(),
  // foldGutter(),
  // drawSelection(),
  window.CodeMirror.view.dropCursor(),
  // EditorState.allowMultipleSelections.of(true),
  // indentOnInput(),
  // syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  // autocompletion(),
  window.CodeMirror.view.rectangularSelection(),
  window.CodeMirror.view.crosshairCursor(),
  // highlightActiveLine(),
  // highlightSelectionMatches(),
  window.CodeMirror.view.keymap.of([
    ...window.CodeMirror.auto.closeBracketsKeymap,
    ...window.CodeMirror.commands.defaultKeymap,
    // ...searchKeymap,
    ...window.CodeMirror.commands.historyKeymap,
    // ...foldKeymap,
    // ...completionKeymap,
  ]),
])()
};

/// A minimal set of extensions to create a functional editor. Only
/// includes [the default keymap](#commands.defaultKeymap), [undo
/// history](#commands.history), [special character
/// highlighting](#view.highlightSpecialChars), [custom selection
/// drawing](#view.drawSelection), and [default highlight
/// style](#language.defaultHighlightStyle).
export function minimalSetup() { return (() => [
  window.CodeMirror.view.highlightSpecialChars(),
  window.CodeMirror.commands.history(),
  window.CodeMirror.view.drawSelection(),
  window.CodeMirror.lang.syntaxHighlighting(window.CodeMirror.lang.defaultHighlightStyle, { fallback: true }),
  window.CodeMirror.view.keymap.of([...window.CodeMirror.commands.defaultKeymap, ...window.CodeMirror.commands.historyKeymap]),
])()}
