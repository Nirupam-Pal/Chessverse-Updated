/*
 * Testimonials, in two lists:
 *   familyTestimonials   parents — home "What Our Families Say" (sections/Testimonials.tsx) and /testimonials
 *   studentTestimonials  students — the Student Testimonials section (sections/StudentTestimonials.tsx),
 *                        on the home page and /testimonials
 *
 * PLACEHOLDER CONTENT: every name, photo (Unsplash stock), rating and quote here is demo data.
 * Replace it with real, consented testimonials before launch — publishing invented reviews as genuine
 * would mislead parents. Student entries carry `placeholder: true`, which makes the section show a
 * "Sample testimonials" label; remove the flag from each entry you replace with a real one.
 */

export type FamilyTestimonial = {
  name: string
  role: string
  image: string
  quote: string
  rating: number
  improvement: string
}

export const familyTestimonials: FamilyTestimonial[] = [
  {
    name: 'Priyanka Dey',
    role: 'Parent of Student',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    quote:
      "My daughter joined Chessverse two years ago. Today she is a district champion. The coaches don't just teach moves — they teach patience and focus.",
    rating: 5,
    improvement: 'District Champ',
  },
  {
    name: 'Anirban Datta',
    role: 'Parent of Student',
    image: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=300&q=80',
    quote:
      'The team is genuine. They send monthly progress reports and you can actually see your child growing — both in rating and in confidence.',
    rating: 5,
    improvement: 'State Finalist',
  },
]

export type StudentTestimonial = {
  slug: string
  name: string
  /** class, batch or school, e.g. "Class 9 · Agartala" */
  detail: string
  /** Chessverse course, when known */
  course?: string
  image?: string
  quote: string
  /** a short outcome tag, only when it's real, e.g. "FIDE Rated" */
  highlight?: string
  /** demo data — while any entry has this, the section shows a "Sample testimonials" label */
  placeholder?: boolean
}

/* The first entry is shown as the featured testimonial. */
export const studentTestimonials: StudentTestimonial[] = [
  {
    slug: 'rohan-chakraborty',
    name: 'Rohan Chakraborty',
    detail: 'Class 9 Student',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    quote:
      'I started as a beginner and now I am a FIDE rated player. The weekly analysis sessions taught me how to actually think, not just memorise openings.',
    highlight: 'FIDE Rated',
    placeholder: true,
  },
  {
    slug: 'sneha-bhowmik',
    name: 'Sneha Bhowmik',
    detail: 'College Student · Online batch',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
    quote:
      'Online classes from Dharmanagar — same quality as the Agartala batch. The discipline I learned here helps me beyond chess.',
    highlight: '+450 ELO',
    placeholder: true,
  },
  // invented stand-ins (no photos, no results claimed) so the layout can be seen — replace with real students
  {
    slug: 'sample-arnab-saha',
    name: 'Arnab Saha',
    detail: 'Class 7 · Agartala',
    course: 'Pawn Starter',
    quote: 'I used to lose every game in a few moves. Now I know how to start a game properly, and the puzzles make every class fun.',
    placeholder: true,
  },
  {
    slug: 'sample-priya-debnath',
    name: 'Priya Debnath',
    detail: 'Class 10 · Online batch',
    course: 'Knight Tactician',
    quote: 'My coach goes through my own games with me every week. Seeing exactly where I went wrong has changed how I think at the board.',
    placeholder: true,
  },
  {
    slug: 'sample-ritam-paul',
    name: 'Ritam Paul',
    detail: 'Class 11 · Agartala',
    course: 'Bishop Strategist',
    quote: 'I always spotted tactics, but I never had a plan. Learning pawn structures finally made the middlegame make sense to me.',
    placeholder: true,
  },
]

/** Derived summary figures (never typed in by hand). */
export const testimonialSummary = {
  stories: familyTestimonials.length + studentTestimonials.length,
  averageRating: familyTestimonials.reduce((s, t) => s + t.rating, 0) / Math.max(1, familyTestimonials.length),
}
