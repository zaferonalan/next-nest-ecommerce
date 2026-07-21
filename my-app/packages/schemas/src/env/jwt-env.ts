import z from "zod";

export const jwtEnvSchema = z.object({
    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_ACCESS_EXPIRES_IN: z.string()
})

export type JwtEnv = z.infer<typeof jwtEnvSchema>