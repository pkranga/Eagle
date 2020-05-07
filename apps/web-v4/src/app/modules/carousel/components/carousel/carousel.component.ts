/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { IInstanceConfigBannerUnit } from '../../../../models/instanceConfig.model';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @ContentChild(TemplateRef, { static: true }) template: TemplateRef<any>;
  @Input() banners: Array<IInstanceConfigBannerUnit>;
  @Input() showNavigation = true;

  currentIndex = 0;
  slideInterval: NodeJS.Timer;

  constructor(private router: Router) {}

  ngOnInit() {
    this.reInitiateSlideInterval();
  }

  reInitiateSlideInterval() {
    try {
      if (this.slideInterval) {
        clearInterval(this.slideInterval);
      }
    } catch (e) {
    } finally {
      this.slideInterval = setInterval(() => {
        if (this.currentIndex === this.banners.length - 1) {
          this.currentIndex = 0;
        } else {
          this.currentIndex += 1;
        }
      }, 5000);
    }
  }

  slide(dir: 'left' | 'right') {
    if (dir === 'left') {
      if (this.currentIndex === 0) {
        this.currentIndex = this.banners.length - 1;
      } else {
        this.currentIndex -= 1;
      }
    } else if (dir === 'right') {
      if (this.currentIndex === this.banners.length - 1) {
        this.currentIndex = 0;
      } else {
        this.currentIndex += 1;
      }
    }
    this.reInitiateSlideInterval();
  }

  slideTo(index: number) {
    if (index >= 0 && index < this.banners.length) {
      this.currentIndex = index;
    } else {
      this.currentIndex = 0;
    }
    this.reInitiateSlideInterval();
  }

  navigate(banner: IInstanceConfigBannerUnit) {
    if (banner.openInNewTab) {
      window.open(banner.url);
    } else {
      if (banner.url) {
        this.router.navigateByUrl(banner.url);
      }
    }
  }
}
