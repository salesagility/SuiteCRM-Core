import {Injectable} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export enum ScreenSize {
    XSmall = 'XSmall',
    Small = 'Small',
    Medium = 'Medium',
    Large = 'Large',
    XLarge = 'XLarge'
}

@Injectable({
    providedIn: 'root'
})
export class ScreenSizeObserverService {

    screenSize$: Observable<ScreenSize>;

    constructor(protected breakpointObserver: BreakpointObserver) {
        this.initScreenSizeObservable();
    }

    protected initScreenSizeObservable(): void {
        this.screenSize$ = merge(
            this.breakpointObserver.observe([
                Breakpoints.XSmall,
            ]).pipe(map((result: BreakpointState) => {
                if (result.matches) {
                    return ScreenSize.XSmall;
                }
            })),
            this.breakpointObserver.observe([
                Breakpoints.Small,
            ]).pipe(map((result: BreakpointState) => {
                if (result.matches) {
                    return ScreenSize.Small;
                }
            })),
            this.breakpointObserver.observe([
                Breakpoints.Medium,
            ]).pipe(map((result: BreakpointState) => {
                if (result.matches) {
                    return ScreenSize.Medium;
                }
            })),
            this.breakpointObserver.observe([
                Breakpoints.Large,
            ]).pipe(map((result: BreakpointState) => {
                if (result.matches) {
                    return ScreenSize.Large;
                }
            })),
            this.breakpointObserver.observe([
                Breakpoints.XLarge,
            ]).pipe(map((result: BreakpointState) => {
                if (result.matches) {
                    return ScreenSize.XLarge;
                }
            }))
        );
    }
}
