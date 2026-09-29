import z from "zod";

export const updateProductStockSchema = z.object({
    quantity: z.number().int()
})

export type UpdateProductStockType = z.infer<typeof updateProductStockSchema>