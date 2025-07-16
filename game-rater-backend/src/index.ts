import express, { Request, Response } from "express";
import { PrismaClient, Game } from "@prisma/client";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Create a new game
app.post("/games", async (req: Request, res: Response) => {
  const data = req.body as Omit<Game, "id">;

  const game = await prisma.game.create({ data });
  res.json(game);
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
  const id = parseInt(req.params.id);
  const data = req.body as Omit<Game, "id">;

  const game = await prisma.game.update({ where: { id }, data });
  res.json(game);
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
