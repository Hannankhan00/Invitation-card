"use client";

import { useEffect, useRef, useState } from "react";
import {
  Volume2,
  VolumeX,
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Sparkles,
  Share2,
  CheckCircle2,
  Compass,
} from "lucide-react";

interface EventDetail {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  time: string;
  date: string;
  venue: string;
  description: string;
  accentIcon: string;
}

const EVENTS: EventDetail[] = [
  {
    id: 1,
    tag: "AUSPICIOUS UNION",
    title: "Welcome to Our Wedding",
    subtitle: "In the name of Love, Grace & Family",
    time: "Dec 18, 2026",
    date: "Friday Evening",
    venue: "The Grand Regal Palace",
    description:
      "Together with our parents, we warmly invite you and your family to witness and celebrate the sacred union of two loving souls.",
    accentIcon: "✨",
  },
  {
    id: 2,
    tag: "THE COUPLE",
    title: "Aarav & Meera",
    subtitle: "Two souls, one eternal beginning",
    time: "Blessed Together",
    date: "Forever & Always",
    venue: "Daughter of Mr. & Mrs. Sharma • Son of Mr. & Mrs. Verma",
    description:
      "As our story unfolds into a lifetime of shared laughter and dreams, your presence and blessings will make our special day complete.",
    accentIcon: "💍",
  },
  {
    id: 3,
    tag: "CEREMONIES",
    title: "Varmala & Pheras",
    subtitle: "Holy Matrimony & Grand Reception",
    time: "06:30 PM Onwards",
    date: "Friday, Dec 18, 2026",
    venue: "Royal Courtyard, Udaipur",
    description:
      "Followed by an evening of music, banquet dinner, and timeless memories under the starlit sky.",
    accentIcon: "🪷",
  },
  {
    id: 4,
    tag: "CELEBRATE WITH US",
    title: "Join The Festivities",
    subtitle: "We Can't Wait To See You",
    time: "RSVP & Venue Directions",
    date: "Location Guide",
    venue: "The Grand Regal Palace, Lake Pichola",
    description:
      "Kindly consider this as our heartfelt personal invitation. Click below to view directions or save the date to your calendar.",
    accentIcon: "💌",
  },
];

