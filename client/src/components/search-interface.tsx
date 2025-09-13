import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function SearchInterface({ onSearch, isLoading = false }: SearchInterfaceProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const quickSearches = [
    "back pain",
    "diabetes",
    "headache",
    "hypertension",
    "chest pain"
  ];

  const handleQuickSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    onSearch(searchTerm);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Search Medical Conditions
          </label>
          <div className="relative">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 pr-12 text-lg"
              placeholder="e.g., back pain, diabetes, hypertension..."
              data-testid="input-search-query"
            />
            <Button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-2 px-4 py-2"
              data-testid="button-search"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </form>
      
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground">Quick searches:</span>
        {quickSearches.map((term) => (
          <Button
            key={term}
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleQuickSearch(term)}
            disabled={isLoading}
            className="text-xs"
            data-testid={`button-quick-search-${term.replace(" ", "-")}`}
          >
            {term}
          </Button>
        ))}
      </div>
    </div>
  );
}
