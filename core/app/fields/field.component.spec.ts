import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AppManagerModule} from '../src/app-manager/app-manager.module';
import {FieldComponent} from './field.component';
// import {PLUGIN_MANIFESTS} from '../../../../plugin-manager/plugin-manifest';


describe('FieldComponent', () => {
    let component: FieldComponent;
    let fixture: ComponentFixture<FieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FieldComponent],
            providers: [AppManagerModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //   console.log(component);

    //   expect(component).toBeTruthy();
    // });
});
