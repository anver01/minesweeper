import { useEffect, useMemo, useRef, useState } from 'react'

function useBombLocations(size:number): Array<Array<boolean>> {

  const bs = useMemo<Array<Array<boolean>>>(() => {
    return Array(size)
    .fill([])
    .map(() => Array(size).fill(false))
  }, [size])

  const [bombList, setBombList] = useState<Array<Array<boolean>>>([])

  const runFlag = useRef<boolean>(false)

  useEffect(() => {
    if (!runFlag.current){
      runFlag.current = true
      let cnt:number = 0;
  
      for (let i = 0; i < size; i++){
        for (let j = 0; j < size; j++){
          const p: number = Math.random()
          if(p<0.2 && cnt <= Math.floor(0.2*(size*size))){
            bs[i][j] = true
            cnt += 1
          }
        }
      }
      setBombList(bs)
    }

  }, [bs, size])

  return bombList
}

export default useBombLocations