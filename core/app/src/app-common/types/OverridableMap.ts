export interface MapEntry<T> {
    [key: string]: T;
}

export interface MapGroupEntry<T> {
    values?: MapEntry<T>;
    exclude?: string[];
}

export interface OverridableMapType<T> {
    [key: string]: MapGroupEntry<T>;
}

export interface OverridableMapInterface<T> {

    init(entryMap: OverridableMapType<T>): void;

    addEntry(group: string, key: string, value: T): void;

    excludeEntry(group: string, key: string);

    getGroupEntries(group: string);
}

export class OverridableMap<T> implements OverridableMapInterface<T> {
    public map: OverridableMapType<T>;

    constructor() {
        this.map = {
            default: {
                values: {},
                exclude: []
            }
        };
    }

    public init(entryMap: OverridableMapType<T>): void {
        Object.keys(entryMap).forEach(group => {

            if (entryMap[group].values) {
                Object.keys(entryMap[group].values).forEach(key => {
                    this.addEntry(group, key, entryMap[group].values[key]);
                });
            }

            if (entryMap[group].exclude) {
                entryMap[group].exclude.forEach(excluded => this.excludeEntry(group, excluded));
            }
        });
    }

    public addEntry(group: string, key: string, value: T): void {

        if (!(group in this.map)) {
            this.map[group] = {
                values: {},
                exclude: []
            };
        }

        this.map[group].values[key] = value;
    }

    public excludeEntry(group: string, key: string): void {

        if (!(group in this.map)) {
            this.map[group] = {
                values: {},
                exclude: []
            };
        }

        this.map[group].exclude.push(key);
    }

    public getGroupEntries(group: string): MapEntry<T> {
        const values = {};

        const allValues = {...this.map.default.values};
        let groupEntry: MapGroupEntry<T> = {
            values: {},
            exclude: []
        };

        if (group in this.map) {
            groupEntry = this.map[group];
            groupEntry.values = groupEntry.values || {};
            groupEntry.exclude = groupEntry.exclude || [];
        }

        Object.keys(groupEntry.values).forEach(key => {
            allValues[key] = groupEntry.values[key];
        });

        Object.keys(allValues).forEach(key => {
            if (this.map.default.exclude.includes(key)) {
                return;
            }

            if (groupEntry.exclude.includes(key)) {
                return;
            }

            values[key] = allValues[key];
        });

        return values;
    }
}
