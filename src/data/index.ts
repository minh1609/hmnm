import { activeProfile } from '@/config';
import * as mindy from '@/data/mindy';

const profiles = { mindy } satisfies Record<string, typeof mindy>;

const data = profiles[activeProfile];

export const { datingTimeline, trips, IMAGE_FILES, ICONS } = data;
