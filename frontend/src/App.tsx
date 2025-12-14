import React, { useEffect, useState, useRef } from "react";
import { BrowserProvider } from "ethers";
import { Link, Route, Routes, Navigate } from "react-router-dom";
import { PatchedBrowserProvider } from "./utils/contract";

import Navbar from "./components/Navbar";
import WalletConnect, { WalletConnectHandle } from "./components/WalletConnect";
import Walkthrough from "./components/Walkthrough";
import AdminVerify from "./pages/Admin/AdminVerify";
import AdminRegistry from "./pages/Admin/AdminRegistry";
import AdminReputation from "./pages/Admin/AdminReputation";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SubmitAction from "./pages/SubmitAction";
import Actions from "./pages/Actions";
import Donate from "./pages/Donate";
import Leaderboard from "./pages/Leaderboard";
import MatchingPool from "./pages/MatchingPool";
import Governance from "./pages/Governance";
import Retirement from "./pages/Retirement";

const MOONBASE_PARAMS = {
  chainId: "0x507", // 1287
  chainName: "Moonbase Alpha",
  nativeCurrency: { name: "Dev", symbol: "DEV", decimals: 18 },
  rpcUrls: ["https://rpc.api.moonbase.moonbeam.network"],
  blockExplorerUrls: ["https://moonbase.moonscan.io"],
};

function getInjectedProvider(): any {
  const eth = (window as any).ethereum;
  if (!eth) return null;
  if (Array.isArray(eth.providers)) {
    const mm = eth.providers.find((p: any) => p && p.isMetaMask);
    return mm ?? eth.providers[0];
  }
  return eth;
}

const App = () => {
  const [provider, setProvider] = useState<PatchedBrowserProvider | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const [address, setAddress] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [showWalkthrough, setShowWalkthrough] = useState<boolean>(false);
  const walletConnectRef = useRef<WalletConnectHandle>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const eth = (window as any).ethereum;
    if (eth) {
      try {
        setProvider(new PatchedBrowserProvider(eth));
      } catch (e) {
        console.error("Failed to initialize PatchedBrowserProvider:", e);
        setProvider(null);
      }
    } else {
      setProvider(null);
    }
  }, []);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboardingCompleted");
    if (!onboardingCompleted) {
      setShowWalkthrough(true);
    }
  }, []);

  const handleConnect = (provider: PatchedBrowserProvider, signer: any) => {
    setProvider(provider);
    setSigner(signer);
  };

  const connected = !!address && !!provider;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const connectWallet = async () => {
    const ethereum = getInjectedProvider();
    if (!ethereum) {
      alert("No injected wallet found. Please install MetaMask.");
      return;
    }

    try {
      const currentChain: string = await ethereum.request({ method: "eth_chainId" });
      if (currentChain !== MOONBASE_PARAMS.chainId) {
        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: MOONBASE_PARAMS.chainId }],
          });
        } catch (e: any) {
          if (e?.code === 4902) {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [MOONBASE_PARAMS],
            });
          } else {
            throw e;
          }
        }
      }

      await ethereum.request({ method: "eth_requestAccounts" });

      const fresh = new PatchedBrowserProvider(ethereum);
      const signer = await fresh.getSigner();
      const addr = await signer.getAddress();
      setProvider(fresh);
      setAddress(addr);
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Failed to connect wallet");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--card-bg)]/90 backdrop-blur-sm border-b border-[rgba(0,0,0,0.1)] shadow-lg">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-12 py-4 flex items-center justify-between">
          {/* Brand Section */}
          <Link to="/" className="flex items-center gap-3">
            <span className="text-xl font-bold text-emerald-600">🌱 Green Credits</span>
          </Link>
          {/* WalletConnect */}
          <WalletConnect
            ref={walletConnectRef}
            provider={provider}
            address={address}
            setAddress={setAddress}
            setProvider={setProvider}
            onConnect={handleConnect}
            isDemoMode={isDemoMode}
            setIsDemoMode={setIsDemoMode}
          />
        </div>

        {/* ✅ Use the dropdown-based Navbar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pb-4">
          <Navbar
            provider={provider}
            address={address}
            setAddress={setAddress}
            connected={connected}
          />
        </div>
      </header>

      {/* Routes */}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                provider={provider}
                address={address}
                setAddress={setAddress}
                theme={theme}
                toggleTheme={toggleTheme}
                connectWallet={connectWallet}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              connected ? (
                <Dashboard provider={provider!} address={address} signer={signer!} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/submit"
            element={
              connected ? <SubmitAction /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/actions"
            element={
              connected ? <Actions provider={provider!} /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/leaderboard"
            element={
              connected ? <Leaderboard provider={provider!} /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/donate"
            element={
              connected ? <Donate provider={provider!} /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/admin"
            element={
              connected ? <AdminVerify provider={provider!} /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/admin/registry"
            element={
              connected ? <AdminRegistry provider={provider!} /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/admin/reputation"
            element={
              connected ? (
                <AdminReputation provider={provider!} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/matching"
            element={
              connected ? <MatchingPool provider={provider!} /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/retirement"
            element={
              connected ? (
                <Retirement provider={provider!} address={address} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/governance"
            element={
              connected ? (
                <Governance provider={provider!} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>



      {/* Walkthrough Modal */}
      {showWalkthrough && (
        <Walkthrough
          onClose={() => setShowWalkthrough(false)}
          onConnect={() => {
            setShowWalkthrough(false);
            walletConnectRef.current?.connect();
          }}
          onDemo={() => {
            setShowWalkthrough(false);
            walletConnectRef.current?.enableDemoMode();
          }}
        />
      )}
    </div>
  );
};

export default App;
