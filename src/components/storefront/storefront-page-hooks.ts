import { useEffect, useRef, useState } from "react";
import {
  HOME_FLOW_STEPS,
  HOME_METRIC_DURATION_MS,
  HOME_METRICS,
  HOME_SCROLL_CTA_RATIO,
  SHOWCASE_TRIGGER_VIEWPORT_RATIO,
  SHOWCASE_WHEEL_MAX_STEP,
  SHOWCASE_WHEEL_SENSITIVITY,
  THEME_STORAGE_KEY,
  THEMES,
  type StorefrontView,
  type ThemeId,
  getRangeProgress
} from "@/components/storefront/storefront-page-config";

export function useStorefrontTheme() {
  const [theme, setTheme] = useState<ThemeId>("sand");

  useEffect(() => {
    const savedRaw = window.localStorage.getItem(THEME_STORAGE_KEY);
    const saved = savedRaw === "ocean" ? "evergreen" : savedRaw;
    const validTheme = THEMES.some((item) => item.id === saved);

    if (savedRaw === "ocean") {
      window.localStorage.setItem(THEME_STORAGE_KEY, "evergreen");
    }

    if (validTheme) {
      setTheme(saved as ThemeId);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return { theme, setTheme };
}

type UseHomeInteractionsOptions = {
  activeView: StorefrontView;
  isProductDialogOpen: boolean;
};

export function useHomeInteractions({
  activeView,
  isProductDialogOpen
}: UseHomeInteractionsOptions) {
  const showcaseRef = useRef<HTMLElement | null>(null);
  const metricsSectionRef = useRef<HTMLElement | null>(null);
  const flowSectionRef = useRef<HTMLElement | null>(null);
  const showcaseProgressRef = useRef(0);
  const showcaseDirectionRef = useRef<"forward" | "reverse">("forward");
  const metricsRafRef = useRef<number | null>(null);
  const metricsStartedRef = useRef(false);

  const [showcaseProgress, setShowcaseProgress] = useState(0);
  const [metricValues, setMetricValues] = useState(() =>
    HOME_METRICS.map(() => 0)
  );
  const [activeFlowStep, setActiveFlowStep] = useState(0);
  const [isScrollCtaVisible, setIsScrollCtaVisible] = useState(false);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (activeView !== "Home" || isProductDialogOpen) {
        return;
      }

      const directionState = showcaseDirectionRef.current;
      const section = showcaseRef.current;

      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const triggerLine = window.innerHeight * SHOWCASE_TRIGGER_VIEWPORT_RATIO;
      const inTriggerRange =
        rect.top <= triggerLine && rect.bottom >= window.innerHeight * 0.35;

      if (!inTriggerRange) {
        return;
      }

      const direction = Math.sign(event.deltaY);

      if (direction === 0) {
        return;
      }

      const current = showcaseProgressRef.current;
      const step = Math.min(
        Math.abs(event.deltaY) * SHOWCASE_WHEEL_SENSITIVITY,
        SHOWCASE_WHEEL_MAX_STEP
      );
      const next =
        direction > 0
          ? Math.min(1, current + step)
          : Math.max(0, current - step);
      const shouldLockScroll =
        (directionState === "forward" && direction > 0 && current < 1) ||
        (directionState === "reverse" && direction < 0 && current > 0);

      if (!shouldLockScroll) {
        return;
      }

      event.preventDefault();
      showcaseProgressRef.current = next;
      setShowcaseProgress(next);

      if (directionState === "forward" && next >= 1) {
        showcaseDirectionRef.current = "reverse";
      }

      if (directionState === "reverse" && next <= 0) {
        showcaseDirectionRef.current = "forward";
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, [activeView, isProductDialogOpen]);

  useEffect(() => {
    return () => {
      if (metricsRafRef.current !== null) {
        cancelAnimationFrame(metricsRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (activeView !== "Home") {
      return;
    }

    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-home-reveal]")
    );

    if (!revealNodes.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.2
      }
    );

    revealNodes.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
    };
  }, [activeView]);

  useEffect(() => {
    if (activeView !== "Home") {
      return;
    }

    const section = metricsSectionRef.current;

    if (!section || metricsStartedRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting || metricsStartedRef.current) {
          return;
        }

        metricsStartedRef.current = true;
        const startTime = performance.now();

        const tick = (now: number) => {
          const t = Math.min((now - startTime) / HOME_METRIC_DURATION_MS, 1);
          const eased = 1 - Math.pow(1 - t, 3);

          setMetricValues(
            HOME_METRICS.map((metric) => {
              const raw = metric.target * eased;

              if (metric.decimals && metric.decimals > 0) {
                return Number(raw.toFixed(metric.decimals));
              }

              return Math.round(raw);
            })
          );

          if (t < 1) {
            metricsRafRef.current = window.requestAnimationFrame(tick);
          } else {
            setMetricValues(
              HOME_METRICS.map((metric) =>
                metric.decimals && metric.decimals > 0
                  ? Number(metric.target.toFixed(metric.decimals))
                  : metric.target
              )
            );
            metricsRafRef.current = null;
          }
        };

        metricsRafRef.current = window.requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [activeView]);

  useEffect(() => {
    if (activeView !== "Home") {
      setIsScrollCtaVisible(false);
      setActiveFlowStep(0);
      return;
    }

    let raf = 0;

    const update = () => {
      const doc = document.documentElement;
      const max = Math.max(doc.scrollHeight - doc.clientHeight, 1);
      const scrollTop = window.scrollY;
      const depth = scrollTop / max;
      const shouldShowCta = depth >= HOME_SCROLL_CTA_RATIO;

      setIsScrollCtaVisible((current) =>
        current === shouldShowCta ? current : shouldShowCta
      );

      const flowSection = flowSectionRef.current;
      if (!flowSection) {
        return;
      }

      const rect = flowSection.getBoundingClientRect();
      const start = window.innerHeight * 0.82;
      const end = window.innerHeight * 0.2;
      const travel = Math.max(flowSection.offsetHeight + (start - end), 1);
      const progress = Math.min(Math.max((start - rect.top) / travel, 0), 1);
      const nextStep = Math.min(
        HOME_FLOW_STEPS.length - 1,
        Math.floor(progress * HOME_FLOW_STEPS.length)
      );

      setActiveFlowStep((current) =>
        current === nextStep ? current : nextStep
      );
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(update);
    };

    update();

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [activeView]);

  const cardOneProgress = getRangeProgress(showcaseProgress, 0, 0.2);
  const cardTwoProgress = getRangeProgress(showcaseProgress, 0.2, 0.45);
  const cardThreeProgress = getRangeProgress(showcaseProgress, 0.45, 0.72);

  return {
    showcaseRef,
    metricsSectionRef,
    flowSectionRef,
    metricValues,
    activeFlowStep,
    isScrollCtaVisible,
    cardOneTranslateY: 120 - 120 * cardOneProgress,
    cardTwoTranslateY: 220 - 200 * cardTwoProgress,
    cardThreeTranslateY: 300 - 250 * cardThreeProgress,
    cardTwoProgress,
    cardThreeProgress
  };
}
