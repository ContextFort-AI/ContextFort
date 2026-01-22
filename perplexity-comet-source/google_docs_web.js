(() => {
  const grammarlyId = 'kbfnbcaeplbcioakkpcpgfkobkghlhen';
  const scriptContents = `window['_docs_annotate_canvas_by_ext'] = "${grammarlyId}";`;

  if (window.trustedTypes) {
    const policy = window.trustedTypes.createPolicy('gdocsPolicy', {
      createScript: (text) => text,
    });
    const sanitized = policy.createScript(scriptContents);
    eval(sanitized);
  } else {
    eval(scriptContents);
  }
})();
