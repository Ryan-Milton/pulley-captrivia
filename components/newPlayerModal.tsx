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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new user</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new user.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name..." {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
