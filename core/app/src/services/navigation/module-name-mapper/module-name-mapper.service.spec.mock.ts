import {SystemConfigFacade} from '@base/store/system-config/system-config.facade';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';

export const moduleNameMapperMockData = {
    Accounts: 'accounts',
    Bugs: 'bugs',
    Calendar: 'calendar',
    Calls: 'calls',
    Campaigns: 'campaigns',
    Cases: 'cases',
    Contacts: 'contacts',
    Documents: 'documents',
    // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
    AOW_WorkFlow: 'workflow'
};

export const moduleNameMapperMock = new ModuleNameMapper({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getConfigValue: (configKey) => moduleNameMapperMockData
} as SystemConfigFacade);
