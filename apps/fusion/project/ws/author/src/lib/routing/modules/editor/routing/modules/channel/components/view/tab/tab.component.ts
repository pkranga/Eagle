/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { IWidgetAuthor } from './../../../interface/widget'
import { Component, OnInit, Input, OnChanges } from '@angular/core'
import { ChannelStoreService } from './../../../services/store.service'

@Component({
  selector: 'ws-auth-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements OnInit, OnChanges {

  @Input() id = ''
  @Input() isSubmitPressed = false
  widget!: IWidgetAuthor
  widgetDatas!: {
    title: string,
    id: string,
  }[]

  constructor(
    private store: ChannelStoreService,
  ) { }

  ngOnChanges() {
    this.initiate()
  }

  ngOnInit() {
    this.store.update.subscribe(
      (id: string) => {
        if (id === this.id) {
          this.initiate()
        }
      },
    )
  }

  initiate() {
    this.widgetDatas = []
    this.widget = this.store.getUpdatedContent(this.id)
    if (this.widget && this.widget.children.length) {
      this.widget.children.map(v => {
        const data = this.store.getUpdatedContent(v)
        this.widgetDatas.push({
          id: v,
          title: data.addOnData.title,
        })
      })
    }
  }

  triggerEdit(id: string) {
    this.store.triggerEdit(id)
  }

}
