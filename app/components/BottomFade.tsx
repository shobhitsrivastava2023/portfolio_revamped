"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

/** Within this many px of the end of the page, the fade clears away so the footer is fully visible. */
const CLEAR_DISTANCE = 120;
/** After this long without scrolling, the fade slowly dissolves; any scroll brings it back. */
const IDLE_MS = 500;
/** Scroll movement smaller than this (px) doesn't count as activity. */
const WAKE_THRESHOLD = 15;

/**
 * Fixed fade at the bottom of the screen. It stretches while you scroll and
 * springs back when you stop, carries a slow drifting warm haze (CSS, see
 * .bottom-fade-haze), clears near the end of the page, and dissolves after a
 * moment of not scrolling. Kept deliberately faint.
 */
export default function BottomFade() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const stretch = useSpring(useTransform(velocity, [-2500, 0, 2500], [1.15, 1, 1.15]), {
    stiffness: 120,
    damping: 20,
  });

  const visibility = useMotionValue(0);
  const opacity = useSpring(visibility, { stiffness: 200, damping: 30 });

  const update = (y: number) => {
    const remaining = document.documentElement.scrollHeight - (y + window.innerHeight);
    visibility.set(Math.min(1, Math.max(0, remaining / CLEAR_DISTANCE)));
  };

  const [idle, setIdle] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wake = () => {
    setIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), IDLE_MS);
  };

  // Only real scrolling counts as activity. Firefox-based browsers on scaled displays report
  // fractional positions that jitter by sub-pixel amounts while still, which would keep it awake forever.
  const lastActiveY = useRef(0);
  useMotionValueEvent(scrollY, "change", (y) => {
    update(y);
    if (Math.abs(y - lastActiveY.current) < WAKE_THRESHOLD) return;
    lastActiveY.current = y;
    wake();
  });

  // Page height changes when cards open or images load, so re-check without waiting for a scroll.
  useEffect(() => {
    const check = () => update(window.scrollY);
    check();
    lastActiveY.current = window.scrollY;
    wake();
    const observer = new ResizeObserver(check);
    observer.observe(document.body);
    window.addEventListener("resize", check);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", check);
      clearTimeout(idleTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- update and wake only touch stable refs and setters
  }, []);

  return (
    <motion.div
      aria-hidden
      className="bottom-fade"
      style={{ opacity, scaleY: reduceMotion ? 1 : stretch, transformOrigin: "bottom" }}
    >
      {/* Idle layer: slow dissolve after IDLE_MS, quick return on scroll */}
      <motion.div
        className="absolute inset-0 bottom-fade-fill"
        initial={false}
        animate={{ opacity: idle ? 0 : 1 }}
        transition={idle ? { duration: 0.8, ease: "easeInOut" } : { duration: 0.3, ease: "easeOut" }}
      >
        <div className="bottom-fade-haze" />
      </motion.div>
    </motion.div>
  );
}
