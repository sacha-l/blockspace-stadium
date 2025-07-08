import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TechStackChipsProps {
  value: string[];
  onChange: (technologies: string[]) => void;
  placeholder?: string;
}

const TechStackChips = ({
  value,
  onChange,
  placeholder = "Enter technology and press Enter",
}: TechStackChipsProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTech();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      // Remove last chip if input is empty and backspace is pressed
      removeTech(value.length - 1);
    }
  };

  const addTech = () => {
    const tech = inputValue.trim();
    if (tech && !value.includes(tech)) {
      onChange([...value, tech]);
      setInputValue("");
    }
  };

  const removeTech = (index: number) => {
    const newTechs = value.filter((_, i) => i !== index);
    onChange(newTechs);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md bg-background">
        {value.map((tech, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            <span>{tech}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => removeTech(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <div className="flex-1 min-w-[200px]">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : "Add more..."}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-6"
          />
        </div>
      </div>
      {inputValue.trim() && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTech}
          className="flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          Add "{inputValue.trim()}"
        </Button>
      )}
      <p className="text-xs text-muted-foreground">
        Press Enter or comma to add a technology. Click the X to remove.
      </p>
    </div>
  );
};

export default TechStackChips;
