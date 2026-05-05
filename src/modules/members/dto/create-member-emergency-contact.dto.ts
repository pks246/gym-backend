import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateMemberEmergencyContactDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  relationship!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/^[0-9+\-()\s]+$/)
  phoneNumber!: string;
}
