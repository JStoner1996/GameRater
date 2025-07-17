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
} from "@mui/material";
import { GameList } from "../../../shared/types/types";
import { tableCellClasses, styled } from "@mui/material";
import GamesStats from "./GamesStats";

const GamesTable: React.FC = () => {
  const [games, setGames] = useState<GameList>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "75vh", overflowY: "auto" }}
      >
        <Typography variant="h5" component="div" sx={{ p: 2 }}>
          Game List
        </Typography>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.id}>
                <TableCell>{game.title}</TableCell>
                <TableCell>{game.gameplay}</TableCell>
                <TableCell>{game.story}</TableCell>
                <TableCell>{game.characters}</TableCell>
                <TableCell>{game.fun}</TableCell>
                <TableCell>{game.artGraphics}</TableCell>
                <TableCell>{game.personal}</TableCell>
                <TableCell>{game.overall}</TableCell>
                <TableCell>{game.stars}</TableCell>
                <TableCell>{game.yearCompleted}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <GamesStats games={games} />
    </>
  );
};

export default GamesTable;
