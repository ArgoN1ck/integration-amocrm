import {
  AmocrmModuleOptions,
  AmocrmModuleOptionsFactory,
} from '@integration-amo-crm/amocrm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AmocrmConfiguration } from './amocrm-configuration.type';

@Injectable()
export class AmocrmConfigService implements AmocrmModuleOptionsFactory {
  constructor(
    private readonly configService: ConfigService<AmocrmConfiguration>
  ) {}

  createAmocrmModuleOptions(): AmocrmModuleOptions {
    const { baseUrl, secret, integrationId, redirectUrl } =
      this.configService.get('amocrm');

    return {
      integrationId,
      baseUrl,
      secret,
      redirectUrl,
    };
  }
}
