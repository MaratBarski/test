import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, Effect } from '@ngrx/effects';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as act from '../actions/imported-files.actions'
import { ImportedFilesService } from '../../services/imported-files.service';

@Injectable()
export class SourceFileEffect {
    @Effect()
    loadProducts$: Observable<any> = this.actions$.pipe(
        ofType(act.LOAD_FILE_SOURCE),
        switchMap(() => {
            return this.importedFilesService.load()
                .pipe(
                    map((data: any) => {
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
        private importedFilesService: ImportedFilesService
    ) { }
}