"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { Global, css } from "@emotion/react"; // Import emotion for global styles
import { createSystem, defaultConfig } from "@chakra-ui/react";

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--font-montserrat)" },
        body: { value: "var(--font-montserrat)" },
      },
    },
  },
});

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      {/* Apply global styles manually */}
      <Global
        styles={css`
          html, body {
            background: transparent !important;
            color: white;
          }
        `}
      />
      {children}
    </ChakraProvider>
  );
}
