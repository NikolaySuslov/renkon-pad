export const setFlash = window.CodeMirror.state.StateEffect.define();
export const flashField = window.CodeMirror.state.StateField.define({
  create() {
    return window.CodeMirror.view.Decoration.none;
  },
  update(flash, tr) {
    try {
      for (let e of tr.effects) {
        if (e.is(setFlash)) {
          if (e.value && tr.newDoc.length > 0) {
            const mark = window.CodeMirror.view.Decoration.mark({
              attributes: { style: `background-color: rgba(255,255,255, .4); filter: invert(10%)` },
            });
            flash = window.CodeMirror.view.Decoration.set([mark.range(0, tr.newDoc.length)]);
          } else {
            flash = window.CodeMirror.view.Decoration.set([]);
          }
        }
      }
      return flash;
    } catch (err) {
      console.warn('flash error', err);
      return flash;
    }
  },
  provide: (f) => window.CodeMirror.EditorView.decorations.from(f),
});

export const flash = (view, ms = 200) => {
  view.dispatch({ effects: setFlash.of(true) });
  setTimeout(() => {
    view.dispatch({ effects: setFlash.of(false) });
  }, ms);
};

export const isFlashEnabled = (on) => (on ? flashField : []);
