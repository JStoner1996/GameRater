import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { Game, Order } from "./shared/types/types";
import { stableSort, getComparator } from "./shared/helpers/Sorting";
import { getCellColors } from "./shared/helpers/ColourScale";
import { numericColumns } from "./shared/helpers/Columns";
import { StyledHeaderCell, StyledBodyCell } from "./shared/helpers/StyledCells";

type GamesTableProps = {
  games: Game[];
  onRowClick?: (game: Game) => void;
  onDeleteClick?: (id: number) => void;
  deleting?: boolean;
  showExtras?: boolean;
};

const GamesTable: React.FC<GamesTableProps> = ({
  games,
  onRowClick,
  onDeleteClick,
  deleting = false,
  showExtras = true,
}) => {
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof Game>("overall");

  const handleRequestSort = (property: keyof Game) => {
    let newOrder: Order;

    if (property === orderBy) {
      newOrder = order === "asc" ? "desc" : "asc";
    } else {
      // Title defaults ASC, everything else DESC
      newOrder = property === "title" ? "desc" : "asc";
    }

    setOrder(newOrder);
    setOrderBy(property);
  };

  const getHeaderColor = (col: keyof Game) => {
    if (orderBy !== col) return "white";

    // Title colors reversed
    if (col === "title") {
      return order === "asc" ? "red" : "green";
    }

    return order === "asc" ? "green" : "red";
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: "75vh" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <StyledHeaderCell
              onClick={() => handleRequestSort("title")}
              sx={{ color: getHeaderColor("title") }}
            >
              Title
            </StyledHeaderCell>

            {numericColumns.map((col) => (
              <StyledHeaderCell
                key={col}
                onClick={() => handleRequestSort(col)}
                sx={{ color: getHeaderColor(col) }}
              >
                {col === "artGraphics"
                  ? "Art / Graphics"
                  : col.charAt(0).toUpperCase() + col.slice(1)}
              </StyledHeaderCell>
            ))}

            {showExtras && (
              <StyledHeaderCell
                onClick={() => handleRequestSort("yearCompleted")}
                sx={{ color: getHeaderColor("yearCompleted") }}
              >
                Year Completed
              </StyledHeaderCell>
            )}

            {showExtras && <StyledHeaderCell />}
          </TableRow>
        </TableHead>

        <TableBody>
          {stableSort(games, getComparator(order, orderBy)).map((game) => (
            <TableRow key={game.id}>
              <StyledBodyCell
                onClick={() => onRowClick?.(game)}
                sx={{
                  cursor: onRowClick ? "pointer" : "default",
                  color: "primary.main",
                  textDecoration: "underline",
                }}
              >
                {game.title}
              </StyledBodyCell>

              {numericColumns.map((col) => {
                const value = game[col] as number;
                const { backgroundColor, textColor } = getCellColors(
                  value,
                  games.map((g) => g[col] as number)
                );

                return (
                  <StyledBodyCell
                    key={col}
                    sx={{ backgroundColor, color: textColor }}
                  >
                    {value}
                  </StyledBodyCell>
                );
              })}

              {showExtras && (
                <StyledBodyCell>{game.yearCompleted}</StyledBodyCell>
              )}

              {showExtras && (
                <StyledBodyCell>
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{
                      cursor: deleting ? "not-allowed" : "pointer",
                      textDecoration: deleting ? "none" : "underline",
                      opacity: deleting ? 0.5 : 1,
                    }}
                    onClick={() => !deleting && onDeleteClick?.(game.id)}
                  >
                    Delete
                  </Typography>
                </StyledBodyCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GamesTable;
