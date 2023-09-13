import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EnvSchema {
  @IsString()
  @IsNotEmpty()
  NODE_ENV: string;

  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  HOST: string;

  @IsString()
  @IsNotEmpty()
  AMOCRM_SECRET: string;

  @IsNotEmpty()
  @IsString()
  AMOCRM_BASE_URL: string;
}
