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
} from "@mui/material";
import { Game, GameList } from "./shared/types/types";
import { gameSchema } from "./shared/validation/gameSchema";
import { Formik, Form } from "formik";

type AddGameProps = {
  onAddGame: (game: Game) => void;
  gameList: GameList;
};

const AddGame: React.FC<AddGameProps> = ({ onAddGame, gameList }) => {
  const [open, setOpen] = useState(false);

  const calculateOverall = (values: any) =>
    values.gameplay +
    values.story +
    values.characters +
    values.fun +
    values.artGraphics +
    values.personal;

  const findClosestGames = (games: Game[], overall: number) => {
    if (games.length === 0) return { above: null, equal: [], below: null };

    const aboveGames = games.filter((g) => g.overall > overall);
    const belowGames = games.filter((g) => g.overall < overall);
    const equalGames = games.filter((g) => g.overall === overall);

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

    return { above: closestAbove, equal: equalGames, below: closestBelow };
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ my: 2 }}>
        Add Game
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        sx={{ "& .MuiPaper-root": { width: 700, height: 700 } }} // fixed size of dialog
      >
        <DialogTitle align="center">Add New Game</DialogTitle>
        <Formik
          initialValues={{
            title: "",
            gameplay: 0,
            story: 0,
            characters: 0,
            fun: 0,
            artGraphics: 0,
            personal: 0,
            yearCompleted: new Date().getFullYear(),
          }}
          validationSchema={gameSchema}
          onSubmit={(values, { resetForm }) => {
            onAddGame(values as Game);
            resetForm();
            setOpen(false);
          }}
        >
          {({ errors, touched, handleChange, values }) => {
            const overall = calculateOverall(values);
            const closest = findClosestGames(gameList, overall);

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
                    {/* Form Inputs in Two Columns */}
                    {Object.keys(values).map((field) => (
                      <Grid size={6}>
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

                  {/* Overall Score */}
                  <Grid>
                    <Typography variant="h6" align="left" mt={3}>
                      Overall Score: {overall}
                    </Typography>
                  </Grid>

                  {/* Closest Games */}
                  <Grid
                    container
                    spacing={8}
                    sx={{
                      minHeight: 180,
                      maxHeight: 180,
                      flexShrink: 0,
                    }}
                    mt={3}
                  >
                    <Grid sx={{ maxWidth: 165, minWidth: 165 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Closest Above
                      </Typography>
                      {closest.above ? (
                        <Typography>{`${closest.above.title} (${closest.above.overall})`}</Typography>
                      ) : (
                        <Typography>No game above</Typography>
                      )}
                    </Grid>

                    <Grid
                      sx={{
                        maxHeight: 150,
                        maxWidth: 165,
                        minWidth: 165,
                        overflowY:
                          closest.equal.length > 5 ? "auto" : "visible",
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Same Overall
                      </Typography>
                      {closest.equal.length > 0 ? (
                        closest.equal.map((g) => (
                          <Typography key={g.id}>{g.title}</Typography>
                        ))
                      ) : (
                        <Typography>No game with same overall</Typography>
                      )}
                    </Grid>

                    <Grid sx={{ maxWidth: 165, minWidth: 165 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Closest Below
                      </Typography>
                      {closest.below ? (
                        <Typography>{`${closest.below.title} (${closest.below.overall})`}</Typography>
                      ) : (
                        <Typography>No game below</Typography>
                      )}
                    </Grid>
                  </Grid>
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

export default AddGame;
