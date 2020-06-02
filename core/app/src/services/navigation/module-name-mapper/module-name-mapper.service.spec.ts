import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {moduleNameMapperMock} from '@services/navigation/module-name-mapper/module-name-mapper.service.spec.mock';

describe('Module Name Mapper Service', () => {
    const service: ModuleNameMapper = moduleNameMapperMock;

    beforeEach(() => {
    });

    it('#toFrontend with valid module name', () => {
        const action = service.toFrontend('AOW_WorkFlow');
        expect(action).toEqual('workflow');
    });

    it('#toFrontend with invalid module name', () => {
        const action = service.toFrontend('fake');
        expect(action).toEqual(undefined);
    });

    it('#toLegacy with valid module name', () => {
        const action = service.toLegacy('workflow');
        expect(action).toEqual('AOW_WorkFlow');
    });

    it('#toLegacy with invalid module name', () => {
        const action = service.toLegacy('fake');
        expect(action).toEqual(undefined);
    });

    it('#isValid with valid module name', () => {
        const action = service.isValid('workflow');
        expect(action).toEqual(true);

    });

    it('#isValid with invalid module name', () => {
        const fakeAction = service.isValid('fake');
        expect(fakeAction).toEqual(false);
    });
});

