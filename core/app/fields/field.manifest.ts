import {GroupFieldModule} from '@fields/group-field/group-field.module';
import {GroupFieldComponent} from '@fields/group-field/group-field.component';
import {baseFieldComponents, baseFieldModules, baseViewFieldsMap} from '@fields/base-fields.manifest';

export const fieldModules = [
    ...baseFieldModules,
    GroupFieldModule
];
export const fieldComponents = [
    ...baseFieldComponents,
    GroupFieldComponent
];

export const viewFieldsMap = {
    ...baseViewFieldsMap,
    'grouped-field.list': GroupFieldComponent,
    'grouped-field.detail': GroupFieldComponent,
    'grouped-field.edit': GroupFieldComponent
};
