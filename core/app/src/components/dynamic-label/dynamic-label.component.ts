import {Component, Input, OnInit} from '@angular/core';
import {DynamicLabelService} from '@services/language/dynamic-label.service';
import {StringMap} from '@app-common/types/StringMap';
import {FieldMap} from '@app-common/record/field.model';
import {LanguageStore, LanguageStrings} from '@store/language/language.store';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
    selector: 'scrm-dynamic-label',
    templateUrl: './dynamic-label.component.html',
    styleUrls: []
})
export class DynamicLabelComponent implements OnInit {
    @Input() template = '';
    @Input() labelKey = '';
    @Input() context: StringMap = {};
    @Input() fields: FieldMap = {};

    parsedLabel = '';
    vm$: Observable<LanguageStrings>;

    constructor(protected dynamicLabels: DynamicLabelService, protected language: LanguageStore) {
    }

    ngOnInit(): void {
        this.vm$ = this.language.vm$.pipe(tap(() => {
            if (this.labelKey) {
                this.template = this.language.getFieldLabel(this.labelKey);
            }
            this.parseLabel();
        }));
    }

    protected parseLabel(): void {
        this.parsedLabel = this.dynamicLabels.parse(this.template, this.context, this.fields);
    }
}
