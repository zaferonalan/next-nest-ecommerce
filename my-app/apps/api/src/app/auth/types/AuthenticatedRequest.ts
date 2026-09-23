import { AuthUser } from "@org/schemas"
import { Request } from "express";

export type AuthenticatedRequest = Request & {
    user: AuthUser
}