"use client";

import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/get-query-client";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
