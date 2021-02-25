import {Type} from '@angular/core';
import {OverridableMap} from 'common';
import {BaseFieldComponent} from './base/base-field.component';
import {FieldComponentMap} from './field.model';

export interface FieldRegistryInterface {
    register(module: string, type: string, mode: string, component: Type<BaseFieldComponent>): void;

    exclude(module: string, key: string): void;

    get(module: string, type: string, mode: string): Type<BaseFieldComponent>;
}

export class BaseFieldRegistry implements FieldRegistryInterface {
    protected map: OverridableMap<Type<BaseFieldComponent>>;

    constructor() {
        this.init();
    }

    public register(module: string, type: string, mode: string, component: Type<BaseFieldComponent>): void {
        this.map.addEntry(module, BaseFieldRegistry.getKey(type, mode), component);
    }

    public exclude(module: string, key: string): void {
        this.map.excludeEntry(module, key);
    }

    public get(module: string, type: string, mode: string): Type<BaseFieldComponent> {

        const moduleFields = this.map.getGroupEntries(module);

        const key = BaseFieldRegistry.getKey(type, mode);
        if (moduleFields[key]) {
            return moduleFields[key];
        }

        const defaultKey = BaseFieldRegistry.getKey('varchar', mode);
        return moduleFields[defaultKey];
    }

    public static getKey(type: string, mode: string): string {
        return type + '.' + mode;
    }

    protected init(): void {
        this.map = new OverridableMap<Type<BaseFieldComponent>>();

        Object.keys(this.getDefaultMap()).forEach(key => {
            const [type, mode] = key.split('.', 2);
            this.register('default', type, mode, this.getDefaultMap()[key]);
        });
    }

    protected getDefaultMap(): FieldComponentMap {
        return {};
    }
}
