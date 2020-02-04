import {Component, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'scrm-classic-view-ui',
    templateUrl: './classic-view.component.html',
    styleUrls: []
})
export class ClassicViewUiComponent {
    data: any;

    @ViewChild('dataContainer', {static: true}) dataContainer: ElementRef;
    public element: any;

    renderHtml(data) {
        this.element = this.dataContainer.nativeElement;
        const fragment = document.createRange().createContextualFragment(data.html);
        this.element.appendChild(fragment);
    }

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.data = this.route.snapshot.data;
    }

    ngAfterViewInit() {
        this.renderHtml(this.data.view);
    }
}
