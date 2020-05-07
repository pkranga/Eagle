/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ConfigService } from '../../../../services/config.service';
import { UtilityService as UtilitySvc } from '../../../../services/utility.service';
import { UtilityService } from '../../services/utility.service';
@Component({
  selector: 'app-certification-panel',
  templateUrl: './certification-panel.component.html',
  styleUrls: ['./certification-panel.component.scss']
})
export class CertificationPanelComponent implements OnInit, OnChanges {
  @Input()
  lpItems: any[];

  showAlternativesCertificationsFor: string;
  certificateHash = {};
  alternativesHash = {};
  isCardSelected = {};
  availableCertifications: any[] = [];

  sendingMailInProgress: { [id: string]: boolean } = {};

  constructor(
    private utilSvc: UtilityService,
    private utilSvcGen: UtilitySvc,
    private router: Router,
    private snackBar: MatSnackBar,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.availableCertifications = [];
    this.lpItems.forEach(lpItem => this.addCertfication(lpItem));
  }

  ngOnChanges(_changes): void {
    this.availableCertifications = [];
    this.lpItems.forEach(lpItem => this.addCertfication(lpItem));
  }

  addCertfication(lpItem) {
    lpItem.lp_internal_certification = lpItem.lp_internal_certification || lpItem.fs_internal_certification;
    lpItem.lp_external_certification = lpItem.lp_external_certification || lpItem.fs_external_certification;
    lpItem.lp_internal_certification = lpItem.lp_internal_certification.map(cert => {
      cert.lp_internal_certification_id = cert.lp_internal_certification_id || cert.internal_certification_id;
      cert.lp_internal_certification_name = cert.lp_internal_certification_name || cert.internal_certification_name;
      cert.lp_internal_certification_description =
        cert.lp_internal_certification_description || cert.internal_certification_desc;
      cert.lp_internal_certification_link =
        cert.lp_internal_certification_link || cert.internal_certification_link || 'http://learninghub/';
      return cert;
    });
    lpItem.lp_external_certification = lpItem.lp_external_certification.map(cert => {
      cert.lp_external_certification_id = cert.lp_external_certification_id || cert.external_certification_id;
      cert.lp_external_certification_name = cert.lp_external_certification_name || cert.external_certification_name;
      cert.lp_external_certification_description =
        cert.lp_external_certification_description || cert.external_certification_desc;
      cert.lp_external_certification_link =
        cert.lp_external_certification_link || cert.external_certification_link || 'http://learninghub/';
      return cert;
    });
    if (lpItem.lp_internal_certification.length > 0) {
      lpItem.lp_internal_certification.forEach(certificate => {
        if (!certificate.is_alternate) {
          let i_alternates = lpItem.lp_internal_certification
            .filter(
              i_cert =>
                i_cert.is_alternate &&
                i_cert.alternate_parent_id &&
                i_cert.alternate_parent_id[0] === 'internal' &&
                i_cert.alternate_parent_id[1] === certificate.lp_internal_certification_id
            )
            .map(i_cert => {
              return {
                id: 'internal_' + i_cert.lp_internal_certification_id,
                title: i_cert.lp_internal_certification_name,
                description: i_cert.lp_internal_certification_description,
                certificationType: 'internal-certification',
                certificationUrl: i_cert.lp_internal_certification_link || 'http://learninghub/',
                alternate_parent_id: i_cert.alternate_parent_id,
                virtual_proctoring: i_cert.virtual_proctoring,
                virutal_proctoring_id: i_cert.virutal_proctoring_id
              };
            });
          i_alternates = i_alternates
            .concat(
              lpItem.lp_external_certification.filter(
                e_cert =>
                  e_cert.is_alternate &&
                  e_cert.alternate_parent_id &&
                  e_cert.alternate_parent_id[0] === 'internal' &&
                  e_cert.alternate_parent_id[1] === certificate.lp_internal_certification_id
              )
            )
            .map(e_cert => {
              return {
                id: 'external_' + e_cert.lp_external_certification_id,
                title: e_cert.lp_external_certification_name,
                description: e_cert.lp_external_certification_description,
                certificationType: 'external-certification',
                certificationUrl: e_cert.lp_external_certification_link || 'http://learninghub/',
                alternate_parent_id: e_cert.alternate_parent_id,
                virtual_proctoring: e_cert.virtual_proctoring,
                virutal_proctoring_id: e_cert.virutal_proctoring_id
              };
            });
          this.alternativesHash['internal_' + certificate.lp_internal_certification_id] = i_alternates;
          this.availableCertifications.push({
            id: 'internal_' + certificate.lp_internal_certification_id,
            title: certificate.lp_internal_certification_name,
            description: certificate.lp_internal_certification_description,
            certificationType: 'internal-certification',
            certificationUrl: certificate.lp_internal_certification_link || 'http://learninghub/',
            has_alternate_certificates: i_alternates && i_alternates.length,
            virtual_proctoring: certificate.virtual_proctoring,
            virutal_proctoring_id: certificate.virtual_proctoring_id
          });
        }
      });
    }
    if (lpItem.lp_external_certification.length > 0) {
      lpItem.lp_external_certification.forEach(certificate => {
        if (!certificate.is_alternate) {
          let e_alternates = lpItem.lp_internal_certification
            .filter(
              i_cert =>
                i_cert.is_alternate &&
                i_cert.alternate_parent_id &&
                i_cert.alternate_parent_id[0] === 'external' &&
                i_cert.alternate_parent_id[1] === certificate.lp_external_certification_id
            )
            .map(i_cert => {
              return {
                id: 'internal_' + i_cert.lp_internal_certification_id,
                title: i_cert.lp_internal_certification_name,
                description: i_cert.lp_internal_certification_description,
                certificationType: 'internal-certification',
                certificationUrl: i_cert.lp_internal_certification_link || 'http://learninghub/',
                alternate_parent_id: i_cert.alternate_parent_id,
                virtual_proctoring: i_cert.virtual_proctoring,
                virutal_proctoring_id: i_cert.virutal_proctoring_id
              };
            });
          e_alternates = e_alternates
            .concat(
              lpItem.lp_external_certification.filter(
                e_cert =>
                  e_cert.is_alternate &&
                  e_cert.alternate_parent_id &&
                  e_cert.alternate_parent_id[0] === 'external' &&
                  e_cert.alternate_parent_id[1] === certificate.lp_external_certification_id
              )
            )
            .map(e_cert => {
              return {
                id: 'external_' + e_cert.lp_external_certification_id,
                title: e_cert.lp_external_certification_name,
                description: e_cert.lp_external_certification_description,
                certificationType: 'external-certification',
                certificationUrl: e_cert.lp_external_certification_link || 'http://learninghub/',
                alternate_parent_id: e_cert.alternate_parent_id,
                virtual_proctoring: e_cert.virtual_proctoring,
                virutal_proctoring_id: e_cert.virutal_proctoring_id
              };
            });
          this.alternativesHash['external_' + certificate.lp_external_certification_id] = e_alternates;
          this.availableCertifications.push({
            id: 'external_' + certificate.lp_external_certification_id,
            title: certificate.lp_external_certification_name,
            description: certificate.lp_external_certification_description,
            certificationType: 'external-certification',
            certificationUrl: certificate.lp_external_certification_link || 'http://learninghub/',
            has_alternate_certificates: e_alternates && e_alternates.length,
            virtual_proctoring: certificate.virtual_proctoring,
            virutal_proctoring_id: certificate.virutal_proctoring_id
          });
        }
      });
    }
    // console.log(lpItem.lp_name, lpItem.lp_external_certification.length, lpItem.lp_external_certification.length);
    // if (lpItem.lp_external_certification.length === 0 && lpItem.lp_external_certification.length === 0) {
    //   console.log(lpItem.lp_name, 'Pushing coming soon');
    //   this.availableCertifications.push({
    //     title: lpItem.lp_name,
    //     description: 'Coming soon...'
    //   });
    // }

    this.availableCertifications.forEach(certificate => {
      this.certificateHash[certificate.id] = certificate;
      certificate.first_alternate =
        this.alternativesHash[certificate.id] && this.alternativesHash[certificate.id].length > 0
          ? this.alternativesHash[certificate.id][0]
          : undefined;
    });
  }

