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
    title: "Wedding Reception",
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
  const userExplicitlyMuted = useRef<boolean>(false);

  // Toggle Video Mute/Unmute
  const toggleAudio = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (newMuted) {
      userExplicitlyMuted.current = true;
    } else {
      userExplicitlyMuted.current = false;
      videoRef.current.play().catch(() => {});
    }
  };

  // Enable audio by default on video load with automatic interaction unlock
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMuted(false);
        })
        .catch(() => {
          // If browser restricts unmuted autoplay before user interaction,
          // play muted initially and automatically unmute on the first user tap/click.
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});

          const unlockAudio = () => {
            if (!userExplicitlyMuted.current && videoRef.current) {
              videoRef.current.muted = false;
              setIsMuted(false);
              videoRef.current.play().catch(() => {});
            }
            window.removeEventListener("click", unlockAudio);
            window.removeEventListener("touchstart", unlockAudio);
          };

          window.addEventListener("click", unlockAudio, { passive: true });
          window.addEventListener("touchstart", unlockAudio, { passive: true });
        });
    }
  }, []);

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
      // 0.00 .. 0.45 -> Step 0 (The Invitation)
      // 0.45 .. 1.00 -> Step 1 (Thank You & Good Wishes)
      const stepIndex = progress >= 0.45 ? 1 : 0;
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

  // Sequence the animation: Flowers slide & bloom in, then text reveals promptly
  useEffect(() => {
    if (page2InView) {
      const flowerTimer = setTimeout(() => {
        setFlowersAnimated(true);
      }, 50);

      const textTimer = setTimeout(() => {
        setTextAnimated(true);
      }, 200);

      return () => {
        clearTimeout(flowerTimer);
        clearTimeout(textTimer);
      };
    }
  }, [page2InView]);

  const jumpToStep = (index: number) => {
    if (!pinnedTrackRef.current) return;
    const totalTrackHeight = pinnedTrackRef.current.offsetHeight - window.innerHeight;
    const ratio = index === 1 ? 0.75 : 0;
    const targetScroll = pinnedTrackRef.current.offsetTop + (totalTrackHeight * ratio);
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Wedding Invitation | Khadija Mansoor & Sohaib Javed",
        text: "Mr. & Mrs. Mansoor cordially invite you to celebrate the wedding of Khadija Mansoor & Sohaib Javed at Dubai Palace Marque on Friday, November 13, 2026 at 1:30 PM (After Jummah)!",
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
            SCREEN 2 & 3: LUXURY EMBOSSED PINNED TRACK
            - Pinned 3D damask frame & velvet burgundy flowers
            - Scrolling down smoothly transitions between:
              Card 0: The Invitation Card (Khadija & Sohaib)
              Card 1: Thank You Card (Gratitude & Beautiful Reading)
           ======================================================== */}
        <section
          ref={pinnedTrackRef}
          id="pinned-invitation"
          className="relative w-full h-[220vh] select-none"
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
                    cordially invite you to the wedding of
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
                  <p
                    className={`font-body text-base sm:text-lg text-[#1a0205] font-bold tracking-wide transition-all duration-500 ease-out ${
                      textAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                    style={{ transitionDelay: textAnimated ? "500ms" : "0ms" }}
                  >
                    Friday, 13 November 2026
                  </p>

                  <p
                    className={`font-body text-base sm:text-lg text-[#1a0205] font-semibold tracking-wide transition-all duration-500 ease-out ${
                      textAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                    style={{ transitionDelay: textAnimated ? "580ms" : "0ms" }}
                  >
                    1:30 PM (After Jummah)
                  </p>

                  <p
                    className={`font-body text-base sm:text-lg text-[#1a0205] font-bold tracking-wide transition-all duration-500 ease-out ${
                      textAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                    style={{ transitionDelay: textAnimated ? "660ms" : "0ms" }}
                  >
                    Dubai Palace Marque
                  </p>
                </div>
              </div>

              {/* ----------------------------------------------------
                  CARD 1: THANK YOU & BEAUTIFUL WISHES / READING
                 ---------------------------------------------------- */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center text-center px-2 transition-all duration-700 ease-out ${
                  currentStep === 1
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

            </div>

            {/* Bottom Navigation Pills & Flower Clearance */}
            <div className="relative z-30 pb-3 flex flex-col items-center shrink-0">
              {currentStep === 0 && (
                <button
                  onClick={() => jumpToStep(1)}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#200408]/85 border border-[#d4af37]/50 text-[#fae084] shadow-lg active:scale-95 hover:bg-[#38070e] transition-all text-xs tracking-wider uppercase font-medium backdrop-blur-sm cursor-pointer"
                >
                  <span>Thank You</span>
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
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#38070e] border border-[#d4af37]/60 text-[#fbeea4] shadow-lg active:scale-95 hover:bg-[#520a14] transition-all text-[11px] tracking-wider uppercase font-semibold backdrop-blur-sm cursor-pointer"
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
