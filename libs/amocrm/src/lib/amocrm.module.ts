import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import { AMOCRM_MODULE_OPTIONS } from './amocrm.constants';
import { AmocrmService } from './amocrm.service';
import {
  AmocrmModuleAsyncOptions,
  AmocrmModuleOptions,
  AmocrmModuleOptionsFactory,
} from './options';

@Global()
@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AmocrmModule {
  static forRoot(options: AmocrmModuleOptions): DynamicModule {
    return {
      module: AmocrmModule,
      providers: [
        {
          provide: AMOCRM_MODULE_OPTIONS,
          useValue: options,
        },
        AmocrmService,
      ],
      exports: [AmocrmService],
    };
  }

  static forRootAsync(options: AmocrmModuleAsyncOptions): DynamicModule {
    const providers: Array<Provider> = [];

    if (options.useFactory) {
      providers.push({
        inject: options.inject || [],
        provide: AMOCRM_MODULE_OPTIONS,
        useFactory: options.useFactory,
      });
    } else {
      if (options.useClass || options.useExisting) {
        providers.push({
          inject: [options.useClass || options.useExisting] as any,
          provide: AMOCRM_MODULE_OPTIONS,
          useFactory: (factory: AmocrmModuleOptionsFactory) =>
            factory.createAmocrmModuleOptions(),
        });

        if (options.useClass) {
          providers.push({
            useClass: options.useClass,
            provide: options.useClass,
          });
        }
      } else {
        throw new Error(
          '[AmocrmModule] one of the options (useClass, useExisting, useFactory) must be provided'
        );
      }
    }

    providers.push(AmocrmService);

    return {
      module: AmocrmModule,
      imports: options.imports || [],
      providers,
      exports: [AmocrmService],
    };
  }
}
