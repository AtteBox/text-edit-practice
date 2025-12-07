"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  // Create a new QueryClient instance for each session
  // https://tanstack.com/query/latest/docs/framework/react/guides/ssr#initial-setup
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 30 * 1000, // 30 seconds
            retry: parseInt(
              process.env.NEXT_PUBLIC_REACT_QUERY_RETRIES ?? "3",
              10,
            ),
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
