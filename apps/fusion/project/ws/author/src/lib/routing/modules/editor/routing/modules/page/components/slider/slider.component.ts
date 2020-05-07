/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { WidgetEditorBaseComponent } from '@ws/author/src/lib/routing/modules/editor/routing/modules/page/interface/component'
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { ICarousel } from '@ws-widget/collection/src/public-api'
import { FormGroup, FormBuilder } from '@angular/forms'

@Component({
  selector: 'ws-auth-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent extends WidgetEditorBaseComponent<ICarousel> implements OnInit {
  bannerForm!: FormGroup

  @Input() identifier!: string
  @Input() widgerData!: ICarousel
  @Output() data = new EventEmitter<ICarousel>()
  banners: ICarousel[] = []
  infoType = ''
  bannerTabs = ['Banner 1']
  selectedIndex = 0
  constructor(
    private formBuilder: FormBuilder,
  ) {
    super()
  }

  ngOnInit() {
    this.bannerForm = this.formBuilder.group({
      title: [],
      redirectUrl: [],
      newTab: [],
      banners: [],
    })
  }

  showInfo(info: string) {
    this.infoType = info
  }

  addBanner() {
    this.bannerTabs.push(`Banner ${this.bannerTabs.length + 1}`)
    this.selectedIndex = this.bannerTabs.length + 1
  }
}