export default function WeddingInvitation() {
  const [isMuted, setIsMuted] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Page 2 animation triggers
  const [page2InView, setPage2InView] = useState(false);
  const [flowersAnimated, setFlowersAnimated] = useState(false);
  const [textAnimated, setTextAnimated] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const pinnedTrackRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef<number>(0);

  // Toggle Video Mute/Unmute
  const toggleAudio = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted) {
      videoRef.current.play().catch(() => {});
    }
  };

  // Auto-scroll from hero to pinned section on first scroll/swipe
  const scrollToPinnedSection = () => {
    const pinnedEl = pinnedTrackRef.current;
    if (pinnedEl) {
      pinnedEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Wheel listener for hero section
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 15) {
        scrollToPinnedSection();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      if (touchStartY.current - touchEndY > 35) {
        scrollToPinnedSection();
      }
    };

    heroEl.addEventListener("wheel", handleWheel, { passive: true });
    heroEl.addEventListener("touchstart", handleTouchStart, { passive: true });
    heroEl.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      heroEl.removeEventListener("wheel", handleWheel);
      heroEl.removeEventListener("touchstart", handleTouchStart);
      heroEl.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Track scroll position inside pinned section to switch between Invitation, Save The Date, and Thank You
  useEffect(() => {
    const handleScroll = () => {
      if (!pinnedTrackRef.current) return;
      const rect = pinnedTrackRef.current.getBoundingClientRect();
      const totalTrackHeight = pinnedTrackRef.current.offsetHeight - window.innerHeight;
      
      if (totalTrackHeight <= 0) return;

      // Current distance scrolled into the pinned track
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalTrackHeight));
      
      // Step distribution across progress [0 -> 1]:
      // 0.00 .. 0.28 -> Step 0 (The Invitation)
      // 0.28 .. 0.65 -> Step 1 (Save The Date)
      // 0.65 .. 1.00 -> Step 2 (Thank You & Good Wishes)
      let stepIndex = 0;
      if (progress >= 0.65) {
        stepIndex = 2;
      } else if (progress >= 0.28) {
        stepIndex = 1;
      } else {
        stepIndex = 0;
      }
      setCurrentStep(stepIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Observe Page 2 to trigger the flower bloom and text appearance sequence
  useEffect(() => {
    const pinnedEl = pinnedTrackRef.current;
    if (!pinnedEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPage2InView(true);
          } else if (entry.boundingClientRect.top > (typeof window !== "undefined" ? window.innerHeight * 0.5 : 400)) {
            // Reset when user scrolls back to the top video screen
            setPage2InView(false);
            setFlowersAnimated(false);
            setTextAnimated(false);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(pinnedEl);

    return () => observer.disconnect();
  }, []);

  // Sequence the animation: Flowers slide & bloom in, then text reveals
  useEffect(() => {
    if (page2InView) {
      const flowerTimer = setTimeout(() => {
        setFlowersAnimated(true);
      }, 150);

      const textTimer = setTimeout(() => {
        setTextAnimated(true);
      }, 1150);

      return () => {
        clearTimeout(flowerTimer);
        clearTimeout(textTimer);
      };
    }
  }, [page2InView]);

  const jumpToStep = (index: number) => {
    if (!pinnedTrackRef.current) return;
    const totalTrackHeight = pinnedTrackRef.current.offsetHeight - window.innerHeight;
    let ratio = 0;
    if (index === 1) ratio = 0.46;
    else if (index === 2) ratio = 0.92;
    const targetScroll = pinnedTrackRef.current.offsetTop + (totalTrackHeight * ratio);
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Khadija's Marriage Invitation | Khadija & Sohaib",
        text: "You are cordially invited to celebrate the marriage of Khadija & Sohaib at Dubai Palace Marque on March 26, 2026!",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const currentEvent = EVENTS[currentStep];

  return (
    <div className="relative w-full min-h-screen bg-[#200408] text-[#faf6ee] flex justify-center">
      {/* Mobile-first centered container frame */}
      <div className="w-full max-w-[480px] min-h-screen relative shadow-[0_0_80px_rgba(0,0,0,0.9)] bg-[#200408] border-x border-[#d4af37]/20">
        
        {/* ========================================================
            SCREEN 1: HERO VIDEO SECTION (100dvh)
           ======================================================== */}
        <section
          ref={heroRef}
          id="hero-video-section"
          className="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-between items-center text-center select-none"
        >
          {/* Background Video */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            poster="/images/poster.jpg"
            onLoadedData={() => setVideoLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src="/video/intro.webm" type="video/webm" />
            <source src="/video/intro.mp4" type="video/mp4" />
          </video>

          {/* Luxury Vignette & Maroon Gradient Overlays - Center kept transparent so hands shine */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#200408]/40 via-transparent to-[#200408]/95 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(32,4,8,0.5)_100%)] z-10 pointer-events-none" />

          {/* Subtle Golden Ornate Frame Borders */}
          <div className="absolute inset-3 border border-[#d4af37]/30 rounded-2xl pointer-events-none z-20">
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]" />
          </div>

          {/* Top Audio Toggle */}
          <header className="relative z-30 w-full pt-6 px-6 flex items-center justify-end">
            <button
              onClick={toggleAudio}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#200408]/70 border border-[#d4af37]/50 text-[#fbeea4] shadow-lg active:scale-95 transition-transform"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-[#d4af37]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#fae084] animate-pulse" />
              )}
            </button>
          </header>

          {/* Spacer so the hands in the video remain completely unobstructed */}
          <div className="flex-1 pointer-events-none" />

          {/* Welcome & Happy Marriage - Positioned Elegantly Below the Hands & Shifted Higher */}
          <div className="relative z-30 px-6 -translate-y-16 sm:-translate-y-20 flex flex-col items-center">
            {/* Flourish with Welcome between the two lines */}
            <div className="flex items-center gap-3 mb-2">
              <span className="h-[1px] w-10 sm:w-14 bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="font-royal text-[11px] sm:text-xs uppercase tracking-[0.35em] text-[#fae084] drop-shadow-sm font-medium">
                Welcome
              </span>
              <span className="h-[1px] w-10 sm:w-14 bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>

            {/* Main Greeting in Pinyon Script - Strictly on one line for all phone screens */}
            <h1 className="font-pinyon text-[clamp(2.1rem,9.5vw,4.25rem)] whitespace-nowrap text-gold-gradient py-1 drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)] leading-tight text-center max-w-full">
              Happy Marriage
            </h1>
          </div>

          {/* Bottom Call To Action / Auto-scroll Prompt */}
          <footer
            onClick={scrollToPinnedSection}
            className="relative z-30 pb-7 px-6 flex flex-col items-center cursor-pointer group"
          >
            <p className="font-royal text-[10px] tracking-[0.28em] uppercase text-[#fae084] mb-2 group-hover:text-white transition-colors">
              Scroll To Open Invitation
            </p>
            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-[#d4af37]/60 bg-[#200408]/60 backdrop-blur-md animate-bounce shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <ChevronDown className="w-4 h-4 text-[#fae084]" />
            </div>
          </footer>
        </section>

        {/* ========================================================
            SCREEN 2, 3 & 4: LUXURY EMBOSSED PINNED TRACK
            - Pinned 3D damask frame & velvet burgundy flowers
            - Scrolling down smoothly transitions between:
              Card 0: The Invitation Card (Khadija & Sohaib)
              Card 1: Save The Date Card (26 MARCH 2026 lockup)
              Card 2: Thank You Card (Gratitude & Beautiful Reading)
           ======================================================== */}
        <section
          ref={pinnedTrackRef}
          id="pinned-invitation"
          className="relative w-full h-[320vh] select-none"
        >
          {/* Sticky Viewport Stage - Keeps background and floral frames completely fixed */}
          <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col justify-between p-6">
            
            {/* Background: 3D Embossed Cream & Ivory Carved Lace Frame */}
            <div
              className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
              style={{ backgroundImage: "url('/images/page2-bg.jpg')" }}
            />

            {/* Subtle warm ambient lighting overlay */}
            <div className="absolute inset-0 bg-amber-50/15 pointer-events-none z-1" />

            {/* Top-Right Flower & Berry Garland - Fixed in Corner */}
            <div
              className={`absolute top-0 right-0 w-full pointer-events-none z-10 transition-all duration-1000 ${
                flowersAnimated
                  ? "opacity-100 translate-x-0 translate-y-0 scale-100 rotate-0"
                  : "opacity-0 translate-x-20 -translate-y-20 scale-85 rotate-12"
              }`}
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              <img
                src="/images/flower-top.png"
                alt="Burgundy Velvet Flower Top Corner"
                className="w-full h-auto object-contain drop-shadow-[0_16px_28px_rgba(74,14,23,0.35)]"
              />
            </div>

            {/* Bottom-Left Flower & Berry Garland - Fixed in Corner */}
            <div
              className={`absolute bottom-0 left-0 w-full pointer-events-none z-10 transition-all duration-1000 ${
                flowersAnimated
                  ? "opacity-100 translate-x-0 translate-y-0 scale-100 rotate-0"
                  : "opacity-0 -translate-x-20 translate-y-20 scale-85 -rotate-12"
              }`}
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              <img
                src="/images/flower-bottom.png"
                alt="Burgundy Velvet Flower Bottom Corner"
                className="w-full h-auto object-contain drop-shadow-[0_-16px_28px_rgba(74,14,23,0.35)]"
              />
            </div>

            {/* Invisible Top Clearance Spacer */}
            <div className="h-14 sm:h-16 w-full pointer-events-none z-20 shrink-0" />

            {/* Center Content Stage: Smooth Cross-fade Between Cards */}
            <div className="relative z-20 my-auto w-full max-w-sm mx-auto flex items-center justify-center min-h-[390px]">

              {/* ----------------------------------------------------
                  CARD 0: THE WEDDING INVITATION
                 ---------------------------------------------------- */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 ease-out ${
                  currentStep === 0
                    ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
                    : "opacity-0 -translate-y-8 pointer-events-none scale-95"
                }`}
              >
                {/* Top Invitation Header */}
                <div className="mb-4 flex flex-col items-center">
                  <p
                    className={`font-body text-xl sm:text-2xl text-[#1a0205] font-medium tracking-wide leading-none transition-all duration-700 ease-out ${
                      textAnimated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                    }`}
                    style={{ transitionDelay: textAnimated ? "850ms" : "0ms" }}
                  >
                    You Are
                  </p>

                  <p
                    className={`font-body text-xl sm:text-2xl text-[#1a0205] font-medium tracking-wide leading-none mt-1 sm:mt-1.5 transition-all duration-700 ease-out ${
                      textAnimated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                    }`}
                    style={{ transitionDelay: textAnimated ? "1100ms" : "0ms" }}
                  >
                    Invited On Our Wedding
                  </p>
                </div>

                {/* Prominent Stacked Couple Names */}
                <div className="flex flex-col items-center my-3 select-none">
                  <h2
                    className={`text-5xl sm:text-6xl md:text-7xl text-[#140103] leading-[0.88] uppercase tracking-tight transition-all duration-800 ease-out ${
                      textAnimated ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-3"
                    }`}
                    style={{
                      fontFamily: "'Times New Roman', 'TimesNewRomanPS-BoldMT', Georgia, serif",
                      fontWeight: 900,
                      transitionDelay: textAnimated ? "1400ms" : "0ms",
                    }}
                  >
                    KHADIJA
                  </h2>

                  <h2
                    className={`text-5xl sm:text-6xl md:text-7xl text-[#140103] leading-[0.88] uppercase tracking-tight -mt-1 sm:-mt-2 transition-all duration-800 ease-out ${
                      textAnimated ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-3"
                    }`}
                    style={{
                      fontFamily: "'Times New Roman', 'TimesNewRomanPS-BoldMT', Georgia, serif",
                      fontWeight: 900,
                      transitionDelay: textAnimated ? "1700ms" : "0ms",
                    }}
                  >
                    &amp;SOHAIB
                  </h2>
                </div>

                {/* Time & Venue Lines */}
                <div className="flex flex-col items-center gap-1.5 my-4">
                  <p
                    className={`font-body text-lg sm:text-xl text-[#1a0205] font-semibold leading-relaxed transition-all duration-600 ease-out ${
                      textAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                    }`}
                    style={{ transitionDelay: textAnimated ? "2000ms" : "0ms" }}
                  >
                    1&apos;clock Afternoon
                  </p>

                  <p
                    className={`font-body text-lg sm:text-xl text-[#1a0205] font-semibold leading-relaxed transition-all duration-600 ease-out ${
                      textAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                    }`}
                    style={{ transitionDelay: textAnimated ? "2250ms" : "0ms" }}
                  >
                    Dubai Palace Marque
                  </p>
                </div>
              </div>

              {/* ----------------------------------------------------
                  CARD 1: SAVE THE DATE (MATCHING REFERENCE IMAGE)
                 ---------------------------------------------------- */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 ease-out ${
                  currentStep === 1
                    ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
                    : currentStep > 1
                    ? "opacity-0 -translate-y-8 pointer-events-none scale-95"
                    : "opacity-0 translate-y-8 pointer-events-none scale-95"
                }`}
              >
                {/* Header Tag */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-[1px] w-8 bg-[#8b1e2e]/50" />
                  <span className="font-royal text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#5c0f1c] font-semibold">
                    Khadija &amp; Sohaib
                  </span>
                  <span className="h-[1px] w-8 bg-[#8b1e2e]/50" />
                </div>

                {/* Main "SAVE THE DATE 26 MARCH 2026" Typographic Lockup */}
                <div className="flex items-center justify-center gap-5 sm:gap-7 my-2 text-[#140103] drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
                  {/* Left Column: Stacked SAVE / THE / DATE in Bold Italic Serif */}
                  <div className="flex flex-col items-start text-left leading-[0.82] select-none">
                    <span
                      className="text-[2.2rem] sm:text-[2.85rem] font-black italic tracking-tighter"
                      style={{ fontFamily: "'Times New Roman', 'TimesNewRomanPS-BoldItalicMT', Georgia, serif" }}
                    >
                      SAVE
                    </span>
                    <span
                      className="text-[2.75rem] sm:text-[3.5rem] font-black italic tracking-tight -my-1 sm:-my-1.5"
                      style={{ fontFamily: "'Times New Roman', 'TimesNewRomanPS-BoldItalicMT', Georgia, serif" }}
                    >
                      THE
                    </span>
                    <span
                      className="text-[2.2rem] sm:text-[2.85rem] font-black italic tracking-tighter"
                      style={{ fontFamily: "'Times New Roman', 'TimesNewRomanPS-BoldItalicMT', Georgia, serif" }}
                    >
                      DATE
                    </span>
                  </div>

                  {/* Right Column: 26 / MARCH / 2026 in Bold Italic Serif */}
                  <div className="flex flex-col items-center text-center select-none">
                    <span
                      className="text-[5.4rem] sm:text-[6.8rem] font-black italic leading-[0.72] tracking-tighter"
                      style={{ fontFamily: "'Times New Roman', 'TimesNewRomanPS-BoldItalicMT', Georgia, serif" }}
                    >
                      26
                    </span>
                    <span
                      className="text-[1.25rem] sm:text-[1.55rem] font-black italic uppercase tracking-wider leading-none mt-1 sm:mt-1.5"
                      style={{ fontFamily: "'Times New Roman', 'TimesNewRomanPS-BoldItalicMT', Georgia, serif" }}
                    >
                      MARCH
                    </span>
                    <span
                      className="text-[1.25rem] sm:text-[1.55rem] font-black italic tracking-wider leading-none mt-0.5"
                      style={{ fontFamily: "'Times New Roman', 'TimesNewRomanPS-BoldItalicMT', Georgia, serif" }}
                    >
                      2026
                    </span>
                  </div>
                </div>

                {/* Subtitle / Venue Information */}
                <div className="flex flex-col items-center gap-1 my-3 text-[#1a0205]">
                  <p className="font-body text-base sm:text-lg font-semibold tracking-wide">
                    1&apos;clock Afternoon
                  </p>
                  <p className="font-body text-base sm:text-lg font-bold tracking-wide">
                    Dubai Palace Marque
                  </p>
                </div>

                {/* Action Buttons: Add To Calendar & Share */}
                <div className="flex items-center gap-2.5 mt-2">
                  <a
                    href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Khadija+%26+Sohaib&dates=20260326T080000Z/20260326T140000Z&details=You+are+cordially+invited+to+celebrate+the+wedding+of+Khadija+%26+Sohaib+at+Dubai+Palace+Marque.&location=Dubai+Palace+Marque"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#38070e] text-[#fbeea4] text-xs font-semibold tracking-wider uppercase border border-[#d4af37]/40 shadow hover:bg-[#520a14] active:scale-95 transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#fae084]" />
                    <span>Add To Calendar</span>
                  </a>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f8f1df] text-[#38070e] text-xs font-semibold tracking-wider uppercase border border-[#38070e]/30 shadow hover:bg-[#f1e6ce] active:scale-95 transition-all"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Link Copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-[#38070e]" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* ----------------------------------------------------
                  CARD 2: THANK YOU & BEAUTIFUL WISHES / READING
                 ---------------------------------------------------- */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center text-center px-2 transition-all duration-700 ease-out ${
                  currentStep === 2
                    ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
                    : "opacity-0 translate-y-8 pointer-events-none scale-95"
                }`}
              >
                {/* Header Tag */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-[1px] w-6 sm:w-8 bg-[#8b1e2e]/50" />
                  <span className="font-royal text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#5c0f1c] font-semibold">
                    With Sincere Gratitude
                  </span>
                  <span className="h-[1px] w-6 sm:w-8 bg-[#8b1e2e]/50" />
                </div>

                {/* Main Calligraphy Header: Thank You */}
                <h2 className="font-pinyon text-5xl sm:text-6xl text-[#140103] leading-none my-1 drop-shadow-sm select-none">
                  Thank You
                </h2>

                {/* Delicate Divider Ornament */}
                <div className="flex items-center justify-center gap-2 my-1.5 opacity-80">
                  <span className="w-6 h-[1px] bg-[#a67c1e]" />
                  <span className="text-[#a67c1e] text-[10px]">♦</span>
                  <span className="w-6 h-[1px] bg-[#a67c1e]" />
                </div>

                {/* Meaningful & Inspiring Reading */}
                <div className="max-w-[320px] sm:max-w-xs mx-auto my-1 flex flex-col gap-1.5 select-none">
                  <p className="font-body text-[13px] sm:text-[14.5px] text-[#240308] leading-relaxed font-semibold">
                    Your presence, warm blessings, and prayers are the greatest gift as we begin our new journey together.
                  </p>
                  <p className="font-body text-[12px] sm:text-[13px] text-[#420812] leading-relaxed italic opacity-95">
                    &ldquo;Two lives, two hearts, joined together in friendship, united forever in love.&rdquo;
                  </p>
                </div>

                {/* Sign-off / Signature */}
                <div className="mt-2 flex flex-col items-center select-none">
                  <p className="font-pinyon text-2xl sm:text-3xl text-[#5c0f1c] leading-none">
                    Khadija &amp; Sohaib
                  </p>
                  <p className="font-royal text-[10px] uppercase tracking-[0.22em] text-[#8b1e2e] mt-1 font-semibold">
                    &amp; Families
                  </p>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex items-center gap-2 mt-3">
                  <a
                    href="https://maps.google.com/?q=Dubai+Palace+Marque"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#38070e] text-[#fbeea4] text-[11px] font-semibold tracking-wider uppercase border border-[#d4af37]/40 shadow hover:bg-[#520a14] active:scale-95 transition-all"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#fae084]" />
                    <span>Venue Location</span>
                  </a>

                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#f8f1df] text-[#38070e] text-[11px] font-semibold tracking-wider uppercase border border-[#38070e]/30 shadow hover:bg-[#f1e6ce] active:scale-95 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#a67c1e]" />
                    <span>Back To Top</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Navigation Pills & Flower Clearance */}
            <div className="relative z-30 pb-3 flex flex-col items-center shrink-0">
              {currentStep === 0 && (
                <button
                  onClick={() => jumpToStep(1)}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#200408]/85 border border-[#d4af37]/50 text-[#fae084] shadow-lg active:scale-95 hover:bg-[#38070e] transition-all text-xs tracking-wider uppercase font-medium backdrop-blur-sm cursor-pointer"
                >
                  <span>Save The Date</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#fae084] animate-bounce" />
                </button>
              )}

              {currentStep === 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => jumpToStep(0)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#200408]/85 border border-[#d4af37]/40 text-[#fae084] shadow-md active:scale-95 hover:bg-[#38070e] transition-all text-[11px] tracking-wider uppercase font-medium backdrop-blur-sm cursor-pointer"
                  >
                    <span>↑ Invitation</span>
                  </button>
                  <button
                    onClick={() => jumpToStep(2)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#38070e] border border-[#d4af37]/60 text-[#fbeea4] shadow-lg active:scale-95 hover:bg-[#520a14] transition-all text-[11px] tracking-wider uppercase font-semibold backdrop-blur-sm cursor-pointer"
                  >
                    <span>Thank You</span>
                    <ChevronDown className="w-3 h-3 text-[#fae084] animate-bounce" />
                  </button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => jumpToStep(1)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#200408]/85 border border-[#d4af37]/40 text-[#fae084] shadow-md active:scale-95 hover:bg-[#38070e] transition-all text-[11px] tracking-wider uppercase font-medium backdrop-blur-sm cursor-pointer"
                  >
                    <span>↑ Save The Date</span>
                  </button>
                  <button
                    onClick={() => jumpToStep(0)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#200408]/85 border border-[#d4af37]/40 text-[#fae084] shadow-md active:scale-95 hover:bg-[#38070e] transition-all text-[11px] tracking-wider uppercase font-medium backdrop-blur-sm cursor-pointer"
                  >
                    <span>↑ Start</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
