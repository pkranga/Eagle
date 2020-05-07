/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import { IKhubResult } from '../../../../models/khub.model';
import { ConfigService } from '../../../../services/config.service';
import { KhubService } from '../../../../services/khub.service';
import { IContent } from '../../../../models/content.model';
import { IconData } from '../../constants/khubData';
/**
 * CODE_REVIEW: assets being used directly in HTML
 * all these assets will not be present in other instance builds
 * REPLACE with env_var
 */

@Component({
  selector: 'app-home-bubble',
  templateUrl: './home-bubble.component.html',
  styleUrls: ['./home-bubble.component.scss']
})
export class HomeBubbleComponent implements OnInit, OnChanges {
  @Input() isIntranet: boolean;
  @Input() marketingContent: IContent[];
  modalPaddingFromTop = 0;
  public showModelTile = false;
  public iconData = Object.assign(IconData);
  banner = {
    bannerImg: this.confServ.instanceConfig.features.khub.config.khubImages.banner_background,
    loaderGif: this.confServ.instanceConfig.features.khub.config.khubImages.loaderGif
  };
  public uiData = {
    modalState: false,
    currentPopup: null
  };
  public modalVisibility = {
    current: '',
    Project: false,
    automationcentral: false,
    Document: false,
    Innovation: false,
    Video: false,
    Learning: false,
    Sales: false
  };
  selected = 'Project';
  public selected2 = 'Project';
  public show1 = 'show';
  public expand = 'expand';
  //   public data :any;
  @Input() count: IKhubResult;
  @Input() show: boolean;
  constructor(private khubSvc: KhubService, private myElement: ElementRef, private confServ: ConfigService) {
    this.iconData.Sales.icon = this.confServ.instanceConfig.features.khub.config.khubImages.marketing;
    this.iconData.KShop.icon = this.confServ.instanceConfig.features.khub.config.khubImages.kshop;
    this.iconData.automationcentral.icon = this.confServ.instanceConfig.features.khub.config.khubImages.automation;
    this.iconData.Project.icon = this.confServ.instanceConfig.features.khub.config.khubImages.project;
  }

  ngOnInit() {}

  ngOnChanges() {
    if (this.show) {
      this.iconData.KShop.countText = this.count.kshop.length + '';
      this.iconData.KShop.data = this.khubSvc.setTiles(this.count.kshop);
      this.iconData.automationcentral.countText = this.count.automationcentral.length + '';
      this.iconData.automationcentral.data = this.khubSvc.setTiles(this.count.automationcentral);
      this.iconData.Project.countText = this.count.project.length + '';
      this.iconData.Project.data = this.khubSvc.setTiles(this.count.project);
      // this.iconData.Sales.countText = this.marketingContent.length > 15 ? 25 : '';
      this.iconData.Sales.countText = this.marketingContent.length;
      this.iconData.Sales.data = this.khubSvc.setMarketing(this.marketingContent);
    }
  }
  // zoom on model hover
  showModalHover(key: any, count: any) {
    try {
      if (count > 0) {
        this.uiData.modalState = true;
        this.iconData[key].grow = true;
        this.uiData.currentPopup = key;
        document.body.style.overflowY = 'inherit';
      }
    } catch (e) {
      throw e;
    }
  }
  // highlight a single bubble model
  showModal(key: any, id: any, action: any) {
    try {
      if (this.iconData[key].data.length <= 0) {
        return;
      }
      if (action === 'show') {
        this.selected = key;
        this.selected2 = key !== 'Sales' ? key : 'Marketing';
        this.showModelTile = true;
        // console.log(id,key);
        let scroll = 0;
        scroll = scroll < this.modalPaddingFromTop ? scroll : scroll - this.modalPaddingFromTop - 80;

        // Displaying the modals
        this.modalVisibility[key] = true;
        this.modalVisibility.current = key;
        // Unhiding modals
        // Getting the height of body because black screen has to fill whole body
        // Blacking out the screen
        const mainRowHeight = window.getComputedStyle(document.getElementsByTagName('body')[0]).height;
        // const mainRowwidth = window.getComputedStyle(document.getElementsByTagName('body')[0]).width;
        const blackElement = document.getElementById('translucent-black');
        blackElement.style.height = mainRowHeight;
        // console.log(mainRowHeight,typeof mainRowHeight,window.getComputedStyle(document.getElementsByTagName('body')[0]));
        // blackElement.style.width = mainRowwidth;
        blackElement.style.visibility = 'visible';
        const element = document.getElementById(key.toLowerCase() + '-icon-wrapper');
        // Displaying the icons
        element.style.zIndex = '200';

        // Stopping grow animation for icon
        element.className = 'icon-wrapper permanent-grow';
        // this.homeService.scrollTo(scroll, 1);
        document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
        this.scrollToElement(key.toLowerCase() + '-icon-wrapper');
      }
    } catch (e) {
      throw e;
    }
  }
  // hides model on click on any window
  hideModal() {
    try {
      this.uiData.modalState = false;
      for (const key in this.iconData) {
        if (this.iconData[key].grow) {
          this.iconData[key].grow = false;
        }
      }
      // this.selected = 'Project';

      document.body.style.overflowY = 'inherit';
    } catch (e) {
      throw e;
    }
  }

  //   hides the highlighted bubble element
  hideBubble() {
    this.modalVisibility[this.modalVisibility.current] = false;
    const element = document.getElementById(this.modalVisibility.current.toLowerCase() + '-icon-wrapper');
    // Resetting z-index of icon
    document.getElementById(this.modalVisibility.current.toLowerCase() + '-icon-wrapper').style.zIndex = '';

    // Adding back the grow animation
    element.className = 'icon-wrapper grow';
    document.getElementById('translucent-black').style.visibility = 'hidden';
    document.getElementsByTagName('body')[0].style.overflowY = '';
    this.showModelTile = false;
    // this.scrollToElement('khubHome-id-12');
  }
  // scroll to respective content on view more button click
  scrollToElement(key?: string) {
    try {
      if (!key) {
        const el = this.myElement.nativeElement.ownerDocument.getElementById(this.selected2.toLowerCase() + 'model');
        el.scrollIntoView();
      } else {
        const el = this.myElement.nativeElement.ownerDocument.getElementById(key);
        el.scrollIntoView();
      }
    } catch (e) {}
  }
}
