import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as act from '../actions/history-report.actions';
import { HistoryReportService } from '../../services/history-repost.service';

@Injectable()
export class HistoryReportLoadEffect {
    @Effect()
    loadFiles$: Observable<any> = this.actions$.pipe(
        ofType(act.LOAD_HISTORY_REPORT),
        switchMap(() => {
            return this.historyReportService.load()
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
        private historyReportService: HistoryReportService
    ) { }
}