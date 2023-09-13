export { AmocrmConfigService } from './modules/amocrm';
export * from './pipes';

import { getAmocrmConfig } from './modules/amocrm/amocrm.configuration';

export const configLoad = [getAmocrmConfig];
