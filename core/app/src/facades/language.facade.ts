import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';

import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import {
  map, distinctUntilChanged,
  switchMap, startWith, tap, delay, debounceTime
} from 'rxjs/operators';

export interface LanguageStringMap {
  [key: string]: string;
}
export interface LanguageState {
  languageStrings: LanguageStringMap;
  languageType: string;
  loaded?: [];
}

let _state: LanguageState = {
  languageStrings: {},
  languageType: 'en_us',
  loaded: []
};

@Injectable()
export class LanguageFacade {
  private store = new BehaviorSubject<LanguageState>(_state);
  private state$ = this.store.asObservable();

  languageStrings$ = this.state$.pipe(map(state => state.languageStrings), distinctUntilChanged());
  languageType$ = this.state$.pipe(map(state => state.languageType), distinctUntilChanged());
  loaded$ = this.state$.pipe(map(state => state.loaded));

  vm$: Observable<LanguageState> = combineLatest(
    this.languageStrings$,
    this.languageType$,
    this.loaded$
  ).pipe(
    map( ([languageStrings, languageType, loaded]) => {
      return { languageStrings, languageType, loaded };
    })
  );

  constructor(private http: HttpClient) {
    // combineLatest(this.criteria$).pipe(
    //   switchMap(([criteria]) => {
    //     return this.findAllUsers(criteria);
    //   })
    // ).subscribe(languageStrings => {
    //   this.updateState({ ..._state, languageStrings,  loading: false });
    // });
  }

  // ------- Public Methods ------------------------

  /** RandomUser REST call */
  // public loadAppStrings(): Observable<LanguageString[]> {
  //   // const url = buildLanguageUrl();
  //   return this.http.get<LanguageString>(url).pipe(
  //     map(response => response.results)
  //   );
  // }

  // ------- Private Methods ------------------------

  /** Update internal state cache and emit from store... */
  private updateState(state: LanguageState) {
    this.store.next(_state = state);
  }
}

function buildLanguageUrl(criteria: string): string {
  // const URL = 'https://randomuser.me/api/';
  // const currentPage = `page=${pagination.currentPage}`;
  // const pageSize = `results=${pagination.selectedSize}&`;
  // const searchFor = `seed=${criteria}`;

  // return `${URL}?${searchFor}&${pageSize}&${currentPage}`;

  return '';
}