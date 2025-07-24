import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import symmetryProjects from "@/data/symmetry-2024.json";
import synergyProjects from "@/data/synergy-2025.json";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ProjectBubble } from "@/components/ProjectBubble";
import { DemoVideoModal } from "@/components/DemoVideoModal";
import { AnimatePresence, motion } from "framer-motion";

const CATEGORY_MAP: Record<string, string> = {
  // Symmetry 2024 categories
  "Rust": "Developer Tools",
  "wasm": "Developer Tools",
  "typescript": "Developer Tools",
  "TS": "Developer Tools",
  "react": "Developer Tools",
  "NEXT": "Developer Tools",
  "Next.js": "Developer Tools",
  "NextJS": "Developer Tools",
  "Golang": "Developer Tools",
  "Python": "Developer Tools",
  "deno": "Developer Tools",
  "Solidity": "DeFi",
  "EVM": "DeFi",
  "Polkadot": "DeFi",
  "Cairo": "DeFi",
  "NFT": "NFT",
  "Figma": "NFT",
  "JavaScript": "Developer Tools",
  "JS": "Developer Tools",
  "Jetson Nano": "Gaming",
  "Substrate": "Developer Tools",
  "GraphViz": "Developer Tools",
  "Mongo": "Developer Tools",
  "mongoDB": "Developer Tools",
  "Flutter": "Developer Tools",
  "React Native": "Developer Tools",
  "Wagmi": "DeFi",
  "Viem": "DeFi",
  "Sepolia": "DeFi",
  "Blink": "DeFi",
  "Phantom Wallet": "DeFi",
  "Solana": "DeFi",
  "Web3.js": "DeFi",
  "Livepeer": "Social",
  "Langchain": "Developer Tools",
  "CSS": "Developer Tools",
  "HTML": "Developer Tools",
  "Gaming": "Gaming",
  "Social": "Social",
  "F#": "Developer Tools",
  "Flask": "Developer Tools",
  "ethers.js": "DeFi",
  "Ollama": "Developer Tools",
  "EVM Pallet": "DeFi",
  "dephy messaging layer": "Developer Tools",
  "DePHY ID": "Developer Tools",
  "Structured Causal Models": "Developer Tools",
  "Rootstock": "DeFi",
  "Cere Network": "DeFi",
  "Goldsky Subgraph": "Developer Tools",
  "SQL": "Developer Tools",
  "Nextjs": "Developer Tools",
  "Papi": "Developer Tools",
  "DotConnect": "Developer Tools",
  // Synergy 2025 categories
  "Kusama": "DeFi", 
  "ink!": "Developer Tools",
  "Other": "Other",
};

const ALL_CATEGORIES = [
  "Gaming",
  "DeFi",
  "NFT",
  "Developer Tools",
  "Social",
  "Other",
  "Winners",
];

function extractCategories(techStack: string): string[] {
  return techStack
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t && t.toLowerCase() !== "nan")
    .map((t) => {
      // Try exact match first
      if (CATEGORY_MAP[t]) {
        return CATEGORY_MAP[t];
      }
      // Try case-insensitive match
      const lowerT = t.toLowerCase();
      for (const [key, value] of Object.entries(CATEGORY_MAP)) {
        if (key.toLowerCase() === lowerT) {
          return value;
        }
      }
      return t;
    });
}

const PastProjectsPage = () => {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("synergy-2025");
  const [videoProject, setVideoProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(false); // Simulate loading if needed

  // Select projects based on event
  const projects = selectedEvent === "symmetry-2024" ? symmetryProjects : synergyProjects;
  const filteredProjects = useMemo(() => {
    return projects.filter((project: any) => {
      // Event filter
      const matchesEvent = selectedEvent === "symmetry-2024" || 
        (selectedEvent === "synergy-2025" && project.eventStartedAt === "synergy-hack-2024");
      
      // Search
      const matchesSearch =
        !search ||
        project.projectName.toLowerCase().includes(search.toLowerCase()) ||
        project.teamLead.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase());
      
      // Filters
      let matchesFilter = true;
      if (activeFilters.length > 0) {
        matchesFilter = false;
        for (const filter of activeFilters) {
          if (filter === "Winners") {
            let isWinner = false;
            
            if (selectedEvent === "symmetry-2024") {
              // Check for specific winner projects in symmetry-2024
              const winnerProjects = [
                "anytype - nft gating",
                "delegit", 
                "empathy technologies",
                "hypertents",
                "papi actions",
                "propcorn",
                "ChainView"
              ];
              isWinner = winnerProjects.some(winner =>
                project.projectName.toLowerCase().includes(winner.toLowerCase())
              ) || (project.milestones && project.milestones.length > 3);
            } else {
              // Check for winner projects based on winner field in synergy-2025
              isWinner = project.winner && project.winner !== "";
            }
            
            if (isWinner) {
              matchesFilter = true;
              break;
            }
          }
          // Check techStack
          const cats = extractCategories(project.techStack);
          if (cats.includes(filter)) {
            matchesFilter = true;
            break;
          }
        }
      }
      return matchesEvent && matchesSearch && matchesFilter;
    });
  }, [projects, search, activeFilters, selectedEvent]);

  // Skeleton bubbles for loading state
  const skeletons = Array.from({ length: 6 });

  return (
    <div className="container py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center space-x-2">
              <ChevronLeft className="h-4 w-4" />
              <span>Go Back Home</span>
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-bold mb-2">Past Projects</h1>
        <p className="text-muted-foreground">
          Browse {filteredProjects.length} projects from {selectedEvent === "symmetry-2024" ? "Blockspace Symmetry 2024" : "Blockspace Synergy 2025"}
        </p>
      </div>
      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <FilterSidebar
          search={search}
          setSearch={setSearch}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          allCategories={ALL_CATEGORIES}
          activeCount={activeFilters.length}
          onClear={() => setActiveFilters([])}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
        {/* Bubble Gallery */}
        <div className="flex-1 bubble-grid">
          {loading ? (
            skeletons.map((_, idx) => (
              <div
                key={idx}
                className="project-bubble bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse"
                style={{ minHeight: 220 + (idx % 3) * 40 }}
              />
            ))
          ) : (
            <AnimatePresence>
              {filteredProjects.length === 0 ? (
                <motion.div
                  className="col-span-full text-center text-muted-foreground py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  No projects found.
                </motion.div>
              ) : (
                filteredProjects.map((project, idx) => (
                  <motion.div
                    key={project.projectName + idx}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    style={{ "--index": idx } as React.CSSProperties }
                  >
                    <ProjectBubble
                      project={project}
                      onPlayDemo={setVideoProject}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
      {/* Video Modal */}
      <DemoVideoModal open={!!videoProject} onClose={() => setVideoProject(null)} project={videoProject} />
    </div>
  );
};

export default PastProjectsPage;
