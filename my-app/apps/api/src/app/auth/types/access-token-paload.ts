import { Role } from "@org/database"

export type AccessTokenPayload = {
    sub: string,
    role: Role
}