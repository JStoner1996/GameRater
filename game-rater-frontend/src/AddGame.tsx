import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import { Game } from "./shared/types/types";
import { gameSchema } from "./shared/validation/gameSchema";
import { Formik, Form } from "formik";

type AddGameProps = {
  onAddGame: (game: Game) => void;
};

const AddGame: React.FC<AddGameProps> = ({ onAddGame }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ my: 2 }}>
        Add Game
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Game</DialogTitle>
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
          {({ errors, touched, handleChange, values }) => (
            <Form>
              <DialogContent>
                <Grid container spacing={2} mt={1}>
                  {Object.keys(values).map((field) => (
                    <Grid key={field}>
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
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained">
                  Save
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default AddGame;
