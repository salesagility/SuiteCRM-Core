import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModuletitleUiComponent} from './module-title.component';

describe('ModuletitleUiComponent', () => {
    let component: ModuletitleUiComponent;
    let fixture: ComponentFixture<ModuletitleUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModuletitleUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModuletitleUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
