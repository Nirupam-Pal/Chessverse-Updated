import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
 
// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
 
export interface Expert {
  id: string;
  name: string;
  title: string;
  credentials: string;
  quote: string;
  rating?: string;
  imageUrl: string;
  fideTitle?: "GM" | "IM" | "FM" | "WGM" | "WIM" | "CM" | "NM";
}
 
// eslint-disable-next-line react-refresh/only-export-components
export const EXPERTS: Expert[] = [
  {
    id: "e1",
    name: "Grandmaster Aryan Roy",
    title: "National Champion & Head Trainer",
    credentials: "FIDE Rated 2487 · 15+ Years Coaching",
    quote:
      "ChessVerse has revolutionized how we nurture talent in the Northeast. The structured curriculum takes a complete beginner and systematically builds the pattern recognition, calculation depth, and psychological resilience of a tournament player. I've seen students progress from casual hobbyists to rated competitors in under a year.",
    rating: "2487 FIDE",
    fideTitle: "GM",
    imageUrl: "https://i.pravatar.cc/300?img=11",
  },
  {
    id: "e2",
    name: "IM Priya Chakraborty",
    title: "Women's International Master",
    credentials: "3× National Women's Champion · FIDE Trainer",
    quote:
      "What sets ChessVerse apart is not just the chess training — it's the mindset coaching woven through every lesson. Students learn to handle pressure, analyze their mistakes without ego, and play objectively. These are life skills that extend far beyond the 64 squares.",
    rating: "2310 FIDE",
    fideTitle: "IM",
    imageUrl: "https://i.pravatar.cc/300?img=47",
  },
  {
    id: "e3",
    name: "FM Debashis Sen",
    title: "FIDE Master & Opening Theorist",
    credentials: "Author of 'Modern Indian Defenses' · Coach since 2010",
    quote:
      "I recommend ChessVerse without hesitation to any parent looking to give their child a competitive edge. The coaches here don't just teach moves — they teach thinking. The combination of live coaching and structured self-study produces well-rounded players.",
    rating: "2241 FIDE",
    fideTitle: "FM",
    imageUrl: "https://i.pravatar.cc/300?img=12",
  },
  {
    id: "e4",
    name: "Prof. Sandip Biswas",
    title: "Chess Psychology Researcher",
    credentials: "PhD in Cognitive Science · NIT Agartala",
    quote:
      "The cognitive benefits of chess training done right are well-documented — improved working memory, planning ability, and focus. ChessVerse's methodology aligns with the science: deliberate practice with timely feedback and increasing challenge. It's the approach the research actually endorses.",
    rating: undefined,
    fideTitle: undefined,
    imageUrl: "https://i.pravatar.cc/300?img=52",
  },
  {
    id: "e5",
    name: "CM Ritu Debnath",
    title: "Candidate Master & Youth Coach",
    credentials: "State U-20 Champion · ChessVerse Alumni",
    quote:
      "I joined ChessVerse as a student and came back as a coach because I believe in what this institute does. The personal attention each student receives, the quality of game analysis sessions, and the tournament preparation programme are genuinely world-class for this region.",
    rating: "1987 FIDE",
    fideTitle: "CM",
    imageUrl: "https://i.pravatar.cc/300?img=45",
  },
];
 
// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
 
const T = {
  bg: "#060b1a",
  bgCard: "#111118",
  bgCardHover: "#18181f",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.15)",
  gold: "#d4a843",
  goldLight: "#e8c96a",
  goldDim: "rgba(212,168,67,0.12)",
  textPrimary: "#f0ede8",
  textSecondary: "rgba(240,237,232,0.62)",
  textMuted: "rgba(240,237,232,0.38)",
  fontDisplay: "'Playfair Display', Georgia, serif",
  fontBody: "'Inter', 'Segoe UI', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', monospace",
};
 
// ─────────────────────────────────────────────
// SCROLL-TIMELINE MATH
//
// We split progress [0, 1] into N equal segments.
// Each segment has 3 phases:
//   [segStart → segStart+enterFrac]  = card slides in from below
//   [segStart+enterFrac → segEnd-exitFrac] = card rests, fully visible
//   [segEnd-exitFrac → segEnd]       = card slides out upward
//
// Card 0: enters immediately at progress=0 (already in place)
// Card N-1: exits at progress=1
// ─────────────────────────────────────────────
 
