"use server";

import { player } from "@/state/atom";
import { useRecoilValue } from "recoil";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createPost(id: string) {
  const playerName = useRecoilValue(player);
  if (!playerName) {
    return redirect(`/`);
  }
}
