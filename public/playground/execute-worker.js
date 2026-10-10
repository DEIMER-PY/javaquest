self.onmessage = async ({ data }) => {
  let size = 0;
  let stdout = '';
  let stderr = '';
  const write = (ch, error) => {
    if (++size > 32768) throw Error('Output limit: 32 KB');
    if (error) stderr += String.fromCharCode(ch);
    else stdout += String.fromCharCode(ch);
  };
  try {
    const { load } = await import(data.base + '/compiler.wasm-runtime.js');
    const program = await load(data.code, {
      noAutoImports: true,
      installImports(imports) {
        imports.teavmConsole.putcharStdout = (ch) => write(ch, false);
        imports.teavmConsole.putcharStderr = (ch) => write(ch, true);
      },
    });
    await program.exports.main([]);
    self.postMessage({ type: 'result', stdout, stderr });
  } catch (e) {
    self.postMessage({ type: 'runtime-error', stdout, stderr, message: e.message || String(e) });
  }
};
