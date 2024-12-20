"use client";

import { useEffect, useState } from "react";
import SearchResults from "@/components/SearchResults";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

export default function Search() {
  const { register, watch } = useForm();
  const search = watch("search");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Input {...register("search")} placeholder="Search" className="w-3/4" />
      <SearchResults q={debouncedSearch} />
    </div>
  );
}
