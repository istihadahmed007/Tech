import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Hero.css';

/**
 * Five individually generated Tech Nest product slider slides in the exact requested order:
 * 1. Wireless Earbuds — “Sound Beyond Limits”
 * 2. Fast Chargers and Cables — “Power Up Your Life”
 * 3. Phone Cases — “Style Meets Protection”
 * 4. Power Banks — “Stay Charged Anywhere”
 * 5. Car Phone Holders — “Your Drive. Your Tech.”
 */
const SLIDES = [
  {
    id: 'slide-wireless-earbuds',
    title: 'Wireless Earbuds',
    headline: 'Sound Beyond Limits',
    category: 'audio',
    image: '/assets/slider/slide-1-wireless-earbuds.jpg',
    alt: 'Tech Nest Wireless Earbuds — Sound Beyond Limits with Active Noise Cancellation, up to 40H Playtime, and IPX4 Water Resistance',
    action: ({ onSelectCategory, onShopClick }) => {
      if (onSelectCategory) onSelectCategory('audio');
      if (onShopClick) onShopClick();
    }
  },
  {
    id: 'slide-fast-chargers-cables',
    title: 'Fast Chargers and Cables',
    headline: 'Power Up Your Life',
    category: 'charging',
    image: '/assets/slider/slide-2-fast-chargers-cables.jpg',
    alt: 'Tech Nest Fast Chargers and Cables — Power Up Your Life with PD 65W Fast Charging and Multi-Port Design',
    action: ({ onSelectCategory, onShopClick }) => {
      if (onSelectCategory) onSelectCategory('charging');
      if (onShopClick) onShopClick();
    }
  },
  {
    id: 'slide-phone-cases',
    title: 'Phone Cases',
    headline: 'Style Meets Protection',
    category: 'cases',
    image: '/assets/slider/slide-3-phone-cases.jpg',
    alt: 'Tech Nest Premium Smartphone Cases — Style Meets Protection with Drop Protection, Slim & Light, and Grip Texture',
    action: ({ onFindPhoneClick, onSelectCategory, onShopClick }) => {
      if (onFindPhoneClick) {
        onFindPhoneClick();
      } else {
        if (onSelectCategory) onSelectCategory('cases');
        if (onShopClick) onShopClick();
      }
    }
  },
  {
    id: 'slide-power-banks',
    title: 'Power Banks',
    headline: 'Stay Charged Anywhere',
    category: 'charging',
    image: '/assets/slider/slide-4-power-banks.jpg',
    alt: 'Tech Nest Portable Power Bank — Stay Charged Anywhere with Fast Charging, Dual Out & Input, 10000mAh - 20000mAh',
    action: ({ onSelectCategory, onShopClick }) => {
      if (onSelectCategory) onSelectCategory('charging');
      if (onShopClick) onShopClick();
    }
  },
  {
    id: 'slide-car-phone-holders',
    title: 'Car Phone Holders',
    headline: 'Your Drive. Your Tech.',
    category: 'all',
    image: '/assets/slider/slide-5-car-phone-holders.jpg',
    alt: 'Tech Nest Premium Car Accessories — Your Drive. Your Tech. with 360° Rotation, Strong Grip, and Vibration Dampening',
    action: ({ onShopClick }) => {
      if (onShopClick) onShopClick();
    }
  }
];

export default function Hero({ 
  onShopClick, 
  onSelectCategory,
  onFindPhoneClick
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const containerRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);

  // Check reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e) => setPrefersReducedMotion(e.matches);
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
      }
    } catch (e) {}
  }, []);

  // Pause autoplay when slider is off-screen using IntersectionObserver
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Pause autoplay when browser tab is inactive/hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
      } else if (containerRef.current) {
        setIsVisible(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const totalSlides = SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // 5-second Autoplay timer, cleanly paused on hover, focus, off-screen, or reduced-motion
  useEffect(() => {
    if (prefersReducedMotion || isHovered || isFocused || !isVisible) {
      return;
    }

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [nextSlide, prefersReducedMotion, isHovered, isFocused, isVisible]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const deltaX = touchStartXRef.current - touchEndXRef.current;
    const swipeThreshold = 45;
    if (deltaX > swipeThreshold) {
      nextSlide();
    } else if (deltaX < -swipeThreshold) {
      prevSlide();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Keyboard navigation when slider is focused
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  };

  const activeSlide = SLIDES[currentSlide];

  const handleTriggerAction = (slide, e) => {
    e?.stopPropagation();
    slide.action({ onSelectCategory, onShopClick, onFindPhoneClick });
  };

  return (
    <section 
      ref={containerRef}
      id="hero-slider"
      aria-label="Tech Nest Featured Product Banners"
      aria-roledescription="carousel"
      className="hero-slider-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
    >
      <div className="hero-slider-card">
        {/* Live Active Category Chip */}
        <div className="hero-slider-badge-live" aria-hidden="true">
          <span className="hero-slider-badge-pulse" />
          <span>{activeSlide.title}</span>
        </div>

        {/* Carousel Track with smooth hardware-accelerated transform */}
        <div 
          className="hero-slider-track"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: prefersReducedMotion ? 'none' : 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          {SLIDES.map((slide, index) => {
            const isCurrent = index === currentSlide;

            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${totalSlides}: ${slide.title} — ${slide.headline}`}
                aria-hidden={!isCurrent}
                onClick={(e) => handleTriggerAction(slide, e)}
                className="hero-slider-slide"
              >
                {/* Visual Banner Image */}
                <img
                  src={slide.image}
                  alt={slide.alt}
                  width={1024}
                  height={571}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding={index === 0 ? 'sync' : 'async'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  className="hero-slider-image"
                />

                {/* Real Interactive Accessible "Shop Now" Button positioned over banner */}
                <button
                  type="button"
                  tabIndex={isCurrent ? 0 : -1}
                  onClick={(e) => handleTriggerAction(slide, e)}
                  aria-label={`Shop ${slide.title} — ${slide.headline}`}
                  className="hero-slider-shop-btn"
                  title={`Shop ${slide.title}`}
                >
                  <span className="sr-only">
                    Shop {slide.title} — {slide.headline}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Previous Navigation Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous slide"
          className="hero-slider-arrow is-left"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Next Navigation Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next slide"
          className="hero-slider-arrow is-right"
        >
          <ChevronRight size={22} />
        </button>

        {/* Interactive Clickable Pagination Dots */}
        <div className="hero-slider-dots" role="tablist" aria-label="Slide Selection Dots">
          {SLIDES.map((slide, index) => (
            <button
              key={`dot-${slide.id}`}
              type="button"
              role="tab"
              aria-selected={currentSlide === index}
              aria-label={`Go to slide ${index + 1}: ${slide.title}`}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`hero-slider-dot ${currentSlide === index ? 'is-active' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
