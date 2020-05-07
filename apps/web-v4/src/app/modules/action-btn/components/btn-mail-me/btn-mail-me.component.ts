/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import {
  MailMeDialogComponent,
  IMailMeDialogComponentData,
  IMailMeDialogComponentResponseData
} from '../mail-me-dialog/mail-me-dialog.component';
import { IContent } from '../../../../models/content.model';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ShareService } from '../../../../services/share.service';
import { AuthService } from '../../../../services/auth.service';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { UtilityService } from '../../../../services/utility.service';
import { ConfigService } from '../../../../services/config.service';

enum TMailMeResponse {
  NONE,
  SUCCESS,
  ERROR
}
interface TMailResponseObj extends IMailMeDialogComponentResponseData {
  res: TMailMeResponse;
}

const validCategories = new Set(['leave behind']);

@Component({
  selector: 'app-btn-mail-me',
  templateUrl: './btn-mail-me.component.html',
  styleUrls: ['./btn-mail-me.component.scss']
})
export class BtnMailMeComponent implements OnInit {
  @Input()
  content: IContent;

  enabled = false;
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private shareSvc: ShareService,
    private authSvc: AuthService,
    private utilSvc: UtilityService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.checkAccesibility();
  }
  checkAccesibility() {
    try {
      const userEmail = this.authSvc.userEmail;
      if (this.configSvc.instanceConfig.platform.validMailExtForMailMe.indexOf('@' + userEmail.split('@')[1]) > -1) {
        let isLeaveBehind = false;
        if (this.content.resourceCategory) {
          this.content.resourceCategory.forEach(category => {
            isLeaveBehind = isLeaveBehind || validCategories.has(category.toLowerCase());
          });
          this.enabled =
            isLeaveBehind &&
            (this.content.mimeType === MIME_TYPE.pdf ||
              this.content.mimeType === MIME_TYPE.mp4 ||
              this.content.mimeType === MIME_TYPE.mp3 ||
              this.content.mimeType === MIME_TYPE.youtube);
        }
      } else {
        this.enabled = false;
      }
    } catch (e) {
      this.enabled = false;
    }
  }
  confirm(event?: Event) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    if (!this.configSvc.instanceConfig.features.btnMailMe.available) {
      this.utilSvc.featureUnavailable();
      return;
    }
    const dialogRef = this.dialog.open<
      MailMeDialogComponent,
      IMailMeDialogComponentData,
      IMailMeDialogComponentResponseData
    >(MailMeDialogComponent, {
      data: { title: this.content.name, description: this.content.description }
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap(
          (sendObj: IMailMeDialogComponentResponseData): Observable<TMailResponseObj> => {
            if (sendObj && sendObj.send) {
              return this.shareSvc.shareApi(this.content, [], sendObj.mailBody, 'attachment').pipe(
                map(({ response, invalidIds }): boolean => response === 'Success'),
                map(
                  (sent): TMailResponseObj => ({
                    res: sent ? TMailMeResponse.SUCCESS : TMailMeResponse.ERROR,
                    ...sendObj
                  })
                ),
                catchError(error => {
                  // console.log('error', error);
                  return of({ res: TMailMeResponse.ERROR, ...sendObj });
                })
              );
            } else {
              return of({ res: TMailMeResponse.NONE, ...sendObj });
            }
          }
        )
      )
      .subscribe((res: TMailResponseObj) => {
        switch (res.res) {
          case TMailMeResponse.SUCCESS:
            this.snackBar.open(res.successToast);
            break;
          case TMailMeResponse.ERROR:
            this.snackBar.open(res.errorToast);
            break;
        }
      });
  }
}
