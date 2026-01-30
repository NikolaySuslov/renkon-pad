//import { isAutoCompletionEnabled } from './autocomplete.mjs';
import { basicSetup } from './basicSetup.js';
import { flash, isFlashEnabled } from './flash.js';
import { highlightMiniLocations, isPatternHighlightingEnabled, updateMiniLocations } from './highlight.js';
//import { keybindings } from './keybindings.mjs';
//import { sliderPlugin, updateSliderWidgets } from './slider.mjs';
import { activateTheme, initTheme, theme } from './themes.js'; //, theme 
//import { isTooltipEnabled } from './tooltip.mjs';
//import { updateWidgets, widgetPlugin } from './widget.mjs';


export const defaultSettings = {
  keybindings: 'codemirror',
  isBracketMatchingEnabled: false,
  isBracketClosingEnabled: true,
  isLineNumbersDisplayed: true,
  isActiveLineHighlighted: false,
  isAutoCompletionEnabled: false,
  isPatternHighlightingEnabled: true,
  isFlashEnabled: true,
  isTooltipEnabled: false,
  isLineWrappingEnabled: false,
  isTabIndentationEnabled: false,
  isMultiCursorEnabled: false,
  theme: 'strudelTheme',
  fontFamily: 'monospace',
  fontSize: 18,
};

