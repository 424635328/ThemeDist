import type { ThemePart } from './types';
import { colors } from './parts/colors';
import { typography } from './parts/typography';
import { spacing } from './parts/spacing';
import { wallpaper } from './parts/wallpaper';
import { effects } from './parts/effects';

/** All available theme parts, keyed by id */
export const parts = {
  colors,
  typography,
  spacing,
  wallpaper,
  effects,
} as const satisfies Record<string, ThemePart>;

export type PartId = keyof typeof parts;

export function getPart(id: PartId): ThemePart {
  return parts[id];
}
