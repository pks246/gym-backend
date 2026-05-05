import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsInt()
  @Min(1)
  memberId!: number;

  @IsInt()
  @Min(1)
  planId!: number;

  @IsOptional()
  @IsString()
  @Matches(/^(active|paused|cancelled|expired)$/)
  status?: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1500)
  notes?: string;
}
