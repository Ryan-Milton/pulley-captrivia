"use client";
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
import gameSchema from "@/lib/gameSchema";
import { game } from "@/state/atom";
import { useRecoilState, useRecoilValue } from "recoil";
import { gameModalOpen, createGameError } from "@/state/atom";
import { useRouter } from "next/navigation";
import { api } from "@/api";
import { useState } from "react";

interface NewGameModalProps {
  isOpen: boolean;
}

export default function NewGameModal({ isOpen }: NewGameModalProps) {
  const [currentGame, setCurrentGame] = useRecoilState(game);
  const [openModal, setOpenModal] = useRecoilState(gameModalOpen);
  const [gameError, setGameError] = useRecoilState(createGameError);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof gameSchema>>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      name: "",
      questionCount: 0,
    },
  });
  function onSubmit(data: z.infer<typeof gameSchema>) {
    console.log("create game data -> ", data);
    setCurrentGame(data);
    createGame(data.name, data.questionCount);
  }
  const createGame = async (gameName: string, questionCount: number) => {
    try {
      setIsLoading(true);
      await api.createGame(gameName, questionCount);
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating game:", error);
      setGameError("Failed to create game: " + error.message);
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setOpenModal}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="items-center">
          <DialogTitle className="text-2xl">Create Game</DialogTitle>
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
                    <Input placeholder="Game Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="questionCount"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Question Count</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="How many questions?"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-1/2">
              Create Game
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
