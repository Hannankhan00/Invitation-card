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

            {/* Main Greeting in Pinyon Script */}
            <h1 className="font-pinyon text-6xl sm:text-7xl md:text-8xl text-gold-gradient py-1 drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)] leading-tight text-center">
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
            SCREEN 2: PINNED STEP-BY-STEP SECTION
            The background & frame stay fixed in viewport while each scroll
            smoothly animates the decorative elements & transitions the text!
           ======================================================== */}
        <section
          ref={pinnedTrackRef}
          id="pinned-invitation"
          className="relative w-full h-[400vh]"
        >
          {/* Sticky Viewport Stage (Pinned at top: 0, height: 100dvh) */}
          <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col justify-between p-5 bg-[#200408]">
            
            {/* Rich Royal Background Layers */}
            <div className="absolute inset-0 bg-radial from-[#5c0f1c]/40 via-[#200408] to-[#120104] pointer-events-none" />
            
            {/* Ambient Animated Gold Glows */}
            <div className="absolute top-1/4 -left-20 w-56 h-56 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none animate-pulse-gold" />
            <div className="absolute bottom-1/4 -right-20 w-56 h-56 bg-[#fae084]/10 rounded-full blur-3xl pointer-events-none animate-pulse-gold" />

            {/* Pinned Royal Arch & Floral Ornament Container */}
            <div className="absolute inset-3 border border-[#d4af37]/35 rounded-3xl pointer-events-none flex flex-col justify-between p-4">
              {/* Corner Ornaments */}
              <div className="flex justify-between w-full">
                <svg className="w-8 h-8 text-[#d4af37]/60" viewBox="0 0 40 40" fill="currentColor">
                  <path d="M0,0 L18,0 C12,6 6,12 0,18 Z M0,2 C6,8 10,14 14,20 C8,16 2,12 0,6 Z" />
                </svg>
                <svg className="w-8 h-8 text-[#d4af37]/60 transform rotate-90" viewBox="0 0 40 40" fill="currentColor">
                  <path d="M0,0 L18,0 C12,6 6,12 0,18 Z M0,2 C6,8 10,14 14,20 C8,16 2,12 0,6 Z" />
                </svg>
              </div>

              {/* Central Background Animated Mandala / Sacred Geometry */}
              <div
                className="w-48 h-48 mx-auto opacity-15 transition-transform duration-1000 ease-out pointer-events-none"
                style={{
                  transform: `rotate(${currentStep * 45}deg) scale(${1 + (currentStep % 2) * 0.1})`,
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#d4af37]" fill="none" stroke="currentColor" strokeWidth="0.8">
                  <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="35" />
                  <circle cx="50" cy="50" r="22" strokeDasharray="2 2" />
                  <polygon points="50,15 62,38 85,50 62,62 50,85 38,62 15,50 38,38" />
                  <polygon points="50,22 58,42 78,50 58,58 50,78 42,58 22,50 42,42" strokeDasharray="1 2" />
                </svg>
              </div>

              <div className="flex justify-between w-full">
                <svg className="w-8 h-8 text-[#d4af37]/60 transform -rotate-90" viewBox="0 0 40 40" fill="currentColor">
                  <path d="M0,0 L18,0 C12,6 6,12 0,18 Z M0,2 C6,8 10,14 14,20 C8,16 2,12 0,6 Z" />
                </svg>
                <svg className="w-8 h-8 text-[#d4af37]/60 transform rotate-180" viewBox="0 0 40 40" fill="currentColor">
                  <path d="M0,0 L18,0 C12,6 6,12 0,18 Z M0,2 C6,8 10,14 14,20 C8,16 2,12 0,6 Z" />
                </svg>
              </div>
            </div>

            {/* Pinned Top Bar: Step Progress Indicator & Chapter */}
            <div className="relative z-20 flex items-center justify-between pt-2 px-2">
              <span className="font-royal text-[11px] tracking-[0.25em] text-[#fae084] uppercase">
                {currentEvent.tag}
              </span>

              {/* Step Dots (Clickable to smoothly advance) */}
              <div className="flex items-center gap-1.5 bg-[#200408]/80 px-2.5 py-1 rounded-full border border-[#d4af37]/30 backdrop-blur-md">
                {EVENTS.map((ev, idx) => (
                  <button
                    key={ev.id}
                    onClick={() => jumpToStep(idx)}
                    aria-label={`Jump to ${ev.tag}`}
                    className={`transition-all duration-300 rounded-full ${
                      currentStep === idx
                        ? "w-6 h-1.5 bg-gradient-to-r from-[#fae084] to-[#d4af37]"
                        : "w-1.5 h-1.5 bg-[#d4af37]/30 hover:bg-[#d4af37]/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Center Animated Element & Text Stage */}
            <div className="relative z-20 my-auto px-3 flex flex-col items-center text-center">
              
              {/* Step Animated Icon Motif (Re-animates on step change) */}
              <div
                key={`icon-${currentStep}`}
                className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-b from-[#420812] to-[#200408] border border-[#d4af37]/60 shadow-[0_0_25px_rgba(212,175,55,0.25)] mb-4 animate-float"
              >
                <span className="text-2xl">{currentEvent.accentIcon}</span>
              </div>

              {/* Step Text Block with Staggered Transition */}
              <div
                key={`content-${currentStep}`}
                className="w-full transition-all duration-700 ease-out transform translate-y-0 opacity-100"
              >
                <p className="font-script text-2xl sm:text-3xl text-[#fbeea4] mb-1">
                  {currentEvent.subtitle}
                </p>

                <h3 className="font-royal text-2xl sm:text-3xl text-gold-gradient font-semibold tracking-wide uppercase mb-3">
                  {currentEvent.title}
                </h3>

                <div className="w-14 h-[1px] bg-[#d4af37]/50 mx-auto mb-4" />

                {/* Glassmorphic Details Card */}
                <div className="gold-glass rounded-2xl p-4 sm:p-5 text-left flex flex-col gap-3 shadow-xl">
                  <p className="font-body text-xs sm:text-sm text-[#faf6ee]/90 leading-relaxed text-center italic">
                    "{currentEvent.description}"
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#d4af37]/20">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#fae084] shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#fae084]/70 uppercase font-royal tracking-wider">Date</p>
                        <p className="text-[11px] text-[#faf6ee] font-medium">{currentEvent.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#fae084] shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#fae084]/70 uppercase font-royal tracking-wider">Time</p>
                        <p className="text-[11px] text-[#faf6ee] font-medium">{currentEvent.time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1 border-t border-[#d4af37]/20">
                    <MapPin className="w-3.5 h-3.5 text-[#fae084] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-[#fae084]/70 uppercase font-royal tracking-wider">Venue</p>
                      <p className="text-[11px] text-[#faf6ee] font-medium leading-snug">{currentEvent.venue}</p>
                    </div>
                  </div>
                </div>

                {/* Interactive Action for Step 4 (Share / Direction) */}
                {currentStep === EVENTS.length - 1 && (
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b89128] text-[#200408] font-royal text-xs uppercase tracking-wider font-semibold shadow-lg active:scale-95 transition-transform"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Copied Link
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          Share Invitation
                        </>
                      )}
                    </button>

                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#d4af37]/60 bg-[#200408]/80 text-[#fae084] font-royal text-xs uppercase tracking-wider hover:bg-[#d4af37]/20 active:scale-95 transition-transform"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      Directions
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Pinned Bottom Footer Navigation */}
            <div className="relative z-20 pb-2 px-2 flex items-center justify-between text-[#fae084]/80 text-[10px] font-royal tracking-widest uppercase">
              <span>Step {currentStep + 1} of {EVENTS.length}</span>

              {currentStep < EVENTS.length - 1 ? (
                <button
                  onClick={() => jumpToStep(currentStep + 1)}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Scroll for more</span>
                  <ChevronDown className="w-3 h-3 animate-bounce" />
                </button>
              ) : (
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Back to Top ↑
                </button>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
