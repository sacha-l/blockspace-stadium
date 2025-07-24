export interface Project {
  id: string;
  ss58Address: string; // unique identifier
  projectTitle: string;
  projectSummary: string;
  background: string;
  techStack: string;
  gitLink?: string;
  demoLink?: string;
  milestoneTitle: string;
  milestoneDescription: string;
  deliverables: string[];
  successCriteria: string;
  additionalNotes?: string;
  hasOtherMilestones: boolean;
  status: "pending" | "reviewing" | "approved" | "winner" | "rejected";
  submittedAt: string;
}

export const mockProjects: Project[] = [
  {
    id: "1",
    ss58Address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    projectTitle: "DeFi Portfolio Tracker",
    projectSummary:
      "A comprehensive DeFi portfolio tracking application with real-time yield farming analytics and cross-chain asset management.",
    background:
      "Traditional portfolio trackers fail to capture the complexity of DeFi protocols. Users need a unified dashboard to track their positions across multiple chains and protocols.",
    techStack: "React, TypeScript, Web3.js, Polkadot.js, ChartJS, TailwindCSS",
    gitLink: "https://github.com/example/defi-tracker",
    demoLink: "https://defi-tracker-demo.vercel.app",
    milestoneTitle: "Core Portfolio Dashboard",
    milestoneDescription:
      "Develop the main dashboard interface with portfolio overview, asset allocation charts, and real-time price feeds integration.",
    deliverables: [
      "Portfolio overview dashboard with real-time updates",
      "Multi-chain asset detection and balance aggregation",
      "Yield farming position tracking across major protocols",
      "Historical performance analytics and charts",
    ],
    successCriteria:
      "Dashboard loads within 2 seconds, supports 5+ major DeFi protocols, accurate balance tracking with 99.9% uptime",
    additionalNotes:
      "Integration with Polkadot ecosystem is a priority. Future plans include mobile app development.",
    hasOtherMilestones: true,
    status: "approved",
    submittedAt: "2024-01-15T09:30:00Z",
  },
  {
    id: "2",
    ss58Address: "5FNQc3j6wTN2AkXAUf4dWrPXy5LQWXcPL7H7rGQvzXfkVQ2q",
    projectTitle: "DAO Governance Analytics",
    projectSummary:
      "Advanced analytics platform for DAO governance activities, proposal tracking, and voter participation insights.",
    background:
      "DAOs lack comprehensive analytics tools to understand governance patterns, voter behavior, and proposal effectiveness.",
    techStack: "Next.js, Prisma, PostgreSQL, D3.js, Substrate API",
    gitLink: "https://github.com/example/dao-analytics",
    demoLink: "https://dao-analytics-demo.netlify.app",
    milestoneTitle: "Governance Metrics Dashboard",
    milestoneDescription:
      "Build comprehensive dashboard showing governance metrics, voting patterns, and proposal outcomes across multiple DAOs.",
    deliverables: [
      "Real-time governance activity feed",
      "Voter participation analytics with visual insights",
      "Proposal outcome prediction models",
      "Cross-DAO comparative analytics",
    ],
    successCriteria:
      "Support for 10+ major DAOs, real-time data updates, mobile-responsive design",
    additionalNotes:
      "Focus on Kusama and Polkadot council governance initially",
    hasOtherMilestones: false,
    status: "winner",
    submittedAt: "2024-01-14T14:22:00Z",
  },
  {
    id: "3",
    ss58Address: "5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY",
    projectTitle: "NFT Marketplace Aggregator",
    projectSummary:
      "Cross-chain NFT marketplace aggregator with advanced filtering, price discovery, and collection analytics.",
    background:
      "NFT traders need to monitor multiple marketplaces across different chains, leading to fragmented user experience and missed opportunities.",
    techStack: "Vue.js, Nuxt, GraphQL, IPFS, Polkadot.js API",
    gitLink: "https://github.com/example/nft-aggregator",
    milestoneTitle: "Multi-Chain NFT Discovery",
    milestoneDescription:
      "Implement NFT discovery engine that aggregates listings from major marketplaces across Polkadot, Kusama, and Ethereum.",
    deliverables: [
      "Cross-chain NFT listing aggregation",
      "Advanced search and filtering system",
      "Price history and trend analysis",
      "Collection rarity scoring algorithm",
    ],
    successCriteria:
      "Aggregate 100k+ NFT listings, sub-second search response time, accurate price tracking",
    hasOtherMilestones: true,
    status: "reviewing",
    submittedAt: "2024-01-16T11:45:00Z",
  },
  {
    id: "4",
    ss58Address: "5H4MvAsobfZ6bBCDyj5dsrWYLrA8HrRzaqa9p61UXtxMhSCY",
    projectTitle: "Decentralized Identity Vault",
    projectSummary:
      "Self-sovereign identity management system with verifiable credentials and privacy-preserving authentication.",
    background:
      "Current identity solutions are centralized and privacy-invasive. Users need control over their digital identity and credentials.",
    techStack:
      "Rust, Substrate, React Native, DID standards, Zero-knowledge proofs",
    gitLink: "https://github.com/example/identity-vault",
    demoLink: "https://identity-vault-demo.surge.sh",
    milestoneTitle: "Core Identity Infrastructure",
    milestoneDescription:
      "Develop the foundational identity infrastructure with DID creation, credential issuance, and verification protocols.",
    deliverables: [
      "DID creation and management interface",
      "Verifiable credential issuance system",
      "Zero-knowledge proof verification",
      "Mobile wallet application",
    ],
    successCriteria:
      "W3C DID compliance, privacy-preserving verification, seamless user experience",
    additionalNotes:
      "Collaboration with Kilt Protocol for credential standards",
    hasOtherMilestones: true,
    status: "pending",
    submittedAt: "2024-01-17T16:20:00Z",
  },
  {
    id: "5",
    ss58Address: "5Ff3iXP75ruzrQtWrWqaF7JFLwdXGXaD3RQ6cKCaFNQm4G7J",
    projectTitle: "Supply Chain Transparency Tool",
    projectSummary:
      "Blockchain-based supply chain tracking with IoT integration for real-time transparency and authenticity verification.",
    background:
      "Supply chains lack transparency, making it difficult to verify product authenticity and ethical sourcing practices.",
    techStack: "Substrate, IoT sensors, React, WebRTC, IPFS",
    gitLink: "https://github.com/example/supply-chain",
    milestoneTitle: "Product Journey Tracking",
    milestoneDescription:
      "Build system to track products from origin to consumer with immutable records and IoT sensor integration.",
    deliverables: [
      "Product registration and QR code generation",
      "IoT sensor data integration pipeline",
      "Real-time tracking dashboard",
      "Consumer verification interface",
    ],
    successCriteria:
      "Track 1000+ products, integrate with 5+ IoT sensor types, 99.5% data accuracy",
    hasOtherMilestones: false,
    status: "rejected",
    submittedAt: "2024-01-13T08:15:00Z",
  },
  {
    id: "6",
    ss58Address: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
    projectTitle: "Cross-Chain Bridge Protocol",
    projectSummary:
      "Secure and efficient bridge protocol for transferring assets between Polkadot parachains and external networks.",
    background:
      "Interoperability between different blockchain networks is crucial for DeFi growth and user experience.",
    techStack: "Rust, Substrate, Solidity, React, Web3.js",
    gitLink: "https://github.com/example/cross-chain-bridge",
    demoLink: "https://bridge-protocol-demo.vercel.app",
    milestoneTitle: "Core Bridge Infrastructure",
    milestoneDescription:
      "Develop the foundational bridge infrastructure with security mechanisms and cross-chain communication protocols.",
    deliverables: [
      "Multi-chain asset transfer functionality",
      "Security audit and vulnerability assessment",
      "User interface for bridge operations",
      "Real-time transaction monitoring",
    ],
    successCriteria:
      "Support 3+ major networks, sub-5 minute transfer times, 99.9% security rating",
    additionalNotes:
      "Focus on Polkadot-Kusama bridge initially, then expand to Ethereum and other networks",
    hasOtherMilestones: true,
    status: "approved",
    submittedAt: "2024-01-18T10:30:00Z",
  },
];

// Admin user simulation
export const adminCredentials = {
  password: "hackathonia2024",
};

// Mock payout data
export interface Payout {
  id: string;
  projectId: string;
  recipient: string;
  amount: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

export const mockPayouts: Payout[] = [
  {
    id: "payout-1",
    projectId: "2",
    recipient: "5FNQc3j6wTN2AkXAUf4dWrPXy5LQWXcPL7H7rGQvzXfkVQ2q",
    amount: "10000",
    status: "completed",
    createdAt: "2024-01-18T10:00:00Z",
  },
];
