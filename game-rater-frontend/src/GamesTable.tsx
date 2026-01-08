// GameTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import { Game, Order } from "./shared/types/types";
import { stableSort, getComparator } from "./shared/helpers/Sorting";
import { getCellColors } from "./shared/helpers/ColourScale";
import { numericColumns } from "./shared/helpers/Columns";

type GamesTableProps = {
  games: Game[];
  order: Order;
  orderBy: keyof Game;
  onSort?: (property: keyof Game) => void;
  onRowClick?: (game: Game) => void;
  onDeleteClick?: (id: number) => void;
  deleting?: boolean;
  showActions?: boolean;
};

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    textAlign: "center",
    cursor: "pointer",
    userSelect: "none",
    fontWeight: "bold",
  },
}));

const StyledBodyCell = styled(TableCell)({
  textAlign: "center",
});

const GamesTable: React.FC<GamesTableProps> = ({
  games,
  order,
  orderBy,
  onSort,
  onRowClick,
  onDeleteClick,
  deleting,
  showActions = true,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: "75vh", overflowY: "auto" }}
    >
      <Table stickyHeader sx={{ borderCollapse: "collapse" }}>
        <TableHead>
          <TableRow>
            <StyledHeaderCell
              onClick={() => onSort?.("title")}
              sx={{
                color:
                  orderBy === "title"
                    ? order === "asc"
                      ? "red"
                      : "green"
                    : "white",
              }}
            >
              Title
            </StyledHeaderCell>

            {numericColumns.map((col) => (
              <StyledHeaderCell
                key={col}
                onClick={() => onSort?.(col)}
                sx={{
                  color:
                    orderBy === col
                      ? order === "asc"
                        ? "green"
                        : "red"
                      : "white",
                }}
              >
                {col === "artGraphics"
                  ? "Art / Graphics"
                  : col.charAt(0).toUpperCase() + col.slice(1)}
              </StyledHeaderCell>
            ))}

            <StyledHeaderCell
              onClick={() => onSort?.("yearCompleted")}
              sx={{
                color:
                  orderBy === "yearCompleted"
                    ? order === "asc"
                      ? "red"
                      : "green"
                    : "white",
              }}
            >
              Year Completed
            </StyledHeaderCell>

            {showActions && <StyledHeaderCell />}
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

              <StyledBodyCell>{game.yearCompleted}</StyledBodyCell>

              {showActions && (
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
