import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ready } from "libsodium-wrappers";
import { useEffect, useState } from "react";
import { http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

const config = createConfig({
  chains: [mainnet], // Pass your required chains as an array
  transports: { [mainnet.id]: http() },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function Boot() {
  // only return the App component when the libsodium-wrappers is ready
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    ready.then(() => {
      setIsReady(true);
    });
  }, []);

  return isReady ? (
    <PrivyProvider
      appId="cm1gt9i1b002g12ih6b6l4vvi"
      config={{
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          requireUserPasswordOnCreate: true,
          noPromptOnSignature: false,
        },
        loginMethods: ["wallet", "email"],
        appearance: {
          showWalletLoginFirst: true,
          theme: "light",
          accentColor: "#676FFF",
        },
      }}
    >
      <WagmiProvider config={config}>
        <RouterProvider router={router} />
      </WagmiProvider>
    </PrivyProvider>
  ) : null;
}
