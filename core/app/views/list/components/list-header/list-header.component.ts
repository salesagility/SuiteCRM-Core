import {Component} from '@angular/core';
import {ListViewStore} from '@views/list/store/list-view/list-view.store';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {FilterAdapter} from '@views/list/adapters/filter.adapter';

@Component({
    selector: 'scrm-list-header',
    templateUrl: 'list-header.component.html',
    providers: [FilterAdapter],
})
export class ListHeaderComponent {

    displayResponsiveTable = false;

    constructor(
        public filterAdapter: FilterAdapter,
        protected listStore: ListViewStore,
        protected moduleNavigation: ModuleNavigation) {
    }

    get showFilters(): boolean {
        return this.listStore.showFilters;
    }

    get moduleTitle(): string {
        const module = this.listStore.vm.appData.module;
        const appListStrings = this.listStore.vm.appData.language.appListStrings;
        return this.moduleNavigation.getModuleLabel(module, appListStrings);
    }

}
