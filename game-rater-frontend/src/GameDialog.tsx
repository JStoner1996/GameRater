import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Game, GameList } from "./shared/types/types";
import { gameSchema } from "./shared/validation/gameSchema";
import { Formik, Form } from "formik";
import axios from "axios";
import GameSearch from "./GameSearch";
import GamesTable from "./GamesTable";
import NoGamesFound from "./NoGamesFound";
import ClosestGames from "./ClosestGames";

type GameDialogProps = {
  open: boolean;
  gameList: GameList;
  initialGame?: Game | null;
  onClose: () => void;
  onGameSaved: (game: Game) => void;
};

const GameDialog: React.FC<GameDialogProps> = ({
  open,
  gameList,
  initialGame,
  onGameSaved,
  onClose,
}) => {
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [viewMode, setViewMode] = useState<"closest" | "search">("closest");

  const calculateOverall = (values: any) =>
    values.gameplay +
    values.story +
    values.characters +
    values.fun +
    values.artGraphics +
    values.personal;

  const findClosestGames = (
    games: Game[],
    overall: number,
    excludeId?: number
  ) => {
    const filteredGames = excludeId
      ? games.filter((g) => g.id !== excludeId)
      : games;

    if (!filteredGames.length) return { aboveAll: [], equal: [], belowAll: [] };

    const aboveGames = filteredGames.filter((g) => g.overall > overall);
    const belowGames = filteredGames.filter((g) => g.overall < overall);
    const equalGames = filteredGames.filter((g) => g.overall === overall);

    const closestAbove = aboveGames.length
      ? aboveGames.reduce((prev, curr) =>
          curr.overall < prev.overall ? curr : prev
        )
      : null;
    const closestBelow = belowGames.length
      ? belowGames.reduce((prev, curr) =>
          curr.overall > prev.overall ? curr : prev
        )
      : null;

    const aboveAll = closestAbove
      ? aboveGames.filter((g) => g.overall === closestAbove.overall)
      : [];
    const belowAll = closestBelow
      ? belowGames.filter((g) => g.overall === closestBelow.overall)
      : [];

    return { aboveAll, equal: equalGames, belowAll };
  };

  const handleSaveGame = async (game: Game, isEditing: boolean) => {
    try {
      const url = isEditing
        ? `http://localhost:3001/games/${game.id}`
        : "http://localhost:3001/games";
      const method = isEditing ? "put" : "post";
      const response = await axios[method](url, game);
      return response.data;
    } catch (error) {
      console.error("Error saving game:", error);
      alert(`Failed to ${isEditing ? "edit" : "add"} game`);
      throw error;
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogTitle align="center">Add New Game</DialogTitle>
      <Formik
        initialValues={{
          id: initialGame?.id ?? undefined,
          title: initialGame?.title || "",
          gameplay: initialGame?.gameplay ?? 0,
          story: initialGame?.story ?? 0,
          characters: initialGame?.characters ?? 0,
          fun: initialGame?.fun ?? 0,
          artGraphics: initialGame?.artGraphics ?? 0,
          personal: initialGame?.personal ?? 0,
          yearCompleted: initialGame?.yearCompleted ?? new Date().getFullYear(),
        }}
        validationSchema={gameSchema}
        onSubmit={(values, { resetForm }) => {
          handleSaveGame(values as Game, !!initialGame?.id).then(
            (savedGame) => {
              onGameSaved(savedGame);
              resetForm();
              onClose();
            }
          );
        }}
      >
        {({ errors, touched, handleChange, values }) => {
          const overall = calculateOverall(values);
          const closest = findClosestGames(gameList, overall, initialGame?.id);

          return (
            <Form
              style={{ padding: 16, position: "relative", paddingBottom: 80 }}
            >
              <DialogContent sx={{ overflow: "hidden", flex: 1 }}>
                {/* Game Fields */}
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  {Object.keys(values)
                    .filter((field) => field !== "id")
                    .map((field) => (
                      <Grid key={field} size={6}>
                        <TextField
                          name={field}
                          label={field.charAt(0).toUpperCase() + field.slice(1)}
                          type={field === "title" ? "text" : "number"}
                          value={values[field as keyof typeof values]}
                          onChange={handleChange}
                          fullWidth
                          error={Boolean(
                            touched[field as keyof typeof touched] &&
                              errors[field as keyof typeof errors]
                          )}
                          helperText={
                            touched[field as keyof typeof touched] &&
                            errors[field as keyof typeof errors]
                              ? errors[field as keyof typeof errors]
                              : ""
                          }
                        />
                      </Grid>
                    ))}
                </Grid>

                <Typography variant="h6" align="left" mt={3} textAlign="center">
                  Overall Score: {overall}
                </Typography>

                {/* Toggle between Closest / Search */}
                <Box mt={3} display="flex" justifyContent="center">
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(_, value) => value && setViewMode(value)}
                  >
                    <ToggleButton value="closest">Closest Games</ToggleButton>
                    <ToggleButton value="search">Search Games</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {/* Closest Games or Search */}
                {viewMode === "closest" && <ClosestGames closest={closest} />}

                {viewMode === "search" && (
                  <Box mt={2}>
                    <GameSearch
                      games={gameList}
                      onResults={(results, term) => {
                        setSearchResults(results);
                      }}
                    />

                    {searchResults.length > 0 ? (
                      <Box maxWidth={800} width="100%" my={2}>
                        <GamesTable games={searchResults} showExtras={false} />
                      </Box>
                    ) : (
                      <NoGamesFound message="No games found" />
                    )}
                  </Box>
                )}
              </DialogContent>

              {/* Save / Cancel buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  position: "absolute",
                  bottom: 16,
                  left: 24,
                  right: 24,
                  zIndex: 10,
                }}
              >
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  Save
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default GameDialog;
