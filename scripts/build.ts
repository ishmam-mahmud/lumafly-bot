const results = await Bun.build({
  entrypoints: ['./src/core/index.ts'],
  outdir: './out',
  target: "bun"
});

console.log(results);

export {};
