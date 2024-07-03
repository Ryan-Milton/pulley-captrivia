import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import playerSchema from "@/lib/playerSchema";
import { player } from "@/state/atom";
import { useRecoilState } from "recoil";
import { openPlayerModal } from "@/state/atom";
import { useRouter } from "next/navigation";

interface NewPlayerModalProps {
  isOpen: boolean;
}

export default function NewPlayerModal({ isOpen }: NewPlayerModalProps) {
  const [currentPlayer, setCurrentPlayer] = useRecoilState(player);
  const [openModal, setOpenModal] = useRecoilState(openPlayerModal);
  const router = useRouter();
  const form = useForm<z.infer<typeof playerSchema>>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: "",
    },
  });
  function onSubmit(data: z.infer<typeof playerSchema>) {
    setCurrentPlayer(data.name);
    router.push("/games");
    setOpenModal(false);
  }
  return (
    <Dialog open={isOpen} onOpenChange={setOpenModal}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="items-center">
          <DialogTitle className="text-2xl">Who are you?</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-8 items-center"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Let's Play!
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
