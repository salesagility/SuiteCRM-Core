import {ActionNameMapper} from '@services/navigation/action-name-mapper/action-name-mapper.service';
import {SystemConfigStore} from '@store/system-config/system-config.store';

export const actionNameMapperMockData = {
    Authenticate: 'authenticate',
    CampaignDiagnostic: 'diagnostic',
    ComposeView: 'compose',
    DetailView: 'record',
    EditView: 'edit',
    ImportVCard: 'importvcard',
    ListView: 'list',
    Login: 'login',
    Popup: 'popup',
    ResourceList: 'resource-list',
    Step1: 'step1',
    WebToLeadCreation: 'web-to-lead',
    WizardEmailSetup: 'wizard-email-setup',
    WizardHome: 'wizard-home',
    favorites: 'favorites',
    index: 'index',
    modulelistmenu: 'modulelistmenu',
    multieditview: 'multieditview',
    noaccess: 'noaccess',
    // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
    quick_radius: 'quick-radius',
    vcard: 'vcard',
};

export const actionNameMapperMock = new ActionNameMapper({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getConfigValue: (configKey) => actionNameMapperMockData
} as SystemConfigStore);
