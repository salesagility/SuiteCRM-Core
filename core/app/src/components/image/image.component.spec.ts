import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ImageComponent} from './image.component';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {of} from 'rxjs';
import {take} from 'rxjs/operators';
import {Component} from '@angular/core';

@Component({
    selector: 'host-component',
    template: '<scrm-image [image]="image"></scrm-image>'
})
class TestHostComponent {
    private image = 'line';

    setImage(newImage: string): void {
        this.image = newImage;
    }
}

describe('ImageComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            declarations: [ImageComponent, TestHostComponent],
            imports: [
                AngularSvgIconModule,
                HttpClientTestingModule
            ],
            providers: [
                {
                    provide: ThemeImagesStore, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                },
            ],
        })
            .compileComponents();


    });

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have image with src', () => {
        expect(testHostComponent).toBeTruthy();
        const img = testHostFixture.nativeElement.querySelector('img');

        expect(img).toBeTruthy();
        expect(img.src).toContain(themeImagesMockData.line.path);
    });

    it('should have svg', () => {
        testHostComponent.setImage('download');
        testHostFixture.detectChanges();

        expect(testHostFixture.nativeElement.querySelector('svg-icon')).toBeTruthy();
    });
});
