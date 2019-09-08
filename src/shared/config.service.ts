import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import * as fs from 'fs';

export interface EnvConfig {
  [key: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production'])
        .default('development'),
      PORT: Joi.number().default(3030),
      JWT_SECRET: Joi.string().required(),
      GOOGLE_OAUTH_CLIENT_ID: Joi.string().required(),
      GOOGLE_OAUTH_SECRET_KEY: Joi.string().required(),
    });
    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
      { stripUnknown: true },
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get port(): number {
    return Number(this.envConfig.PORT);
  }

  get isProduction(): boolean {
    return this.envConfig.NODE_ENV === 'production';
  }

  get jwtSecret(): string {
    return this.envConfig.JWT_SECRET;
  }

  get googleOAuthClientID(): string {
    return this.envConfig.GOOGLE_OAUTH_CLIENT_ID;
  }

  get googleOAuthSecretKey(): string {
    return this.envConfig.GOOGLE_OAUTH_SECRET_KEY;
  }
}
