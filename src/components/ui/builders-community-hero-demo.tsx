'use client';

import { Briefcase, GraduationCap, Presentation, Code2, MessageSquareText } from 'lucide-react';
import CommunityOrbit, { type OrbitItem, type OrbitStat, type OrbitTag } from '@/components/ui/builders-community-hero';

const memoji = (n: number) => `https://raw.githubusercontent.com/alohe/memojis/main/png/memo_${n}.png`;

function ThreadAvatar() {
  return (
    <span className="flex h-[22px] w-[22px] items-center justify-center overflow-hidden rounded-full bg-[#dfe6f5]">
      <img
        src={memoji(33)}
        alt=""
        draggable={false}
        className="h-full w-full translate-y-[8%] scale-[1.1] object-cover object-top"
      />
    </span>
  );
}

const items: OrbitItem[] = [
  // Outer ring, left to right
  { kind: 'status', ring: 'outer', angle: 132, label: 'Release shipped' },
  { kind: 'card', ring: 'outer', angle: 112.6, emoji: '🚀', badge: 12 },
  { kind: 'pill', ring: 'outer', angle: 90, icon: <ThreadAvatar />, label: '8 New Threads' },
  { kind: 'pill', ring: 'outer', angle: 67.6, icon: '⭐', label: '240' },
  { kind: 'avatar', ring: 'outer', angle: 50.9, src: memoji(9), alt: 'Community member', color: '#c4bceb' },
  { kind: 'pill', ring: 'outer', angle: 35.2, icon: <MessageSquareText size={13} strokeWidth={2} />, label: '36' },
  // Inner ring, left to right
  { kind: 'avatar', ring: 'inner', angle: 137.2, src: memoji(19), alt: 'Community member', color: '#ffdcb6' },
  { kind: 'pill', ring: 'inner', angle: 116.6, icon: '🔥', label: '18' },
  { kind: 'avatar', ring: 'inner', angle: 90, src: memoji(35), alt: 'Community member', color: '#c0cef3', size: 48 },
  { kind: 'card', ring: 'inner', angle: 63.3, emoji: '📦' },
  { kind: 'check', ring: 'inner', angle: 41.8 },
];

const stats: OrbitStat[] = [
  { value: '12K+', label: 'Members' },
  { value: '340+', label: 'Projects' },
  { value: '2.5M+', label: 'Downloads' },
];

const tags: OrbitTag[] = [
  { icon: <Code2 strokeWidth={2} />, label: 'Open source', href: '#' },
  { icon: <Presentation strokeWidth={2} />, label: 'Weekly demos', href: '#' },
  { icon: <GraduationCap strokeWidth={2} />, label: 'Mentorship', href: '#' },
  { icon: <Briefcase strokeWidth={2} />, label: 'Job board', href: '#' },
];

export default function CommunityOrbitDemo() {
  return (
    <div className="w-full">
      <CommunityOrbit
        items={items}
        stats={stats}
        headline={
          <>
            Where Builders Ship
            <br className="hidden sm:block" /> Together
          </>
        }
        tags={tags}
      />
    </div>
  );
}
