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
import { Game, GameList, Order } from "./shared/types/types";
import { tableCellClasses, styled } from "@mui/material";
import GamesStats from "./GamesStats";
import GameDialog from "./GameDialog";
import ConfirmDialog from "./ConfirmDialog";
import { getComparator, stableSort } from "./shared/helpers/Sorting";

const columns: { key: keyof Game | "actions"; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "gameplay", label: "Gameplay" },
  { key: "story", label: "Story" },
  { key: "characters", label: "Characters" },
  { key: "fun", label: "Fun" },
  { key: "artGraphics", label: "Art / Graphics" },
  { key: "personal", label: "Personal" },
  { key: "overall", label: "Overall" },
  { key: "stars", label: "Stars" },
  { key: "yearCompleted", label: "Year Completed" },
  { key: "actions", label: "" }, // delete button column
];

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

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Game>("title");

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

  const handleRequestSort = (property: keyof Game) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  //styling
  const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      textAlign: "center",
      cursor: "pointer",
      userSelect: "none",
    },
  }));

  const StyledBodyTableCell = styled(TableCell)({
    textAlign: "center",
  });

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
        <Table stickyHeader sx={{ borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                let color = "white";
                if (orderBy === column.key) {
                  color = order === "asc" ? "red" : "green";
                }

                return (
                  <StyledTableHeaderCell
                    key={column.key}
                    onClick={() =>
                      column.key !== "actions" &&
                      handleRequestSort(column.key as keyof Game)
                    }
                    sx={{
                      textAlign: "center",
                      cursor: column.key === "actions" ? "default" : "pointer",
                      fontWeight: "bold",
                      color,
                      userSelect: "none",
                    }}
                  >
                    {column.label}
                  </StyledTableHeaderCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {stableSort(games, getComparator(order, orderBy)).map((game) => (
              <TableRow key={game.id}>
                <StyledBodyTableCell
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
                </StyledBodyTableCell>
                <StyledBodyTableCell>{game.gameplay}</StyledBodyTableCell>
                <StyledBodyTableCell>{game.story}</StyledBodyTableCell>
                <StyledBodyTableCell>{game.characters}</StyledBodyTableCell>
                <StyledBodyTableCell>{game.fun}</StyledBodyTableCell>
                <StyledBodyTableCell>{game.artGraphics}</StyledBodyTableCell>
                <StyledBodyTableCell>{game.personal}</StyledBodyTableCell>
                <StyledBodyTableCell>{game.overall}</StyledBodyTableCell>
                <StyledBodyTableCell>{game.stars}</StyledBodyTableCell>
                <StyledBodyTableCell>{game.yearCompleted}</StyledBodyTableCell>
                <StyledBodyTableCell>
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => handleDeleteClick(game.id)}
                  >
                    Delete
                  </Typography>
                </StyledBodyTableCell>
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
      />
    </>
  );
};

export default GamesTable;
