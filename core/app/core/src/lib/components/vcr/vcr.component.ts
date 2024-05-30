/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2024 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {PaginationCount, PageSelection, PaginationType, ObjectMap, ViewMode, ModalButtonInterface} from "common";
import {combineLatestWith, Observable, Subscription} from "rxjs";
import {filter, map, tap} from "rxjs/operators";
import {toNumber} from "lodash-es";
import {ImageModule} from "../image/image.module";
import {ModuleNavigation} from "../../services/navigation/module-navigation/module-navigation.service";
import {ModuleNameMapper} from "../../services/navigation/module-name-mapper/module-name-mapper.service";
import {LanguageStore, LanguageStringMap} from "../../store/language/language.store";
import {RecordViewStore} from "../../views/record/store/record-view/record-view.store";
import {SystemConfigStore} from "../../store/system-config/system-config.store";
import {MessageModalComponent} from "../modal/components/message-modal/message-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {VcrStore} from "../../views/record/store/vcr/vcr.store";
import {VcrService} from "../../views/record/store/vcr/vcr.service";
import {UserPreferenceStore} from "../../store/user-preference/user-preference.store";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";

export interface VcrViewModel {
    appStrings: LanguageStringMap;
    pageCount: PaginationCount;
    vcrEnabled: boolean;
}

