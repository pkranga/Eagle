/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KhubService } from '../../../../services/khub.service';
import { ItemTile, IKhubProject, IErrorObj } from '../../../../models/khub.model';
import { RoutingService } from '../../../../services/routing.service';
import { ValuesService } from '../../../../services/values.service';
import { UserApiService } from '../../../../apis/user-api.service';

@Component({
  selector: 'app-khub-view',
  templateUrl: './khub-view.component.html',
  styleUrls: ['./khub-view.component.scss']
})
export class KhubViewComponent implements OnInit, OnDestroy {
  private defaultSideNavBarOpenedSubscription;
  isLtMedium$ = this.valueSvc.isLtMedium$;
  screenSizeIsLtMedium: boolean;
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
  hasInternetUrl: boolean;
  url: any;
  isIntranet: boolean;
  constructor(
    private activated: ActivatedRoute,
    private router: Router,
    private khubServ: KhubService,
    public routingSvc: RoutingService,
    private valueSvc: ValuesService,
    private userApi: UserApiService
  ) {}
  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   const num = this.doc.body.scrollTop;
  //   if (num > 50) {
  //     this.fixed = true;
  //   } else if (this.fixed && num < 5) {
  //     this.fixed = false;
  //   }
  // }

  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.screenSizeIsLtMedium = isLtMedium;
    });
    this.activated.params.subscribe(params => {
      this.fetchStatus = false;
      this.recsStatus = false;
      this.viewObj.category = params.category;
      this.viewObj.itemId = params.itemId;
      this.fetchPerData();
      // this.item = this.khubServ.getSelectedItem();
    });
    this.userApi.checkIfIntranet().subscribe(data => {
      // console.log('isIntra >', data);
      this.isIntranet = data;
    });
  }
  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe();
    }
  }

  fetchPerData() {
    try {
      this.khubServ.fetchViewData(this.viewObj).subscribe(
        data => {
          const key = Object.keys(data)[0];
          this.result = this.khubServ.setTiles(data[key])[0];
          this.fetchStatus = true;
          this.viewData = data[key][0];
          this.type = this.result.source.toLowerCase() === 'promt' ? 'Project' : 'Document';
          const resObj = {
            category: this.result.source.toLowerCase() === 'promt' ? 'project' : 'document',
            itemId: '' + this.result.itemId,
            source: this.result.source.toLowerCase() === 'promt' ? 'project' : this.result.source.toLowerCase()
          };
          // if (data[key][0].sourceId && typeof data[key][0].sourceId === 'string') {
          //   this.hasInternetUrl = true;
          //   this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://kshopt.azurewebsites.net/aspx/kshopwrapper?DocID=159295');
          //   // data[key][0].url
          // }
          console.log(data[key][0]);
          if (data[key][0].identifier && data[key][0].url.indexOf('private-content-service') !== -1) {
            this.hasInternetUrl = true;
            this.url = data[key][0].identifier;
          }
          this.khubServ.fetchMoreLikeThis(resObj).subscribe(
            data1 => {
              this.moreRecs = this.khubServ.setTiles(data1.hits);
              this.recsStatus = true;
            },
            error => {
              throw error;
              this.moreRecs = [];
              this.recsStatus = true;
            }
          );
        },
        error => {
          throw error;
          this.errObj.show = true;
          this.fetchStatus = false;
        }
      );
    } catch (e) {
      throw e;
    }
  }
  gotoView(tag: string) {
    try {
      this.router.navigate(['/khub/kgraph/' + tag]);
    } catch (e) {
      throw e;
    }
  }
}
