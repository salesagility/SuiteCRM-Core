import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class FormControlUtils {

    getTrimmedInputValue(inputValue: any): any {
        // Handle the cases, when input values are not string e.g. multienums: String[]
        // Process the input, only when it's a string else return as it is
        if (typeof inputValue !== 'string') {
            return inputValue;
        }
        return inputValue.trim();
    }

    isEmptyInputValue(inputValue: any): boolean {
        // Handle the cases, when input value is an string, array, objects or any other type
        return inputValue == null
            || typeof inputValue === 'undefined'
            || inputValue === ''
            || inputValue.length === 0;
    }

    isEmptyTrimmedInputValue(inputValue: any): boolean {
        return this.isEmptyInputValue(this.getTrimmedInputValue(inputValue));
    }

}
