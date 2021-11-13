import { build } from 'esbuild';

build({
  bundle: true,
  outfile: 'dist/deploy.js',
  minify: true,
  external: ['discord.js', '@discordjs/*', 'discord-api-types/*'],
  platform: 'node',
  entryPoints: ['scripts/deployCommands.ts'],
}).catch(() => {
  process.exit(1);
});
