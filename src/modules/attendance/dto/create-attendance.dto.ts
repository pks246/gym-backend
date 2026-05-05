import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAttendanceDto {
  @IsInt()
  @Min(1)
  memberId!: number;

  @IsDateString()
  attendedOn!: string;

  @IsDateString()
  checkInAt!: string;

  @IsOptional()
  @IsDateString()
  checkOutAt?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(front-desk|kiosk|mobile|staff)$/)
  source?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
