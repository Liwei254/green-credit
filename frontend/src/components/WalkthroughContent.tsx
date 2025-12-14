import React from "react";

export const walkthroughContent: Record<string, React.ReactNode> = {
  welcome: (
    <div className="text-center">
      <p className="mb-4">
        Green Credits rewards users with Green Credit Tokens (GCT) for verified
        real-world environmental actions on the Moonbeam blockchain.
      </p>
      <p className="mb-4">
        Earn tokens by submitting proof of actions like tree planting, waste
        reduction, or sustainable farming.
      </p>
      <p>
        Join a transparent, community-driven ecosystem that incentivizes
        planetary healing.
      </p>
    </div>
  ),

  connect: (
    <div className="text-center">
      <p className="mb-4">
        To start earning and managing GCT tokens, connect a Web3 wallet like
        MetaMask.
      </p>
      <p className="mb-4">
        You can also explore the platform in demo mode without connecting a
        wallet.
      </p>
    </div>
  ),

  mobileWallets: (
    <div className="text-center">
      <p className="mb-4">
        For the best mobile experience, use MetaMask Mobile or WalletConnect-
        enabled wallets such as Trust Wallet.
      </p>
    </div>
  ),

  submitAction: (
    <div className="text-center">
      <p className="mb-4">
        Navigate to the “Submit Action” page and provide details about your
        eco-friendly activity.
      </p>
      <p>
        After verification, you’ll earn GCT tokens based on the impact of your
        submission.
      </p>
    </div>
  ),

  donate: (
    <div className="text-center">
      <p className="mb-4">
        Donate your earned GCT tokens to verified NGOs and environmental causes.
      </p>
      <p>
        Your contributions directly support real-world conservation efforts.
      </p>
    </div>
  ),

  moonbase: (
    <div className="text-center">
      <p className="mb-4">
        All Green Credits transactions run on Moonbase Alpha, part of the
        Moonbeam ecosystem on Polkadot.
      </p>
      <p>
        This ensures low-cost testing, fast transactions, and interoperability.
      </p>
    </div>
  ),
};
