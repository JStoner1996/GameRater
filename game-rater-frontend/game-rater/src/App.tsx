import React from "react";
import logo from "./logo.svg";
import "./App.css";
import GameList from "./GameList";

function App() {
  return (
    <div className="App">
      <h1>My Game Rankings</h1>
      <GameList />
    </div>
  );
}

export default App;
