import {Record} from '@app-common/record/record.model';
import {deepClone} from '@base/utils/object-utils';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';
import {LanguageStore} from '@store/language/language.store';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {Field, FieldManager, FieldMap} from '@app-common/record/field.model';

const initialState = {
    id: '',
    type: '',
    module: '',
    attributes: {}
} as Record;

export class RecordManager {

    state$: Observable<Record>;
    staging$: Observable<Record>;
    protected internalState: Record = deepClone(initialState);
    protected stagingState: Record = deepClone(initialState);
    protected store = new BehaviorSubject<Record>(this.internalState);
    protected staging = new BehaviorSubject<Record>(this.stagingState);
    protected definitions: ViewFieldDefinition[] = [];
    protected subs: Subscription[] = [];

    constructor(protected language: LanguageStore, protected definitions$: Observable<ViewFieldDefinition[]>) {
        this.state$ = this.store.asObservable().pipe(
            tap(record => {
                this.updateStaging(deepClone(record));
            })
        );
        this.staging$ = this.staging.asObservable();

        this.subs.push(definitions$.subscribe(definitions => {
            this.definitions = definitions;
            this.init(this.internalState);
        }));
    }

    init(record: Record): void {
        const newRecord = {
            ...record,
        };

        if (record.module && this.definitions && this.definitions.length > 0) {
            newRecord.fields = this.initFields(record, this.definitions);
        }

        this.updateState(newRecord);
    }

    save(): void {
        this.updateState(this.stagingState);
    }

    resetStaging(): void {
        this.updateStaging(deepClone(this.internalState));
    }

    destroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    /**
     * Get record
     *
     * @returns {object} Record
     */
    getRecord(): Record {
        if (!this.internalState) {
            return null;
        }
        return deepClone(this.internalState);
    }

    /**
     * Internal API
     */

    /**
     * Init Fields
     *
     * @param {object} record to use
     * @param {object} viewFieldDefinitions to use
     * @returns {object} fields
     */
    protected initFields(record: Record, viewFieldDefinitions: ViewFieldDefinition[]): FieldMap {
        const fields = {} as FieldMap;

        viewFieldDefinitions.forEach(viewField => {
            fields[viewField.name] = this.buildField(viewField, record, this.language);
        });

        return fields;
    }

    /**
     * Build Field
     *
     * @param {object} viewField to use
     * @param {object} record to use
     * @param {object} language to use
     * @returns {object} field
     */
    protected buildField(viewField: ViewFieldDefinition, record: Record, language: LanguageStore): Field {
        return FieldManager.buildField(record, viewField, language);
    }

    /**
     * Update the state
     *
     * @param {object} state to set
     */
    protected updateState(state: Record): void {
        this.store.next(this.internalState = state);
    }

    /**
     * Update the staging
     *
     * @param {object} state to set
     */
    protected updateStaging(state: Record): void {
        this.staging.next(this.stagingState = state);
    }
}
