import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { Game, GameList } from "./shared/types/types";
import { tableCellClasses, styled } from "@mui/material";
import GamesStats from "./GamesStats";
import GameDialog from "./GameDialog";
import ConfirmDialog from "./ConfirmDialog";

const GamesTable: React.FC = () => {
  const [games, setGames] = useState<GameList>([]);

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

  useEffect(() => {
    axios
      .get("http://localhost:3001/games")
      .then((response) => {
        setGames(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch games");
        setLoading(false);
      });
  }, []);

  const handleGameSaved = (savedGame: Game) => {
    setGames((prev) => {
      const existing = prev.find((g) => g.id === savedGame.id);
      return existing
        ? prev.map((g) => (g.id === savedGame.id ? savedGame : g))
        : [...prev, savedGame];
    });
  };

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

  //styling
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
  }));

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
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "75vh", overflowY: "auto" }}
      >
        <Table stickyHeader sx={{ "& td, & th": { textAlign: "center" } }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Gameplay</StyledTableCell>
              <StyledTableCell>Story</StyledTableCell>
              <StyledTableCell>Characters</StyledTableCell>
              <StyledTableCell>Fun</StyledTableCell>
              <StyledTableCell>Art / Graphics</StyledTableCell>
              <StyledTableCell>Personal</StyledTableCell>
              <StyledTableCell>Overall</StyledTableCell>
              <StyledTableCell>Stars</StyledTableCell>
              <StyledTableCell>Year Completed</StyledTableCell>
              <StyledTableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.id}>
                <TableCell
                  onClick={() => {
                    setSelectedGame(game);
                    setDialogOpen(true);
                  }}
                  sx={{
                    cursor: "pointer",
                    color: "primary.main",
                    textDecoration: "underline",
                  }}
                >
                  {game.title}
                </TableCell>
                <TableCell>{game.gameplay}</TableCell>
                <TableCell>{game.story}</TableCell>
                <TableCell>{game.characters}</TableCell>
                <TableCell>{game.fun}</TableCell>
                <TableCell>{game.artGraphics}</TableCell>
                <TableCell>{game.personal}</TableCell>
                <TableCell>{game.overall}</TableCell>
                <TableCell>{game.stars}</TableCell>
                <TableCell>{game.yearCompleted}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => handleDeleteClick(game.id)}
                  >
                    Delete
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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

export default GamesTable;
