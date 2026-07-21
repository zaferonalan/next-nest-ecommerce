import z from "zod";
import { appSchema } from "./app-env.schema.js";
import { databaseSchema } from "./database-env.schema.js";
import { jwtEnvSchema } from "./jwt-env.js";
import { refreshEnvSchema } from "./refresh-env.js";

export const mergedEnvSchema = z.object({
    ...appSchema.shape,
    ...databaseSchema.shape,
    ...jwtEnvSchema.shape,
    ...refreshEnvSchema.shape
})

export type AppEnv = z.infer<typeof mergedEnvSchema>