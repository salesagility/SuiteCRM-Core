import {metadataMockData, metadataStoreMock} from '@store/metadata/metadata.store.spec.mock';
import {MetadataStore} from '@store/metadata/metadata.store.service';
import {take} from 'rxjs/operators';

describe('Metadata Store', () => {
    const service: MetadataStore = metadataStoreMock;

    beforeEach(() => {
    });

    it('#load', (done: DoneFn) => {
        service.load('accounts', metadataStoreMock.getMetadataTypes()).pipe(take(1)).subscribe(data => {

            expect(data.listView.fields).toEqual(metadataMockData.listView.columns);
            expect(data.listView.bulkActions).toEqual(metadataMockData.listView.bulkActions);
            expect(data.search).toEqual(metadataMockData.search);
            done();
        });
    });
});

