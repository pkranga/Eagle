/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { CertificationService } from '../../../../services/certification.service';
import { IContent } from '../../../../models/content.model';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.scss']
})
export class CertificationComponent implements OnInit {
  @Input() cardType: 'basic' | 'advanced' = 'advanced';
  latestCertifications: IContent[] = [];
  constructor(private certificationSvc: CertificationService) { }

  ngOnInit() {
    this.certificationSvc.fetchCertifications().subscribe(data => {
      data.sortedList = data.sortedList.filter(
        content =>
          content.certificationStatus !== 'passed' &&
          content.certificationStatus !== 'cannotAttempt'
      );
      this.latestCertifications = data.sortedList;
    });
  }
}
