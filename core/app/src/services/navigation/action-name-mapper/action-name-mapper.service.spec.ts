import {ActionNameMapper} from '@services/navigation/action-name-mapper/action-name-mapper.service';
import {actionNameMapperMock} from '@services/navigation/action-name-mapper/action-name-mapper.service.spec.mock';

describe('Action Name Mapper Service', () => {
    const service: ActionNameMapper = actionNameMapperMock;

    beforeEach(() => {
    });

    it('#toFrontend with valid action name', () => {
        const action = service.toFrontend('DetailView');

        expect(action).toEqual('record');
    });

    it('#toFrontend with invalid action name', () => {
        const action = service.toFrontend('fake');

        expect(action).toEqual(undefined);
    });

    it('#toLegacy with valid action name', () => {
        const action = service.toLegacy('record');

        expect(action).toEqual('DetailView');
    });

    it('#toLegacy with invalid action name', () => {
        const action = service.toLegacy('fake');

        expect(action).toEqual(undefined);
    });

    it('#isValid with valid action name', () => {
        const action = service.isValid('record');

        expect(action).toEqual(true);

    });

    it('#isValid with invalid action name', () => {
        const fakeAction = service.isValid('fake');

        expect(fakeAction).toEqual(false);
    });
});
