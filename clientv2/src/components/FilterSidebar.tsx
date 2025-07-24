import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterSidebarProps {
  search: string;
  setSearch: (s: string) => void;
  activeFilters: string[];
  setActiveFilters: (f: string[]) => void;
  allCategories: string[];
  activeCount: number;
  onClear: () => void;
  selectedEvent: string;
  setSelectedEvent: (event: string) => void;
}

const categoryIcons: Record<string, string> = {
  "Gaming": "🎮",
  "DeFi": "💰",
  "NFT": "🎨",
  "Developer Tools": "🛠️",
  "Social": "🌐",
  "Other": "🔧",
  "Winners": "🏆",
};

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  search,
  setSearch,
  activeFilters,
  setActiveFilters,
  allCategories,
  activeCount,
  onClear,
  selectedEvent,
  setSelectedEvent,
}) => {
  const handleToggle = (cat: string) => {
    setActiveFilters(
      activeFilters.includes(cat)
        ? activeFilters.filter((c) => c !== cat)
        : [...activeFilters, cat]
    );
  };
  return (
    <aside className="w-[250px] min-w-[250px] max-w-[250px] h-full rounded-3xl p-6 backdrop-blur-md bg-white/10 border border-white/20 flex flex-col gap-6">
      <div>
        <div className="mb-4">
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 transition-colors">
              <SelectValue placeholder="Select Event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="symmetry-2024">Blockspace Symmetry 2024</SelectItem>
              <SelectItem value="synergy-2025">Blockspace Synergy 2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />
        <div className="flex flex-wrap gap-2 mb-2">
          {allCategories.map((cat) => (
            <Button
              key={cat}
              type="button"
              variant={activeFilters.includes(cat) ? "default" : "outline"}
              className="rounded-full px-3 py-1 text-sm flex items-center gap-1"
              onClick={() => handleToggle(cat)}
            >
              <span>{categoryIcons[cat] || ""}</span>
              {cat}
            </Button>
          ))}
        </div>
        {activeCount > 0 && (
          <span className="inline-block bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-bold mb-2">
            {activeCount} active
          </span>
        )}
      </div>
      <div className="mt-auto text-right">
        <button
          className="text-xs underline text-muted-foreground hover:text-primary"
          onClick={onClear}
        >
          Clear filters
        </button>
      </div>
    </aside>
  );
}; 