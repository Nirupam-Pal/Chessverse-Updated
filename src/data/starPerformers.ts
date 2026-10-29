/*
 * Student showcase data — two lists, two tiers:
 *   starPerformers       major achievements: large featured cards (home page + /star-performers)
 *   meritoriousStudents  other deserving students: compact cards on /star-performers
 * A student's category is simply the list they're in: move an entry to re-classify them.
 * Only `slug`, `name` and `age` are required; every other field is optional and is left out of
 * the card when missing (no photo → an initials badge). Never fill a field with a guess.
 *
 * PLACEHOLDER CONTENT: the three star performers below are demo data (Unsplash stock photos, and
 * the photos don't even match the names). Replace them with real Chessverse students, with their
 * families' consent, before launch.
 */

export type StarPerformer = {
  slug: string
  name: string
  /** class and town, e.g. "Class 9 · Agartala" */
  age: string
  image?: string
  /** e.g. "Star Performer · 2024" */
  period?: string
  /** the headline achievement, e.g. "Tripura State U-14 Gold Medallist" */
  title?: string
  rating?: string
  quote?: string
  achievements?: string[]
  stats?: { label: string; value: string }[]
}

export type MeritoriousStudent = {
  slug: string
  name: string
  /** class or batch, e.g. "Class 7 · Evening batch" */
  age: string
  image?: string
  /** one short, real highlight, e.g. "District U-12 runner-up" */
  highlight?: string
  rating?: string
  /** made-up stand-in: while any entry has this, the section shows a "Sample profiles" note */
  sample?: boolean
}

export const starPerformers: StarPerformer[] = [
  {
    slug: 'rohan-chakraborty',
    name: 'Rohan Chakraborty',
    age: 'Class 9 · Agartala',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
    period: 'Star Performer · 2024',
    title: 'Tripura State U-14 Gold Medallist',
    rating: 'FIDE 1847',
    quote:
      'Chessverse taught me to stay calm under pressure. Winning state gold felt like the natural next step on a journey I started here as a complete beginner.',
    achievements: ['National Schools Championship Qualifier', 'District Champion — 3 consecutive years', '+420 ELO growth in 18 months'],
    stats: [
      { label: 'FIDE Rating', value: '1847' },
      { label: 'Medals Won', value: '12' },
      { label: 'Years at Chessverse', value: '3' },
    ],
  },
  {
    slug: 'ananya-das',
    name: 'Ananya Das',
    age: 'Class 6 · Udaipur',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    period: 'Rising Star · 2024',
    title: 'North East Open U-10 Silver',
    rating: 'FIDE 1520',
    quote:
      'My coaches break every game into puzzles I can understand. I love coming to class — every week I feel stronger on the board.',
    achievements: ['Youngest FIDE-rated girl from Tripura', 'Inter-district U-10 Champion', 'Perfect score in district rapid'],
    stats: [
      { label: 'FIDE Rating', value: '1520' },
      { label: 'Medals Won', value: '8' },
      { label: 'Years at Chessverse', value: '2' },
    ],
  },
  {
    slug: 'debojyoti-nath',
    name: 'Debojyoti Nath',
    age: 'Class 11 · Dharmanagar',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    period: 'Star Performer · 2023',
    title: 'National Sub-Junior Finalist',
    rating: 'FIDE 1962',
    quote:
      'Online classes from Dharmanagar never felt distant. The analysis sessions here are as sharp as any academy in the mainland.',
    achievements: ['Tripura State Open Champion', 'Represented NE at Nationals', 'Top board for school team'],
    stats: [
      { label: 'FIDE Rating', value: '1962' },
      { label: 'Medals Won', value: '18' },
      { label: 'Years at Chessverse', value: '4' },
    ],
  },
]

/*
 * Other deserving students, shown as compact cards (the section hides itself when this is empty).
 * Format (all fields but slug/name/age optional):
 *   { slug: 'firstname-lastname', name: 'Firstname Lastname', age: 'Class 7 · Agartala',
 *     image: '/images/students/firstname.webp', highlight: 'District U-12 runner-up' },
 *
 * SAMPLE DATA: the entries below are invented stand-ins (`sample: true`) added so the layout can be
 * seen. Their photos are the project's placeholder portraits. The page labels them as samples.
 * Replace them with real students — and drop the `sample` flag — before relying on this section.
 */
export const meritoriousStudents: MeritoriousStudent[] = [
  { slug: 'sample-arpita-saha', name: 'Arpita Saha', age: 'Class 11 · Agartala', image: '/images/students/student1-cutout.webp', highlight: 'Academy rapid event winner', sample: true },
  { slug: 'sample-rahul-debnath', name: 'Rahul Debnath', age: 'Class 12 · Agartala', image: '/images/students/student2-cutout.webp', highlight: 'Most improved player of the term', sample: true },
  { slug: 'sample-tanmoy-paul', name: 'Tanmoy Paul', age: 'Class 10 · Online batch', highlight: 'Top scorer in weekly puzzle ladder', sample: true },
  { slug: 'sample-ishita-roy', name: 'Ishita Roy', age: 'Class 12 · Agartala', image: '/images/students/student3-cutout.webp', highlight: 'First tournament, first medal', sample: true },
  { slug: 'sample-sourav-das', name: 'Sourav Das', age: 'Class 9 · Udaipur', image: '/images/students/student4-cutout.webp', highlight: 'Unbeaten in the academy league', sample: true },
  { slug: 'sample-megha-sinha', name: 'Megha Sinha', age: 'Class 6 · Online batch', highlight: 'Perfect attendance all season', sample: true },
  { slug: 'sample-ankit-sarkar', name: 'Ankit Sarkar', age: 'Class 11 · Agartala', highlight: 'School team top board', sample: true },
  { slug: 'sample-riya-chowdhury', name: 'Riya Chowdhury', age: 'Class 4 · Agartala', highlight: 'Youngest finalist in academy blitz', sample: true },
  { slug: 'sample-kunal-majumder', name: 'Kunal Majumder', age: 'Class 8 · Dharmanagar', highlight: 'Steady rating gains this year', sample: true },
  { slug: 'sample-pooja-bhowmik', name: 'Pooja Bhowmik', age: 'Class 7 · Online batch', highlight: 'Best endgame project of the term', sample: true },
  { slug: 'sample-nirban-ghosh', name: 'Nirban Ghosh', age: 'Class 6 · Agartala', highlight: 'Academy simul draw against a coach', sample: true },
  { slug: 'sample-sneha-acharjee', name: 'Sneha Acharjee', age: 'Class 9 · Agartala', highlight: 'Runner-up in academy rapid', sample: true },
]

const ratingNumber = (r?: string) => Number(r?.replace(/\D/g, '')) || 0

/** Totals for headline stats (derived — never typed in by hand; 0 when the data has none). */
export const starPerformerTotals = {
  students: starPerformers.length,
  medals: starPerformers.reduce((n, p) => n + Number(p.stats?.find((s) => s.label === 'Medals Won')?.value ?? 0), 0),
  topRating: Math.max(0, ...starPerformers.map((p) => ratingNumber(p.rating))),
}
