import { ModuleMetadata, Type } from '@nestjs/common';

import { AmocrmModuleOptions } from './amocrm-module.options';
import { AmocrmModuleOptionsFactory } from './amocrm-module.options-factory';

export interface AmocrmModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useClass?: Type<AmocrmModuleOptionsFactory>;
  useExisting?: Type<AmocrmModuleOptionsFactory>;
  useFactory?: (
    ...args: any
  ) => Promise<AmocrmModuleOptions> | AmocrmModuleOptions;
  inject?: any[];
}
