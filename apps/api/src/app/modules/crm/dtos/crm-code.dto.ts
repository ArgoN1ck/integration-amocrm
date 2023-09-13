import { ApiProperty } from '@nestjs/swagger';

export class CrmCodeDto {
  @ApiProperty()
  code: string;
}
