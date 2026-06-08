import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";

// ─────────────────────────────────────────────
// THEME DETECTION HOOK
// Reads the same `dark` class that Tailwind / your site's
// ThemeProvider toggles on <html>. Falls back gracefully to
// system preference. Re-runs whenever the class changes.
// ─────────────────────────────────────────────

function useIsDark(): boolean {
  const [dark, setDark] = React.useState(() => {
    if (typeof document === "undefined") return true;
    return document.documentElement.classList.contains("dark");
  });

  React.useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return dark;
}

// ─────────────────────────────────────────────
// RESPONSIVE HOOK
// ─────────────────────────────────────────────

function useBreakpoint() {
  const [width, setWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  React.useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);
  return {
    isMobile:  width < 640,
    isTablet:  width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    width,
  };
}

// ─────────────────────────────────────────────
// THEME TOKENS
// Dark: matches existing deep-navy dark theme
// Light: derived from Founder.tsx —
//   void=#060b1a → bg=warm off-white
//   bg-white/5 → card=white with backdrop-blur
//   border-white/10 → border=black/8
//   text-ivory=#f0ede8 → text=#1a1a2e (deep navy, same as dark bg)
//   text-ghost=rgba(240,…,0.62) → text=rgba(26,26,46,0.65)
//   gold=#d4a843 stays identical across both themes
//   sky accent used in light glow
// ─────────────────────────────────────────────

interface ThemeTokens {
  // backgrounds
  bg: string;
  bgInner: string;          // sticky inner panel bg
  bgCard: string;
  bgCardHover: string;
  bgChip: string;

  // borders
  border: string;
  borderHover: string;
  borderChip: string;
  borderMobile: string;     // divider between stacked panels

  // accent
  gold: string;
  goldLight: string;
  goldDim: string;
  goldRing: string;         // avatar ring default
  goldRingHover: string;    // avatar ring on hover

  // text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textGold: string;         // same as gold, convenience

  // shadows
  shadowCard: string;
  shadowCardHover: string;

  // glows (ambient bg decoration)
  glow: string;

  // progress track empty fill
  progressTrack: string;
  dotInactive: string;

  // watermark king opacity
  kingOpacity: number;
}

const DARK: ThemeTokens = {
  bg:             "#060b1a",
  bgInner:        "#060b1a",
  bgCard:         "#111118",
  bgCardHover:    "#18181f",
  bgChip:         "rgba(212,168,67,0.07)",

  border:         "rgba(255,255,255,0.07)",
  borderHover:    "rgba(255,255,255,0.15)",
  borderChip:     "rgba(212,168,67,0.30)",
  borderMobile:   "rgba(255,255,255,0.06)",

  gold:           "#d4a843",
  goldLight:      "#e8c96a",
  goldDim:        "rgba(212,168,67,0.12)",
  goldRing:       "rgba(212,168,67,0.30)",
  goldRingHover:  "#d4a843",

  textPrimary:    "#f0ede8",
  textSecondary:  "rgba(240,237,232,0.62)",
  textMuted:      "rgba(240,237,232,0.38)",
  textGold:       "#d4a843",

  shadowCard:     "0 1px 4px rgba(0,0,0,.60), 0 8px 32px rgba(0,0,0,.45)",
  shadowCardHover:"0 2px 8px rgba(0,0,0,.70), 0 16px 48px rgba(0,0,0,.50), 0 0 0 1px rgba(212,168,67,.20)",

  glow: [
    "radial-gradient(ellipse 55% 60% at 15% 50%, rgba(212,168,67,.05) 0%, transparent 65%)",
    "radial-gradient(ellipse 35% 55% at 85% 30%, rgba(192,57,43,.03) 0%, transparent 65%)",
  ].join(","),

  progressTrack:  "rgba(255,255,255,0.08)",
  dotInactive:    "rgba(255,255,255,0.18)",
  kingOpacity:    0.04,
};

