let compiler;
let runtime;
self.onmessage = async ({ data }) => {
  try {
    if (data.type === 'init') {
      runtime = await import(data.base + '/compiler.wasm-runtime.js');
      const lib = await runtime.load(data.base + '/compiler.wasm', { noAutoImports: true });
      compiler = lib.exports.createCompiler();
      const [sdk, classlib] = await Promise.all([
        fetch(data.base + '/compile-classlib-teavm.bin', { credentials: 'omit' }).then((r) => {
          if (!r.ok) throw Error('SDK unavailable');
          return r.arrayBuffer();
        }),
        fetch(data.base + '/runtime-classlib-teavm.bin', { credentials: 'omit' }).then((r) => {
          if (!r.ok) throw Error('Class library unavailable');
          return r.arrayBuffer();
        }),
      ]);
      compiler.setSdk(new Int8Array(sdk));
      compiler.setTeaVMClasslib(new Int8Array(classlib));
      compiler.onDiagnostic((d) =>
        self.postMessage({
          type: 'diagnostic',
          message: d.message,
          line: d.lineNumber,
          severity: d.severity,
          file: d.fileName,
        }),
      );
      self.postMessage({ type: 'ready' });
    } else if (data.type === 'compile') {
      compiler.clearSourceFiles();
      compiler.clearOutputFiles();
      for (const file of data.files) compiler.addSourceFile(file.name, file.code);
      if (!compiler.compile()) {
        self.postMessage({ type: 'compile-error' });
        return;
      }
      const mains = compiler.detectMainClasses();
      if (!mains.length) throw Error('Add public static void main(String[] args) to a class.');
      if (!compiler.generateWebAssembly({ outputName: 'app', mainClass: mains[0] })) {
        self.postMessage({ type: 'compile-error' });
        return;
      }
      const code = compiler.getWebAssemblyOutputFile('app.wasm');
      self.postMessage({ type: 'compiled', code });
    }
  } catch (e) {
    self.postMessage({ type: 'error', message: e.message || String(e) });
  }
};
