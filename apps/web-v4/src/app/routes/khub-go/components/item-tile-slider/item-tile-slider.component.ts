/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ItemTile } from '../../../../models/khub.model';

/**
 * CODE_REVIEW: equality check with string true instead of boolean. Line 150, 160
 * fixed
 */

@Component({
  selector: 'app-item-tile-slider',
  templateUrl: './item-tile-slider.component.html',
  styleUrls: ['./item-tile-slider.component.scss']
})
export class ItemTileSliderComponent implements OnInit, OnChanges {
  @Input() fetchMoreCallback: any;
  public sliderData: any;
  public left = 'left';
  public right = 'right';
  @Input() style: any;
  @Input() hasMore: boolean;
  @Input() sliderId: string;
  @Input() id: string;
  @Input() showFetchMore: boolean;
  @Input() invokedBy: string;
  @Input() itemtileData: ItemTile[];
  public load = true;
  constructor() {}

  ngOnInit() {
    this.validate();
    this.sliderData = {
      sliderId: this.sliderId,
      itemtileData: this.itemtileData,
      fetchMoreCallback: this.fetchMoreCallback,
      showFetchMore: this.showFetchMore,
      // logEvents: this.logEvents || false,
      invokedBy: this.invokedBy || -1,
      itemWidth: 310,
      showLeft: false,
      showRight: false,
      fetchingMore: false,
      hasMore: this.hasMore || false,
      tileHeight: this.sliderId === 'projects' ? '390px' : '300px'
    };
    this.style = {
      // "margin-top": '100px',
      transform: 'translateX(0px)',
      '-webkit-transform': 'translateX(0px)',
      '-ms-transform': 'translateX(0px)',
      'max-width': 90 + 'vw',
      offleft: 0
      // set: function(key, value) {
      //     applicationService.setter(this, key, value, true);
      // }
    };
    if (this.sliderData.itemtileData.length > 4) {
      this.sliderData.showRight = true;
    }
  }
  // will be evaluated for  more data
  ngOnChanges(data: any) {
    if (data.hasOwnProperty('itemtileData')) {
      if (!data.itemtileData.isFirstChange()) {
        if (data.itemtileData.currentValue.length > this.sliderData.itemtileData.length + 1) {
          this.sliderData.showRight = true;
        }
        this.sliderData.itemtileData = data.itemtileData.currentValue;
        this.sliderData.fetchingMore = false;
      }
      if (data.hasOwnProperty('hasMore')) {
        if (!data.hasMore.isFirstChange()) {
          this.hasMore = this.hasMore === true ? true : false;
          this.sliderData.hasMore = this.hasMore;
        }
      }
    }
  }
  // will be added in future if user wants to see more tiles than 10 which is default
  fetchMore() {
    try {
      if (this.sliderData.showFetchMore) {
        if (this.fetchMoreCallback && typeof this.fetchMoreCallback === 'function') {
          this.sliderData.fetchingMore = true;
          this.fetchMoreCallback(this.sliderData.sliderId);
        }
      }
    } catch (e) {
      throw e;
    }
  }

  //   moves the tiles to right or left based on user action
  action(type: string) {
    try {
      let left = this.style.offleft;
      const offset = this.sliderData.itemWidth;
      const items = this.sliderData.itemtileData.length;
      const finalLeft = type === 'right' ? left - offset : left + offset;
      this.style = {
        // "margin-top": '100px',
        transform: 'translateX(' + finalLeft + 'px' + ')',
        '-webkit-transform': 'translateX(' + finalLeft + 'px' + ')',
        '-ms-transform': 'translateX(' + finalLeft + 'px' + ')',
        'max-width': 90 + 'vw',
        offleft: finalLeft
      };
      // to calculate how many have been show, to toggle action buttons.
      left = this.style.offleft; // to get new values
      const itemsScrolled = Math.abs(left / offset);

      if (itemsScrolled > 0) {
        this.sliderData.showLeft = true;
      } else {
        this.sliderData.showLeft = false;
      }
      // check if is fetchmore or not. then show fetchmore and hide right action btn,
      const checker = this.sliderData.showFetchMore && this.sliderData.hasMore ? itemsScrolled + 3 : itemsScrolled + 4;

      if (checker >= items) {
        this.sliderData.showRight = false;
      } else {
        this.sliderData.showRight = true;
      }

      // to emit any parent component which will know that slider happened for
      // other utilities like to log and to know what page we are on
    } catch (e) {
      throw e;
    }
  }

  //   validates the content and marker actions
  validate() {
    try {
      // validate all bindings.
      if (!this.sliderId) {
        throw new Error('Item Tile Slider Component requires sliderId binding');
      }
      if (!this.id) {
        throw new Error('Item Tile Slider Component requires id binding');
      }
      if (!this.itemtileData) {
        throw new Error('Item Tile Slider Component requires itemtileData binding');
      }
      if (!this.invokedBy) {
        throw new Error('Item Tile Slider Component requires invokedBy binding');
      }
      // all bindings are strings.
      if (!this.showFetchMore) {
        this.showFetchMore = false;
      } else {
        if (this.showFetchMore === true) {
          this.showFetchMore = true;
        } else {
          this.showFetchMore = false;
        }
      }

      if (!this.hasMore) {
        this.hasMore = false;
      } else {
        if (this.hasMore === true) {
          this.hasMore = true;
        } else {
          this.hasMore = false;
        }
      }
    } catch (e) {
      throw e;
    }
  }
}
