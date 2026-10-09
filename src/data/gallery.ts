import { GraduationCap, Star, Trophy, Users, type LucideIcon } from 'lucide-react'

export type FolderId = 'tournaments' | 'masterclasses' | 'community' | 'spotlights'

export type GalleryFolder = {
  id: FolderId
  label: string
  blurb: string
  icon: LucideIcon
}

export type GalleryPhoto = {
  src: string
  title: string
  caption: string
  folder: FolderId
  /** width / height of the displayed crop — reserves space before load (no layout shift) */
  ratio: number
}

export const folders: GalleryFolder[] = [
  { id: 'tournaments', label: 'Tournaments', blurb: 'Match days, medals and the nerves in between', icon: Trophy },
  { id: 'masterclasses', label: 'Masterclasses', blurb: 'Deep-dive sessions with our coaches', icon: GraduationCap },
  { id: 'community', label: 'Community Events', blurb: 'Club nights, simuls and family days', icon: Users },
  { id: 'spotlights', label: 'Student Spotlights', blurb: 'Breakthroughs worth celebrating', icon: Star },
]

/*
 * Placeholder photography. To add real Chessverse photos: drop files into /public/images/gallery/
 * and add an entry here, e.g. { src: '/images/gallery/state-2024.webp', folder: 'tournaments', ratio: 4 / 3, … }.
 * Prefer WebP exported at ~1600px on the long edge. Unsplash URLs are resized + format-negotiated automatically.
 */
export const photos: GalleryPhoto[] = [
  // Tournaments
  {
    src: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b',
    title: 'Tournament Day',
    caption: 'Pieces set, clocks ready — the hall falls silent before round one.',
    folder: 'tournaments',
    ratio: 4 / 3,
  },
  {
    src: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763',
    title: 'Inter-School Meet',
    caption: 'Schools from across Agartala go board-to-board.',
    folder: 'tournaments',
    ratio: 3 / 2,
  },
  {
    src: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f',
    title: 'Final Round Focus',
    caption: 'Everything comes down to one last game.',
    folder: 'tournaments',
    ratio: 4 / 5,
  },
  // Masterclasses
  {
    src: '/images/coaching.jpg',
    title: 'One-on-One Analysis',
    caption: 'Reviewing a tournament game move by move with a coach.',
    folder: 'masterclasses',
    ratio: 1344 / 768,
  },
  {
    src: 'https://images.unsplash.com/photo-1604948501466-4e9c339b9c24',
    title: 'Opening Theory',
    caption: 'Building a repertoire that fits each player’s style.',
    folder: 'masterclasses',
    ratio: 4 / 5,
  },
  {
    src: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793',
    title: 'Middlegame Strategy',
    caption: 'Plans, pawn structures and piece activity.',
    folder: 'masterclasses',
    ratio: 4 / 3,
  },
  // Community events
  {
    src: 'https://images.unsplash.com/photo-1523875194681-bedd468c58bf',
    title: 'Weekend Club Night',
    caption: 'Friendly games, loud post-mortems, lots of laughter.',
    folder: 'community',
    ratio: 3 / 2,
  },
  {
    src: 'https://images.unsplash.com/photo-1610633389918-7d5b62977dc3',
    title: 'Simultaneous Exhibition',
    caption: 'One coach, many boards — and a few brave upsets.',
    folder: 'community',
    ratio: 4 / 5,
  },
  {
    src: 'https://images.unsplash.com/photo-1588412079929-790b9f593d8e',
    title: 'Blitz Hour',
    caption: 'Three minutes on the clock, no time to doubt.',
    folder: 'community',
    ratio: 4 / 3,
  },
  // Student spotlights
  {
    src: 'https://images.unsplash.com/photo-1543092587-d8b8feaf362b',
    title: 'Rising Star',
    caption: 'From first lesson to first rated tournament.',
    folder: 'spotlights',
    ratio: 4 / 5,
  },
  {
    src: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461',
    title: 'Player of the Month',
    caption: 'Recognising consistency, effort and sportsmanship.',
    folder: 'spotlights',
    ratio: 3 / 2,
  },
  {
    src: 'https://images.unsplash.com/photo-1560174038-da43ac74f01b',
    title: 'Breakthrough Season',
    caption: 'A rating jump earned one tough game at a time.',
    folder: 'spotlights',
    ratio: 4 / 3,
  },
]

export const folderById = Object.fromEntries(folders.map((f) => [f.id, f])) as Record<FolderId, GalleryFolder>
