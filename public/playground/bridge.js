// Runs only in a sandboxed opaque-origin iframe; communicates over a transferred MessagePort.
let compiler;
let execution;
let port;
let compileTimer;
let executionTimer;
let base;
let generation = 0;
function send(data) {
  port?.postMessage(data);
}
function stop() {
  generation++;
  clearTimeout(compileTimer);
  clearTimeout(executionTimer);
  compiler?.terminate();
  execution?.terminate();
  compiler = null;
  execution = null;
}
async function makeWorker(name) {
  const response = await fetch(base.replace('/java-runtime', '') + '/playground/' + name, {
    credentials: 'omit',
  });
  if (!response.ok) throw Error('Worker unavailable');
  const url = URL.createObjectURL(new Blob([await response.text()], { type: 'text/javascript' }));
  const worker = new Worker(url);
  // Keep the blob available until the worker has resolved its source.
  setTimeout(() => URL.revokeObjectURL(url), 90000);
  return worker;
}
async function init() {
  const currentGeneration = generation;
  const worker = await makeWorker('compile-worker.js');
  if (generation !== currentGeneration) {
    worker.terminate();
    return;
  }
  compiler = worker;
  compiler.onerror = (event) => {
    event.preventDefault();
    stop();
    send({
      type: 'error',
      message: 'Java runtime could not load in this browser. ' + (event.message || ''),
    });
  };
  compiler.onmessage = async ({ data }) => {
    if (generation !== currentGeneration) return;
    if (data.type === 'ready') clearTimeout(compileTimer);
    if (['compile-error', 'error'].includes(data.type)) clearTimeout(compileTimer);
    if (data.type !== 'compiled') {
      send(data);
      return;
    }
    clearTimeout(compileTimer);
    const executionWorker = await makeWorker('execute-worker.js');
    if (generation !== currentGeneration) {
      executionWorker.terminate();
      return;
    }
    execution = executionWorker;
    execution.onerror = () => {
      execution?.terminate();
      clearTimeout(executionTimer);
      send({ type: 'error', message: 'Execution failed.' });
    };
    execution.onmessage = ({ data: result }) => {
      clearTimeout(executionTimer);
      execution?.terminate();
      execution = null;
      send(result);
    };
    executionTimer = setTimeout(() => {
      execution?.terminate();
      execution = null;
      send({
        type: 'runtime-error',
        message: 'Execution exceeded 5 seconds.',
        stdout: '',
        stderr: '',
      });
    }, 5000);
    execution.postMessage({ code: data.code, base });
    send({ type: 'running' });
  };
  compileTimer = setTimeout(() => {
    stop();
    send({
      type: 'error',
      message: 'Java initialization exceeded 90 seconds. Retry or use a local JDK.',
    });
  }, 90000);
  compiler.postMessage({ type: 'init', base });
}
window.addEventListener('message', async (event) => {
  if (event.source !== parent || !event.ports[0] || port) return;
  port = event.ports[0];
  base = event.data.base;
  port.onmessage = async ({ data }) => {
    try {
      if (data.type === 'init') {
        stop();
        await init();
      }
      if (data.type === 'stop') {
        stop();
        send({ type: 'stopped' });
      }
      if (data.type === 'compile') {
        if (!compiler) throw Error('Initialize Java first.');
        compileTimer = setTimeout(() => {
          stop();
          send({ type: 'error', message: 'Compilation exceeded 60 seconds.' });
        }, 60000);
        compiler.postMessage(data);
      }
    } catch (e) {
      stop();
      send({ type: 'error', message: e.message });
    }
  };
  send({ type: 'connected' });
});
