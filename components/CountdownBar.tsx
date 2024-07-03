import { useEffect, useState } from "react";
import { Progress } from "./ui/progress";

export default function CountdownBar({ seconds }: { seconds: number }) {
  const [countdown, setCountdown] = useState<number>(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 0) {
          return prevCountdown - 100 / seconds;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <Progress value={countdown} />;
}
