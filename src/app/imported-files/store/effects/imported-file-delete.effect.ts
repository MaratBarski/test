import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as act from '../actions/imported-files.actions'
import { ImportedFilesService } from '../../services/imported-files.service';
import { FileSource } from '@app/imported-files/models/file-source';

@Injectable()
export class SourceFileDeleteEffect {
    @Effect()
    loadFiles$: Observable<any> = this.actions$.pipe(
        ofType(act.DELETE_FILE_SOURCE),
        switchMap((fs:FileSource) => {
            return this.importedFilesService.deleteFile(fs)
                .pipe(
                    map((data: any) => {
                        return act.deleteFileSucc({ payload: data });
                    }),
                    catchError(error => {
                        return of(act.deleteFileFail({ payload: fs }));
                    })
                )
        })
    );

    constructor(
        private actions$: Actions,
        private importedFilesService: ImportedFilesService
    ) { }
}