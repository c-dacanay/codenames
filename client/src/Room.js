import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";
import Game from "./Game";
const ENDPOINT = "http://127.0.0.1:4001";

const Room = () => {
  const room = window.location.pathname.slice(1);
  const [role, setRole] = useState("player");
  const [winner, setWinner] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState({});
  const [socket, setSocket] = useState(undefined);
  const [currentTurn, setCurrentTurn] = useState(score.startingTeam);
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);
    socket.emit("joinRoom", room);
    socket.on("newPlayer", ({ board, currentTurn, score }) => {
      setBoard(board);
      setScore(score);
      setCurrentTurn(currentTurn);
    });

    socket.on("newGame", ({ board, currentTurn, score }) => {
      setBoard(board);
      setScore(score);
      setCurrentTurn(currentTurn);
    });
    socket.on("newTurn", ({ currentTurn }) => {
      setCurrentTurn(currentTurn);
    });
    socket.on("wordGuessed", ({ board, currentTurn, score }) => {
      setScore(score);
      setBoard(board);
      setCurrentTurn(currentTurn);
    });

    socket.on("gameOver", ({ board, score, winner }) => {
      setGameOver(true);
      setWinner(winner);
      setBoard(board);
      setScore(score);
    });
    return () => socket.disconnect();
  }, [room]);

  const endTurn = () => {
    socket.emit("endTurn", room);
  };

  const startNewGame = () => {
    socket.emit("newGame", room);
  };

  return (
    <div className="App">
      <img src="./logo.svg" />
      {/* <h1>{room}</h1> */}
      <p>Send this link to friends: {window.location.href}</p>

      <p>
        <span className="pink">{score.pink}</span>-
        <span className="teal">{score.teal}</span>
      </p>
      {gameOver ? (
        <p>{winner} wins</p>
      ) : (
          <>
            <p className={currentTurn}>{currentTurn}'s turn</p>
            <button class="bigbutton" onClick={endTurn}>End {currentTurn}'s turn</button>
          </>
        )}
      <Game
        board={board}
        role={role}
        socket={socket}
        room={room}
        gameOver={gameOver}
      />

      <input
        name="player"
        checked={role === "player"}
        id="player"
        onChange={() => setRole("player")}
        type="radio"
        disabled={gameOver}
      />
      <label htmlFor="player">Player</label>
      <input
        type="radio"
        name="spymaster"
        checked={role === "spymaster"}
        id="spymaster"
        onChange={() => setRole("spymaster")}
        disabled={gameOver}
      />
      <label htmlFor="spymaster">Spymaster</label>

      <button class="bigbutton" onClick={startNewGame}>New Game</button>
    </div>
  );
};

export default Room;
