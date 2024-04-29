import { useState, FormEvent, FC } from "react";
import "./App.css";
import InitalForm from "./Components/InitalForm";
import GameBoard from "./Components/GameBoard";

interface GameProps {
  size: number;
  state: number;
}

const App: FC = () => {
  const [gameState, setGameState] = useState<GameProps>({ size: 10, state: 0 });
  const [time, setTime] = useState(0)

  const handlePlay = (e: FormEvent<HTMLInputElement>, size: number): void => {
    e.preventDefault();
    setGameState((prev) => ({ ...prev, size, state: prev.state + 1 }));
  };

  const handleEnd = (): void => {
    setGameState((prev) => ({ ...prev, state: prev.state + 1 }));
  };

  const handleReset = (e: FormEvent<HTMLButtonElement>) : void => {
    e.preventDefault()
    setGameState({ size: 10, state: 0 })
  }

  return (
    <div className="w-2/3 mx-auto my-20">
      <h1 className="font-bold text-3xl text-center py-4">Minesweeper</h1>
      {gameState.state === 0 ? (
        <InitalForm handlePlay={handlePlay} />
      ) : (
        <GameBoard gameState={gameState} handleEnd={handleEnd} handleReset={handleReset} />
      )}
    </div>
  );
};

export default App;
