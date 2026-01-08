import { styled, TableCell, tableCellClasses } from "@mui/material";

export const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    textAlign: "center",
    cursor: "pointer",
    userSelect: "none",
    fontWeight: "bold",
  },
}));

export const StyledBodyCell = styled(TableCell)({
  textAlign: "center",
});
