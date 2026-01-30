export function createTheme ({ theme, settings, styles }) {

  const _theme = window.CodeMirror.EditorView.theme(
    {
      '&': {
        color: settings.foreground,
        backgroundColor: settings.background,
      },
      '.cm-gutters': {
        backgroundColor: settings.gutterBackground,
        color: settings.gutterForeground,
        //borderRightColor: settings.gutterBorder
      },
      '.cm-content': {
        caretColor: settings.caret,
      },
      '.cm-cursor, .cm-dropCursor': {
        borderLeftColor: settings.caret,
      },
      '.cm-activeLineGutter': {
        // color: settings.gutterActiveForeground
        backgroundColor: settings.lineHighlight,
      },
      '.cm-activeLine': {
        backgroundColor: settings.lineHighlight,
      },
      '&.cm-focused .cm-selectionBackground, & .cm-line::selection, & .cm-selectionLayer .cm-selectionBackground, .cm-content ::selection':
        {
          background: settings.selection + ' !important',
        },
      '& .cm-selectionMatch': {
        backgroundColor: settings.selectionMatch,
      },
    },
    { dark: theme === 'dark' },
  );
  const highlightStyle = window.CodeMirror.lang.HighlightStyle.define(styles);
  return [_theme, window.CodeMirror.lang.syntaxHighlighting(highlightStyle)];
};
