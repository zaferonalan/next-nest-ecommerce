import { registerAs } from "@nestjs/config";
import { StringValue } from "ms";


export default registerAs('jwt', () => ({
    secret: process.env.JWT_ACCESS_SECRET!,
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as StringValue
}))