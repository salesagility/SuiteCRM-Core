import {Component} from '@angular/core';
import {BaseFieldComponent} from '@fields/base/base-field.component';
import {baseViewFieldsMap} from '@fields/base-fields.manifest';
import {Field} from '@app-common/record/field.model';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Component({
    selector: 'scrm-group-field',
    templateUrl: './group-field.component.html',
    styleUrls: []
})
export class GroupFieldComponent extends BaseFieldComponent {
    map = baseViewFieldsMap;

    constructor(protected typeFormatter: DataTypeFormatter) {
        super(typeFormatter);
    }

    getComponentType(type: string): any {
        const key = type + '.' + this.mode;
        if (this.map[key]) {
            return this.map[key];
        }

        const defaultKey = 'varchar' + '.' + this.mode;
        return this.map[defaultKey];
    }

    /**
     * Get the group fields from the record
     *
     * @returns {object} Field[]
     */
    getFields(): Field[] {
        const fields: Field[] = [];

        this.field.definition.layout.forEach(name => {
            fields.push(this.record.fields[name]);
        });

        return fields;
    }

    getModule(): string {
        if (!this.record) {
            return null;
        }

        return this.record.module;
    }

    /**
     * Get flex direction to be used
     *
     * @returns {string} direction
     */
    getDirection(): string {
        let direction = 'flex-column';

        if (this.field.definition.display === 'inline') {
            direction = 'flex-row';
        }

        return direction;
    }

    /**
     * Check if is configured
     *
     * @returns {boolean} is configured
     */
    isConfigured(): boolean {
        return this.hasDisplay() && this.hasLayout() && this.hasGroupFields();
    }

    showLabel(fieldName: string): boolean {
        const definition = this.field.definition || null;
        const showLabel = definition.showLabel || null;

        if (!definition || !showLabel) {
            return false;
        }

        const showLabelOptions = definition.showLabel[this.mode] || null;

        // showLabel > viewMode not defined || defined without any values e.g. edit:
        if(!showLabelOptions || typeof(showLabelOptions) === 'undefined'){
            return false;
        }

        return (showLabelOptions.includes('*') || showLabelOptions.includes(fieldName));
    }

    /**
     * Check if groupFields are configured
     *
     * @returns {boolean} has groupFields
     */
    protected hasGroupFields(): boolean {
        return !!(this.field.definition.groupFields && Object.keys(this.field.definition.groupFields).length);
    }

    /**
     * Check if layout is configured
     *
     * @returns {boolean} has layout
     */
    protected hasLayout(): boolean {
        return !!(this.field.definition.layout && this.field.definition.layout.length);
    }

    /**
     * Check if display is configured
     *
     * @returns {boolean} has display
     */
    protected hasDisplay(): boolean {
        return !!this.field.definition.display;
    }
}
