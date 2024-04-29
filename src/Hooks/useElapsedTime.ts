import { useState, useEffect } from "react";

interface TimeProps {
  minutes: number,
  seconds: number
}

function useElapsedTime():TimeProps {
  const [time, setTime] = useState<TimeProps>({minutes: 0, seconds: 0})
  
  useEffect(() => {
    const startTime:Date = new Date()
    const timeInterval = setInterval(() => {
      const endTime:Date = new Date()
      const timeDiff:number = endTime.valueOf() - startTime.valueOf()
      const secondsDiff:number = Math.round(timeDiff/1000)
      const minutesDiff:number = Math.floor(secondsDiff/60)
      setTime({minutes: minutesDiff, seconds: secondsDiff%60})
    }, 1000)
    return () => {
      clearInterval(timeInterval)
    }
  }, [])

  return time
}
  
export default useElapsedTime