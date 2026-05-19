"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider } from "@/context/StoreContext";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        {children}
        <Toaster position="top-center" />
      </StoreProvider>
    </QueryClientProvider>
  );
}
