import z from "zod";
import { createCategorySchema } from "./create-category.schema.js";

export const updateCategorySchema = createCategorySchema.partial()

export type UpdateCategoryType = z.infer<typeof updateCategorySchema>