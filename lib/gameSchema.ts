import { z } from "zod";

const gameSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  questionCount: z.number().min(2, {
    message: "Question count must be at least 2.",
  }),
});

export default gameSchema;
