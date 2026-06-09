'use client';

import dynamic from 'next/dynamic';

const ReadingProgress = dynamic(() => import('@/components/ui/ReadingProgress').then((m) => m.ReadingProgress), {
  ssr: false,
});
const HeartTrail = dynamic(() => import('@/components/ui/HeartTrail').then((m) => m.HeartTrail), {
  ssr: false,
});
const StickyCTA = dynamic(() => import('@/components/ui/StickyCTA').then((m) => m.StickyCTA), {
  ssr: false,
});

export function ClientEnhancements() {
  return (
    <>
      <ReadingProgress />
      <HeartTrail />
      <StickyCTA />
    </>
  );
}
