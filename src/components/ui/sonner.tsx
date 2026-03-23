"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="top-right"
      richColors
      toastOptions={{
        style: {
          background: "rgba(255, 249, 240, 0.96)",
          border: "1px solid rgba(88, 65, 38, 0.14)",
          color: "#1f1a15"
        }
      }}
      {...props}
    />
  );
}

export { Toaster };
