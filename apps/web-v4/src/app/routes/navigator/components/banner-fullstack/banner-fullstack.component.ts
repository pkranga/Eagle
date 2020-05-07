/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigatorService } from '../../../../services/navigator.service';
import { RoutingService } from '../../../../services/routing.service';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-banner-fullstack',
  templateUrl: './banner-fullstack.component.html',
  styleUrls: ['./banner-fullstack.component.scss']
})
export class BannerFullstackComponent implements OnInit {
  requestProcessing = true;
  errorOccurred = false;
  availablePrograms: any[];
  thumbnailsHash: { [id: string]: string } = {};
  constructor(
    public routingSvc: RoutingService,
    private contentSvc: ContentService,
    private navSvc: NavigatorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.navSvc.fs.subscribe(
      fsdata => {
        console.log(fsdata);
        console.log(fsdata.length);
        this.contentSvc.fetchMultipleContent(fsdata.map(data => data.fs_linked_program)).subscribe(metas => {
          metas
            .filter(item => item !== null)
            .forEach(item => {
              this.thumbnailsHash[item.identifier] = item.appIcon;
            });
        });
        this.availablePrograms = fsdata;
        this.requestProcessing = false;
      },
      err => {
        this.requestProcessing = false;
        this.errorOccurred = true;
      }
    );
  }

  dpnClicked() {
    this.router.navigateByUrl('/navigator/dpn');
  }
}
