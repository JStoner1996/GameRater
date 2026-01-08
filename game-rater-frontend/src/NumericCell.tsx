import React from "react";
import { TableCell } from "@mui/material";
import { getCellColors } from "./shared/helpers/ColourScale";

type NumericCellProps = {
  value: number;
  columnValues: number[];
};

const NumericCell: React.FC<NumericCellProps> = ({ value, columnValues }) => {
  const { backgroundColor, textColor } = getCellColors(value, columnValues);

  return (
    <TableCell sx={{ backgroundColor, color: textColor, textAlign: "center" }}>
      {value}
    </TableCell>
  );
};

export default NumericCell;
