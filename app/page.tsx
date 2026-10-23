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

  // Track scroll position inside pinned section to switch steps
  useEffect(() => {
    const handleScroll = () => {
      if (!pinnedTrackRef.current) return;
      const rect = pinnedTrackRef.current.getBoundingClientRect();
      const totalTrackHeight = pinnedTrackRef.current.offsetHeight - window.innerHeight;
      
      if (totalTrackHeight <= 0) return;

      // Current distance scrolled into the pinned track
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalTrackHeight));
      
      const stepIndex = Math.min(
        EVENTS.length - 1,
        Math.floor(progress * EVENTS.length)
      );
      
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
    const targetScroll = pinnedTrackRef.current.offsetTop + (index / (EVENTS.length - 1)) * totalTrackHeight;
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Royal Wedding Invitation | Aarav & Meera",
        text: "You are cordially invited to celebrate the marriage of Aarav & Meera!",
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
            src="/video/intro.mp4"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

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
            SCREEN 2: LUXURY EMBOSSED INVITATION CARD
            - Cream embossed 3D damask frame background
            - Top-right & bottom-left burgundy flowers bloom in from corners
            - Center text gracefully appears after the floral entrance
           ======================================================== */}
        <section
          ref={pinnedTrackRef}
          id="pinned-invitation"
          className="relative w-full min-h-[100dvh] overflow-hidden flex flex-col justify-between p-6 select-none"
        >
          {/* Background: 3D Embossed Cream & Ivory Carved Lace Frame */}
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
            style={{ backgroundImage: "url('/images/page2-bg.jpg')" }}
          />

          {/* Subtle warm ambient lighting overlay */}
          <div className="absolute inset-0 bg-amber-50/15 pointer-events-none z-1" />

          {/* Top-Right Flower & Berry Garland - Slides & Blooms In from Corner */}
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

          {/* Bottom-Left Flower & Berry Garland - Slides & Blooms In from Corner */}
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

          {/* Invisible Spacer Top for Floral Clearance */}
          <div className="h-16 w-full pointer-events-none z-20" />

          {/* Center Text Area - Each line animates in with its own staggered sequence */}
          <div className="relative z-20 my-auto px-4 max-w-sm mx-auto flex flex-col items-center text-center">
            
            {/* Top Invitation Header - Tightly grouped */}
            <div className="mb-4 flex flex-col items-center">
              {/* Line 1: You Are */}
              <p
                className={`font-body text-xl sm:text-2xl text-[#1a0205] font-medium tracking-wide leading-none transition-all duration-700 ease-out ${
                  textAnimated
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4"
                }`}
                style={{ transitionDelay: textAnimated ? "850ms" : "0ms" }}
              >
                You Are
              </p>

              {/* Line 2: Invited On Our Wedding */}
              <p
                className={`font-body text-xl sm:text-2xl text-[#1a0205] font-medium tracking-wide leading-none mt-1 sm:mt-1.5 transition-all duration-700 ease-out ${
                  textAnimated
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4"
                }`}
                style={{ transitionDelay: textAnimated ? "1100ms" : "0ms" }}
              >
                Invited On Our Wedding
              </p>
            </div>

            {/* Prominent Stacked Couple Names - Tightly stacked with no gap */}
            <div className="flex flex-col items-center my-3 select-none">
              {/* Line 3: KHADIJA */}
              <h2
                className={`text-5xl sm:text-6xl md:text-7xl text-[#140103] leading-[0.88] uppercase tracking-tight transition-all duration-800 ease-out ${
                  textAnimated
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-90 translate-y-3"
                }`}
                style={{
                  fontFamily: "'Times New Roman', 'TimesNewRomanPS-BoldMT', Georgia, serif",
                  fontWeight: 900,
                  transitionDelay: textAnimated ? "1400ms" : "0ms",
                }}
              >
                KHADIJA
              </h2>

              {/* Line 4: &SOHAIB */}
              <h2
                className={`text-5xl sm:text-6xl md:text-7xl text-[#140103] leading-[0.88] uppercase tracking-tight -mt-1 sm:-mt-2 transition-all duration-800 ease-out ${
                  textAnimated
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-90 translate-y-3"
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
              {/* Line 5: 1'clock Afternoon */}
              <p
                className={`font-body text-lg sm:text-xl text-[#1a0205] font-semibold leading-relaxed transition-all duration-600 ease-out ${
                  textAnimated
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3"
                }`}
                style={{ transitionDelay: textAnimated ? "2000ms" : "0ms" }}
              >
                1&apos;clock Afternoon
              </p>

              {/* Line 6: Dubai Palace Marque */}
              <p
                className={`font-body text-lg sm:text-xl text-[#1a0205] font-semibold leading-relaxed transition-all duration-600 ease-out ${
                  textAnimated
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3"
                }`}
                style={{ transitionDelay: textAnimated ? "2250ms" : "0ms" }}
              >
                Dubai Palace Marque
              </p>
            </div>
          </div>

          {/* Bottom Invisible Spacer for Flower Clearance */}
          <div className="h-16 w-full pointer-events-none z-20" />
        </section>

      </div>
    </div>
  );
}
