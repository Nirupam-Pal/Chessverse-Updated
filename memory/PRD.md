# ChessVerse — Product Requirements & Progress

## Original Problem Statement
Update the existing Chess Institute website (ChessVerse — biggest chess institute in Tripura) with a complete modern UI redesign. Use the uploaded logo for color inspiration. Premium, elegant, modern chess-themed design. Add floating WhatsApp button (+91 7629037237), modern hero, animations, smooth scroll, glassmorphism, hover effects. Update Hero/About/Courses/Achievements/Gallery/Testimonials/Contact sections. Pure frontend — no backend; contact form must email chessverse07@gmail.com through a 3rd-party service.

## Brand & Architecture
- **Stack**: Vite + React 19 + TypeScript + Tailwind CSS + framer-motion + three.js (@react-three/fiber + drei) + lucide-react icons
- **Logo**: `/public/images/chessverse-logo.jpg` (blue crown over "CHESSVERSE")
- **Palette (logo-inspired)**: void `#060B1A`, twilight `#0B1733`, royal `#1F4FAE`, sky `#3A8DDE`, azure `#8ECAE6`, gold `#D4AF37`, ivory `#F2F5FA`
- **Fonts**: Fraunces (display/headings, serif italic for accents), Manrope (body)
- **Contact details**: Ramnagar 4, opposite Suruchi Restaurant, Agartala, Tripura · Phone/WhatsApp: +91 76290 37237 · Email: chessverse07@gmail.com
- **3rd-party email service**: [Formsubmit.co](https://formsubmit.co) → endpoint `https://formsubmit.co/ajax/chessverse07@gmail.com` (no signup, no API key; activation email required on first submission)

## User Personas
- **Parents** in Tripura looking for a structured chess academy for their child
- **School-age students** wanting tournament-ready coaching
- **Adult learners / college students** picking up chess online from across the state

## Core Requirements (static)
1. Premium, trustworthy design reflecting "biggest institute in Tripura"
2. Logo-based blue palette + gold premium accent
3. Hero with animated 3D chess board + three CTAs (Join Now / Book Free Demo / Contact Us)
4. Sticky modern navbar with logo + nav links + Book Free Demo CTA
5. Floating WhatsApp button — pulse animation, opens chat with pre-filled message
6. Forms (Booking + Contact) → email chessverse07@gmail.com via Formsubmit.co
7. Sections: Hero, StatsTicker, About, Courses, Achievements, Coaches, Gallery, Testimonials, Booking, Contact, Footer
8. Smooth scroll, fade-in animations, hover effects, glassmorphism
9. Fully responsive (mobile / tablet / desktop)

## What's Implemented (2026-01-14)
- ✅ New theme: Tailwind palette + Fraunces/Manrope fonts + custom utilities (`liquid-glass`, `btn-primary/ghost/gold`, `pill-tag`, `text-gradient`, `text-gradient-gold`, `chess-grid-bg`, `chess-board-bg`)
- ✅ Logo integrated in Navigation + Footer + About section + favicon
- ✅ Hero rebuilt: navy chess board, 3D pieces (white = ivory/sky emissive, black = navy/blue emissive, gold accents on royals), new headline ("Master the 64 squares. Rule the board."), 3 CTAs, floating stat cards (rating growth, FIDE-rated, location)
- ✅ Sticky Navigation with logo, mobile hamburger menu, smooth scroll
- ✅ StatsTicker updated for Tripura context (students, FIDE, NE region)
- ✅ NEW About section with 4 pillars, image, "Since 2013" badge
- ✅ Services (Courses) — Pawn Starter / Knight Tactician (featured w/ gold halo) / Grandmaster Path
- ✅ NEW Achievements section — 4 stat cards + 4-milestone timeline (2024 → 2020)
- ✅ Coaches — 4 cards with Indian names, Coach Arijit Debbarma as featured Founder
- ✅ NEW Gallery section — 7-image asymmetric grid with hover overlays + lightbox modal
- ✅ Testimonials — Indian student/parent quotes (Priyanka Dey, Rohan Chakraborty, etc.)
- ✅ Booking section rewritten — free-demo form, posts to Formsubmit + WhatsApp fallback button
- ✅ Contact section — Formsubmit integration, Agartala address card, embedded Google Maps for Ramnagar 4, WhatsApp banner, social links
- ✅ Footer — logo, address, phone, email, link columns (Courses / Institute / Connect), back-to-top
- ✅ Floating WhatsApp button (`/src/components/WhatsAppButton.tsx`) — pulse ring animation, opens wa.me/917629037237 with pre-filled message, hover tooltip
- ✅ Smooth scroll behavior, fade-in motion on every section
- ✅ Responsive across viewports
- ✅ All interactive elements have `data-testid` attributes
- ✅ Vite config updated with `allowedHosts: true` so preview URL works

## Files
**New files**
- `/app/src/components/WhatsAppButton.tsx`
- `/app/src/sections/About.tsx`
- `/app/src/sections/Achievements.tsx`
- `/app/src/sections/Gallery.tsx`

**Rewritten files**
- `/app/tailwind.config.js`, `/app/src/index.css`, `/app/index.html`, `/app/vite.config.ts`
- `/app/src/pages/Home.tsx`, `/app/src/sections/{Navigation,Hero,StatsTicker,Services,Coaches,Testimonials,Booking,Contact,Footer}.tsx`

**Deleted**
- `/app/src/sections/FocusedClasses.tsx` (replaced by About)

## Testing
- Iteration 1: 100% pass — all sections render, navigation works, forms POST correctly, WhatsApp button correct URL, gallery lightbox functional, mobile menu works, no console errors. See `/app/test_reports/iteration_1.json`.

## Important Activation Note (for the user)
The contact + booking forms send to chessverse07@gmail.com via **Formsubmit.co**.
On the very first form submission, Formsubmit will send an **activation email** to chessverse07@gmail.com — you must click the link in that email **once** to start receiving form submissions. After that, all subsequent submissions deliver instantly. No signup or API key needed.

## Prioritized Backlog (P0 done; future ideas)
- **P1 — Lead capture polish**: Add a thank-you page redirect (`_next` field on Formsubmit) + autoresponder using `_autoresponse`
- **P1 — Google reCAPTCHA / hCaptcha**: Currently `_captcha=false` for clean UX; enable later if spam appears
- **P2 — Real photos**: Replace Unsplash placeholders in Gallery & Coaches with actual ChessVerse photos (just swap URLs in `Gallery.tsx` and `Coaches.tsx`)
- **P2 — Blog / Resources** section for chess tips → drives SEO
- **P2 — Online enrolment + payment** via Razorpay/Stripe (would need backend)
- **P3 — Multi-language** (Bengali/Kokborok) toggle
- **P3 — Newsletter signup** wired to Mailchimp/Brevo

## Next Tasks
1. Activate Formsubmit by submitting one test message and clicking the email confirmation
2. Replace Unsplash gallery/coach photos with real ChessVerse images
3. Update social media links (Facebook/Instagram/YouTube currently `#`)
