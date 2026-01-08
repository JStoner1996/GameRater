import React from "react";
import { Typography, Box } from "@mui/material";

type NoGamesFoundProps = {
  message?: string;
};

const NoGamesFound: React.FC<NoGamesFoundProps> = ({
  message = "No games found",
}) => {
  return (
    <Box sx={{ mt: 2, textAlign: "center" }}>
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default NoGamesFound;
