import React, { FC, MouseEvent, useMemo, useState } from "react";
import useBombLocations from "../Hooks/useBombLocations";

interface InitialFormProps {
  gameState: GameStateProps;
  handleEnd: VoidFunction;
  handleReset: (e: React.MouseEvent<HTMLButtonElement>) => void
}

interface GameStateProps {
  size: number;
  state: number;
}

const GameBoard: FC<InitialFormProps> = ({
  gameState,
  handleEnd,
  handleReset
}) => {
  const { size, state } = gameState;
  const bs = useMemo<Array<Array<boolean>>>(() => {
    return Array(size)
    .fill([])
    .map(() => Array(size).fill(false));
  },  [size])

  const fs = useMemo<Array<Array<boolean>>>(() => {
    return Array(size)
    .fill([])
    .map(() => Array(size).fill(false));
  },  [size])

  const [boardState, setBoardState] = useState<Array<Array<boolean>>>(bs);
  const [flagState, setFlagState] = useState<Array<Array<boolean>>>(fs);
  const bombLocations = useBombLocations(size);

  const handleButtonClick = (r: number, c: number) => {
    if (flagState[r][c]){
      return
    }
    if (!bombLocations[r][c]) {
      setBoardState((prev: Array<Array<boolean>>) => {
        const copy: Array<Array<boolean>> = [...prev];
        copy[r][c] = true;
        return copy;
      });
    } else {
      handleEnd();
    }
  };

  const handleFlagClick = (e: MouseEvent<HTMLButtonElement>, r: number, c:number) => {
    e.preventDefault()
    setFlagState((prev: Array<Array<boolean>>) => {
      const copy: Array<Array<boolean>> = [...prev];
      copy[r][c] = true;
      return copy;
    });
  }

  return (
    <div className="grid place-items-center">
      <div className="flex flex-col gap-2">
        {Array(size)
          .fill(0)
          .map((_row, rkey) => {
            return (
              <div className="flex gap-2" key={rkey}>
                {Array(size)
                  .fill(0)
                  .map((_col, ckey) => (
                    <button
                      className={`h-10 w-10 rounded-sm ${
                        boardState[rkey][ckey]
                          ? "bg-gray-300 shadow-inner shadow-black pointer-events-none"
                          : "bg-gray-400"
                      }`}
                      key={ckey}
                      type="button"
                      onClick={() => handleButtonClick(rkey, ckey)}
                      onContextMenu={(e: MouseEvent<HTMLButtonElement>) => handleFlagClick(e, rkey, ckey)}
                      disabled={boardState[rkey][ckey] || state > 1}
                    >
                      {state === 1
                        ? flagState[rkey][ckey]
                          ? <img className="w-1/2 aspect-square m-auto" src="./flag.png" />
                          : boardState[rkey][ckey]
                            ? "1"
                            : ""
                        : Number(bombLocations[rkey][ckey]) === 1
                        ? <img className="w-1/2 aspect-square m-auto" src="./bomb.png" />
                        : flagState[rkey][ckey]
                          ? <img className="w-1/2 aspect-square m-auto" src="./flag.png" />
                          : boardState[rkey][ckey]
                            ? "1"
                            : ""}
                    </button>
                  ))}
              </div>
            );
          })}
      </div>
      {gameState.state > 1 && (
        <button
          className="border border-solid border-black rounded-md px-4 py-1 mt-4"
          type="button"
          onClick={handleReset}
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default GameBoard;
