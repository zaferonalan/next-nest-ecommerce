import { Module } from '@nestjs/common';
import { ConfigModule as NestConfig } from "@nestjs/config";
import { AppEnv, mergedEnvSchema } from '@org/schemas';
import jwtConfig from './jwt.config.js';
import refreshConfig from './refresh.config.js';

@Module({
  imports: [
    NestConfig.forRoot({
        isGlobal: true,
        load: [jwtConfig, refreshConfig],
        validate(config):AppEnv {
            const result = mergedEnvSchema.safeParse(config)

            if (!result.success) {
                throw new Error("Invalid enviroment varible")
            }

            return result.data
        }
    })
  ],
  controllers: [],
  providers: [],
  exports: [NestConfig]
})
export class ConfigModule {}
