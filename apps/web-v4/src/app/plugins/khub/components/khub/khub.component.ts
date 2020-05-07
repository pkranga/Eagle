/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KhubService } from '../../../../services/khub.service';
import { ItemTile, IKhubProject, IErrorObj } from '../../../../models/khub.model';
import { RoutingService } from '../../../../services/routing.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UserApiService } from '../../../../apis/user-api.service';

const pdfPluginPath = '/public-assets/common/plugins/pdf/web/viewer.html';

@Component({
  selector: 'ws-khub',
  templateUrl: './khub.component.html',
  styleUrls: ['./khub.component.scss']
})
export class KhubComponent implements OnInit {
  viewObj = {
    category: '',
    itemId: '',
    source: ''
  };
  type = '';
  fetchStatus: boolean;
  recsStatus: boolean;
  item: ItemTile;
  result: ItemTile;
  iframeUrl;
  viewData: IKhubProject;
  moreRecs: ItemTile[];
  public fixed = false;
  public errObj: IErrorObj = {
    show: false,
    title: 'Check your Internet connection',
    body: 'Some Error Occured While Fetching the Artifact details please try later',
    cancelText: 'Back',
    modelType: 'danger',
    btnType: 'primary',
    okText: 'ok'
  };
  isIntranet: boolean;
  constructor(
    private activated: ActivatedRoute,
    private router: Router,
    private khubServ: KhubService,
    private domSanitizer: DomSanitizer,
    public routingSvc: RoutingService,
    private userApi: UserApiService
  ) {}

  ngOnInit() {
    this.activated.params.subscribe(params => {
      this.fetchStatus = false;
      this.recsStatus = false;
      this.viewObj.itemId = params.itemId;
      this.fetchPerData();
    });
    this.userApi.checkIfIntranet().subscribe(data => {
      this.isIntranet = data;
    });
  }

  fetchPerData() {
    try {
      this.khubServ.fetchViewData(this.viewObj).subscribe(
        data => {
          const key = Object.keys(data)[0];
          this.result = this.khubServ.setTiles(data[key])[0];
          this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.result.url);
          // this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.getUrl(this.result.url));
          this.fetchStatus = true;
          this.viewData = data[key][0];
          this.type = this.result.source.toLowerCase() === 'promt' ? 'Project' : 'Document';
          const resObj = {
            category: this.result.source.toLowerCase() === 'promt' ? 'project' : 'document',
            itemId: '' + this.result.itemId,
            source: this.result.source.toLowerCase() === 'promt' ? 'project' : this.result.source.toLowerCase()
          };
          this.khubServ.fetchMoreLikeThis(resObj).subscribe(
            data1 => {
              this.moreRecs = this.khubServ.setTiles(data1.hits);
              this.recsStatus = true;
            },
            error => {
              console.error(error);
              this.moreRecs = [];
              this.recsStatus = true;
            }
          );
        },
        error => {
          console.error(error);
          this.errObj.show = true;
          this.fetchStatus = false;
        }
      );
    } catch (e) {
      console.error(e);
    }
  }
  gotoView(tag: string) {
    try {
      this.router.navigate(['/khub/kgraph/' + tag]);
    } catch (e) {
      console.error(e);
    }
  }
  private getUrl(url): string {
    return `${pdfPluginPath}?file=${encodeURIComponent(url)}`;
  }
}
