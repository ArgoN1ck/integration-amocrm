import {
  AmocrmService,
  CreateContactDto,
  CreateLeadDto,
  GetContactDto,
  MakeLeadDto,
} from '@integration-amo-crm/amocrm';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CrmCodeDto } from './dtos';

@Controller('crm')
export class CrmController {
  constructor(private readonly amoCrmService: AmocrmService) {}

  @Get()
  getContact(@Query() getContactDto: GetContactDto) {
    return this.amoCrmService.getContact(getContactDto);
  }

  @Get('redirect')
  redirect(@Query() crmCodeDto: CrmCodeDto) {
    const { code } = crmCodeDto;

    return this.amoCrmService.setCode(code);
  }

  @Get('contacts')
  getContacts(@Query() getContactDto: GetContactDto) {
    return this.amoCrmService.getContact(getContactDto);
  }

  @Post('contact')
  createContact(@Body() createContactDto: CreateContactDto) {
    return this.amoCrmService.createContact(createContactDto);
  }

  @Post('lead')
  createLead(@Body() createLeadDto: CreateLeadDto) {
    return this.amoCrmService.createLead(createLeadDto);
  }

  @Post('make-lead')
  makeLead(@Body() makeLeadDto: MakeLeadDto) {
    return this.amoCrmService.makeLead(makeLeadDto);
  }
}
