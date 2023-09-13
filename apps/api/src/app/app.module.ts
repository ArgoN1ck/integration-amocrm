import { EventloopFrozenDetectorModule } from '@argotools/eventloop-frozen-detector';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configLoad, validateConfig } from './configs';
import { CrmModule } from './modules/crm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configLoad,
      validate: validateConfig,
    }),

    EventloopFrozenDetectorModule.forRoot({
      delay: 3000,
    }),

    CrmModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
