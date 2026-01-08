import React, { useEffect, useState, useMemo } from "react";
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
import { tableCellClasses, styled } from "@mui/material";

import { Game, GameList, Order } from "./shared/types/types";
import { columns, numericColumns } from "./shared/helpers/Columns";
import { getComparator, stableSort } from "./shared/helpers/Sorting";

import GamesStats from "./GamesStats";
import GameDialog from "./GameDialog";
import ConfirmDialog from "./ConfirmDialog";
import NumericCell from "./NumericCell";

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    textAlign: "center",
    userSelect: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
}));

const StyledBodyCell = styled(TableCell)({
  textAlign: "center",
});

const GamesTable: React.FC = () => {
  const [games, setGames] = useState<GameList>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [gameToDelete, setGameToDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const [deleting, setDeleting] = useState(false);

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Game>("overall");

  useEffect(() => {
    axios
      .get("http://localhost:3001/games")
      .then((res) => setGames(res.data))
      .catch(() => setError("Failed to fetch games"))
      .finally(() => setLoading(false));
  }, []);

  const handleGameSaved = (savedGame: Game) => {
    setGames((prev) => {
      const exists = prev.find((g) => g.id === savedGame.id);
      return exists
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

  const handleConfirmDelete = async () => {
    if (!gameToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:3001/games/${gameToDelete.id}`);
      setGames((prev) => prev.filter((g) => g.id !== gameToDelete.id));
      setConfirmOpen(false);
      setGameToDelete(null);
    } catch (err) {
      console.error(err);
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

  // Precompute column min/max values for color scale
  const columnValues = useMemo(() => {
    const result: Record<keyof Game, number[]> = {} as any;
    numericColumns.forEach(
      (col) => (result[col] = games.map((g) => g[col] as number))
    );
    return result;
  }, [games]);

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
              {columns.map((col) => {
                let color = "white";

                if (orderBy === col.key) {
                  if (col.key === "title") {
                    // Reverse colors for title
                    color = order === "asc" ? "red" : "green";
                  } else {
                    color = order === "asc" ? "green" : "red";
                  }
                }
                return (
                  <StyledHeaderCell
                    key={col.key}
                    onClick={() =>
                      col.key !== "actions" &&
                      handleRequestSort(col.key as keyof Game)
                    }
                    sx={{
                      color,
                      cursor: col.key === "actions" ? "default" : "pointer",
                    }}
                  >
                    {col.label}
                  </StyledHeaderCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {stableSort(games, getComparator(order, orderBy)).map((game) => (
              <TableRow key={game.id}>
                <StyledBodyCell
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
                </StyledBodyCell>

                {numericColumns.map((col) => (
                  <NumericCell
                    key={col}
                    value={game[col] as number}
                    columnValues={columnValues[col]}
                  />
                ))}

                <StyledBodyCell>{game.yearCompleted}</StyledBodyCell>

                <StyledBodyCell>
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{
                      cursor: deleting ? "not-allowed" : "pointer",
                      textDecoration: deleting ? "none" : "underline",
                      opacity: deleting ? 0.5 : 1,
                    }}
                    onClick={() => !deleting && handleDeleteClick(game.id)}
                  >
                    Delete
                  </Typography>
                </StyledBodyCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <GamesStats games={games} />
      <GameDialog
        open={dialogOpen}
        gameList={games}
        initialGame={selectedGame}
        onClose={() => setDialogOpen(false)}
        onGameSaved={handleGameSaved}
      />
      <ConfirmDialog
        open={confirmOpen}
        gameName={gameToDelete?.title}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </>
  );
};

export default GamesTable;
