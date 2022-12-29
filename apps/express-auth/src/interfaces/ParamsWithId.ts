import * as z from 'zod'

export const paramsWithIdSchema = z.object({
  id: z.string().min(1, 'Invalid id'),
})

export type ParamsWithId = z.infer<typeof paramsWithIdSchema>
