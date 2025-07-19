import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { gameSchema } from "../../game-rater-frontend/src/shared/validation/gameSchema";
import cors from "cors";
import { Game } from "../../game-rater-frontend/src/shared/types/types";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Create a new game
app.post("/games", async (req: Request, res: Response) => {
  try {
    const validatedData = await gameSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const {
      title,
      gameplay,
      story,
      characters,
      fun,
      artGraphics,
      personal,
      yearCompleted,
    } = validatedData;

    const overall =
      gameplay + story + characters + fun + artGraphics + personal;

    const stars =
      overall >= 2 ? Math.round(((overall / 60) * 100) / 2 - 1) / 10 : 0;

    const game = await prisma.game.create({
      data: {
        title,
        gameplay,
        story,
        characters,
        fun,
        artGraphics,
        personal,
        yearCompleted,
        overall,
        stars,
      },
    });

    res.status(201).json(game);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ errors: error.errors });
    }

    console.error("Error creating game:", error);
    res.status(500).json({ error: "Failed to create game" });
  }
});

// Get all games
app.get("/games", async (_req: Request, res: Response) => {
  const games = await prisma.game.findMany();
  res.json(games);
});

// Get one game
app.get("/games/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const game = await prisma.game.findUnique({ where: { id } });
  res.json(game);
});

// Update a game
app.put("/games/:id", async (req: Request, res: Response) => {
  const gameId = Number(req.params.id);

  try {
    const validatedData = await gameSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const {
      title,
      gameplay,
      story,
      characters,
      fun,
      artGraphics,
      personal,
      yearCompleted,
    } = validatedData;

    const overall =
      gameplay + story + characters + fun + artGraphics + personal;

    const stars =
      overall >= 2 ? Math.round(((overall / 60) * 100) / 2 - 1) / 10 : 0;

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        title,
        gameplay,
        story,
        characters,
        fun,
        artGraphics,
        personal,
        yearCompleted,
        overall,
        stars,
      },
    });

    res.json(updatedGame);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ errors: error.errors });
    }

    console.error("Error updating game:", error);
    res.status(500).json({ error: "Failed to update game" });
  }
});

// Delete a game
app.delete("/games/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await prisma.game.delete({ where: { id } });
  res.json({ message: "Game deleted" });
});

app.listen(3001, () => {
  console.log("🚀 Server ready at http://localhost:3001");
});