// Light theme — mirrors Founder.tsx's glassmorphism + soft-sky-gold palette
const LIGHT: ThemeTokens = {
  // Exact gradient sampled from the site's light-mode background:
  // near-white center (#f8f9fb) → cool blue-gray edges (#f1f2f6 / #eff3fc)
  // bg: solid mid-tone for the tall outer scroll wrapper (gradient would stretch)
  // bgInner: the visible gradient, applied only to the sticky 100vh panel
  bg:      "#f3f4f8",
  bgInner: "linear-gradient(135deg, #f1f2f6 0%, #f8f9fb 45%, #eff3fc 100%)",

  // Cards use white + backdrop-blur (mirrors bg-white/5 backdrop-blur-xl in Founder)
  bgCard:         "rgba(255,255,255,0.75)",
  bgCardHover:    "rgba(255,255,255,0.95)",
  bgChip:         "rgba(212,168,67,0.10)",

  // Borders — equivalent of border-white/10 translated to light surface
  border:         "rgba(26,26,46,0.08)",
  borderHover:    "rgba(212,168,67,0.40)",
  borderChip:     "rgba(212,168,67,0.40)",
  borderMobile:   "rgba(26,26,46,0.08)",

  gold:           "#b8891e",           // darker gold for contrast on white
  goldLight:      "#d4a843",
  goldDim:        "rgba(184,137,30,0.12)",
  goldRing:       "rgba(184,137,30,0.30)",
  goldRingHover:  "#b8891e",

  // Text — deep navy (same hue as dark bg) for strong light-mode contrast
  textPrimary:    "#1a1a2e",
  textSecondary:  "rgba(26,26,46,0.65)",
  textMuted:      "rgba(26,26,46,0.42)",
  textGold:       "#b8891e",

  // Elevated white-surface shadows (mirrors shadow-[0_30px_80px_-48px_…] in Founder)
  shadowCard:     "0 1px 2px rgba(0,0,0,.04), 0 8px 32px rgba(0,0,0,.08), 0 0 0 1px rgba(26,26,46,.06)",
  shadowCardHover:"0 4px 12px rgba(0,0,0,.08), 0 20px 56px rgba(0,0,0,.12), 0 0 0 1px rgba(184,137,30,.25)",

  // Soft gold + sky glows (mirrors the Founder section's ambient blurs)
  glow: [
    "radial-gradient(ellipse 60% 55% at 10% 50%, rgba(212,168,67,.07) 0%, transparent 60%)",
    "radial-gradient(ellipse 50% 60% at 90% 20%, rgba(14,165,233,.05) 0%, transparent 55%)",
    "radial-gradient(ellipse 40% 50% at 50% 100%, rgba(212,168,67,.04) 0%, transparent 60%)",
  ].join(","),

  progressTrack:  "rgba(26,26,46,0.10)",
  dotInactive:    "rgba(26,26,46,0.15)",
  kingOpacity:    0.04,
};

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
// FONTS
// ─────────────────────────────────────────────

const FONT_DISPLAY = "'Playfair Display', Georgia, serif";
const FONT_BODY    = "'Inter', 'Segoe UI', system-ui, sans-serif";
const FONT_MONO    = "'JetBrains Mono', monospace";

// ─────────────────────────────────────────────
// SCROLL-TIMELINE MATH  (unchanged)
// ─────────────────────────────────────────────

const ENTER_FRAC = 0.25;
const EXIT_FRAC  = 0.25;

function getCardTimeline(index: number, total: number) {
  const seg = 1 / total;
  const s   = index * seg;
  const e   = s + seg;
  return {
    enterStart: s,
    enterEnd:   s + seg * ENTER_FRAC,
    exitStart:  e - seg * EXIT_FRAC,
    exitEnd:    e,
  };
}

// ─────────────────────────────────────────────
// ANIMATED CARD WRAPPER  (animation logic unchanged)
// ─────────────────────────────────────────────

