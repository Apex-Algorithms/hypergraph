import { Button } from "@/components/ui/button";
import { loadKeys, storeKeys } from "@/lib/keyStorage";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { createLazyFileRoute, redirect } from "@tanstack/react-router";
import { Client, Signer, useClient, XMTPProvider } from "@xmtp/react-sdk";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export const Route = createLazyFileRoute("/login2")({
  component: () => <Login />,
});

function Login() {
  const { ready, authenticated, user, login, logout, signMessage } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  const { wallets } = useWallets();
  const [signer, setSigner] = useState<Signer | null>(null);

  useEffect(() => {
    const getSigner = async () => {
      const embeddedWallet =
        wallets.find((wallet) => wallet.walletClientType === "privy") ||
        wallets[0];

      console.log("wallets", wallets);

      if (embeddedWallet.walletClientType === "privy") {
        // Works with social
        const provider = await embeddedWallet.getEthersProvider();
        const newSigner = provider.getSigner();
        const address = await newSigner.getAddress();
        newSigner.signMessage = async (message) => {
          const uiConfig = {
            title: "Enable GraphFramework XMTP",
            description:
              "What is XMTP? XMTP provides apps and websites with private, secure, and encrypted messaging without your email or phone number. To turn on secure messaging for this app, tap the 'Enable XMTP' button.",
            buttonText: "Enable XMTP",
          };

          const signature = await signMessage(message, uiConfig);
          return signature;
        };
        localStorage.setItem("signerAddress", address);
        setSigner(newSigner);
      } else if (window.ethereum == null) {
        try {
          await window.ethereum.enable();
          const provider = new ethers.BrowserProvider(window.ethereum);
          const newSigner = await provider.getSigner();
          const address = await newSigner.getAddress();
          localStorage.setItem("signerAddress", address);
          setSigner(newSigner);
        } catch (error) {
          console.error("User rejected request", error);
        }
      } else {
        console.error("Metamask not found");
      }
    };

    if (wallets.length > 0) {
      getSigner();
    }
  }, [wallets]);

  return (
    <div className="flex flex-1 justify-center items-center flex-col gap-4">
      {(!ready || !authenticated) && (
        <Button disabled={disableLogin} onClick={login}>
          Log in
        </Button>
      )}
      {signer ? (
        <XMTPProvider>
          <XmtpLogin signer={signer} />
        </XMTPProvider>
      ) : null}
    </div>
  );
}

function XmtpLogin({ signer }: { signer: Signer }) {
  const { error, isLoading, initialize } = useClient();

  const initXmtpWithKeys = async () => {
    const address = await signer?.getAddress();
    if (!address) {
      return;
    }
    let keys = loadKeys(address);
    if (!keys) {
      keys = await Client.getKeys(signer, {
        env: "dev",
      });
      storeKeys(address, keys);
    }
    await initialize({ signer, options: { env: "dev" }, keys });
    console.log("wallet initialized");
    redirect({ to: "/space/$spaceId", params: { spaceId: "abc" } });
  };

  useEffect(() => {
    void initXmtpWithKeys();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Failed to initialize Account: {error.message}</div>;
  }

  return (
    <div>
      <h1>Connected</h1>
    </div>
  );
}
