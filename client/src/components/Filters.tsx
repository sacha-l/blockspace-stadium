import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ProjectFiltersProps {
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
  onClearFilters: () => void;
  searchValue: string;
  statusValue: string;
}

const ProjectFilters = ({
  onSearchChange,
  onStatusChange,
  onClearFilters,
  searchValue,
  statusValue,
}: ProjectFiltersProps) => {
  const [searchInput, setSearchInput] = useState(searchValue);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchInput);
  };

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "reviewing", label: "Reviewing" },
    { value: "approved", label: "Approved" },
    { value: "winner", label: "Winner" },
    { value: "rejected", label: "Rejected" },
  ];

  const hasActiveFilters = searchValue || statusValue;

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <form onSubmit={handleSearchSubmit} className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
      </form>

      <div className="flex gap-2">
        <Select value={statusValue} onValueChange={onStatusChange}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchValue && (
            <Badge variant="secondary">Search: {searchValue}</Badge>
          )}
          {statusValue && (
            <Badge variant="secondary">
              Status:{" "}
              {statusOptions.find((opt) => opt.value === statusValue)?.label}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;
