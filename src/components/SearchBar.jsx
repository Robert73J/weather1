// SearchBar.jsx
import React, { useState } from "react";
import { geocodeCity } from "../services/weatherService";

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const [suggestions, setSuggestions] = useState([]);

async function handleChange(e) {
  const text = e.target.value;
  setQuery(text);

  if (text.length < 2) {
    setSuggestions([]);
    return;
  }

  try {
    const results = await geocodeCity(text, 5);
    setSuggestions(results);
  } catch {
    setSuggestions([]);
  }
}

function selectSuggestion(place) {
  setQuery(place.name);
  setSuggestions([]);
}

async function handleSearch() {
  if (!query) return;

  setLoading(true);
  setError("");
  setSuggestions([]); // ✅ ADDED: hide suggestions when searching

  try {
    // ⬇️ CHANGED: fetch 5 results instead of 1
    const results = await geocodeCity(query.trim(), 5);

    // ⬇️ ADDED: check for an EXACT match only
    const exact = results.find(
      (city) => city.name.toLowerCase() === query.trim().toLowerCase()
    );

    if (!exact) {
      setError("Place not found"); // ❗ Changed behavior here
      return;
    }

    onSelect(exact); // ⬅️ Use exact match only

  } catch {
    setError("Search failed");
  } finally {
    setLoading(false);
  }
}

function handleKeyDown(e) {
  if (e.key === "Enter") handleSearch();
}

  return (
  <div className="search-wrapper">
    <div className="search-bar">
      <input
        type="text"
        value={query}
        placeholder="Enter place name..."
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      <button onClick={handleSearch} disabled={loading}>
        {loading ? "..." : "Search"}
      </button>
    </div>

    {/* Error message on its own line */}
    {error && <div className="search-error">{error}</div>}

    {/* Floating suggestions panel */}
    {suggestions.length > 0 && (
      <div className="suggestions-panel">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="suggestion-item"
            onClick={() => selectSuggestion(s)}
          >
            {s.name}, {s.country}
          </div>
        ))}
      </div>
    )}
  </div>
);
}
