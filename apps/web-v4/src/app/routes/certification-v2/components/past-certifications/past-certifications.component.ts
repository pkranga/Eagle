/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, noop } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ICertificationSubmission, TCertificationCompletionStatus } from '../../../../models/certification.model';
import { CertificationService } from '../../../../services/certification.service';
import { FetchStatus } from '../../../../models/status.model';

@Component({
  selector: 'ws-past-certifications',
  templateUrl: './past-certifications.component.html',
  styleUrls: ['./past-certifications.component.scss']
})
export class PastCertificationsComponent implements OnInit {
  pastCertifications: ICertificationSubmission[];
  certificationsFetchStatus: FetchStatus;
  statusControl: FormControl;
  fetchSubject: BehaviorSubject<TCertificationCompletionStatus>;

  constructor(private certificationSvc: CertificationService) {
    this.statusControl = new FormControl('completed');
    this.fetchSubject = new BehaviorSubject(this.statusControl.value);
  }

  ngOnInit() {
    this.fetchSubject
      .pipe(
        tap(() => {
          this.certificationsFetchStatus = 'fetching';
        }),
        switchMap(status => this.certificationSvc.getPastCertifications(status))
      )
      .subscribe(
        certifications => {
          this.pastCertifications = certifications;
          this.certificationsFetchStatus = 'done';
        },
        () => {
          this.certificationsFetchStatus = 'error';
        }
      );

    this.statusControl.valueChanges.subscribe((value: TCertificationCompletionStatus) => {
      this.fetchSubject.next(value);
    }, noop);
  }
}
