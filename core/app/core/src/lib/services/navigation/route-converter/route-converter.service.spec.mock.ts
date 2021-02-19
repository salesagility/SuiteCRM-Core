import {RouteConverter} from './route-converter.service';
import {moduleNameMapperMock} from '../module-name-mapper/module-name-mapper.service.spec.mock';
import {actionNameMapperMock} from '../action-name-mapper/action-name-mapper.service.spec.mock';

export const routeConverterMock = new RouteConverter(moduleNameMapperMock, actionNameMapperMock);
