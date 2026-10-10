import { readFile } from 'node:fs/promises';
import { load } from '../public/java-runtime/compiler.wasm-runtime.js';
const lib = await load(new Uint8Array(await readFile('public/java-runtime/compiler.wasm')), {
  noAutoImports: true,
});
const compiler = lib.exports.createCompiler();
compiler.setSdk(new Int8Array(await readFile('public/java-runtime/compile-classlib-teavm.bin')));
compiler.setTeaVMClasslib(
  new Int8Array(await readFile('public/java-runtime/runtime-classlib-teavm.bin')),
);
compiler.onDiagnostic((d) => console.log(d.severity, d.message));
const scenarios = [
  ['hello', 'System.out.println("JavaQuest");', 'JavaQuest\n'],
  ['loops', 'int sum=0; for(int i=1;i<=5;i++) sum+=i; System.out.println(sum);', '15\n'],
  ['arrays', 'int[] nums={2,4,6}; System.out.println(nums[1]);', '4\n'],
  [
    'collections',
    'java.util.ArrayList<String> xs=new java.util.ArrayList<>(); xs.add("Java"); System.out.println(xs.get(0));',
    'Java\n',
  ],
  [
    'objects',
    'Person p=new Person(); System.out.println(p.name);',
    'Ada\n',
    'class Person { String name="Ada"; }',
  ],
];
for (const [name, body, expected, extra = ''] of scenarios) {
  compiler.clearSourceFiles();
  compiler.clearOutputFiles();
  compiler.addSourceFile(
    'Main.java',
    `public class Main { public static void main(String[] args) { ${body} } } ${extra}`,
  );
  if (
    !compiler.compile() ||
    !compiler.generateWebAssembly({ outputName: 'app', mainClass: 'Main' })
  )
    throw Error(`${name}: compilation failed`);
  let output = '';
  const app = await load(compiler.getWebAssemblyOutputFile('app.wasm'), {
    noAutoImports: true,
    installImports(o) {
      o.teavmConsole.putcharStdout = (ch) => (output += String.fromCharCode(ch));
    },
  });
  await app.exports.main([]);
  if (output !== expected)
    throw Error(`${name}: ${JSON.stringify(output)} != ${JSON.stringify(expected)}`);
  console.log(`PASS ${name}: ${output.trim()}`);
}
const lessons = JSON.parse(await readFile('src/lib/lessons.json', 'utf8'));
for (const lesson of lessons) {
  for (const [kind, source] of [
    ['example', lesson.example],
    ['solution', lesson.solution],
  ]) {
    compiler.clearSourceFiles();
    compiler.clearOutputFiles();
    compiler.addSourceFile('Main.java', source);
    if (
      !compiler.compile() ||
      !compiler.generateWebAssembly({ outputName: 'app', mainClass: 'Main' })
    )
      throw Error(`${lesson.id}/${kind}: compilation failed`);
    let output = '';
    const app = await load(compiler.getWebAssemblyOutputFile('app.wasm'), {
      noAutoImports: true,
      installImports(o) {
        o.teavmConsole.putcharStdout = (ch) => (output += String.fromCharCode(ch));
      },
    });
    await app.exports.main([]);
    if (!output.trim()) throw Error(`${lesson.id}/${kind}: expected visible output`);
    console.log(`PASS ${lesson.id}/${kind}`);
  }
}
