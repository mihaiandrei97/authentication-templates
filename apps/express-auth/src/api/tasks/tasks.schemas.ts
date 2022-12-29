import * as z from 'zod'

export const taskSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  favourite: z.boolean(),
})

export type TaskInput = z.infer<typeof taskSchema>
