import { createSvgSpriteBuilder } from '@neodx/svg';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const builder = createSvgSpriteBuilder({
  inputRoot: `${root}/public/icons`,
  output: `${root}/public/sprites`,
  group: true,
  fileName: '{name}.{hash:8}.svg',
  metadata: `${root}/src/shared/ui/icon/sprite.gen.ts`,
  resetColors: {
    replaceUnknown: 'currentColor',
  },
});

await builder.load('**/*.svg');
await builder.build();
