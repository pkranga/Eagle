/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ShareService } from '../../../../services/share.service'
import { IEmailTextRequest } from '../../../../models/email.model';
import { ConfigService } from '../../../../services/config.service';
import { AuthService } from '../../../../services/auth.service';
import { MatSnackBar } from '@angular/material';
import { ICoCreatorConfig } from '../../../../models/wingspan-pages.model';


@Component({
  selector: 'app-co-create',
  templateUrl: './co-create.component.html',
  styleUrls: ['./co-create.component.scss']
})
export class CoCreateComponent implements OnInit {
  @Input() config: ICoCreatorConfig;

  showAnwserInput: boolean;

  mailRequest: {
    type: string,
    answer: string
  } = {
      type: '',
      answer: ''
    };

  fixedEmailText: string;
  submitInProgress: boolean = false;
  @ViewChild('toastSuccess', { static: true }) toastSuccess: ElementRef<any>;
  @ViewChild('toastError', { static: true }) toastError: ElementRef<any>;

  constructor(
    private shareSvc: ShareService,
    private configSvc: ConfigService,
    private authSvc: AuthService,
    private matSnackBar: MatSnackBar) { }

  ngOnInit() { }

  sendMail(form) {
    this.submitInProgress = true;
    const req: IEmailTextRequest = {
      emailTo: [
        {
          email: this.configSvc.instanceConfig.features.navigateChange.config.emailTo
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
        text: this.fixedEmailText + '.\n\n' + this.mailRequest.answer,
      },
      timestamp: new Date().getTime(),
      appURL: location.host,
      subject: 'Be a Co-Creator - ' + this.mailRequest.type
    };
    console.log('rrq', req);
    this.shareSvc.shareTextMail(req).subscribe(data => {
      form.resetForm();
      this.matSnackBar.open(this.toastSuccess.nativeElement.value);
      this.submitInProgress = false;
    }, err => {
      this.matSnackBar.open(this.toastError.nativeElement.value);
      this.submitInProgress = false;
    })

  }
  contributionTypeClicked(data) {
    this.mailRequest.type = data.name;
    this.showAnwserInput = true;
    this.fixedEmailText = data.emailText;
  }
}
