"use client";

import { useDeferredValue, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { useProducts } from "@/hooks/use-products";
import { type ProductCategory } from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/types/product";
import {
  PAGE_SIZE,
  PRODUCT_DIALOG_ANIMATION_MS,
  resolveShowcaseProducts,
  type StorefrontView
} from "@/components/storefront/storefront-page-config";
import {
  useHomeInteractions,
  useStorefrontTheme
} from "@/components/storefront/storefront-page-hooks";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { StorefrontHeroSection } from "@/components/storefront/storefront-hero-section";
import { StorefrontHomeView } from "@/components/storefront/storefront-home-view";
import { StorefrontPlaceholderView } from "@/components/storefront/storefront-placeholder-view";
import { ProductDetailWindow } from "@/components/storefront/storefront-product-detail-window";
import { StorefrontProductView } from "@/components/storefront/storefront-product-view";

export function StorefrontPage() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | undefined
  >();
  const [activeView, setActiveView] = useState<StorefrontView>("Home");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  const deferredCategory = useDeferredValue(selectedCategory);
  const addItem = useCartStore((state) => state.addItem);
  const { theme, setTheme } = useStorefrontTheme();

  const {
    showcaseRef,
    metricsSectionRef,
    flowSectionRef,
    metricValues,
    activeFlowStep,
    isScrollCtaVisible,
    cardOneTranslateY,
    cardTwoTranslateY,
    cardThreeTranslateY,
    cardTwoProgress,
    cardThreeProgress
  } = useHomeInteractions({
    activeView,
    isProductDialogOpen
  });

  const { data, isLoading, isFetching, error } = useProducts({
    page,
    pageSize: PAGE_SIZE,
    category: deferredCategory
  });

  const products = useMemo(() => data?.items ?? [], [data]);
  const pagination = data?.pagination;
  const showcaseProducts = useMemo(
    () => resolveShowcaseProducts(products),
    [products]
  );

  const handleCategoryChange = (category?: ProductCategory) => {
    startTransition(() => {
      setSelectedCategory(category);
      setPage(1);
    });
  };

  const handleAddToBag = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} added to bag.`);
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDialogOpen(true);
  };

  const openProductSection = () => {
    setIsProductDialogOpen(false);
    setActiveView("Product");
    handleCategoryChange(undefined);
    requestAnimationFrame(() => {
      document
        .getElementById("product-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const openHome = () => {
    setIsProductDialogOpen(false);
    setActiveView("Home");
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const handlePrimaryNavClick = (item: Exclude<StorefrontView, "Home">) => {
    setIsProductDialogOpen(false);
    setActiveView(item);

    if (item === "Product") {
      requestAnimationFrame(() => {
        document
          .getElementById("product-section")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <main className="min-h-screen [font-family:'Avenir_Next','Helvetica_Neue','Segoe_UI',sans-serif]">
      <StorefrontHeader
        activeView={activeView}
        theme={theme}
        onHome={openHome}
        onPrimaryNavClick={handlePrimaryNavClick}
        onThemeChange={setTheme}
      />

      <StorefrontHeroSection
        totalProducts={pagination?.total ?? 0}
        onOpenProductSection={openProductSection}
      />

      {activeView === "Product" ? (
        <StorefrontProductView
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          isLoading={isLoading}
          isPending={isPending}
          isFetching={isFetching}
          error={error}
          products={products}
          pagination={pagination}
          onOpenProductDetail={openProductDetail}
          onAddToBag={handleAddToBag}
          onPreviousPage={() => setPage((current) => Math.max(1, current - 1))}
          onNextPage={() => setPage((current) => current + 1)}
        />
      ) : activeView === "Home" ? (
        <StorefrontHomeView
          showcaseRef={showcaseRef}
          metricsSectionRef={metricsSectionRef}
          flowSectionRef={flowSectionRef}
          showcaseProducts={showcaseProducts}
          cardOneTranslateY={cardOneTranslateY}
          cardTwoTranslateY={cardTwoTranslateY}
          cardThreeTranslateY={cardThreeTranslateY}
          cardTwoProgress={cardTwoProgress}
          cardThreeProgress={cardThreeProgress}
          metricValues={metricValues}
          activeFlowStep={activeFlowStep}
          isScrollCtaVisible={isScrollCtaVisible}
          onOpenProductSection={openProductSection}
        />
      ) : (
        <StorefrontPlaceholderView
          activeView={activeView as Exclude<StorefrontView, "Home" | "Product">}
          onBackToProduct={openProductSection}
        />
      )}

      <ProductDetailWindow
        open={isProductDialogOpen}
        product={selectedProduct}
        onOpenChange={setIsProductDialogOpen}
        onAdd={handleAddToBag}
        animationMs={PRODUCT_DIALOG_ANIMATION_MS}
      />
    </main>
  );
}