const ENTER_FRAC = 0.25; // fraction of segment used for enter
const EXIT_FRAC  = 0.25; // fraction of segment used for exit
 
function getCardTimeline(index: number, total: number) {
  const seg  = 1 / total;
  const s    = index * seg;
  const e    = s + seg;
  return {
    enterStart : s,
    enterEnd   : s + seg * ENTER_FRAC,
    exitStart  : e - seg * EXIT_FRAC,
    exitEnd    : e,
  };
}
 
// ─────────────────────────────────────────────
// ANIMATED CARD WRAPPER
// ─────────────────────────────────────────────
 
interface AnimatedCardProps {
  expert: Expert;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}
 
const AnimatedCard: React.FC<AnimatedCardProps> = ({
  expert,
  index,
  total,
  scrollYProgress,
}) => {
  const { enterStart, enterEnd, exitStart, exitEnd } =
    getCardTimeline(index, total);
 
  // translateY: below → 0 → above
  // Using px values relative to viewport height avoids the
  // "% of element own height" ambiguity that caused the original bug.
  const yPx = useTransform(
    scrollYProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    ["100vh",    "0vh",    "0vh",     "-100vh"]
  );
 
  // Smooth spring so fast scrolling doesn't look jerky
  // Removed: spring can cause drift in scroll-driven animations
  // Use Y transform directly for precise scroll tracking

  const opacity = useTransform(
    scrollYProgress,
    [enterStart, enterStart + (enterEnd - enterStart) * 0.2,
     exitStart  + (exitEnd - exitStart)  * 0.8, exitEnd],
    [0, 1, 1, 0]
  );
 
  const scale = useTransform(
    scrollYProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0.93,       1,        1,         0.97]
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        y: yPx,
        opacity,
        scale,
        display: "flex",
        alignItems: "center",
        willChange: "transform, opacity",
        zIndex: total - index,
      }}
    >
      <CardInner expert={expert} index={index} />
    </motion.div>
  );
};
 
// ─────────────────────────────────────────────
// CARD INNER
// ─────────────────────────────────────────────
 
