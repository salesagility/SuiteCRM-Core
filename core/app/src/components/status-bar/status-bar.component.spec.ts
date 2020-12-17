import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {StatusBarComponent} from './status-bar.component';
import {ActionMenuModule} from '@views/list/components/action-menu/action-menu.module';
import {SettingsMenuModule} from '@views/list/components/settings-menu/settings-menu.module';
import {ImageModule} from '@components/image/image.module';
import {RouterTestingModule} from '@angular/router/testing';
import {ButtonModule} from '@components/button/button.module';
import {RecordViewStore} from '@views/record/store/record-view/record-view.store';

@Component({
    selector: 'status-bar-test-host-component',
    template: '<scrm-status-bar></scrm-status-bar>'
})
class StatusBarTestHostComponent {
}

describe('StatusBarComponent', () => {
    let testHostComponent: StatusBarTestHostComponent;
    let testHostFixture: ComponentFixture<StatusBarTestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ActionMenuModule,
                ButtonModule,
                SettingsMenuModule,
                ApolloTestingModule,
                HttpClientTestingModule,
                ImageModule,
                RouterTestingModule
            ],
            declarations: [StatusBarComponent, StatusBarTestHostComponent],
            providers: [
                {provide: RecordViewStore},
            ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(StatusBarTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });
});
