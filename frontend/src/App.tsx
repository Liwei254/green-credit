import React, { useEffect, useState, useRef } from "react";
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

/* ------------------ Moonbase Config ------------------ */
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
    return eth.providers.find((p: any) => p?.isMetaMask) ?? eth.providers[0];
  }
  return eth;
}

/* ------------------ App ------------------ */
const App = () => {
  const [provider, setProvider] = useState<PatchedBrowserProvider | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const [address, setAddress] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  const walletConnectRef = useRef<WalletConnectHandle>(null);

  /* ------------------ Theme ------------------ */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /* ------------------ Provider Init ------------------ */
  useEffect(() => {
    const eth = (window as any).ethereum;
    if (!eth) return;

    try {
      setProvider(new PatchedBrowserProvider(eth));
    } catch (e) {
      console.error("Failed to initialize provider:", e);
      setProvider(null);
    }
  }, []);

  /* ------------------ Walkthrough Visibility Logic ------------------ */
useEffect(() => {
  const completed = localStorage.getItem("onboardingCompleted");
  const lastWallet = localStorage.getItem("lastWallet");

  // First-time user → show walkthrough
  if (!completed && !address) {
    setShowWalkthrough(true);
    return;
  }

  // New wallet AFTER onboarding completed → show once
  if (completed && address && address !== lastWallet) {
    setShowWalkthrough(true);
    return;
  }
}, [address]);


  /* ------------------ Wallet Connect Handler ------------------ */
  const handleConnect = (provider: PatchedBrowserProvider, signer: any) => {
    setProvider(provider);
    setSigner(signer);
  };

  const connected = Boolean(address && provider);

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  /* ------------------ Wallet Connect Flow ------------------ */
  const connectWallet = async () => {
    const ethereum = getInjectedProvider();
    if (!ethereum) {
      alert("No injected wallet found. Please install MetaMask.");
      return;
    }

    try {
      const chainId = await ethereum.request({ method: "eth_chainId" });

      if (chainId !== MOONBASE_PARAMS.chainId) {
        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: MOONBASE_PARAMS.chainId }],
          });
        } catch (e: any) {
          if (e.code === 4902) {
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

      const freshProvider = new PatchedBrowserProvider(ethereum);
      const signer = await freshProvider.getSigner();
      const addr = await signer.getAddress();

      setProvider(freshProvider);
      setSigner(signer);
      setAddress(addr);

      // Save wallet for onboarding comparison
      localStorage.setItem("lastWallet", addr);
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Failed to connect wallet");
    }
  };

  /* ------------------ Render ------------------ */
  return (
  <div className=" min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-gray-800 text-gray-100 ">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--card-bg)]/90 backdrop-blur-sm border-b shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-emerald-600">
            🌱 Green Credits
          </Link>

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

        <div className="max-w-6xl mx-auto px-4 pb-4">
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

          <Route path="/submit" element={connected ? <SubmitAction /> : <Navigate to="/" replace />} />
          <Route path="/actions" element={connected ? <Actions provider={provider!} /> : <Navigate to="/" replace />} />
          <Route path="/leaderboard" element={connected ? <Leaderboard provider={provider!} /> : <Navigate to="/" replace />} />
          <Route path="/donate" element={connected ? <Donate provider={provider!} /> : <Navigate to="/" replace />} />

          <Route path="/admin" element={connected ? <AdminVerify provider={provider!} /> : <Navigate to="/" replace />} />
          <Route path="/admin/registry" element={connected ? <AdminRegistry provider={provider!} /> : <Navigate to="/" replace />} />
          <Route path="/admin/reputation" element={connected ? <AdminReputation provider={provider!} /> : <Navigate to="/" replace />} />

          <Route path="/matching" element={connected ? <MatchingPool provider={provider!} /> : <Navigate to="/" replace />} />
          <Route path="/retirement" element={connected ? <Retirement provider={provider!} address={address} /> : <Navigate to="/" replace />} />
          <Route path="/governance" element={connected ? <Governance provider={provider!} /> : <Navigate to="/" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Walkthrough */}
      {showWalkthrough && (
        <Walkthrough
          onClose={() => setShowWalkthrough(false)}
          onConnect={() => {
            setShowWalkthrough(false);
            walletConnectRef.current?.connect();
          }}
         onDemo={() => {
         localStorage.setItem("onboardingCompleted", "true");
          setShowWalkthrough(false);
        walletConnectRef.current?.enableDemoMode();
       }}

        />
      )}
    </div>
  );
};

export default App;
