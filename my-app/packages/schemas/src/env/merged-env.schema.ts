import z from "zod";
import { appSchema } from "./app-env.schema.js";
import { databaseSchema } from "./database-env.schema.js";

export const mergedEnvSchema = z.object({
    ...appSchema.shape,
    ...databaseSchema.shape
})

export type AppEnv = z.infer<typeof mergedEnvSchema>