"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import {
  CATEGORY_FILTERS,
  SESSIONS,
  type Session,
  type SessionCategory,
} from "@/lib/mock-data";
import { Search } from "lucide-react";
import { SessionCard } from "../common/SessionCard";

type CategoryFilter = "All" | SessionCategory;

const FILTER_OPTIONS: CategoryFilter[] = ["All", ...CATEGORY_FILTERS];

export function SessionBrowser(): React.ReactNode {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");

  const filtered = useMemo<Session[]>(() => {
    const normalized = query.trim().toLowerCase();
    return SESSIONS.filter((session) => {
      const matchesCategory =
        category === "All" || session.category === category;
      const matchesQuery =
        normalized === "" ||
        session.title.toLowerCase().includes(normalized) ||
        session.location.toLowerCase().includes(normalized) ||
        session.category.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-midnight-violet-400" />
          <input
            type="search"
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setQuery(event.target.value)
            }
            placeholder="Search sessions, instructors..."
            className="w-full rounded-2xl border border-midnight-violet-200 bg-white py-3 pl-12 pr-4 text-midnight-violet-800 placeholder:text-midnight-violet-400 focus:outline-none focus:ring-2 focus:ring-midnight-violet-300"
          />
        </div>
        <select
          value={category}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setCategory(event.target.value as CategoryFilter)
          }
          className="rounded-2xl border border-midnight-violet-200 bg-white px-4 py-3 text-midnight-violet-800 focus:outline-none focus:ring-2 focus:ring-midnight-violet-300"
        >
          <option value="All">All categories</option>
          {CATEGORY_FILTERS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setCategory(option)}
            className={
              option === category
                ? "rounded-full bg-midnight-violet-700 px-4 py-2 text-sm font-medium text-white"
                : "rounded-full border border-midnight-violet-200 px-4 py-2 text-sm font-medium text-midnight-violet-800 hover:bg-midnight-violet-50"
            }
          >
            {option}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-midnight-violet-600">
        {filtered.length} sessions found
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {filtered.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-midnight-violet-600">
          No sessions match your search.
        </p>
      ) : null}
    </>
  );
}
