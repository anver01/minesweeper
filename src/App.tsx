import { useState, FormEvent, FC, useEffect } from "react";
import "./App.css";
import InitalForm from "./Components/InitalForm";
import GameBoard from "./Components/GameBoard";

interface GameProps {
  size: number;
  state: number;
}

const App: FC = () => {
  const [gameState, setGameState] = useState<GameProps>({ size: 10, state: 0 });

  useEffect(() => {
    try {
      console.log(localStorage.getItem('T'))
    } catch (error) {
      console.log('No saved state found')
    }
  }, [])

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
    <div className="bg-yellow-700 h-screen">
      <div className="w-1/2 mx-auto bg-white h-full py-10 shadow-2xl shadow-zinc-700 text-center">
        <h1 className="font-bold text-6xl text-center pb-10">Minesweeper</h1>
        {gameState.state === 0 ? (
          <InitalForm handlePlay={handlePlay} />
        ) : (
          <GameBoard gameState={gameState} handleEnd={handleEnd} handleReset={handleReset} />
        )}
        {gameState.state > 1 && (
          <button
            className="border border-solid border-black rounded-md px-4 py-1 mt-4 bg-white"
            type="button"
            onClick={handleReset}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
