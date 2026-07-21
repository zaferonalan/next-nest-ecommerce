import z from "zod";

export const refreshEnvSchema = z.object({
    JWT_REFRESH_SECRET: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.string() 
})

export type RefreshEnv = z.infer<typeof refreshEnvSchema>