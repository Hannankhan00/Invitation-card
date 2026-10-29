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
    title: "Welcome to Our Nikkah",
    subtitle: "In the name of Love, Grace & Family",
    time: "1:30 PM (After Jummah)",
    date: "Friday, Nov 13, 2026",
    venue: "Dubai Palace Marque",
    description:
      "Together with our parents, we warmly invite you and your family to witness and celebrate the sacred union of two loving souls.",
    accentIcon: "✨",
  },
  {
    id: 2,
    tag: "THE COUPLE",
    title: "Khadija Mansoor & Sohaib Javed",
    subtitle: "Two souls, one eternal beginning",
    time: "1:30 PM (After Jummah)",
    date: "Friday, Nov 13, 2026",
    venue: "Dubai Palace Marque",
    description:
      "As our story unfolds into a lifetime of shared laughter and dreams, your presence and prayers will make our special day complete.",
    accentIcon: "💍",
  },
  {
    id: 3,
    tag: "CEREMONIES",
    title: "Nikkah Ceremony & Reception",
    subtitle: "Celebration & Banquet Feast",
    time: "01:30 PM (After Jummah)",
    date: "Friday, Nov 13, 2026",
    venue: "Dubai Palace Marque",
    description:
      "Followed by an afternoon of prayers, luncheon banquet, and timeless memories surrounded by loved ones.",
    accentIcon: "🪷",
  },
  {
    id: 4,
    tag: "CELEBRATE WITH US",
    title: "Join The Festivities",
    subtitle: "We Can't Wait To See You",
    time: "RSVP & Venue Directions",
    date: "Friday, Nov 13, 2026",
    venue: "Dubai Palace Marque",
    description:
      "Kindly consider this as our heartfelt personal invitation. Click below to view directions or save the date to your calendar.",
    accentIcon: "💌",
  },
];

