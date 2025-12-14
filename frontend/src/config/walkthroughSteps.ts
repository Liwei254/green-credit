// frontend/src/config/walkthroughSteps.ts

export interface WalkthroughStep {
  id: string;
  title: string;
  contentKey: string;
  showButtons: boolean;
  actions?: {
    primary?: 'connect' | 'demo';
    secondary?: 'connect' | 'demo';
  };
}

export const walkthroughSteps: WalkthroughStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Green Credits',
    contentKey: 'welcome',
    showButtons: true,
  },
  {
    id: 'connect-wallet',
    title: 'Connect Your Wallet or Try Demo',
    contentKey: 'connect',
    showButtons: false,
    actions: {
      primary: 'connect',
      secondary: 'demo',
    },
  },
  {
    id: 'mobile-wallets',
    title: 'Mobile Wallet Recommendations',
    contentKey: 'mobileWallets',
    showButtons: true,
  },
  {
    id: 'submit-action',
    title: 'How to Submit an Action',
    contentKey: 'submitAction',
    showButtons: true,
  },
  {
    id: 'donate',
    title: 'How to Donate',
    contentKey: 'donate',
    showButtons: true,
  },
  {
    id: 'moonbase-network',
    title: 'Moonbase Network Requirement',
    contentKey: 'moonbase',
    showButtons: true,
  },
];
