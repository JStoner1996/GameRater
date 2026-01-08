import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { Game } from "./shared/types/types";

type GameSearchProps = {
  games: Game[];
  onResults: (results: Game[], term: string) => void;
  hideIfEmpty?: boolean; // NEW: only for GameDialog
};

const GameSearch: React.FC<GameSearchProps> = ({
  games,
  onResults,
  hideIfEmpty = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term && hideIfEmpty) {
      // GameDialog behavior: hide table if nothing typed
      onResults([], term);
      return;
    }

    const filtered = term
      ? games.filter((g) => g.title.toLowerCase().includes(term))
      : games; // Dashboard behavior: show all if empty

    onResults(filtered, term);
  }, [searchTerm, games, onResults, hideIfEmpty]);

  return (
    <TextField
      fullWidth
      label="Search Games"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{ mb: 2 }}
    />
  );
};

export default GameSearch;
