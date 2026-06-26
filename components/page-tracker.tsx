"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

const SCROLL_MILESTONES = [25, 50, 75, 100] as const;
function getScrollDepth(): number {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (docHeight <= 0) return 100;

  return Math.min(100, Math.round((scrollTop / docHeight) * 100));
}

export function PageTracker() {
  const startTimeRef = useRef<number>(Date.now());
  const reachedMilestonesRef = useRef<Set<number>>(new Set());
  const sessionEndedRef = useRef(false);

  useEffect(() => {
    trackEvent("page_view");

    const handleScroll = () => {
      const depth = getScrollDepth();

      for (const milestone of SCROLL_MILESTONES) {
        if (depth >= milestone && !reachedMilestonesRef.current.has(milestone)) {
          reachedMilestonesRef.current.add(milestone);
          trackEvent("scroll_depth", { depth: milestone });
        }
      }
    };

    const endSession = () => {
      if (sessionEndedRef.current) return;
      sessionEndedRef.current = true;

      const durationMs = Date.now() - startTimeRef.current;
      trackEvent("session_end", { duration_ms: durationMs }, { useBeacon: true });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        endSession();
      }
    });
    window.addEventListener("pagehide", endSession);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pagehide", endSession);
      endSession();
    };
  }, []);

  return null;
}
