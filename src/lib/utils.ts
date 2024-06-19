import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomPickArrayItem<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const isActive = (href: string, segments: string[]) => {
  if (href === '/') {
    return segments.length === 0;
  }

  // filter out group segments like (details)
  const segmentsWithoutGroup = segments.filter(
    (segment) => /\(.*\)/.test(segment) === false,
  );

  let compareTarget = segmentsWithoutGroup[0];

  // if (segmentsWithoutGroup[0] === 'search' && segmentsWithoutGroup[1]) {
  //   compareTarget = segmentsWithoutGroup[1];
  // }

  return href.startsWith(`/${compareTarget}`);
};
