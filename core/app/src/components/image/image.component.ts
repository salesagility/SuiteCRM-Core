import {Component, Input} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ThemeImage, ThemeImageMap, ThemeImagesFacade} from '@base/store/theme-images/theme-images.facade';

@Component({
    selector: 'scrm-image',
    templateUrl: './image.component.html',
    styleUrls: []
})
export class ImageComponent {

    images$: Observable<ThemeImageMap> = this.themeImagesFacade.images$;

    vm$ = combineLatest([this.images$]).pipe(
        map(([images]) => ({
            images
        })));

    @Input() image: string;

    constructor(protected themeImagesFacade: ThemeImagesFacade) {
    }

    /**
     * Get image from current view model and log if not existent
     *
     * @param vm
     * @param image name
     * @returns ThemeImage
     */
    getImage(vm: { images: ThemeImageMap }, image: string): ThemeImage {
        if (!vm || !vm.images || Object.keys(vm.images).length < 1) {
            return null;
        }

        const img = vm.images[image];

        if (!img) {
            console.warn(`Image with name '${image}' not found`);
        }

        return img;
    }
}
