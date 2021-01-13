import {take} from 'rxjs/operators';
import {interval} from 'rxjs';

export const waitUntil = async (untilTruthy: Function): Promise<boolean> => {
    while (!untilTruthy()) {
        await interval(25).pipe(take(1)).toPromise();
    }
    // eslint-disable-next-line compat/compat
    return Promise.resolve(true);
};
