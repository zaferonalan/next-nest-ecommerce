import z from "zod";
import { createProductSchema } from "./create-products.schema.js";

export const updateProductSchema = createProductSchema.partial()

export type UpdateProductType = z.infer<typeof updateProductSchema>