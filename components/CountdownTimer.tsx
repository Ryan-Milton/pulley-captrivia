import { useEffect, useState } from "react";

export default function CountdownTimer({ seconds }: { seconds: number }) {
  const [countdown, setCountdown] = useState<number>(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 0) {
          return prevCountdown - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <p className="text-2xl font-bold mb-4">Time Remaining</p>
      <p>{countdown}s</p>
    </div>
  );
}
