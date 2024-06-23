import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  return (
    <nav className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <Button
          onClick={() => {
            router.push("/");
          }}
        >
          Home
        </Button>
        <Button
          onClick={() => {
            router.push("/games");
          }}
        >
          Games
        </Button>
      </div>
    </nav>
  );
}
