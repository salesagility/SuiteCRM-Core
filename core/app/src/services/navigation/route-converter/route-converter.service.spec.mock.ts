import {RouteConverter} from '@services/navigation/route-converter/route-converter.service';
import {moduleNameMapperMock} from '@services/navigation/module-name-mapper/module-name-mapper.service.spec.mock';
import {actionNameMapperMock} from '@services/navigation/action-name-mapper/action-name-mapper.service.spec.mock';

export const routeConverterMock = new RouteConverter(moduleNameMapperMock, actionNameMapperMock);
