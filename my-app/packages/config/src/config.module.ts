import { Module } from '@nestjs/common';
import { ConfigModule as NestConfig } from "@nestjs/config";
import { AppEnv, mergedEnvSchema } from '@org/schemas';

@Module({
  imports: [
    NestConfig.forRoot({
        isGlobal: true,
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
  exports: []
})
export class ConfigModule {}