export const codemirrorSettings = window.StrudelLib.nano.persistentAtom('codemirror-settings', defaultSettings, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// https://codemirror.net/docs/guide/

export function initEditor({ initialCode = '', onChange, onEvaluate, onStop, mondo, model, renkon, compartments, extensions }) {

  const settings = codemirrorSettings.get();
  const initialSettings = Object.keys(compartments).map((key) =>
    compartments[key].of(extensions[key](parseBooleans(settings[key]))),
  );

  initTheme(settings.theme);

  let ext = [
    /* search(),
    highlightSelectionMatches(), */
    ...initialSettings,
    basicSetup(),
    mondo ? [] : window.CodeMirror["lang-javascript"].javascript(),
    window.CodeMirror["lang-javascript"].javascriptLanguage.data.of({
      closeBrackets: { brackets: ['(', '[', '{', "'", '"', '<'] },
      bracketMatching: { brackets: ['(', '[', '{', "'", '"', '<'] },
    }),
    // sliderPlugin,
    // widgetPlugin,
    // // indentOnInput(), // works without. already brought with javascript
    // // extension? bracketMatching(), // does not do anything
    window.CodeMirror.lang.syntaxHighlighting(window.CodeMirror.lang.defaultHighlightStyle)
    // EditorView.updateListener.of((v) => onChange(v)),
    // drawSelection({ cursorBlinkRate: 0 }),
    // Prec.highest(
    //   keymap.of([
    //     {
    //       key: 'Ctrl-Enter',
    //       run: () => onEvaluate?.(),
    //     },
    //     {
    //       key: 'Alt-Enter',
    //       run: () => onEvaluate?.(),
    //     },
    //     {
    //       key: 'Ctrl-.',
    //       run: () => onStop?.(),
    //     },
    //     {
    //       key: 'Alt-.',
    //       preventDefault: true,
    //       run: () => onStop?.(),
    //     },
    //     /* {
    //       key: 'Ctrl-Shift-.',
    //       run: () => (onPanic ? onPanic() : onStop?.()),
    //     },
    //     {
    //       key: 'Ctrl-Shift-Enter',
    //       run: () => (onReEvaluate ? onReEvaluate() : onEvaluate?.()),
    //     }, */
    //   ]),
    // ),
  ];

  let ed = window.CodeMirrorView.create(renkon, model, ext); //, root
  return ed.editor;

}

export class StrudelMirror {
  constructor(options) {
    const {
      root,
      id,
      initialCode = '',
      onDraw,
      drawContext,
      drawTime = [0, 0],
      autodraw,
      prebake,
      bgFill = true,
      solo = true,
      editor,
      renkon,
      ...replOptions
    } = options;
    this.renkon = renkon;
    this.code = initialCode;
    this.root = root;
    this.miniLocations = [];
    this.widgets = [];
    this.drawTime = drawTime;
    this.drawContext = drawContext;
    this.onDraw = onDraw || this.draw;
    this.id = id || s4();
    this.solo = solo;

    this.drawer = new window.StrudelLib.draw.Drawer((haps, time, _, painters) => {
      const currentFrame = haps.filter((hap) => hap.isActive(time));
      this.highlight(currentFrame, time);
      this.onDraw(haps, time, painters);
    }, drawTime);

    this.prebaked = async () => { }; //prebake();
    autodraw && this.drawFirstFrame();
    this.repl = window.StrudelLib.core.repl({
      ...replOptions,
      id,
      onToggle: (started) => {
        replOptions?.onToggle?.(started);
        if (started) {
          this.drawer.start(this.repl.scheduler);
          if (this.solo) {
            // stop other repls when this one is started
            document.dispatchEvent(
              new CustomEvent('start-repl', {
                detail: this.id,
              }),
            );
          }
        } else {
          this.drawer.stop();
          updateMiniLocations(this.editor, []);
          window.StrudelLib.draw.cleanupDraw(true, id);
        }
      },
      beforeEval: async () => {
        window.StrudelLib.draw.cleanupDraw(true, id);
        await this.prebaked;
        await replOptions?.beforeEval?.();
      },
      afterEval: (options) => {
        // remember for when highlighting is toggled on
        this.miniLocations = options.meta?.miniLocations;
        this.widgets = options.meta?.widgets;
        const sliders = this.widgets.filter((w) => w.type === 'slider');
        //updateSliderWidgets(this.editor, sliders);
        const widgets = this.widgets.filter((w) => w.type !== 'slider');
        //updateWidgets(this.editor, widgets);
        updateMiniLocations(this.editor, this.miniLocations);
        replOptions?.afterEval?.(options);
        // if no painters are set (.onPaint was not called), then we only need
        // the present moment (for highlighting)
        const drawTime = options.pattern.getPainters().length ? this.drawTime : [0, 0];
        this.drawer.setDrawTime(drawTime);
        // invalidate drawer after we've set the appropriate drawTime
        this.drawer.invalidate(this.repl.scheduler);
      },
    });


    this.extensions = {
      isLineWrappingEnabled: (on) => (on ? window.CodeMirror.view.EditorView.lineWrapping : []),
      isBracketMatchingEnabled: (on) => (on ? window.CodeMirror.lang.bracketMatching({ brackets: '()[]{}<>' }) : []),
      isBracketClosingEnabled: (on) => (on ? window.CodeMirror.auto.closeBrackets() : []),
      isLineNumbersDisplayed: (on) => (on ? window.CodeMirror.view.lineNumbers() : []),
      theme,
      // isAutoCompletionEnabled,
      // isTooltipEnabled,
      isPatternHighlightingEnabled: (on) => (on ? isPatternHighlightingEnabled() : []),
      isActiveLineHighlighted: (on) => (on ? [window.CodeMirror.view.highlightActiveLine(), window.CodeMirror.view.highlightActiveLineGutter()] : [])
      // isFlashEnabled,
      // keybindings,
      // isTabIndentationEnabled: (on) => (on ? keymap.of([indentWithTab]) : []),
      // isMultiCursorEnabled: (on) =>
      //   on
      //     ? [
      //         window.CodeMirror.state.EditorState.allowMultipleSelections.of(true),
      //         window.CodeMirror.view.EditorView.clickAddsSelectionRange.of((ev) => ev.metaKey || ev.ctrlKey),
      //       ]
      //     : [],
    };

    this.compartments = Object.fromEntries(Object.keys(this.extensions).map((key) => [key, new window.CodeMirror.state.Compartment()]));

    this.editor = options.editor ? initEditor({
      //root,
      initialCode,
      onChange: (v) => {
        if (v.docChanged) {
          this.code = v.state.doc.toString();
          this.repl.setCode?.(this.code);
        }
      },
      onEvaluate: () => this.evaluate(),
      onStop: () => this.stop(),
      mondo: replOptions.mondo,
      model: editor,
      renkon,
      compartments: this.compartments,
      extensions: this.extensions
    }) : {};

    const cmEditor = this.root.querySelector('.cm-editor');
    if (cmEditor) {
      this.root.style.display = 'block';
      if (bgFill) {
        this.root.style.backgroundColor = 'var(--background)';
      }
      cmEditor.style.backgroundColor = 'transparent';
    }
    const settings = codemirrorSettings.get();
    this.setFontSize(settings.fontSize);
    this.setFontFamily(settings.fontFamily);

    // stop this repl when another repl is started
    this.onStartRepl = (e) => {
      if (this.solo && e.detail !== this.id) {
        this.stop();
      }
    };
    document.addEventListener('start-repl', this.onStartRepl);

    // Handle global evaluation requests (e.g., from Vim :w)
    this.onEvaluateRequest = (e) => {
      try {
        // Evaluate current editor on repl-evaluate
        window.StrudelLib.core.logger('[repl] evaluate via event');
        this.evaluate();
        e?.cancelable && e.preventDefault?.();
      } catch (err) {
        console.error('Error handling repl-evaluate event', err);
      }
    };
    document.addEventListener('repl-evaluate', this.onEvaluateRequest);
    document.addEventListener('repl-stop', this.onStopRequest);

    // Toggle comments requested from Vim (gc)
    this.onToggleComment = (e) => {
      try {
        // Honor selections; toggleLineComment handles both selections and
        // single line
        window.CodeMirror.commands.toggleLineComment(this.editor);
        e?.cancelable && e.preventDefault?.();
      } catch (err) {
        console.error('Error handling repl-toggle-comment event', err);
      }
    };
    document.addEventListener('repl-toggle-comment', this.onToggleComment);
  }
  draw(haps, time, painters) {
    painters?.forEach((painter) => painter(this.drawContext, time, haps, this.drawTime));
  }
  async drawFirstFrame() {
    if (!this.onDraw) {
      return;
    }
    // draw first frame instantly
    await this.prebaked;
    try {
      await this.repl.evaluate(this.code, false);
      this.drawer.invalidate(this.repl.scheduler, -0.001);
      // draw at -0.001 to avoid haps at 0 to be visualized as active
      this.onDraw?.(this.drawer.visibleHaps, -0.001, this.drawer.painters);
    } catch (err) {
      console.warn('first frame could not be painted');
    }
  }
  async evaluate(autostart = true) {
    this.flash();
    await this.repl.evaluate(this.code, autostart);
  }
  async stop() {
    this.repl.scheduler.stop();
  }

  // Listen for global stop requests (e.g., from Vim :q)
  onStopRequest = (e) => {
    try {
      this.stop();
      e?.cancelable && e.preventDefault?.();
    } catch (err) {
      console.error('Error handling repl-stop event', err);
    }
  };
  async toggle() {
    if (this.repl.scheduler.started) {
      this.repl.stop();
    } else {
      this.evaluate();
    }
  }
  flash(ms) {
    flash(this.editor, ms);
  }
  highlight(haps, time) {
    highlightMiniLocations(this.editor, time, haps);
  }
  setFontSize(size) {
    this.root.style.fontSize = size + 'px';
  }
  setFontFamily(family) {
    this.root.style.fontFamily = family;
    const scroller = this.root.querySelector('.cm-scroller');
    if (scroller) {
      scroller.style.fontFamily = family;
    }
  }
  reconfigureExtension(key, value) {
    if (!this.extensions[key]) {
      console.warn(`extension ${key} is not known`);
      return;
    }
    value = parseBooleans(value);
    const newValue = this.extensions[key](value, this);
    this.editor.dispatch({
      effects: this.compartments[key].reconfigure(newValue),
    });
    if (key === 'theme') {
      activateTheme(value);
    }
  }
  setLineWrappingEnabled(enabled) {
    this.reconfigureExtension('isLineWrappingEnabled', enabled);
  }
  setBracketMatchingEnabled(enabled) {
    this.reconfigureExtension('isBracketMatchingEnabled', enabled);
  }
  setLineNumbersDisplayed(enabled) {
    this.reconfigureExtension('isLineNumbersDisplayed', enabled);
  }
  setBracketClosingEnabled(enabled) {
    this.reconfigureExtension('isBracketClosingEnabled', enabled);
  }
  setTheme(theme) {
    this.reconfigureExtension('theme', theme);
  }
  setAutocompletionEnabled(enabled) {
    this.reconfigureExtension('isAutoCompletionEnabled', enabled);
  }
  updateSettings(settings) {
    this.setFontSize(settings.fontSize);
    this.setFontFamily(settings.fontFamily);
    for (let key in extensions) {
      this.reconfigureExtension(key, settings[key]);
    }
    const updated = { ...codemirrorSettings.get(), ...settings };
    codemirrorSettings.set(updated);
  }
  changeSetting(key, value) {
    if (extensions[key]) {
      this.reconfigureExtension(key, value);
      return;
    } else if (key === 'fontFamily') {
      this.setFontFamily(value);
    } else if (key === 'fontSize') {
      this.setFontSize(value);
    }
  }
  setCode(code) {
    const changes = {
      from: 0,
      to: this.editor.state.doc.length,
      insert: code,
    };
    this.editor.dispatch({ changes });
  }
  clear() {
    this.onStartRepl && document.removeEventListener('start-repl', this.onStartRepl);
    this.onEvaluateRequest && document.removeEventListener('repl-evaluate', this.onEvaluateRequest);
    this.onStopRequest && document.removeEventListener('repl-stop', this.onStopRequest);
    this.onToggleComment && document.removeEventListener('repl-toggle-comment', this.onToggleComment);
  }
  getCursorLocation() {
    return this.editor.state.selection.main.head;
  }
  setCursorLocation(col) {
    return this.editor.dispatch({ selection: { anchor: col } });
  }
  appendCode(code) {
    const cursor = this.getCursorLocation();
    this.setCode(this.code + code);
    this.setCursorLocation(cursor);
  }
}

function parseBooleans(value) {
  return { true: true, false: false }[value] ?? value;
}

// helper function to generate repl ids
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

/**
 * Overrides the css of highlighted events. Make sure to use single quotes!
 * @name markcss
 * @example
 * note("c a f e")
 * .markcss('text-decoration:underline')
 */
export const markcss = window.StrudelLib.core.registerControl('markcss');