  certificationClicked(certificate) {
    if (!this.configSvc.instanceConfig.features.navigator.subFeatures.navigatorInterested) {
      this.utilSvcGen.featureUnavailable();
      return;
    }
    // let certification = this.availableCertifications.find((cert: any) => cert.id === certificateId);
    // if (!certification) {
    //   certification = this.alternativesHash[this.showAlternativesCertificationsFor].find(
    //     (cert: any) => cert.id === certificateId
    //   );
    // }
    if (certificate.virtual_proctoring) {
      // this.router.navigateByUrl('/viewer/' + certificate.virutal_proctoring_id);
      this.router.navigateByUrl('/toc/' + certificate.virutal_proctoring_id);
    } else {
      this.sendingMailInProgress[certificate.id] = true;
      this.utilSvc
        .sendCertificationEmail(
          certificate.certificationType,
          certificate.title,
          certificate.description,
          certificate.certificationUrl
        )
        .subscribe(
          data => {
            this.sendingMailInProgress[certificate.id] = false;
            this.snackBar.open('A mail has been sent to you with more details');
          },
          error => {
            this.sendingMailInProgress[certificate.id] = false;
            this.snackBar.open('Error sending mail. Please try again later');
          }
        );
    }
  }

  cardEvent(event) {
    if (event.type === 'VIEW_ALL_ALTERNATIVES') {
      this.showAlternativesCertificationsFor = event.certificateId;
      this.isCardSelected[event.certificateId] = true;
      Object.keys(this.isCardSelected).forEach(card => {
        if (card !== event.certificateId) {
          this.isCardSelected[card] = false;
        }
      });
    }
  }
}
