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

    public static appendClasses(button: ButtonInterface, newClasses: string[]): void {

        if (!button.klass) {
            button.klass = newClasses;
            return;
        }

        if (typeof button.klass === 'string') {
            button.klass = newClasses.join(' ') + ' ' + button.klass;
            return;
        }

        if (button.klass instanceof Array || button.klass instanceof Set) {
            button.klass = [
                ...button.klass,
                ...newClasses
            ];

            return;
        }

        if (button.klass instanceof Object) {
            const classes = {
                ...button.klass,
            };

            classes[newClasses.join(' ')] = true;
            button.klass = classes;
        }
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
