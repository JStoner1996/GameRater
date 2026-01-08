// GamesDashboard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Typography } from "@mui/material";
import { Game, GameList, Order } from "./shared/types/types";
import GamesStats from "./GamesStats";
import GameDialog from "./GameDialog";
import ConfirmDialog from "./ConfirmDialog";
import GamesTable from "./GamesTable";
import GameSearch from "./GameSearch";
import NoGamesFound from "./NoGamesFound";

const GamesDashboard: React.FC = () => {
  const [games, setGames] = useState<GameList>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameToDelete, setGameToDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Game>("overall");

  // Fetch games from backend
  useEffect(() => {
    axios
      .get("http://localhost:3001/games")
      .then((res) => {
        setGames(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch games");
        setLoading(false);
      });
  }, []);

  // Handle adding or updating a game
  const handleGameSaved = (savedGame: Game) => {
    setGames((prev) => {
      const existing = prev.find((g) => g.id === savedGame.id);
      return existing
        ? prev.map((g) => (g.id === savedGame.id ? savedGame : g))
        : [...prev, savedGame];
    });
  };

  // Delete workflow
  const handleDeleteClick = (id: number) => {
    const game = games.find((g) => g.id === id);
    if (!game) return;

    setGameToDelete({ id: game.id, title: game.title });
    setConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setGameToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!gameToDelete) return;

    setDeleting(true);
    try {
      await axios.delete(`http://localhost:3001/games/${gameToDelete.id}`);
      setGames((prev) => prev.filter((g) => g.id !== gameToDelete.id));
      setConfirmOpen(false);
      setGameToDelete(null);
    } catch (err) {
      console.error("Failed to delete game:", err);
      alert("Failed to delete game");
    } finally {
      setDeleting(false);
    }
  };

  const handleRequestSort = (property: keyof Game) => {
    let newOrder: Order;

    if (property === orderBy) {
      newOrder = order === "asc" ? "desc" : "asc";
    } else {
      newOrder = property === "title" ? "desc" : "asc";
    }

    setOrder(newOrder);
    setOrderBy(property);
  };

  if (loading) return <Typography>Loading games...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Button
        variant="contained"
        sx={{ my: 2 }}
        onClick={() => {
          setSelectedGame(null);
          setDialogOpen(true);
        }}
      >
        Add Game
      </Button>

      <GameSearch games={games} onResults={setFilteredGames} />

      {filteredGames.length === 0 ? (
        <NoGamesFound />
      ) : (
        <GamesTable
          games={filteredGames}
          order={order}
          orderBy={orderBy}
          onSort={handleRequestSort}
          onRowClick={(game) => setSelectedGame(game)}
          onDeleteClick={handleDeleteClick}
          deleting={deleting}
        />
      )}

      <GamesStats games={games} />

      <GameDialog
        open={dialogOpen}
        gameList={games}
        onClose={() => setDialogOpen(false)}
        initialGame={selectedGame}
        onGameSaved={handleGameSaved}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Deletion"
        gameName={gameToDelete?.title}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </>
  );
};

export default GamesDashboard;
