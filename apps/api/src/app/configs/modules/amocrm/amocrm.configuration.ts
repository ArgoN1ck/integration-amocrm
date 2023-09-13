import { AmocrmConfiguration } from './amocrm-configuration.type';

export const getAmocrmConfig = (): AmocrmConfiguration => ({
  amocrm: {
    baseUrl: process.env.AMOCRM_BASE_URL,
    secret: process.env.AMOCRM_SECRET,
    integrationId: process.env.AMOCRM_INTEGRATION_ID,
    redirectUrl: process.env.AMOCRM_REDIRECT_URL,
  },
});
