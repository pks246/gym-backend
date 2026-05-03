/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateGymAmenityDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
