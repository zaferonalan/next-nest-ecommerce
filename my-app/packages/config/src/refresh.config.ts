import { registerAs } from "@nestjs/config";
import { StringValue } from "ms";

export default registerAs('refreshJwt', () => ({
    secret: process.env.JWT_REFRESH_SECRET!,
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as StringValue
}))