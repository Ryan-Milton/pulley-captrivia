import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ThemeSwitch";
import { player } from "@/state/atom";
import { useRecoilValue } from "recoil";

export default function Navbar() {
  const currentPlayer = useRecoilValue(player);
  const router = useRouter();
  return (
    <nav className="flex items-center justify-between p-4">
      <div className="flex flex-1 gap-2 items-center">
        {currentPlayer && (
          <>
            <Button
              variant="outline"
              onClick={() => {
                router.push("/");
              }}
            >
              Home
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                router.push("/games");
              }}
            >
              Games
            </Button>
          </>
        )}
      </div>
      <div>
        <ModeToggle />
      </div>
    </nav>
  );
}
