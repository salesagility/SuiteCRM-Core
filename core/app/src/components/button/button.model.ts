export interface ButtonInterface {
    klass?: string | string[] | Set<string> | { [key: string]: any };
    onClick?: Function;
    label?: string;
    icon?: string;
}

export class Button implements ButtonInterface {

    constructor(
        public klass: string | string[] | Set<string> | { [key: string]: any } = null,
        public onClick: Function = null,
        public label: string = null,
        public icon: string = null
    ) {
    }

    public static fromButton(button: ButtonInterface): Button {
        return new this(
            button.klass,
            button.onClick,
            button.label,
            button.icon
        );
    }

    public addClasses(newClasses: string[]): void {

        if (!this.klass) {
            this.klass = newClasses;
            return;
        }

        if (typeof this.klass === 'string') {
            this.klass = newClasses.join(' ') + ' ' + this.klass;
            return;
        }

        if (this.klass instanceof Array || this.klass instanceof Set) {
            this.klass = [
                ...this.klass,
                ...newClasses
            ];

            return;
        }

        if (this.klass instanceof Object) {
            const classes = {
                ...this.klass,
            };

            classes[newClasses.join(' ')] = true;
            this.klass = classes;
        }
    }
}
