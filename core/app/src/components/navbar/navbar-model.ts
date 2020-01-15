import { ActionLinkModel } from './action-link-model';
import { CurrentUserModel } from './current-user-model';
import { AllMenuModel } from './all-menu-model';
import { LogoModel } from '../logo/logo-model';
import { SvgFilenameMapModel } from '../svg-icon/svg-filename-map-model';

export interface NavbarModel {
  svgFilenameMaps: SvgFilenameMapModel[];
  authenticated: boolean;
  logo: LogoModel;
  useGroupTabs: boolean;
  globalActions: Array<ActionLinkModel>;
  currentUser: CurrentUserModel;
  all: AllMenuModel;
  menu: any;
}
