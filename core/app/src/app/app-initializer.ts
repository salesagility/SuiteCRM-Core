import {Injectable} from '@angular/core';
import {ListComponent} from '@views/list/components/list-view/list.component';
import {Router} from '@angular/router';
import {AuthGuard} from '@services/auth/auth-guard.service';
import {BaseModuleResolver} from '@services/metadata/base-module.resolver';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {RecordComponent} from '@views/record/components/record-view/record.component';
import {BaseRecordResolver} from '@services/metadata/base-record.resolver';
import {LoginAuthGuard} from '@services/auth/login-auth-guard.service';
import {BaseMetadataResolver} from '@services/metadata/base-metadata.resolver';
import {ClassicViewUiComponent} from '@views/classic/components/classic-view/classic-view.component';
import {ClassicViewResolver} from '@views/classic/services/classic-view.resolver';

@Injectable()
export class AppInit {

    constructor(private router: Router, protected systemConfigStore: SystemConfigStore) {
    }

    init(): Promise<void> {
        // eslint-disable-next-line compat/compat
        return new Promise<void>((resolve) => {
            this.systemConfigStore.load().subscribe(() => {
                const routes = this.router.config;
                const configRoutes = this.systemConfigStore.getConfigValue('module_routing');

                routes.push({
                    path: 'Login',
                    loadChildren: () => import('../../views/login/components/login/login.module').then(m => m.LoginUiModule),
                    canActivate: [LoginAuthGuard],
                    runGuardsAndResolvers: 'always',
                    resolve: {
                        metadata: BaseMetadataResolver
                    },
                    data: {
                        reuseRoute: false,
                        load: {
                            navigation: false,
                            preferences: false,
                            languageStrings: ['appStrings']
                        }
                    }
                });

                Object.keys(configRoutes).forEach(routeName => {
                    if (configRoutes[routeName].index) {
                        routes.push({
                            path: routeName,
                            component: ListComponent,
                            canActivate: [AuthGuard],
                            runGuardsAndResolvers: 'always',
                            resolve: {
                                metadata: BaseModuleResolver
                            },
                            data: {
                                reuseRoute: false,
                                checkSession: true,
                                module: routeName
                            }
                        });
                        routes.push({
                            path: routeName + '/index',
                            component: ListComponent,
                            canActivate: [AuthGuard],
                            runGuardsAndResolvers: 'always',
                            resolve: {
                                metadata: BaseModuleResolver
                            },
                            data: {
                                reuseRoute: false,
                                checkSession: true,
                                module: routeName
                            }
                        });
                    }

                    if (configRoutes[routeName].list) {
                        routes.push({
                            path: routeName + '/list',
                            component: ListComponent,
                            canActivate: [AuthGuard],
                            runGuardsAndResolvers: 'always',
                            resolve: {
                                metadata: BaseModuleResolver
                            },
                            data: {
                                reuseRoute: false,
                                checkSession: true,
                                module: routeName
                            }
                        });
                    }

                    if (configRoutes[routeName].record) {
                        routes.push({
                            path: routeName + '/record/:record',
                            component: RecordComponent,
                            canActivate: [AuthGuard],
                            runGuardsAndResolvers: 'always',
                            resolve: {
                                view: BaseModuleResolver,
                                metadata: BaseRecordResolver
                            },
                            data: {
                                reuseRoute: false,
                                checkSession: true,
                                module: routeName
                            }
                        });
                        routes.push({
                            path: routeName + '/edit/:record',
                            component: RecordComponent,
                            canActivate: [AuthGuard],
                            runGuardsAndResolvers: 'always',
                            resolve: {
                                view: BaseModuleResolver,
                                metadata: BaseRecordResolver
                            },
                            data: {
                                reuseRoute: false,
                                checkSession: true,
                                module: routeName
                            }
                        });
                        routes.push({
                            path: routeName + '/detail/:record',
                            component: RecordComponent,
                            canActivate: [AuthGuard],
                            runGuardsAndResolvers: 'always',
                            resolve: {
                                view: BaseModuleResolver,
                                metadata: BaseRecordResolver
                            },
                            data: {
                                reuseRoute: false,
                                checkSession: true,
                                module: routeName
                            }
                        });
                    }
                });

                routes.push({
                    path: ':module',
                    component: ClassicViewUiComponent,
                    canActivate: [AuthGuard],
                    runGuardsAndResolvers: 'always',
                    resolve: {
                        legacyUrl: ClassicViewResolver,
                    },
                    data: {
                        reuseRoute: false,
                        checkSession: true
                    }
                });

                routes.push({
                    path: ':module/:action',
                    component: ClassicViewUiComponent,
                    canActivate: [AuthGuard],
                    runGuardsAndResolvers: 'always',
                    resolve: {
                        legacyUrl: ClassicViewResolver,
                    },
                    data: {
                        reuseRoute: false,
                        checkSession: true
                    }
                });

                routes.push({
                    path: ':module/:action/:record',
                    component: ClassicViewUiComponent,
                    canActivate: [AuthGuard],
                    runGuardsAndResolvers: 'always',
                    resolve: {
                        legacyUrl: ClassicViewResolver,
                    },
                    data: {
                        reuseRoute: false,
                        checkSession: true
                    }
                });

                routes.push({
                    path: '**',
                    redirectTo: 'Login'
                });

                routes.push({
                    path: '',
                    component: ClassicViewUiComponent
                });

                this.router.resetConfig(routes);
                resolve();
            });
        });
    }
}
