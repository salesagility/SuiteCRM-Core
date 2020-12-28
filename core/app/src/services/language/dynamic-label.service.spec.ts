import {TestBed} from '@angular/core/testing';
import {dynamicLabelsMock} from '@services/language/dynamic-label.service.spec.mock';
import {Field, FieldDefinition} from '@app-common/record/field.model';

describe('DynamicLabel', () => {
    const service = dynamicLabelsMock;
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {

        expect(service).toBeTruthy();
    });

    it('should parse several template parts', () => {

        const template = '{{fields.name.label}} | {{fields.amount.value}} | Min: {{context.min|int}}';
        const context = {
            min: '1000',
            module: 'accounts'
        };
        const fields = {
            name: {
                value: 'Some Company',
                labelKey: 'LBL_NAME',
                type: 'varchar'
            } as Field,
            amount: {
                value: '1000.50',
                labelKey: 'LBL_AMOUNT',
                type: 'currency',
            } as Field
        };

        const parsed = service.parse(template, context, fields);

        const expected = 'Name: | $1,000.50 | Min: 1,000';

        expect(parsed).toContain(expected);
    });

    it('should support int filter', () => {

        const template = '{{context.min|int}}';
        const context = {
            min: '1000',
            module: 'accounts'
        };
        const fields = {};

        const parsed = service.parse(template, context, fields);

        const expected = '1,000';

        expect(parsed).toContain(expected);
    });

    it('should support float filter', () => {

        const template = '{{context.min|float}}';
        const context = {
            min: '1000.50',
            module: 'accounts'
        };
        const fields = {};

        const parsed = service.parse(template, context, fields);

        const expected = '1,000.5';

        expect(parsed).toContain(expected);
    });

    it('should support currency filter', () => {

        const template = '{{context.min|currency}}';
        const context = {
            min: '1000.50',
            module: 'accounts'
        };
        const fields = {};

        const parsed = service.parse(template, context, fields);

        const expected = '$1,000.50';

        expect(parsed).toContain(expected);
    });

    it('should support date filter', () => {

        const template = '{{context.date|date}}';
        const context = {
            date: '2020-12-12',
            module: 'accounts'
        };
        const fields = {};

        const parsed = service.parse(template, context, fields);

        const expected = '12.12.2020';

        expect(parsed).toContain(expected);
    });

    it('should support datetime filter', () => {

        const template = '{{context.date|datetime}}';
        const context = {
            date: '2020-12-12 12:30:40',
            module: 'accounts'
        };
        const fields = {};

        const parsed = service.parse(template, context, fields);

        const expected = '12.12.2020 12.30.40';

        expect(parsed).toContain(expected);
    });

    it('should parse field label', () => {

        const template = '{{fields.name.label}}';
        const context = {
            module: 'accounts'
        };
        const fields = {
            name: {
                value: 'Some Company',
                labelKey: 'LBL_NAME',
                type: 'varchar'
            } as Field,
            amount: {
                value: '1000.50',
                labelKey: 'LBL_AMOUNT',
                type: 'currency',
            } as Field
        };

        const parsed = service.parse(template, context, fields);

        const expected = 'Name:';

        expect(parsed).toContain(expected);
    });

    it('should parse field currency value', () => {

        const template = '{{fields.amount.value}}';
        const context = {
            module: 'accounts'
        };
        const fields = {
            amount: {
                value: '1000.50',
                labelKey: 'LBL_AMOUNT',
                type: 'currency',
            } as Field
        };

        const parsed = service.parse(template, context, fields);

        const expected = '$1,000.50';

        expect(parsed).toContain(expected);
    });

    it('should parse field int value', () => {

        const template = '{{fields.amount.value}}';
        const context = {
            module: 'accounts'
        };
        const fields = {
            amount: {
                value: '1000',
                labelKey: 'LBL_AMOUNT',
                type: 'int',
            } as Field
        };

        const parsed = service.parse(template, context, fields);

        const expected = '1,000';

        expect(parsed).toContain(expected);
    });

    it('should parse field float value', () => {

        const template = '{{fields.amount.value}}';
        const context = {
            module: 'accounts'
        };
        const fields = {
            amount: {
                value: '1000.50',
                labelKey: 'LBL_AMOUNT',
                type: 'float',
            } as Field
        };

        const parsed = service.parse(template, context, fields);

        const expected = '1,000.5';

        expect(parsed).toContain(expected);
    });

    it('should parse field enum value', () => {

        const template = '{{fields.type.value}}';
        const context = {
            module: 'accounts'
        };
        const fields = {
            type: {
                value: '_analyst',
                labelKey: 'LBL_TYPE',
                definition: {
                    options: 'account_type_dom',
                } as FieldDefinition,
                type: 'enum',
            } as Field
        };

        const parsed = service.parse(template, context, fields);

        const expected = 'Analyst';

        expect(parsed).toContain(expected);
    });

    it('should parse field dynamicenum value', () => {

        const template = '{{fields.type.value}}';
        const context = {
            module: 'accounts'
        };
        const fields = {
            type: {
                value: '_analyst',
                labelKey: 'LBL_TYPE',
                definition: {
                    options: 'account_type_dom',
                } as FieldDefinition,
                type: 'dynamicenum',
            } as Field
        };

        const parsed = service.parse(template, context, fields);

        const expected = 'Analyst';

        expect(parsed).toContain(expected);
    });

    it('should parse field multienum value', () => {

        const template = '{{fields.type.value}}';
        const context = {
            module: 'accounts'
        };
        const fields = {
            type: {
                valueList: ['_analyst', '_prospect'],
                labelKey: 'LBL_TYPE',
                definition: {
                    options: 'account_type_dom',
                } as FieldDefinition,
                type: 'multienum',
            } as Field
        };

        const parsed = service.parse(template, context, fields);

        const expected = 'Analyst, Prospect';

        expect(parsed).toContain(expected);
    });

});
