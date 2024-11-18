"use client";

import { useState, useCallback } from "react";
import Fuse from "fuse.js";
import { Input } from "../../shadcn";

interface SearchBoxProps<T> {
  items: T[];
  keys: string[];
  onResults?: (results: T[]) => void;
  placeholder?: string;
  className?: string;
  threshold?: number;
}

export function SearchBox<T>({
  items,
  keys,
  onResults,
  placeholder = "Search...",
  className,
  threshold = 0.3,
}: SearchBoxProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const fuse = new Fuse(items, {
    keys,
    threshold,
    includeScore: true,
  });

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);

      if (!value.trim()) {
        onResults?.(items);
        return;
      }

      const searchResults = fuse.search(value);
      const filteredResults = searchResults.map((result) => result.item);
      onResults?.(filteredResults);
    },
    [fuse, items, onResults],
  );

  return (
    <Input
      type="search"
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) => handleSearch(e.target.value)}
      className={className}
    />
  );
}
