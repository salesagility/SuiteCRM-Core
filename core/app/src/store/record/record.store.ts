import {Record} from '@app-common/record/record.model';
import {deepClone} from '@base/app-common/utils/object-utils';
import {BehaviorSubject, Observable, Subscription, throwError} from 'rxjs';
import {catchError, filter, map, shareReplay, startWith, take, tap} from 'rxjs/operators';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {RecordFetchGQL} from '@store/record/graphql/api.record.get';
import {RecordSaveGQL} from '@store/record/graphql/api.record.save';
import {MessageService} from '@services/message/message.service';
import {RecordManager} from '@services/record/record.manager';

const initialState = {
    id: '',
    type: '',
    module: '',
    attributes: {}
} as Record;

export class RecordStore {

    state$: Observable<Record>;
    staging$: Observable<Record>;
    protected cache$: Observable<any> = null;
    protected internalState: Record = deepClone(initialState);
    protected stagingState: Record = deepClone(initialState);
    protected store = new BehaviorSubject<Record>(this.internalState);
    protected staging = new BehaviorSubject<Record>(this.stagingState);
    protected definitions: ViewFieldDefinition[] = [];
    protected subs: Subscription[] = [];
    protected fieldsMetadata = {
        fields: [
            '_id',
            'id',
            'attributes',
            'module',
            'type',
        ]
    };

    constructor(
        protected definitions$: Observable<ViewFieldDefinition[]>,
        protected recordSaveGQL: RecordSaveGQL,
        protected recordFetchGQL: RecordFetchGQL,
        protected message: MessageService,
        protected recordManager: RecordManager
    ) {
        this.state$ = this.store.asObservable().pipe(
            tap(record => {
                this.updateStaging(record);
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
            newRecord.fields = this.recordManager.initFields(record, this.definitions);
        }

        this.updateState(newRecord);
    }

    save(): Observable<Record> {

        Object.keys(this.stagingState.fields).forEach(fieldName => {
            const field = this.stagingState.fields[fieldName];

            const type = field.type || '';
            const source = field.definition.source || '';
            const rname = field.definition.rname || 'name';
            const idName = field.definition.id_name || '';

            if (type === 'relate' && source === 'non-db' && idName === fieldName) {
                this.stagingState.attributes[fieldName] = field.value;
                return;
            }

            if (type === 'relate' && source === 'non-db' && rname !== '' && field.valueObject) {
                const attribute = this.stagingState.attributes[fieldName] || {} as any;

                attribute[rname] = field.valueObject[rname];
                attribute.id = field.valueObject.id;

                this.stagingState.attributes[fieldName] = attribute;
                this.stagingState.attributes[idName] = field.valueObject.id;

                return;
            }

            if (field.valueList) {
                this.stagingState.attributes[fieldName] = field.valueList;
                return;
            }

            this.stagingState.attributes[fieldName] = field.value;
        });

        return this.recordSaveGQL.save(this.stagingState).pipe(
            tap((record: Record) => {
                this.initFields(record);
                this.updateState(record);
            })
        );
    }

    validate(): Observable<boolean> {

        this.stagingState.formGroup.markAllAsTouched();
        return this.stagingState.formGroup.statusChanges.pipe(
            startWith(this.stagingState.formGroup.status),
            filter(status => status !== 'PENDING'),
            take(1),
            map(status => status === 'VALID')
        );
    }

    resetStaging(): void {
        this.updateStaging(this.internalState);
    }

    destroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    /**
     * Get record
     *
     * @returns {object} Record
     */
    getBaseRecord(): Record {
        if (!this.internalState) {
            return null;
        }

        const baseRecord = {
            id: this.internalState.id,
            type: this.internalState.type,
            module: this.internalState.module,
            attributes: this.internalState.attributes
        } as Record;

        return deepClone(baseRecord);
    }

    /**
     * Is staging record dirty
     *
     * @returns {object} Record
     */
    isDirty(): boolean {
        if (!this.stagingState || !this.stagingState.formGroup) {
            return false;
        }

        return this.stagingState.formGroup.dirty;
    }

    /**
     * Get record cached Observable or call the backend
     *
     * @param {string} module to use
     * @param {string} recordId to use
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<any>
     */
    public retrieveRecord(
        module: string,
        recordId: string,
        useCache = true
    ): Observable<Record> {
        if (this.cache$ == null || useCache === false) {
            this.cache$ = this.fetch(module, recordId).pipe(
                tap(record => this.init(record)),
                shareReplay(1)
            );
        }
        return this.cache$;
    }

    /**
     * Internal API
     */

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

        const shallowCopy = {...state};
        shallowCopy.formGroup = null;
        shallowCopy.fields = null;
        const newState = deepClone(shallowCopy);
        this.initFields(newState);


        this.staging.next(this.stagingState = newState);
    }

    /**
     * Init record fields
     *
     * @param {object} record Record
     */
    protected initFields(record: Record): void {
        if (record.module && this.definitions && this.definitions.length > 0) {
            record.fields = this.recordManager.initFields(record, this.definitions);
        }
    }

    /**
     * Fetch the record from the backend
     *
     * @param {string} module to use
     * @param {string} recordID to use
     * @returns {object} Observable<any>
     */
    protected fetch(module: string, recordID: string): Observable<Record> {
        return this.recordFetchGQL.fetch(module, recordID, this.fieldsMetadata)
            .pipe(
                map(({data}) => {

                    const record: Record = {
                        type: '',
                        module: '',
                        attributes: {}
                    } as Record;

                    if (!data) {
                        return record;
                    }

                    const id = data.getRecord.attributes.id;
                    if (!id) {
                        this.message.addDangerMessageByKey('LBL_RECORD_DOES_NOT_EXIST');
                        return record;
                    }

                    record.id = id;
                    record.module = module;
                    record.type = data.getRecord.attributes && data.getRecord.attributes.object_name;
                    record.attributes = data.getRecord.attributes;

                    return record;
                }),
                catchError(err => throwError(err)),
            );
    }
}
