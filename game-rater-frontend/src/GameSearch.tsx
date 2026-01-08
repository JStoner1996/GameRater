import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { Game } from "./shared/types/types";

type GameSearchProps = {
  games: Game[];
  onResults: (results: Game[]) => void;
};

const GameSearch: React.FC<GameSearchProps> = ({ games, onResults }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      onResults(games);
      return;
    }

    const filtered = games.filter((g) => g.title.toLowerCase().includes(term));

    onResults(filtered);
  }, [searchTerm, games, onResults]);

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
