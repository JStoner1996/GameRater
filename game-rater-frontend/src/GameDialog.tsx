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
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Game, GameList } from "./shared/types/types";
import { gameSchema } from "./shared/validation/gameSchema";
import { Formik, Form } from "formik";
import axios from "axios";

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

    if (filteredGames.length === 0)
      return { aboveAll: [], equal: [], belowAll: [] };

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

      return response.data; // Return for success handling
    } catch (error) {
      console.error("Error saving game:", error);
      alert(`Failed to ${isEditing ? "edit" : "add"} game`);
      throw error;
    }
  };

  return (
    <>
      <Dialog
        open={open}
        fullWidth
        maxWidth="md"
        sx={{ "& .MuiPaper-root": { width: 800, height: 800 } }}
      >
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
            yearCompleted:
              initialGame?.yearCompleted ?? new Date().getFullYear(),
          }}
          validationSchema={gameSchema}
          onSubmit={(values, { resetForm }) => {
            handleSaveGame(values as Game, !!initialGame?.id).then(
              (savedGame) => {
                // Optionally inform parent component
                onGameSaved(savedGame);
                resetForm();
                onClose();
              }
            );
          }}
        >
          {({ errors, touched, handleChange, values }) => {
            const overall = calculateOverall(values);
            const closest = findClosestGames(
              gameList,
              overall,
              initialGame?.id
            );

            return (
              <Form
                style={{ flex: 1, position: "relative", paddingBottom: 80 }}
              >
                <DialogContent sx={{ overflow: "hidden", flex: 1 }}>
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    {Object.keys(values)
                      .filter((field) => field !== "id")
                      .map((field) => (
                        <Grid size={6}>
                          <TextField
                            name={field}
                            label={
                              field.charAt(0).toUpperCase() + field.slice(1)
                            }
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

                  <Grid>
                    <Typography variant="h6" align="left" mt={3}>
                      Overall Score: {overall}
                    </Typography>
                  </Grid>

                  <TableContainer
                    component={Paper}
                    sx={{ maxHeight: 180, flexShrink: 0, overflowY: "auto" }}
                  >
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center" sx={{ fontWeight: "bold" }}>
                            Closest Above
                            {closest.aboveAll.length > 0 &&
                              ` (${closest.aboveAll[0].overall})`}
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold" }}>
                            Same Overall
                            {closest.equal.length > 0 && ` (${overall})`}
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold" }}>
                            Closest Below
                            {closest.belowAll.length > 0 &&
                              ` (${closest.belowAll[0].overall})`}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.from({
                          length: Math.max(
                            closest.aboveAll.length || 1,
                            closest.equal.length || 1,
                            closest.belowAll.length || 1
                          ),
                        }).map((_, idx) => (
                          <TableRow
                            key={idx}
                            sx={{
                              backgroundColor:
                                idx % 2 === 0 ? "white" : "#f5f5f5",
                            }}
                          >
                            <TableCell align="center">
                              {closest.aboveAll[idx]
                                ? closest.aboveAll[idx].title
                                : ""}
                            </TableCell>
                            <TableCell align="center">
                              {closest.equal[idx]
                                ? closest.equal[idx].title
                                : ""}
                            </TableCell>
                            <TableCell align="center">
                              {closest.belowAll[idx]
                                ? closest.belowAll[idx].title
                                : ""}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </DialogContent>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 24,
                    zIndex: 10,
                  }}
                >
                  <Button type="submit" variant="contained">
                    Save
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Dialog>
    </>
  );
};

export default GameDialog;
