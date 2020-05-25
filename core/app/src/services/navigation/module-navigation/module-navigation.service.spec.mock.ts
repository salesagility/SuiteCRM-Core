import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {NavigationExtras, Router, UrlTree} from '@angular/router';

const mockRouter = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    navigateByUrl: (url: string | UrlTree, extras?: NavigationExtras) => {
        return null;
    }
} as Router;
export const mockModuleNavigation = new ModuleNavigation(mockRouter);
