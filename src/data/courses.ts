import { Crown, GraduationCap, Trophy, type LucideIcon } from 'lucide-react'

/*
 * One source for every course: the home-page cards (sections/Services.tsx) and the full
 * /courses page (pages/CoursesPage.tsx) both read from here, so they can't drift apart.
 * Fees are deliberately not listed — they vary by level and duration (see the FAQs).
 */

export type BookingLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export type Course = {
  /** section id on /courses, e.g. /courses#pawn-starter */
  slug: string
  level: BookingLevel
  title: string
  age: string
  duration: string
  /** short card copy */
  description: string
  /** card bullet points */
  features: string[]
  icon: LucideIcon
  accent: 'sky' | 'gold'
  featured?: boolean
  // ---- detail page ----
  tagline: string
  overview: string
  idealFor: string[]
  curriculum: { title: string; points: string[] }[]
  outcomes: string[]
}

export const courses: Course[] = [
  {
    slug: 'pawn-starter',
    level: 'Beginner',
    title: 'Pawn Starter',
    age: 'Ages 5+',
    duration: '12 weeks',
    description:
      'Perfect for those new to chess. Learn how each piece moves, master basic checkmates and start playing complete games with confidence.',
    features: ['Piece movement & rules', 'Basic checkmates', 'Simple openings', 'Fun puzzles'],
    icon: GraduationCap,
    accent: 'sky',
    tagline: 'First moves, made fun and solid.',
    overview:
      'A playful, structured start for complete beginners. Students learn the board, the pieces and every rule, then put it all together in real games, with puzzles that make each idea stick.',
    idealFor: [
      'Children aged 5 and up who are new to chess',
      'Kids who know a few moves but have never played a full game',
      'Parents looking for a structured, encouraging first course',
    ],
    curriculum: [
      { title: 'The board & the pieces', points: ['How every piece moves and captures', 'Setting up the board and reading coordinates'] },
      { title: 'Rules that decide games', points: ['Check, checkmate and stalemate', 'Castling, en passant and pawn promotion'] },
      { title: 'First checkmates', points: ['Mating with a queen and with a rook', 'Spotting mate in one'] },
      { title: 'Playing complete games', points: ['Simple opening principles: centre, development, king safety', 'Fun puzzles and full practice games'] },
    ],
    outcomes: [
      'Play a complete game confidently, by the rules',
      'Deliver the basic checkmates',
      'Start games with sound opening principles',
      'Solve beginner puzzles on their own',
    ],
  },
  {
    slug: 'knight-tactician',
    level: 'Intermediate',
    title: 'Knight Tactician',
    age: 'For developing players',
    duration: '24 weeks',
    description:
      'For players with basic knowledge. Build a solid opening repertoire, sharpen tactics and learn how to convert winning positions.',
    features: ['Opening repertoire', 'Tactical patterns', 'Endgame essentials', 'Weekly game analysis'],
    icon: Trophy,
    accent: 'gold',
    featured: true,
    tagline: 'Sharper tactics, a real plan, and wins that stay won.',
    overview:
      'For players who know the rules and want to start winning more. Students build an opening repertoire they understand, train the tactical patterns that decide most games, and learn to finish what they start.',
    idealFor: [
      'Players who know the rules and play full games',
      'Students who lose good positions or miss tactics',
      'Juniors preparing for their first tournaments',
    ],
    curriculum: [
      { title: 'Opening repertoire', points: ['A reliable set of openings with White and Black', 'Understanding the ideas, not memorising moves'] },
      { title: 'Tactical patterns', points: ['Forks, pins, skewers and discovered attacks', 'Calculation training on puzzles and positions'] },
      { title: 'Endgame essentials', points: ['King and pawn endings and the opposition', 'Fundamental rook endgames'] },
      { title: 'Converting advantages', points: ['Turning a better position into a win', 'Weekly analysis of students’ own games'] },
    ],
    outcomes: [
      'Spot tactical chances for both sides',
      'Play their openings with understanding',
      'Convert winning positions instead of letting them slip',
      'Review their own games and learn from mistakes',
    ],
  },
  {
    slug: 'grandmaster-path',
    level: 'Advanced',
    title: 'Grandmaster Path',
    age: 'For rated / tournament players',
    duration: 'Ongoing',
    description:
      'Elite training for serious competitors. Deep prep across openings, middlegame strategy, endgame technique and tournament psychology.',
    features: ['1:1 coach mentorship', 'Tournament prep', 'Advanced endgames', 'Position critiques'],
    icon: Crown,
    accent: 'sky',
    tagline: 'Elite preparation for serious competitors.',
    overview:
      'Ongoing training for rated and tournament players, with a coach as mentor. Deep work across every phase of the game, plus the preparation and composure that separate good players from winners.',
    idealFor: [
      'Rated players aiming to raise their FIDE rating',
      'Students competing at district, state or national level',
      'Players who want one coach guiding their long-term growth',
    ],
    curriculum: [
      { title: 'Deep opening preparation', points: ['Building and refining a tournament repertoire', 'Preparing for specific opponents and events'] },
      { title: 'Middlegame strategy', points: ['Pawn structures, piece activity and planning', 'Critiques of students’ own positions'] },
      { title: 'Advanced endgame technique', points: ['Theoretical and practical endgames', 'Precise conversion and defence'] },
      { title: 'Tournament preparation', points: ['Time management and decision-making under pressure', 'Competition routine and game review with a mentor'] },
    ],
    outcomes: [
      'Arrive at tournaments prepared for their opponents',
      'Form strategic plans in complex positions',
      'Handle advanced endgames with precision',
      'Compete with composure under the clock',
    ],
  },
]

/** Private coaching — offered alongside the three programs. */
export const oneOnOne = {
  slug: 'one-on-one',
  title: '1:1 Coaching',
  tagline: 'Private lessons built around one student.',
  overview:
    'One coach, one student, one plan. Private coaching starts from an assessment of how your child actually plays, then focuses every lesson on what will move them forward fastest.',
  points: [
    { title: 'A personal plan', text: 'Built from an assessment of the student’s own games, strengths and gaps.' },
    { title: 'Flexible scheduling', text: 'Lesson times arranged around school and family, Monday to Saturday.' },
    { title: 'Your games, analysed', text: 'Students bring their games; the coach turns every mistake into a lesson.' },
    { title: 'Tournament-focused', text: 'Targeted preparation before events, and honest review after them.' },
  ],
}

/** Facts shared by every course (from the site's FAQs). */
export const classFacts = {
  hours: 'Mon – Sat, 6 AM – 9 PM',
  length: '45 – 60 minutes per class',
  location: 'Ramnagar 4, Agartala',
}

export const WHATSAPP_NUMBER = '917629037237'
export const whatsappLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
