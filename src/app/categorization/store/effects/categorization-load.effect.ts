import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as act from '../actions/categorization.actions'
import { CategorizationService } from '../../services/categorization.service';
import { CategoryeResponse } from '@app/categorization/models/category-reponse';

@Injectable()
export class CategorizationLoadEffect {
    @Effect()
    loadCategories$: Observable<any> = this.actions$.pipe(
        ofType(act.LOAD_CATEGORIZATION),
        switchMap(() => {
            return this.categorizationService.load()
                .pipe(
                    map((data: CategoryeResponse) => {
                        return act.loadSucc({ payload: data });
                    }),
                    catchError(error => {
                        return of(act.loadFail());
                    })
                )
        })
    );

    constructor(
        private actions$: Actions,
        private categorizationService: CategorizationService
    ) { }
}