const CardInner: React.FC<{ expert: Expert; index: number }> = ({
  expert,
  index,
}) => {
  const [hovered, setHovered] = React.useState(false);
 
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        width: "100%",
        borderRadius: "20px",
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        background: hovered ? T.bgCardHover : T.bgCard,
        padding: "clamp(24px, 3.5vw, 40px) clamp(24px, 3.5vw, 40px) clamp(20px, 3vw, 36px)",
        boxShadow: hovered
          ? "0 2px 8px rgba(0,0,0,.7), 0 16px 48px rgba(0,0,0,.5), 0 0 0 1px rgba(212,168,67,.2)"
          : "0 1px 4px rgba(0,0,0,.6), 0 8px 32px rgba(0,0,0,.45)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "background 0.3s, border-color 0.3s, box-shadow 0.4s",
      }}
    >
      {/* Watermark index number */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute", top: 16, right: 24,
          fontSize: "80px", fontWeight: 800,
          fontFamily: T.fontDisplay,
          color: "rgba(212,168,67,0.04)",
          lineHeight: 1, userSelect: "none", pointerEvents: "none",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
 
      {/* Top: avatar + identity */}
      <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 24 }}>
        <motion.div
          animate={{ boxShadow: hovered ? `0 0 0 3px ${T.gold}` : `0 0 0 2px rgba(212,168,67,.3)` }}
          transition={{ duration: 0.3 }}
          style={{ flexShrink: 0, width: 76, height: 76, borderRadius: "50%", overflow: "hidden" }}
        >
          <img
            src={expert.imageUrl}
            alt={expert.name}
            style={{ objectFit: "cover", display: "block", width: "100%", height: "100%" }}
            loading="lazy"
          />
        </motion.div>
 
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 7 }}>
            {expert.fideTitle && (
              <span style={{
                padding: "2px 9px", borderRadius: 6,
                background: T.goldDim, border: `1px solid rgba(212,168,67,.35)`,
                color: T.gold, fontSize: 10, fontWeight: 700,
                letterSpacing: ".08em", fontFamily: T.fontMono,
              }}>{expert.fideTitle}</span>
            )}
            {expert.rating && (
              <span style={{
                padding: "2px 9px", borderRadius: 6,
                background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
                color: T.textSecondary, fontSize: 10, fontFamily: T.fontMono,
              }}>♟ {expert.rating}</span>
            )}
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, fontFamily: T.fontDisplay, color: T.textPrimary, lineHeight: 1.2, marginBottom: 3 }}>
            {expert.name}
          </div>
          <div style={{ fontSize: 12, color: T.gold, fontWeight: 500, marginBottom: 2 }}>{expert.title}</div>
          <div style={{ fontSize: 11, color: T.textMuted }}>{expert.credentials}</div>
        </div>
      </div>
 
      {/* Divider */}
      <div style={{ height: 1, background: "linear-gradient(90deg,rgba(212,168,67,.28) 0%,transparent 80%)", marginBottom: 22 }} />
 
      {/* Quote */}
      <svg width="34" height="27" viewBox="0 0 40 32" fill="none" aria-hidden="true"
        style={{ display: "block", marginBottom: 12, opacity: .48 }}>
        <path d="M0 32V19.2C0 8.533 5.333 2.667 16 0l2.4 3.2C13.067 4.533 10.4 7.467 10.4 12H16V32H0ZM24 32V19.2C24 8.533 29.333 2.667 40 0l2.4 3.2C37.067 4.533 34.4 7.467 34.4 12H40V32H24Z" fill={T.gold}/>
      </svg>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.8, color: T.textSecondary }}>
        {expert.quote}
      </p>
 
      {/* Chess board watermark */}
      <div aria-hidden="true" style={{
        position: "absolute", bottom: 14, right: 14,
        opacity: hovered ? .55 : .2, transition: "opacity .3s", pointerEvents: "none",
      }}>
        <svg width="54" height="54" viewBox="0 0 60 60">
          {Array.from({ length: 36 }).map((_, k) => {
            const r = Math.floor(k / 6), c = k % 6;
            return <rect key={k} x={c*10} y={r*10} width={10} height={10}
              fill={(r+c)%2===0 ? "rgba(212,168,67,.22)" : "rgba(212,168,67,.05)"}/>;
          })}
        </svg>
      </div>
    </motion.div>
  );
};
 
// ─────────────────────────────────────────────
// LEFT PANEL
// ─────────────────────────────────────────────
 
const LeftPanel: React.FC<{
  scrollYProgress: MotionValue<number>;
  total: number;
}> = ({ scrollYProgress, total }) => {
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [activeIndex, setActiveIndex] = React.useState(0);
 
  React.useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const idx = Math.min(Math.floor(v * total), total - 1);
      setActiveIndex(Math.max(0, idx));
    });
  }, [scrollYProgress, total]);
 
  return (
    <div style={{
      display: "flex", flexDirection: "column" as const,
      justifyContent: "center", height: "100%",
      paddingRight: "clamp(24px, 4vw, 64px)",
      position: "relative",
    }}>
      {/* Label */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "6px 14px", borderRadius: 100,
        border: "1px solid rgba(212,168,67,.3)",
        background: "rgba(212,168,67,.07)",
        marginBottom: 22, width: "fit-content",
      }}>
        <span style={{ fontSize: 14, color: T.gold }}>♛</span>
        <span style={{
          fontSize: 11, fontWeight: 600, letterSpacing: ".08em",
          textTransform: "uppercase" as const, color: T.gold,
        }}>Expert Voices</span>
      </div>
 
      {/* Heading */}
      <h2 style={{
        margin: "0 0 12px", fontFamily: T.fontDisplay, fontWeight: 700,
        fontSize: "clamp(28px, 3vw, 46px)", lineHeight: 1.1, color: T.textPrimary,
      }}>
        What <em style={{ fontStyle: "italic", color: T.gold }}>Experts</em>
        <br />Say About Us
      </h2>
 
      {/* Subtext */}
      <p style={{
        margin: "0 0 36px", fontSize: 14, lineHeight: 1.7,
        color: T.textSecondary, maxWidth: 290,
      }}>
        Grandmasters, International Masters, and researchers on why ChessVerse
        produces tournament-ready players.
      </p>
 
      {/* Progress bar */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ height: 2, background: "rgba(255,255,255,.08)", borderRadius: 2, overflow: "hidden", marginBottom: 9 }}>
          <motion.div style={{
            height: "100%", width: progressWidth,
            background: `linear-gradient(90deg,${T.gold},${T.goldLight})`,
            borderRadius: 2,
          }} />
        </div>
        <p style={{ margin: 0, fontSize: 11, color: T.textMuted, fontFamily: T.fontMono }}>
          {activeIndex + 1} / {total}
        </p>
      </div>
 
      {/* Dot indicators */}
      <div style={{ display: "flex", gap: 8 }}>
        {Array.from({ length: total }).map((_, i) => (
          <motion.div key={i}
            animate={{ width: i === activeIndex ? 24 : 8, background: i === activeIndex ? T.gold : "rgba(255,255,255,.18)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ height: 8, borderRadius: 4 }}
          />
        ))}
      </div>
 
      {/* King watermark */}
      <div aria-hidden="true" style={{
        position: "absolute", bottom: "5%", left: -10,
        fontSize: 150, lineHeight: 1,
        color: T.gold, opacity: .04,
        userSelect: "none", pointerEvents: "none",
      }}>♔</div>
    </div>
  );
};
 
// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
 
export interface ExpertTestimonialsProps {
  experts?: Expert[];
  /**
   * Height of your site's fixed navbar in px.
   * The sticky panel offsets by this amount so cards sit below the navbar.
   * Default: 64. Adjust to match your actual navbar height.
   */
  navbarHeight?: number;
}
 
const ExpertTestimonials: React.FC<ExpertTestimonialsProps> = ({
  experts = EXPERTS,
  navbarHeight = 64,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const total = experts.length;
 
  /**
   * KEY FIX: Track scroll progress as the container moves through the viewport.
   * offset["start end"] = when container top reaches viewport bottom (starts entering)
   * offset["end start"] = when container bottom reaches viewport top (exits completely)
   * This ensures card 0 is visible as soon as the section appears.
   */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap');
      `}</style>
 
      {/**
       * OUTER: tall scroll container.
       * (total + 1) screens tall: 1 screen per card + 1 screen entrance buffer.
       * The +1 ensures the first card has a full screen to enter before any exit.
       */}
      <div
        ref={containerRef}
        style={{
          height: `${(total + 1) * 100}vh`,
          background: T.bg,
          position: "relative",
        }}
      >
        {/**
         * INNER STICKY: always exactly (100vh - navbarHeight) tall,
         * pinned just below the navbar.
         */}
        <div style={{
          position: "sticky",
          top: navbarHeight,
          height: `calc(100vh - ${navbarHeight}px)`,
          overflow: "hidden",
          display: "flex",
          background: T.bg,
        }}>
          {/* Ambient glow */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 55% 60% at 15% 50%,rgba(212,168,67,.05) 0%,transparent 65%),radial-gradient(ellipse 35% 55% at 85% 30%,rgba(192,57,43,.03) 0%,transparent 65%)",
          }} />
 
          {/* Two-column layout */}
          <div style={{
            display: "flex", width: "100%",
            maxWidth: 1200, margin: "0 auto",
            padding: "0 clamp(20px,4vw,64px)",
            alignItems: "stretch",
            position: "relative", zIndex: 1,
          }}>
            {/* LEFT: sticky heading */}
            <div style={{ flex: "0 0 clamp(260px,36%,400px)", display: "flex", alignItems: "center" }}>
              <LeftPanel scrollYProgress={scrollYProgress} total={total} />
            </div>
 
            {/* RIGHT: card stage — overflow hidden clips cards entering/exiting */}
            <div style={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              padding: "32px 0",
            }}>
              {experts.map((expert, i) => (
                <AnimatedCard
                  key={expert.id}
                  expert={expert}
                  index={i}
                  total={total}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
 
export default ExpertTestimonials;