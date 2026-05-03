/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsBoolean,
  IsInt,
  IsOptional,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateGymOperatingHourDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  openTime?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  closeTime?: string;

  @IsOptional()
  @IsBoolean()
  isClosed?: boolean;
}
