import React, { useEffect, useState } from "react";
import axios from "axios";
import { Game } from "../../../shared/types/types";

const GameList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/games")
      .then((response) => {
        setGames(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch games");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading games...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Game List</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Gameplay</th>
            <th>Story</th>
            <th>Characters</th>
            <th>Fun</th>
            <th>Art / Graphics</th>
            <th>Personal</th>
            <th>Overall</th>
            <th>Stars</th>
            <th>Year Completed</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id}>
              <td>{game.title}</td>
              <td>{game.gameplay}</td>
              <td>{game.story}</td>
              <td>{game.characters}</td>
              <td>{game.fun}</td>
              <td>{game.artGraphics}</td>
              <td>{game.personal}</td>
              <td>{game.overall}</td>
              <td>{game.stars}</td>
              <td>{game.yearCompleted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameList;
