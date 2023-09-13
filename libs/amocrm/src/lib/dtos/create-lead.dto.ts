import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateLeadDto {
  @ApiProperty()
  @IsNotEmpty()
  contactId: number;

  @ApiProperty()
  @IsNotEmpty()
  price: number;
}
