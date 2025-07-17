import React from "react";
import { Game } from "../../../shared/types/types";
import {
  Typography,
  Box,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";

type Props = {
  games: Game[];
};

const GameStats: React.FC<Props> = ({ games }) => {
  if (games.length === 0) return null;

  const maxOverall = Math.max(...games.map((g) => g.overall));
  const minOverall = Math.min(...games.map((g) => g.overall));

  const highestRatedGames = games.filter((g) => g.overall === maxOverall);
  const lowestRatedGames = games.filter((g) => g.overall === minOverall);

  const completionsByYear: Record<number, number> = {};
  games.forEach((game) => {
    const year = game.yearCompleted;
    completionsByYear[year] = (completionsByYear[year] || 0) + 1;
  });

  const sortedYears = Object.keys(completionsByYear)
    .map(Number)
    .sort((a, b) => b - a); // Descending

  return (
    <Box mt={6} textAlign="center">
      <Typography variant="h5" gutterBottom>
        Game Statistics
      </Typography>

      <Grid container spacing={6} justifyContent="center">
        <Grid>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Highest Rated
            </Typography>
            <Typography variant="body1">
              {highestRatedGames.map((g) => g.title).join(", ")} ({maxOverall})
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Lowest Rated
            </Typography>
            <Typography variant="body1">
              {lowestRatedGames.map((g) => g.title).join(", ")} ({minOverall})
            </Typography>
          </Paper>
        </Grid>

        <Grid>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Number of Games Completed by Year
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Year</TableCell>
                  <TableCell align="center">Completions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedYears.map((year) => (
                  <TableRow key={year}>
                    <TableCell align="center">{year}</TableCell>
                    <TableCell align="center">
                      {completionsByYear[year]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GameStats;
