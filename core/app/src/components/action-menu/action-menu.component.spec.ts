import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonUiModule} from '@components/button/button.module';
import {ModalUiModule} from '@components/modal/modal.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ActionmenuUiComponent} from './action-menu.component';

describe('ActionmenuUiComponent', () => {
    let component: ActionmenuUiComponent;
    let fixture: ComponentFixture<ActionmenuUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ModalUiModule,
                ButtonUiModule,
                AngularSvgIconModule
            ],
            declarations: [
                ActionmenuUiComponent,
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActionmenuUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
