import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {NavigationExtras, Router} from '@angular/router';

const mockRouter = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    navigate: (commands: any[], extras?: NavigationExtras) => null
} as Router;
export const mockModuleNavigation = new ModuleNavigation(mockRouter);