@Component({
    selector: 'scrm-vcr',
    templateUrl: './vcr.component.html',
    styles: [],
    standalone: true,
    imports: [CommonModule, ImageModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VcrComponent implements OnInit, OnDestroy {

    currentIndex: number = 1;
    currentPage: number = 1;
    pageSize: number = 20;
    totalRecordsCount: number = 0;
    isRecordsLoading: boolean = false;
    isSaveContinueClicked: boolean = false;
    mode: ViewMode = 'detail' as ViewMode;
    paginationType: string = PaginationType.PAGINATION;
    recordIds: ObjectMap[];
    subs: Subscription[] = [];

    appStrings$: Observable<LanguageStringMap> = this.languageStore.appStrings$;
    recordIds$: Observable<ObjectMap[]> = this.vcrStore.recordIds$;
    mode$: Observable<ViewMode> = this.recordViewStore.mode$;
    vm$: Observable<VcrViewModel> = null;

    constructor(
        private systemConfigStore: SystemConfigStore,
        private preferences: UserPreferenceStore,
        private localStorageService: LocalStorageService,
        private languageStore: LanguageStore,
        private navigation: ModuleNavigation,
        private nameMapper: ModuleNameMapper,
        private recordViewStore: RecordViewStore,
        private vcrStore: VcrStore,
        private vcrService: VcrService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal
    ) {
        this.subs.push(this.route.queryParamMap
            .subscribe((params: any) => {
                this.currentIndex = toNumber(params.get('offset'));
            })
        );
    }

    ngOnInit(): void {
        this.vcrStore.init();
        this.currentPage = this.vcrStore.getCurrentPage();
        this.pageSize = this.vcrStore.getPageSize();
        this.totalRecordsCount = this.vcrStore.getRecordsCount();
        this.paginationType= this.preferences.getUserPreference('listview_pagination_type') ?? this.systemConfigStore.getConfigValue('listview_pagination_type');
        this.vcrService.paginationType = this.paginationType;
        this.subs.push(this.mode$.subscribe(mode => {
            this.mode = mode;
        }));

        this.vm$ = this.appStrings$.pipe(
            combineLatestWith(this.vcrStore.pagination$, this.vcrStore.vcrEnabled$),
            map(([appStrings, pageCount, vcrEnabled]: [LanguageStringMap, PaginationCount, boolean]) => {
                const module = this.nameMapper.toFrontend(this.vcrStore.getModule()) ?? '';
                const key = module + '-' + 'recordview-current-vcr';
                const isVcrExist = this.localStorageService.get(key);
                const isRecordValid = this.vcrService.checkRecordValid(this.recordViewStore.getRecordId());

                if (!isVcrExist || !isRecordValid || (this.currentIndex > this.totalRecordsCount)) {
                    vcrEnabled = false;
                }
                return { appStrings, pageCount, vcrEnabled };
            })
        );

        this.subs.push(this.recordIds$.subscribe(recordIds => {
            this.recordIds = recordIds;
        }));

        this.subs.push(this.vcrService.nextRecord$.pipe(
            filter(data => {
                if (!data) {
                    return false;
                }
                return true;
            }),
            tap((data) => {
                this.isSaveContinueClicked = true;
                this.nextRecord();
            })
        ).subscribe((data) => {
            this.isSaveContinueClicked = false;
            this.vcrService.triggerNextRecord(false);

        }));
    }

    ngOnDestroy() : void {
        this.subs.forEach(sub => sub.unsubscribe());
        this.vcrStore.clear();
    }

    prevRecord(): void {
        if (this.currentIndex <= 0) {
            return;
        }

        let nextRecordIndex = (this.currentIndex - 2) % this.pageSize;
        let nextPageThreshold = this.currentIndex - ((this.currentPage - 1) * this.pageSize) - 1;

        if (nextPageThreshold <= 0) {
            this.loadPage(PageSelection.PREVIOUS);
        } else {
            if (this.mode === 'edit' && this.recordViewStore.recordStore.isDirty()) {
                this.showConfirmationModal(PageSelection.PREVIOUS, nextRecordIndex);
            } else {
                this.navigatePrevRoute(nextRecordIndex);
            }
        }
    }

    nextRecord(): void {
        if (this.currentIndex >= this.totalRecordsCount) {
            return;
        }

        let nextRecordIndex = this.currentIndex % this.pageSize;
        let nextPageThreshold = this.currentIndex - ((this.currentPage - 1) * this.pageSize);

        if (nextPageThreshold > this.recordIds.length -1) {
            this.loadPage(PageSelection.NEXT);
        } else {
            if (this.mode === 'edit' && this.recordViewStore.recordStore.isDirty() && !this.isSaveContinueClicked) {
                this.showConfirmationModal(PageSelection.NEXT, nextRecordIndex);
            } else {
                this.navigateNextRoute(nextRecordIndex);
            }
        }
    }

    protected loadPage(direction: PageSelection): void {
        this.isRecordsLoading = true;
        let nextRecordIndex = 0;
        if (direction === PageSelection.PREVIOUS) {
            nextRecordIndex = this.pageSize - 1;
        } else if (direction === PageSelection.NEXT && this.paginationType === PaginationType.LOAD_MORE) {
            nextRecordIndex = this.currentIndex;
        }

        if (this.paginationType === PaginationType.LOAD_MORE && direction !== PageSelection.PREVIOUS ) {
            const jump = this.preferences.getUserPreference('list_max_entries_per_page') ?? this.systemConfigStore.getConfigValue('list_max_entries_per_page');
            const pagination = this.vcrStore.recordListStore.getPagination();
            const currentPageSize = pagination.pageSize || 0;
            const newPageSize = Number(currentPageSize) + Number(jump);

            this.vcrStore.recordListStore.setPageSize(newPageSize);
            this.vcrStore.recordListStore.updatePagination(pagination.current);
        }


        this.vcrStore.recordListStore.setPage(direction as PageSelection).subscribe(data => {
            this.vcrService.updateRecordListLocalStorage(data.records, data.pagination);
            this.vcrStore.loadDataLocalStorage();
            this.isRecordsLoading = false;
            if (this.mode === 'edit' && this.recordViewStore.recordStore.isDirty() && !this.isSaveContinueClicked) {
                this.showConfirmationModal(direction, nextRecordIndex);
            } else {
                direction === PageSelection.NEXT ? this.navigateNextRoute(nextRecordIndex) : this.navigatePrevRoute(nextRecordIndex);
            }
        });
    }

    protected navigateNextRoute(nextRecordIndex: number): void {
        const nextRoute = this.buildRoute(this.recordIds[nextRecordIndex]);
        this.router.navigate([nextRoute], { queryParams: { offset: this.currentIndex + 1 }});
    }

    protected navigatePrevRoute(nextRecordIndex: number): void {
        const nextRoute = this.buildRoute(this.recordIds[nextRecordIndex]);
        this.router.navigate([nextRoute], { queryParams: { offset: this.currentIndex - 1 }});
    }

    protected showConfirmationModal(direction: PageSelection, nextRecordIndex: number): void {
        const modal = this.modalService.open(MessageModalComponent);

        modal.componentInstance.textKey = 'WARN_UNSAVED_CHANGES';
        modal.componentInstance.buttons = [
            {
                labelKey: 'LBL_CANCEL',
                klass: ['btn-secondary'],
                onClick: activeModal => activeModal.dismiss()
            } as ModalButtonInterface,
            {
                labelKey: 'LBL_PROCEED',
                klass: ['btn-main'],
                onClick: activeModal => {
                    direction === PageSelection.NEXT ? this.navigateNextRoute(nextRecordIndex) : this.navigatePrevRoute(nextRecordIndex);
                    activeModal.close();
                }
            } as ModalButtonInterface
        ];
    }

    protected buildRoute(recordId: ObjectMap): string {
        const module = this.nameMapper.toFrontend(this.vcrStore.getModule()) ?? '';
        const id = recordId.id ?? '';
        const isEdit = this.mode === 'edit';
        return this.navigation.getRecordRouterLink(module, id, isEdit);
    }
}
