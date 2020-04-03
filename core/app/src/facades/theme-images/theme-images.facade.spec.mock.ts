import {BehaviorSubject, Observable, of} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {ThemeImages, ThemeImagesFacade} from '@base/facades/theme-images/theme-images.facade';
import {RecordGQL} from '@services/api/graphql-api/api.record.get';
import {appStateFacadeMock} from '@base/facades/app-state/app-state.facade.spec.mock';
import {AppStateFacade} from '@base/facades/app-state/app-state.facade';

export const themeImagesMockData = {
    bgOcher: {
        path: 'legacy/themes/default/images/bgOcher.gif',
        name: 'bgOcher',
        type: 'gif'
    },
    Createjjwg_Maps: {
        path: 'legacy/themes/default/images/Createjjwg_Maps.gif',
        name: 'Createjjwg_Maps',
        type: 'gif'
    },
    close: {
        path: 'legacy/themes/suite8/images/close.png',
        name: 'close',
        type: 'png'
    },
    ProjectCopy: {
        path: 'legacy/themes/default/images/ProjectCopy.gif',
        name: 'ProjectCopy',
        type: 'gif'
    },
    line: {
        path: 'legacy/themes/default/images/line.gif',
        name: 'line',
        type: 'gif'
    },
    download: {
        path: 'core/app/themes/suite8/images/download.svg',
        name: 'download',
        type: 'svg'
    },
    paginate_next: {
        path: 'core/app/themes/suite8/images/paginate_next.svg',
        name: 'paginate_next',
        type: 'svg'
    },
    filter: {
        path: 'core/app/themes/suite8/images/filter.svg',
        name: 'filter',
        type: 'svg'
    },
    reset: {
        path: 'core/app/themes/suite8/images/reset.svg',
        name: 'reset',
        type: 'svg'
    },
    column_chooser: {
        path: 'core/app/themes/suite8/images/column_chooser.svg',
        name: 'column_chooser',
        type: 'svg'
    },
    pie: {
        path: 'core/app/themes/suite8/images/pie.svg',
        name: 'pie',
        type: 'svg'
    },
    cross: {
        path: 'core/app/themes/suite8/images/cross.svg',
        name: 'cross',
        type: 'svg'
    },
    plus: {
        path: 'core/app/themes/suite8/images/plus.svg',
        name: 'plus',
        type: 'svg'
    },
    edit: {
        path: 'core/app/themes/suite8/images/edit.svg',
        name: 'edit',
        type: 'svg'
    },
    minimise_circled: {
        path: 'core/app/themes/suite8/images/minimise_circled.svg',
        name: 'minimise_circled',
        type: 'svg'
    },
    paginate_previous: {
        path: 'core/app/themes/suite8/images/paginate_previous.svg',
        name: 'paginate_previous',
        type: 'svg'
    },
    paginate_first: {
        path: 'core/app/themes/suite8/images/paginate_first.svg',
        name: 'paginate_first',
        type: 'svg'
    },
    paginate_last: {
        path: 'core/app/themes/suite8/images/paginate_last.svg',
        name: 'paginate_last',
        type: 'svg'
    }
};

class ThemeImagesRecordGQLSpy extends RecordGQL {

    constructor() {
        super(null);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public fetch(module: string, id: string, metadata: { fields: string[] }): Observable<any> {

        return of({
            data: {
                themeImages: {
                    _id: 'suite8',
                    items: themeImagesMockData
                }
            }
        }).pipe(shareReplay(1));
    }
}

class MockThemeImagesFacade extends ThemeImagesFacade {
    protected store = new BehaviorSubject<ThemeImages>({
        theme: 'suite8',
        images: themeImagesMockData
    });

    constructor(protected recordGQL: RecordGQL, protected appStateFacade: AppStateFacade) {
        super(recordGQL, appStateFacade);
    }
}

export const themeImagesFacadeMock = new MockThemeImagesFacade(new ThemeImagesRecordGQLSpy(), appStateFacadeMock);