export default function WeddingInvitation() {
  const [isMuted, setIsMuted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Page animation triggers
  const [flowersAnimated, setFlowersAnimated] = useState(false);
  const [textAnimated, setTextAnimated] = useState(false);
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const invitationRef = useRef<HTMLDivElement | null>(null);
  const thankyouRef = useRef<HTMLDivElement | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const currentPageRef = useRef<number>(0);
  const isAnimating = useRef<boolean>(false);
  const lastWheelTime = useRef<number>(0);
  const userExplicitlyMuted = useRef<boolean>(false);

  // Toggle Background Audio Mute/Unmute
  const toggleAudio = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused || audio.muted || isMuted) {
      audio.muted = false;
      audio.play().catch(() => {});
      setIsMuted(false);
      userExplicitlyMuted.current = false;
    } else {
      audio.muted = true;
      setIsMuted(true);
      userExplicitlyMuted.current = true;
    }
  };

  // Video remains permanently muted. Background audio handles the music.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }

    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = false;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMuted(false);
        })
        .catch(() => {
          // If browser restricts unmuted autoplay before user interaction,
          // play muted initially and automatically unmute on the first user tap/click.
          setIsMuted(true);

          const unlockAudio = () => {
            if (!userExplicitlyMuted.current && audioRef.current) {
              audioRef.current.muted = false;
              audioRef.current
                .play()
                .then(() => {
                  setIsMuted(false);
                })
                .catch(() => {});
            }
            window.removeEventListener("click", unlockAudio);
            window.removeEventListener("touchstart", unlockAudio);
          };

          window.addEventListener("click", unlockAudio, { passive: true });
          window.addEventListener("touchstart", unlockAudio, { passive: true });
        });
    }
  }, []);

  // Discrete Page Navigation: Exactly ONE page per action (0: Hero, 1: Invitation, 2: Thank You)
  const goToPage = (pageIndex: number) => {
    const target = Math.max(0, Math.min(2, pageIndex));
    if (target === currentPageRef.current || isAnimating.current) return;

    isAnimating.current = true;
    currentPageRef.current = target;
    setCurrentPage(target);

    // Cooldown window physically prevents fast momentum flings from skipping screens
    setTimeout(() => {
      isAnimating.current = false;
    }, 750);
  };

  // Trigger luxury flower and text entrance animations on Invitation page
  useEffect(() => {
    if (currentPage === 1) {
      const timer = setTimeout(() => {
        setFlowersAnimated(true);
        setTextAnimated(true);
      }, 120);
      return () => clearTimeout(timer);
    } else if (currentPage === 0) {
      setFlowersAnimated(false);
      setTextAnimated(false);
    }
  }, [currentPage]);

  // Strict 1-Page per Gesture on Mobile (Touch), Wheel, and Keyboard
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;
    let touchStartX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchStartY - touchEndY;
      const deltaX = Math.abs(touchStartX - touchEndX);

      // Require deliberate vertical gesture (threshold > 35px) and strictly vertical direction
      if (Math.abs(deltaY) > 35 && Math.abs(deltaY) > deltaX) {
        if (deltaY > 0) {
          // Swiped up -> Advance strictly to the next page
          goToPage(currentPageRef.current + 1);
        } else {
          // Swiped down -> Go back strictly to the previous page
          goToPage(currentPageRef.current - 1);
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (isAnimating.current || now - lastWheelTime.current < 700) return;
      if (Math.abs(e.deltaY) < 18) return;

      lastWheelTime.current = now;
      if (e.deltaY > 0) {
        goToPage(currentPageRef.current + 1);
      } else {
        goToPage(currentPageRef.current - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goToPage(currentPageRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goToPage(currentPageRef.current - 1);
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative w-full h-[100dvh] bg-[#200408] text-[#faf6ee] flex justify-center overflow-hidden select-none">
      {/* Background Music Audio Element - Continuous playback across all pages */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source src="/audio/background-music.webm" type="audio/webm" />
        <source src="/audio/background-music.m4a" type="audio/mp4" />
        <source src="/audio/background-music.mp3" type="audio/mpeg" />
      </audio>

      {/* Mobile-first centered container with gesture interception */}
      <div
        ref={containerRef}
        className="w-full max-w-[480px] h-[100dvh] overflow-hidden relative shadow-[0_0_80px_rgba(0,0,0,0.9)] bg-[#200408] border-x border-[#d4af37]/20"
        style={{
          touchAction: "none",
        }}
      >
        {/* Discrete Slide Track: Strictly translates one page (-0%, -100%, -200%) */}
        <div
          className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: `translate3d(0, -${currentPage * 100}%, 0)`,
            willChange: "transform",
          }}
        >
        {/* ========================================================
            PAGE 1: HERO VIDEO SECTION (100dvh)
           ======================================================== */}
        <section
          ref={heroRef}
          id="hero-video-section"
          className="relative w-full h-[100dvh] shrink-0 overflow-hidden flex flex-col justify-between items-center text-center select-none snap-start snap-always"
          style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
        >
          {/* Background Video - Permanently muted */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/poster.jpg"
            onLoadedData={() => setVideoLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src="/video/intro.webm" type="video/webm" />
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
              aria-label={isMuted ? "Unmute music" : "Mute music"}
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
            onClick={() => goToPage(1)}
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
            PAGE 2: THE WEDDING INVITATION (100dvh)
           ======================================================== */}
        <section
          ref={invitationRef}
          id="invitation-section"
          className="relative w-full h-[100dvh] shrink-0 overflow-hidden flex flex-col justify-between p-6 select-none snap-start snap-always"
          style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
        >
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

          {/* Top Clearance Spacer */}
          <div className="h-14 sm:h-16 w-full pointer-events-none z-20 shrink-0" />

          {/* Center Stage: The Wedding Invitation */}
          <div className="relative z-20 my-auto w-full max-w-sm mx-auto flex flex-col items-center justify-center text-center">
            {/* Top Invitation Header */}
            <div className="mb-2.5 sm:mb-3 flex flex-col items-center">
              <p
                className={`font-body text-lg sm:text-xl text-[#1a0205] font-bold tracking-wide leading-tight transition-all duration-500 ease-out ${
                  textAnimated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
                }`}
                style={{ transitionDelay: textAnimated ? "80ms" : "0ms" }}
              >
                Mr. &amp; Mrs. Mansoor
              </p>

              <p
                className={`font-body text-sm sm:text-base text-[#38070e] font-medium tracking-wide leading-snug mt-1 max-w-[290px] sm:max-w-xs transition-all duration-500 ease-out ${
                  textAnimated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
                }`}
                style={{ transitionDelay: textAnimated ? "180ms" : "0ms" }}
              >
                cordially invite you to the nikkah of
              </p>
            </div>

            {/* Prominent Stacked Couple Names */}
            <div className="flex flex-col items-center my-2 select-none px-1 w-full max-w-[350px] mx-auto">
              <h2
                className={`font-royal text-[clamp(1.68rem,6.8vw,2.45rem)] font-extrabold text-[#140103] leading-[0.98] uppercase tracking-[0.025em] transition-all duration-600 ease-out whitespace-nowrap text-center ${
                  textAnimated ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
                }`}
                style={{
                  fontWeight: 800,
                  WebkitTextStroke: "0.35px #140103",
                  transitionDelay: textAnimated ? "280ms" : "0ms",
                }}
              >
                KHADIJA MANSOOR
              </h2>

              <h2
                className={`font-royal text-[clamp(1.68rem,6.8vw,2.45rem)] font-extrabold text-[#140103] leading-[0.98] uppercase tracking-[0.025em] mt-0.5 transition-all duration-600 ease-out whitespace-nowrap text-center ${
                  textAnimated ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
                }`}
                style={{
                  fontWeight: 800,
                  WebkitTextStroke: "0.35px #140103",
                  transitionDelay: textAnimated ? "380ms" : "0ms",
                }}
              >
                &amp; SOHAIB JAVED
              </h2>
            </div>

            {/* Date, Time & Venue Lines */}
            <div className="flex flex-col items-center gap-1.5 my-3 sm:my-4">
              <div
                className={`flex items-center gap-2 font-body text-base sm:text-lg text-[#1a0205] font-bold tracking-wide transition-all duration-500 ease-out drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)] ${
                  textAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
                style={{ transitionDelay: textAnimated ? "500ms" : "0ms" }}
              >
                <Calendar className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#731320] shrink-0" />
                <span>Friday, 13 November 2026</span>
              </div>

              <div
                className={`flex items-center gap-2 font-body text-base sm:text-lg text-[#1a0205] font-semibold tracking-wide transition-all duration-500 ease-out drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)] ${
                  textAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
                style={{ transitionDelay: textAnimated ? "580ms" : "0ms" }}
              >
                <Clock className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#731320] shrink-0" />
                <span>1:30 PM (After Jummah)</span>
              </div>

              <div
                className={`flex items-center gap-2 font-body text-base sm:text-lg text-[#1a0205] font-bold tracking-wide transition-all duration-500 ease-out drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)] ${
                  textAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
                style={{ transitionDelay: textAnimated ? "660ms" : "0ms" }}
              >
                <MapPin className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#731320] shrink-0" />
                <span>Dubai Palace Marque</span>
              </div>
            </div>
          </div>

          {/* Bottom Navigation: Proceed to Thank You Card */}
          <div className="relative z-30 pb-3 flex flex-col items-center shrink-0">
            <button
              onClick={() => goToPage(2)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#200408]/85 border border-[#d4af37]/50 text-[#fae084] shadow-lg active:scale-95 hover:bg-[#38070e] transition-all text-xs tracking-wider uppercase font-medium backdrop-blur-sm cursor-pointer"
            >
              <span>Thank You</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#fae084] animate-bounce" />
            </button>
          </div>
        </section>

        {/* ========================================================
            PAGE 3: THANK YOU & VENUE (100dvh)
           ======================================================== */}
        <section
          ref={thankyouRef}
          id="thankyou-section"
          className="relative w-full h-[100dvh] shrink-0 overflow-hidden flex flex-col justify-between p-6 select-none snap-start snap-always"
          style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
        >
          {/* Background: 3D Embossed Cream & Ivory Carved Lace Frame */}
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
            style={{ backgroundImage: "url('/images/page2-bg.jpg')" }}
          />

          {/* Subtle warm ambient lighting overlay */}
          <div className="absolute inset-0 bg-amber-50/15 pointer-events-none z-1" />

          {/* Top-Right Flower & Berry Garland - Fixed in Corner */}
          <div className="absolute top-0 right-0 w-full pointer-events-none z-10">
            <img
              src="/images/flower-top.png"
              alt="Burgundy Velvet Flower Top Corner"
              className="w-full h-auto object-contain drop-shadow-[0_16px_28px_rgba(74,14,23,0.35)]"
            />
          </div>

          {/* Bottom-Left Flower & Berry Garland - Fixed in Corner */}
          <div className="absolute bottom-0 left-0 w-full pointer-events-none z-10">
            <img
              src="/images/flower-bottom.png"
              alt="Burgundy Velvet Flower Bottom Corner"
              className="w-full h-auto object-contain drop-shadow-[0_-16px_28px_rgba(74,14,23,0.35)]"
            />
          </div>

          {/* Top Clearance Spacer */}
          <div className="h-14 sm:h-16 w-full pointer-events-none z-20 shrink-0" />

          {/* Center Stage: Thank You Card */}
          <div className="relative z-20 my-auto w-full max-w-sm mx-auto flex flex-col items-center justify-center text-center px-2">
            {/* Header Tag */}
            <div className="flex items-center gap-2 mb-1">
              <span className="h-[1px] w-6 sm:w-8 bg-[#8b1e2e]/50" />
              <span className="font-royal text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#5c0f1c] font-semibold">
                With Sincere Gratitude
              </span>
              <span className="h-[1px] w-6 sm:w-8 bg-[#8b1e2e]/50" />
            </div>

            {/* Main Header: Thank You in Cinzel font matching couple names */}
            <h2
              className="font-royal text-2xl sm:text-3xl md:text-[2rem] font-extrabold text-[#140103] leading-tight uppercase tracking-[0.08em] my-1 select-none"
              style={{
                fontWeight: 800,
                WebkitTextStroke: "0.35px #140103",
              }}
            >
              THANK YOU
            </h2>

            {/* Delicate Divider Ornament */}
            <div className="flex items-center justify-center gap-2 my-1.5 opacity-80">
              <span className="w-6 h-[1px] bg-[#a67c1e]" />
              <span className="text-[#a67c1e] text-[10px]">♦</span>
              <span className="w-6 h-[1px] bg-[#a67c1e]" />
            </div>

            {/* Meaningful & Inspiring Reading */}
            <div className="max-w-[320px] sm:max-w-xs mx-auto my-3 flex flex-col gap-1.5 select-none">
              <p className="font-body text-[14px] sm:text-[15.5px] text-[#240308] leading-relaxed font-semibold">
                Your presence, warm blessings, and prayers are the greatest gift as we begin our new journey together.
              </p>
            </div>

            {/* Interactive Action Button: Venue Location in Maroon matching the flowers */}
            <div className="flex items-center justify-center mt-4">
              <a
                href="https://maps.google.com/?q=Dubai+Palace+Marque"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4a0e17] hover:bg-[#5c0f1c] text-[#fbeea4] text-xs font-semibold tracking-widest uppercase border border-[#d4af37]/50 shadow-[0_4px_16px_rgba(74,14,23,0.45)] active:scale-95 transition-all"
              >
                <MapPin className="w-4 h-4 text-[#fae084]" />
                <span>Venue Location</span>
              </a>
            </div>
          </div>

          {/* Bottom Navigation: Return to Invitation or Top */}
          <div className="relative z-30 pb-3 flex flex-col items-center shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#200408]/85 border border-[#d4af37]/40 text-[#fae084] shadow-md active:scale-95 hover:bg-[#38070e] transition-all text-[11px] tracking-wider uppercase font-medium backdrop-blur-sm cursor-pointer"
              >
                <span>↑ Invitation</span>
              </button>
              <button
                onClick={() => goToPage(0)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#38070e] border border-[#d4af37]/60 text-[#fbeea4] shadow-lg active:scale-95 hover:bg-[#520a14] transition-all text-[11px] tracking-wider uppercase font-semibold backdrop-blur-sm cursor-pointer"
              >
                <span>↑ Start</span>
              </button>
            </div>
          </div>
        </section>
        </div>

        {/* Elegant Vertical Page Indicators */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 pointer-events-auto">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx)}
              aria-label={`Go to page ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentPage === idx
                  ? "w-1.5 h-5 bg-[#fae084] shadow-[0_0_8px_rgba(250,224,132,0.8)]"
                  : "w-1.5 h-1.5 bg-[#d4af37]/40 hover:bg-[#d4af37]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
