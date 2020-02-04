import { ActionLinkModel } from './action-link-model';
import { CurrentUserModel } from './current-user-model';
import { AllMenuModel } from './all-menu-model';
import { LogoModel } from '../logo/logo-model';

export interface NavbarModel {
  authenticated: boolean;
  logo: LogoModel;
  useGroupTabs: boolean;
  globalActions: Array<ActionLinkModel>;
  currentUser: CurrentUserModel;
  all: AllMenuModel;
  menu: any;
  buildMenu(items: any, menuItemThreshold: number): void;
}
