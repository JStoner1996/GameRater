-- CreateTable
CREATE TABLE "Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "gameplay" INTEGER NOT NULL,
    "story" INTEGER NOT NULL,
    "characters" INTEGER NOT NULL,
    "fun" INTEGER NOT NULL,
    "artGraphics" INTEGER NOT NULL,
    "personal" INTEGER NOT NULL,
    "overall" INTEGER NOT NULL,
    "stars" REAL NOT NULL,
    "yearCompleted" INTEGER NOT NULL
);
