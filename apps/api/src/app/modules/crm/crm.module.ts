import { AmocrmModule } from '@integration-amo-crm/amocrm';
import { Module } from '@nestjs/common';

import { AmocrmConfigService } from '../../configs';
import { CrmController } from './crm.controller';

@Module({
  imports: [
    AmocrmModule.forRootAsync({
      useClass: AmocrmConfigService,
    }),
  ],
  controllers: [CrmController],
})
export class CrmModule {}
