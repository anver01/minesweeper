import React, { FC, MouseEvent, useMemo, useState } from "react";
import useBombLocations from "../Hooks/useBombLocations";
import clickAudio from '../assets/click-sound.mp3'
import gongAudio from '../assets/gong-sound.mp3'
import useElapsedTime from "../Hooks/useElapsedTime";

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

  const ls = useMemo<Array<Array<number>>>(() => {
    return Array(size)
    .fill([])
    .map(() => Array(size).fill(''));
  },  [size])

  const [boardState, setBoardState] = useState<Array<Array<boolean>>>(bs);
  const [flagState, setFlagState] = useState<Array<Array<boolean>>>(fs);
  const [layout, setLayout] = useState<Array<Array<number | string>>>(ls);
  const [firstClick, setFirstClick] = useState<boolean>(false)

  // try to fix this let
  let bombLocations = useBombLocations(size);

  const timer = useElapsedTime()

  const resetBombState = (r: number, c: number) => {
    const copy: Array<Array<boolean>> = [...bombLocations]
    copy[r][c] = false
    let i = 0
    // eslint-disable-next-line no-constant-condition
    while(true){
      if(!copy[0][i] && (r!==0 || c!==i)){
        copy[0][i] = true
        bombLocations = [...copy]
        break
      }
      i += 1
    }
  }

  const checkZeroCellAndGetNeighbors = (r:number, c:number):{res:boolean, neighbors:Array<Array<number>> } => {
    let res:boolean = true
    const neighbors:Array<Array<number>> = []
    const d: Array<Array<number>> = [[-1, 0], [1, 0], [0, 1], [0, -1], [-1, 1], [-1, -1], [1, 1], [1, -1]]

    d.forEach(i => {
      const nr = r+i[0]
      const nc = c+i[1]
      if(nr >= 0 && nr < size && nc >= 0 && nc < size){
        if(bombLocations[nr][nc]){
          res = false
        }
        neighbors.push([nr, nc])
      }
    })

    return {res, neighbors}
  }

  const updateLayout = (r:number, c:number):void => {
    let cnt:number = 0;
    const d: Array<Array<number>> = [[-1, 0], [1, 0], [0, 1], [0, -1], [-1, 1], [-1, -1], [1, 1], [1, -1]]
    d.forEach(i => {
      const nr = r+i[0]
      const nc = c+i[1]
      if(nr >= 0 && nr < size && nc >= 0 && nc < size && bombLocations[nr][nc]){
        cnt += 1
      }
    })
    setLayout((prev: Array<Array<number | string>>) => {
      const copy: Array<Array<number | string>> = [...prev];
      if(cnt>0){
        copy[r][c] = cnt;
      } else {
        copy[r][c] = ''
      }
      return copy;
    });
    setBoardState((prev: Array<Array<boolean>>) => {
      const copy: Array<Array<boolean>> = [...prev];
      copy[r][c] = true;
      return copy;
    });
  }

  const explore = (r:number, c:number, visited:{[key: number] : Array<number>}) => {
    if(!visited[r]){
      visited[r] = []
    }
    // check if zeroCell
    const {res, neighbors} = checkZeroCellAndGetNeighbors(r, c)
    // if zeroCell get neighbours and explore further
    if(res && !visited[r].includes(c)){
      setBoardState((prev: Array<Array<boolean>>) => {
        const copy: Array<Array<boolean>> = [...prev];
        copy[r][c] = true;
        return copy;
      });
      visited[r].push(c)
      // const neighbors = getNeighbors(r, c)
      if(neighbors.length){
        neighbors.forEach((i:Array<number>) => {
         explore(i[0], i[1], visited)
        })
      }
    } else {
      updateLayout(r, c)
    }
  }

  const handleButtonClick = (r: number, c: number) => {
    if (flagState[r][c]){
      return
    }

    if (!bombLocations[r][c]) {
      new Audio(clickAudio).play()
      explore(r, c, {})
    } else {
      if(!firstClick){
        new Audio(clickAudio).play()
        resetBombState(r, c)
        explore(r, c, {})
      } else {
        new Audio(gongAudio).play()
        handleEnd()
      }
    }

    if (!firstClick){
      setFirstClick(true)
    }
  };

  const handleFlagClick = (e: MouseEvent<HTMLButtonElement>, r: number, c:number) => {
    e.preventDefault()
    if(!flagState[r][c]){
      setFlagState((prev: Array<Array<boolean>>) => {
        const copy: Array<Array<boolean>> = [...prev];
        copy[r][c] = true;
        return copy;
      });
    } else {
      setFlagState((prev: Array<Array<boolean>>) => {
        const copy: Array<Array<boolean>> = [...prev];
        copy[r][c] = false;
        return copy;
      });
    }
  }

  const getLayoutColor: {[key: number|string]: string} = {
    1: 'text-blue-600',
    2: 'text-green-600',
    3: 'text-red-600',
    4: 'text-purple-600',
    5: 'text-yellow-600',
    6: 'text-cyan-600'
  }

  const saveGame = ():void => {
    localStorage.setItem('BL', JSON.stringify(bombLocations))
    localStorage.setItem('BS', JSON.stringify(boardState))
    localStorage.setItem('FS', JSON.stringify(flagState))
    localStorage.setItem('LO', JSON.stringify(layout))
    localStorage.setItem('T', JSON.stringify(timer))
    localStorage.setItem('S', JSON.stringify(1))
  }

  return (
    <div className="grid place-items-center w-max mx-auto">
      <div className="my-2 text-right w-full font-semibold text-xl px-4">
        {timer.minutes} : {timer.seconds}
      </div>
      <div className="flex flex-col gap-1 border border-solid border-black p-2 rounded-md bg-green-200">
        {Array(size)
          .fill(0)
          .map((_row, rkey) => {
            return (
              <div className="flex gap-1" key={rkey}>
                {Array(size)
                  .fill(0)
                  .map((_col, ckey) => (
                    <button
                      className={`h-10 w-10 rounded-sm font-bold ${
                        boardState[rkey][ckey]
                          ? "bg-gray-300 shadow-inner shadow-black pointer-events-none"
                          : "bg-gray-400 shadow-sm shadow-black"
                      } ${getLayoutColor[layout[rkey][ckey]]}`}
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
                            ? layout[rkey][ckey]
                            : ""
                        : Number(bombLocations[rkey][ckey]) === 1
                        ? <img className="w-1/2 aspect-square m-auto" src="./bomb.png" />
                        : flagState[rkey][ckey]
                          ? <img className="w-1/2 aspect-square m-auto" src="./flag.png" />
                          : boardState[rkey][ckey]
                            ? layout[rkey][ckey]
                            : ""}
                    </button>
                  ))}
              </div>
            );
          })}
      </div>
      <button className="border border-solid border-black rounded-md px-4 py-1 mt-4 bg-white" onClick={() => saveGame()}>
        Save
      </button>
    </div>
  );
};

export default GameBoard;
