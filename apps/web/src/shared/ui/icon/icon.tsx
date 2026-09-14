import { type SVGProps } from 'react';

import { cn } from '@/shared/lib/cn';

import { type SpritePrepareConfig, sprites, type SpritesMeta } from './sprite.gen';

export type IconName = {
  [Key in keyof SpritesMeta]: `${Key & string}:${SpritesMeta[Key]}`;
}[keyof SpritesMeta];

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'name' | 'children'> & {
  name: IconName;
  size?: number;
  /**
   * Инвертирует ось масштаба для неквадратных иконок.
   * По умолчанию масштабируем по большей стороне.
   */
  invert?: boolean;
};

const spritesConfig: SpritePrepareConfig = {
  baseUrl: '/sprites/',
};

const getIconMeta = (name: IconName) => {
  const [spriteName, iconName] = name.split(':') as [string, string];
  const item = sprites.experimental_get(spriteName, iconName, spritesConfig);

  if (!item) {
    throw new Error(`Иконка «${name}» не найдена в спрайте «${spriteName}».`);
  }

  return item;
};

export const Icon = ({
  name,
  className,
  size = 16,
  invert = false,
  style,
  ...props
}: IconProps) => {
  const {
    symbol: { viewBox, width, height },
    href,
  } = getIconMeta(name);

  const scaleX = width > height;
  const scaleY = width < height;

  return (
    <svg
      className={cn(
        'inline-block box-content shrink-0 fill-current align-[-0.125em] text-inherit select-none',
        width === height && 'h-[1em] w-[1em]',
        (invert ? scaleY : scaleX) && 'w-[1em]',
        (invert ? scaleX : scaleY) && 'h-[1em]',
        className,
      )}
      viewBox={viewBox}
      focusable="false"
      aria-hidden
      style={{ fontSize: size, ...style }}
      {...props}
    >
      <use href={href} />
    </svg>
  );
};
