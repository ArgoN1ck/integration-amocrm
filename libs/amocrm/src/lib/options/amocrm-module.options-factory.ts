import { AmocrmModuleOptions } from './amocrm-module.options';

export interface AmocrmModuleOptionsFactory {
  createAmocrmModuleOptions: () =>
    | Promise<AmocrmModuleOptions>
    | AmocrmModuleOptions;
}
