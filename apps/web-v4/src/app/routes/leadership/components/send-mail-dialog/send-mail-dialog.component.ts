/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ConfigService } from '../../../../services/config.service';
import { IEmailTextRequest } from '../../../../models/email.model';
import { AuthService } from '../../../../services/auth.service';
import { ShareService } from '../../../../services/share.service';
import { ILeaderMailMeta } from '../../../../models/leadership.model';

@Component({
  selector: 'ws-send-mail-dialog',
  templateUrl: './send-mail-dialog.component.html',
  styleUrls: ['./send-mail-dialog.component.scss']
})
export class SendMailDialogComponent implements OnInit {

  mailBodyText: string;
  mailSendInProgress: boolean = false;

  @ViewChild('successToast', { static: true }) successToast: ElementRef<any>;
  @ViewChild('errorToast', { static: true }) errorToast: ElementRef<any>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ILeaderMailMeta,
    private configSvc: ConfigService,
    private authSvc: AuthService,
    private shareSvc: ShareService,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  sendMail(form) {
    this.mailSendInProgress = true;
    const req: IEmailTextRequest = {
      emailTo: [
        {
          email: this.data.emailTo
        }
      ],
      sharedBy: [
        {
          email: this.authSvc.userEmail,
          name: this.authSvc.userName
        }
      ],
      ccTo: [
        {
          email: this.authSvc.userEmail,
          name: this.authSvc.userName
        }
      ],
      body: {
        text: this.mailBodyText,
      },
      timestamp: new Date().getTime(),
      appURL: location.host,
      subject: this.data.subject
    };
    this.shareSvc.shareTextMail(req).subscribe(response => {
      form.resetForm();
      this.matSnackBar.open(this.successToast.nativeElement.value);
      this.mailSendInProgress = false;
    }, err => {
      this.matSnackBar.open(this.errorToast.nativeElement.value);
      this.mailSendInProgress = false;
    })

  }
}
