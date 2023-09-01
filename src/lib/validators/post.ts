import { z } from 'zod'

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: 'title must be longer than 3 characters' })
    .max(21, { message: 'title cannot be longer than 21 characters' }),
  subredditId: z.string(),
  content: z.any(),
})

export type PostCreationRequest = z.infer<typeof PostValidator>
