/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { IWidgetAuthor } from './../../../interface/widget'
import { Component, OnInit, Input, OnChanges } from '@angular/core'
import { ChannelStoreService } from './../../../services/store.service'
import { ChannelResolverService } from './../../../services/resolver.service'

@Component({
  selector: 'ws-auth-selector-responsive',
  templateUrl: './selector-responsive.component.html',
  styleUrls: ['./selector-responsive.component.scss'],
})
export class SelectorResponsiveComponent implements OnInit, OnChanges {

  @Input() id = ''
  @Input() currentIndex = 0
  @Input() isSubmitPressed = false
  widget!: IWidgetAuthor

  constructor(
    private store: ChannelStoreService,
    private renderService: ChannelResolverService,
  ) { }

  ngOnInit() {
    this.store.update.subscribe(
      (id: string) => {
        if (id === this.id) {
          this.initiate()
        }
      },
    )
  }

  ngOnChanges() {
    this.initiate()
  }

  initiate() {
    this.widget = this.store.getUpdatedContent(this.id)
    if (this.widget && (!this.widget.children || !this.widget.children.length)) {
      const data = this.renderService.renderFromJSON({} as any)
      const node = data[Object.keys(data)[0]]
      node.addOnData = {
        minWidth: 0,
        maxWidth: 100000,
      }
      node.parent = this.id
      this.widget.children.push(node.id)
      this.store.updateContent(node.id, node, false)
      this.store.updateContent(this.id, this.widget, false)
    }
  }

  triggerEdit() {
    this.store.triggerEdit(this.id)
  }

}
