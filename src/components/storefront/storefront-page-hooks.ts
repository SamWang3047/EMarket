import { useEffect, useRef, useState } from "react";
import {
  HOME_FLOW_STEPS,
  HOME_METRIC_DURATION_MS,
  HOME_METRICS
} from "@/components/storefront/storefront-page-config";

type UseHomeInteractionsOptions = {
  activeView: "Home" | "Product";
  isProductDialogOpen: boolean;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

export function useHomeInteractions({
  activeView,
  isProductDialogOpen
}: UseHomeInteractionsOptions) {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const metricsSectionRef = useRef<HTMLElement | null>(null);
  const storySectionRef = useRef<HTMLElement | null>(null);
  const metricsRafRef = useRef<number | null>(null);
  const metricsStartedRef = useRef(false);

  const [heroProgress, setHeroProgress] = useState(0);
  const [metricValues, setMetricValues] = useState(() =>
    HOME_METRICS.map(() => 0)
  );
  const [activeStoryStep, setActiveStoryStep] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isScrollCtaVisible, setIsScrollCtaVisible] = useState(false);

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
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.14
      }
    );

    revealNodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
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
          const t = clamp((now - startTime) / HOME_METRIC_DURATION_MS);
          const eased = 1 - Math.pow(1 - t, 3);

          setMetricValues(
            HOME_METRICS.map((metric) => {
              const raw = metric.target * eased;
              return metric.decimals && metric.decimals > 0
                ? Number(raw.toFixed(metric.decimals))
                : Math.round(raw);
            })
          );

          if (t < 1) {
            metricsRafRef.current = window.requestAnimationFrame(tick);
          } else {
            metricsRafRef.current = null;
          }
        };

        metricsRafRef.current = window.requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [activeView]);

  useEffect(() => {
    if (activeView !== "Home" || isProductDialogOpen) {
      setIsScrollCtaVisible(false);
      return;
    }

    let raf = 0;

    const update = () => {
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const closeToFooter =
        scrollTop + viewportHeight >=
        documentHeight - Math.min(420, viewportHeight * 0.4);

      const heroSection = heroSectionRef.current;
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const distance = Math.max(heroSection.offsetHeight - 72, 1);
        setHeroProgress(clamp(-rect.top / distance));
      }

      setIsScrollCtaVisible(
        scrollTop >= viewportHeight * 0.9 && !closeToFooter
      );

      const storySection = storySectionRef.current;
      if (storySection) {
        const rect = storySection.getBoundingClientRect();
        const scrollable = Math.max(
          storySection.offsetHeight - viewportHeight,
          1
        );
        const progress = clamp((72 - rect.top) / scrollable);
        const nextStep = Math.min(
          HOME_FLOW_STEPS.length - 1,
          Math.floor(progress * HOME_FLOW_STEPS.length)
        );

        setStoryProgress(progress);
        setActiveStoryStep((current) =>
          current === nextStep ? current : nextStep
        );
      }
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
  }, [activeView, isProductDialogOpen]);

  return {
    heroSectionRef,
    metricsSectionRef,
    storySectionRef,
    metricValues,
    activeStoryStep,
    storyProgress,
    heroProgress,
    isScrollCtaVisible
  };
}
