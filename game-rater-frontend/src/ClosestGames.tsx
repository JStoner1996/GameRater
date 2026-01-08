import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Game } from "./shared/types/types";

type ClosestGamesProps = {
  closest: {
    aboveAll: Game[];
    equal: Game[];
    belowAll: Game[];
  };
};

const ClosestGames: React.FC<ClosestGamesProps> = ({ closest }) => {
  const maxLength = Math.max(
    closest.aboveAll.length,
    closest.equal.length,
    closest.belowAll.length,
    1
  );

  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: 180, maxWidth: 800, overflowY: "auto", mt: 2 }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Closest Above
              {closest.aboveAll[0] && ` (${closest.aboveAll[0].overall})`}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Same Overall
              {closest.equal[0] && ` (${closest.equal[0].overall})`}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Closest Below
              {closest.belowAll[0] && ` (${closest.belowAll[0].overall})`}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: maxLength }).map((_, idx) => (
            <TableRow
              key={idx}
              sx={{ backgroundColor: idx % 2 === 0 ? "white" : "#f5f5f5" }}
            >
              <TableCell align="center">
                {closest.aboveAll[idx]?.title || ""}
              </TableCell>
              <TableCell align="center">
                {closest.equal[idx]?.title || ""}
              </TableCell>
              <TableCell align="center">
                {closest.belowAll[idx]?.title || ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClosestGames;
