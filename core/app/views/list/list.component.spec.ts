import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListComponent} from './list.component';
import {ListheaderUiModule} from '@components/list-header/list-header.module';
import {ListcontainerUiModule} from '@components/list-container/list-container.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ImageModule} from '@components/image/image.module';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ThemeImagesFacade} from '@base/facades/theme-images/theme-images.facade';
import {themeImagesMockData} from '@base/facades/theme-images/theme-images.facade.spec.mock';
import {take} from 'rxjs/operators';
import {of} from 'rxjs';
import {DynamicModule} from "ng-dynamic-component";
import {FieldModule} from "../../fields/field.module";
import { By } from '@angular/platform-browser';

describe('ListComponent', () => {
    let component: ListComponent;
    let fixture: ComponentFixture<ListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ListheaderUiModule,
                ListcontainerUiModule,
                HttpClientTestingModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                ImageModule,
                ApolloTestingModule,
                DynamicModule,
                FieldModule
            ],
            declarations: [ListComponent],
            providers: [
                {
                    provide: ThemeImagesFacade, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have title', () => {
        const element = fixture.debugElement.query(By.css('.ng-star-inserted')).nativeElement;
        expect(fixture).toBeTruthy();
        expect(element).toBeTruthy();
        expect(element.textContent).toContain('MY FIELD VALUE');
    });
});
