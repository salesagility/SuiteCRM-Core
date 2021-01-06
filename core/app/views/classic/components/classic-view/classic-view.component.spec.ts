import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';

import {ClassicViewUiComponent} from './classic-view.component';
import {ActivatedRoute} from '@angular/router';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {IframePageChangeObserver} from '@views/classic/services/iframe-page-change-observer.service';
import {IframeResizeHandlerHandler} from '@views/classic/services/iframe-resize-handler.service';
import {AuthService} from '@services/auth/auth.service';

class ClassicViewUiComponentMock extends ClassicViewUiComponent {
    protected buildIframePageChangeObserver(): IframePageChangeObserver {
        return null;
    }

    protected buildIframeResizeHandlerHandler(): IframeResizeHandlerHandler {
        return null;
    }
}

describe('ClassicViewUiComponent', () => {

    let component: ClassicViewUiComponentMock;
    let fixture: ComponentFixture<ClassicViewUiComponentMock>;

    const legacyLink = 'about:blank';
    const route = ({
        data: {legacyUrl: legacyLink},
        snapshot: {
            data: {legacyUrl: legacyLink}
        }
    } as any) as ActivatedRoute;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                RouterTestingModule,
                ApolloTestingModule
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: route
                },
                {
                    provide: AuthService,
                    useValue: jasmine.createSpyObj('AuthService', ['logout'])
                }
            ],
            declarations: [ClassicViewUiComponentMock]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ClassicViewUiComponentMock);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should render', () => {
        expect(component).toBeTruthy();
    });

    it('should have correct legacy url', () => {
        expect(component).toBeTruthy();
        expect(component.url).toEqual(legacyLink);
    });

    it('should contain iframe wrapper', () => {
        const classicElement: HTMLElement = fixture.nativeElement;

        const wrapper = (classicElement.getElementsByClassName('classic-view-container')[0]);

        expect(wrapper).toBeTruthy();
    });

    it('should contain iframe', () => {
        const classicElement: HTMLElement = fixture.nativeElement;
        const wrapper = (classicElement.getElementsByClassName('classic-view-container')[0]);

        const iframe = (wrapper.getElementsByTagName('iframe')[0]);

        expect(iframe).toBeTruthy();
        expect(iframe.src).toEqual(component.url);
    });
});