interface AnimatedCardProps {
  expert: Expert;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  theme: ThemeTokens;
  isDark: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  expert, index, total, scrollYProgress, theme, isDark,
}) => {
  const { enterStart, enterEnd, exitStart, exitEnd } = getCardTimeline(index, total);

  const yPx = useTransform(
    scrollYProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    ["100vh", "0vh", "0vh", "-100vh"]
  );
  const opacity = useTransform(
    scrollYProgress,
    [
      enterStart, enterStart + (enterEnd - enterStart) * 0.2,
      exitStart  + (exitEnd  - exitStart)  * 0.8, exitEnd,
    ],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0.93, 1, 1, 0.97]
  );

  return (
    <motion.div
      style={{
        position: "absolute", inset: 0,
        y: yPx, opacity, scale,
        display: "flex", alignItems: "center",
        willChange: "transform, opacity",
        zIndex: total - index,
      }}
    >
      <CardInner expert={expert} index={index} theme={theme} isDark={isDark} />
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// CARD INNER
// ─────────────────────────────────────────────

interface CardInnerProps {
  expert: Expert;
  index: number;
  theme: ThemeTokens;
  isDark: boolean;
}

const CardInner: React.FC<CardInnerProps> = ({ expert, index, theme: T, isDark }) => {
  const [hovered, setHovered] = React.useState(false);
  const { isMobile, isTablet } = useBreakpoint();

  const avatarSize    = isMobile ? 56 : isTablet ? 64 : 76;
  const nameFontSize  = isMobile ? 16 : isTablet ? 17 : 19;
  const quoteFontSize = isMobile ? 13 : isTablet ? 14 : 15;
  const cardPadding   = isMobile
    ? "20px 18px 18px"
    : isTablet
    ? "28px 28px 24px"
    : "clamp(24px,3.5vw,40px) clamp(24px,3.5vw,40px) clamp(20px,3vw,36px)";

  // Light mode gets backdrop-blur glassmorphism like Founder.tsx cards
  const backdropFilter = isDark ? undefined : "blur(20px) saturate(1.4)";

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        width: "100%",
        borderRadius: isMobile ? "20px" : "28px",       // matches Founder's rounded-[28px]
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        background: hovered ? T.bgCardHover : T.bgCard,
        backdropFilter,
        WebkitBackdropFilter: backdropFilter,
        padding: cardPadding,
        boxShadow: hovered ? T.shadowCardHover : T.shadowCard,
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "background 0.3s, border-color 0.3s, box-shadow 0.4s",
      }}
    >
      {/* Light-mode only: top-edge gold shimmer line (premium detail) */}
      {!isDark && (
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%",
          height: "1px",
          background: `linear-gradient(90deg, transparent, rgba(184,137,30,0.35), transparent)`,
          pointerEvents: "none",
        }} />
      )}

      {/* Watermark index number */}
      {!isMobile && (
        <span aria-hidden="true" style={{
          position: "absolute", top: 16, right: 24,
          fontSize: isTablet ? "64px" : "80px", fontWeight: 800,
          fontFamily: FONT_DISPLAY,
          color: isDark ? "rgba(212,168,67,0.04)" : "rgba(184,137,30,0.06)",
          lineHeight: 1, userSelect: "none", pointerEvents: "none",
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      {/* Top: avatar + identity */}
      <div style={{
        display: "flex", gap: isMobile ? 12 : 18,
        alignItems: "flex-start", marginBottom: isMobile ? 16 : 24,
      }}>
        <motion.div
          animate={{
            boxShadow: hovered
              ? `0 0 0 3px ${T.goldRingHover}`
              : `0 0 0 2px ${T.goldRing}`,
          }}
          transition={{ duration: 0.3 }}
          style={{
            flexShrink: 0, width: avatarSize, height: avatarSize,
            borderRadius: "50%", overflow: "hidden",
            // Light: add a subtle drop shadow on the avatar
            filter: isDark ? undefined : "drop-shadow(0 2px 6px rgba(0,0,0,.12))",
          }}
        >
          <img
            src={expert.imageUrl} alt={expert.name}
            style={{ objectFit: "cover", display: "block", width: "100%", height: "100%" }}
            loading="lazy"
          />
        </motion.div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Badges */}
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 7 }}>
            {expert.fideTitle && (
              <span style={{
                padding: "2px 9px", borderRadius: 6,
                background: T.goldDim,
                border: `1px solid ${isDark ? "rgba(212,168,67,.35)" : "rgba(184,137,30,.35)"}`,
                color: T.textGold, fontSize: 10, fontWeight: 700,
                letterSpacing: ".08em", fontFamily: FONT_MONO,
              }}>{expert.fideTitle}</span>
            )}
            {expert.rating && (
              <span style={{
                padding: "2px 9px", borderRadius: 6,
                background: isDark ? "rgba(255,255,255,.05)" : "rgba(26,26,46,.05)",
                border: `1px solid ${isDark ? "rgba(255,255,255,.10)" : "rgba(26,26,46,.10)"}`,
                color: T.textSecondary, fontSize: 10, fontFamily: FONT_MONO,
              }}>♟ {expert.rating}</span>
            )}
          </div>

          <div style={{
            fontSize: nameFontSize, fontWeight: 700,
            fontFamily: FONT_DISPLAY, color: T.textPrimary,
            lineHeight: 1.2, marginBottom: 3,
          }}>{expert.name}</div>

          <div style={{ fontSize: isMobile ? 11 : 12, color: T.textGold, fontWeight: 500, marginBottom: 2 }}>
            {expert.title}
          </div>
          <div style={{ fontSize: isMobile ? 10 : 11, color: T.textMuted }}>
            {expert.credentials}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        background: isDark
          ? "linear-gradient(90deg,rgba(212,168,67,.28) 0%,transparent 80%)"
          : "linear-gradient(90deg,rgba(184,137,30,.22) 0%,rgba(26,26,46,.06) 60%,transparent 100%)",
        marginBottom: isMobile ? 14 : 22,
      }} />

      {/* Quote icon */}
      <svg
        width={isMobile ? 24 : 34} height={isMobile ? 20 : 27}
        viewBox="0 0 40 32" fill="none" aria-hidden="true"
        style={{ display: "block", marginBottom: isMobile ? 8 : 12, opacity: isDark ? .48 : .38 }}
      >
        <path
          d="M0 32V19.2C0 8.533 5.333 2.667 16 0l2.4 3.2C13.067 4.533 10.4 7.467 10.4 12H16V32H0ZM24 32V19.2C24 8.533 29.333 2.667 40 0l2.4 3.2C37.067 4.533 34.4 7.467 34.4 12H40V32H24Z"
          fill={T.gold}
        />
      </svg>

      <p style={{ margin: 0, fontSize: quoteFontSize, lineHeight: 1.8, color: T.textSecondary }}>
        {expert.quote}
      </p>

      {/* Chess board watermark — desktop only */}
      {!isMobile && (
        <div aria-hidden="true" style={{
          position: "absolute", bottom: 14, right: 14,
          opacity: hovered ? (isDark ? .55 : .45) : (isDark ? .20 : .14),
          transition: "opacity .3s", pointerEvents: "none",
        }}>
          <svg width="54" height="54" viewBox="0 0 60 60">
            {Array.from({ length: 36 }).map((_, k) => {
              const r = Math.floor(k / 6), c = k % 6;
              const darkCell = (r + c) % 2 === 0;
              return (
                <rect key={k} x={c * 10} y={r * 10} width={10} height={10}
                  fill={darkCell
                    ? (isDark ? "rgba(212,168,67,.22)" : "rgba(184,137,30,.20)")
                    : (isDark ? "rgba(212,168,67,.05)" : "rgba(184,137,30,.04)")
                  }
                />
              );
            })}
          </svg>
        </div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// LEFT PANEL
// ─────────────────────────────────────────────

interface LeftPanelProps {
  scrollYProgress: MotionValue<number>;
  total: number;
  isMobile: boolean;
  isTablet: boolean;
  theme: ThemeTokens;
  isDark: boolean;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  scrollYProgress, total, isMobile, isTablet, theme: T, isDark,
}) => {
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
      justifyContent: isMobile ? "flex-start" : "center",
      height: "100%",
      paddingRight: isMobile ? 0 : isTablet ? "24px" : "clamp(24px,4vw,64px)",
      paddingTop: isMobile ? "24px" : 0,
      paddingBottom: isMobile ? "16px" : 0,
      position: "relative",
    }}>

      {/* Label chip — mirrors Founder's pill-tag */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "5px 12px", borderRadius: 100,
        border: `1px solid ${T.borderChip}`,
        background: T.bgChip,
        marginBottom: isMobile ? 14 : 22,
        width: "fit-content",
        // Light: add the same backdrop-blur as Founder's pill chips
        backdropFilter: isDark ? undefined : "blur(8px)",
        WebkitBackdropFilter: isDark ? undefined : "blur(8px)",
      }}>
        <span style={{ fontSize: isMobile ? 12 : 14, color: T.textGold }}>♛</span>
        <span style={{
          fontSize: isMobile ? 10 : 11, fontWeight: 600,
          letterSpacing: ".08em", textTransform: "uppercase" as const,
          color: T.textGold, fontFamily: FONT_BODY,
        }}>Expert Voices</span>
      </div>

      {/* Heading */}
      <h2 style={{
        margin: `0 0 ${isMobile ? "8px" : "12px"}`,
        fontFamily: FONT_DISPLAY, fontWeight: 700,
        fontSize: isMobile ? "22px" : isTablet ? "28px" : "clamp(28px,3vw,46px)",
        lineHeight: 1.15, color: T.textPrimary,
      }}>
        What{" "}
        <em style={{ fontStyle: "italic", color: T.textGold }}>Experts</em>
        {!isMobile && <br />}
        {isMobile ? " " : ""}Say About Us
      </h2>

      {/* Subtext — hidden on mobile */}
      {!isMobile && (
        <p style={{
          margin: `0 0 ${isTablet ? "24px" : "36px"}`,
          fontSize: isTablet ? 13 : 14, lineHeight: 1.7,
          color: T.textSecondary, maxWidth: 290,
          fontFamily: FONT_BODY,
        }}>
          Grandmasters, International Masters, and researchers on why ChessVerse
          produces tournament-ready players.
        </p>
      )}

      {/* Progress bar */}
      <div style={{ marginBottom: isMobile ? 8 : 14, marginTop: isMobile ? 12 : 0 }}>
        <div style={{
          height: 2, background: T.progressTrack,
          borderRadius: 2, overflow: "hidden", marginBottom: isMobile ? 6 : 9,
        }}>
          <motion.div style={{
            height: "100%", width: progressWidth,
            background: `linear-gradient(90deg,${T.gold},${T.goldLight})`,
            borderRadius: 2,
          }} />
        </div>
        <p style={{ margin: 0, fontSize: 10, color: T.textMuted, fontFamily: FONT_MONO }}>
          {activeIndex + 1} / {total}
        </p>
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: total }).map((_, i) => (
          <motion.div key={i}
            animate={{
              width: i === activeIndex ? 20 : 7,
              background: i === activeIndex ? T.gold : T.dotInactive,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ height: 7, borderRadius: 4 }}
          />
        ))}
      </div>

      {/* King watermark */}
      {!isMobile && (
        <div aria-hidden="true" style={{
          position: "absolute", bottom: "5%", left: -10,
          fontSize: isTablet ? 100 : 150, lineHeight: 1,
          color: T.gold, opacity: T.kingOpacity,
          userSelect: "none", pointerEvents: "none",
          fontFamily: FONT_DISPLAY,
        }}>♔</div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export interface ExpertTestimonialsProps {
  experts?: Expert[];
  /**
   * Height of your fixed navbar in px. Sticky inner panel offsets by this.
   * Default: 64. Adjust to match your actual navbar height.
   */
  navbarHeight?: number;
}

const ExpertTestimonials: React.FC<ExpertTestimonialsProps> = ({
  experts = EXPERTS,
  navbarHeight = 64,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const total        = experts.length;
  const { isMobile, isTablet } = useBreakpoint();
  const isDark       = useIsDark();
  const T            = isDark ? DARK : LIGHT;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scrollMultiplier = isMobile ? total + 1.5 : total + 1;

  // Light mode: chess-board-bg pattern (matches Founder's chess-board-bg class)
  // A subtle repeating square pattern at very low opacity
  const chessBoardBg = isDark ? undefined : `
    repeating-conic-gradient(rgba(26,26,46,0.025) 0% 25%, transparent 0% 50%)
    0 0 / 24px 24px
  `;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap');
      `}</style>

      {/* ── OUTER tall scroll container ── */}
      <div
        ref={containerRef}
        style={{
          height: `${scrollMultiplier * 100}vh`,
          background: T.bg,
          position: "relative",
        }}
      >
        {/* ── STICKY viewport ── */}
        <div style={{
          position: "sticky",
          top: navbarHeight,
          height: `calc(100vh - ${navbarHeight}px)`,
          overflow: "hidden",
          display: "flex",
          background: T.bgInner,
        }}>

          {/* Chess board texture — light mode only (mirrors Founder) */}
          {!isDark && (
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: chessBoardBg,
              opacity: 0.8,
            }} />
          )}

          {/* Ambient glow blobs */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: T.glow,
          }} />

          {/* Light mode: top blur orb (mirrors Founder's -top-10 gold blur) */}
          {!isDark && (
            <>
              <div aria-hidden="true" style={{
                position: "absolute", top: -40, left: "50%",
                transform: "translateX(-50%)",
                width: 600, height: 400, borderRadius: "50%",
                background: "rgba(212,168,67,0.07)",
                filter: "blur(120px)", pointerEvents: "none",
              }} />
              <div aria-hidden="true" style={{
                position: "absolute", bottom: 0, right: 0,
                width: 280, height: 280, borderRadius: "50%",
                background: "rgba(14,165,233,0.06)",
                filter: "blur(100px)", pointerEvents: "none",
              }} />
            </>
          )}

          {/* ── MOBILE / TABLET: stacked layout ── */}
          {isMobile || isTablet ? (
            <div style={{
              display: "flex", flexDirection: "column",
              width: "100%", maxWidth: 700,
              margin: "0 auto",
              padding: `0 ${isMobile ? "16px" : "28px"}`,
              position: "relative", zIndex: 1,
              height: "100%",
            }}>
              {/* Heading panel */}
              <div style={{
                flexShrink: 0,
                borderBottom: `1px solid ${T.borderMobile}`,
              }}>
                <LeftPanel
                  scrollYProgress={scrollYProgress} total={total}
                  isMobile={isMobile} isTablet={isTablet}
                  theme={T} isDark={isDark}
                />
              </div>

              {/* Card stage */}
              <div style={{
                flex: 1, position: "relative", overflow: "hidden",
                display: "flex", alignItems: "center",
                padding: `${isMobile ? "12px" : "20px"} 0`,
              }}>
                {experts.map((expert, i) => (
                  <AnimatedCard
                    key={expert.id} expert={expert}
                    index={i} total={total}
                    scrollYProgress={scrollYProgress}
                    theme={T} isDark={isDark}
                  />
                ))}
              </div>
            </div>

          ) : (
            /* ── DESKTOP: side-by-side layout ── */
            <div style={{
              display: "flex", width: "100%",
              maxWidth: 1200, margin: "0 auto",
              padding: "0 clamp(20px,4vw,64px)",
              alignItems: "stretch",
              position: "relative", zIndex: 1,
            }}>
              {/* LEFT */}
              <div style={{ flex: "0 0 clamp(260px,36%,400px)", display: "flex", alignItems: "center" }}>
                <LeftPanel
                  scrollYProgress={scrollYProgress} total={total}
                  isMobile={false} isTablet={false}
                  theme={T} isDark={isDark}
                />
              </div>

              {/* RIGHT: card stage */}
              <div style={{
                flex: 1, position: "relative", overflow: "hidden",
                display: "flex", alignItems: "center",
                padding: "32px 0",
              }}>
                {experts.map((expert, i) => (
                  <AnimatedCard
                    key={expert.id} expert={expert}
                    index={i} total={total}
                    scrollYProgress={scrollYProgress}
                    theme={T} isDark={isDark}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ExpertTestimonials;