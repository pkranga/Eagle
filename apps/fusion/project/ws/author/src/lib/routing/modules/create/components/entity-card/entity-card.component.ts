/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { IEntity } from '../../interface/entity'
import { AccessControlService } from '@ws/author/src/lib/modules/shared/services/access-control.service'

@Component({
  selector: 'ws-auth-entity-card',
  templateUrl: './entity-card.component.html',
  styleUrls: ['./entity-card.component.scss'],
})
export class EntityCardComponent implements OnInit {
  @Input() entity!: IEntity
  @Input() expanded!: boolean
  @Output() step = new EventEmitter<any>()
  resourceClicked = false
  isResource = false
  movableEntity = false
  resourceOpened = false
  notEnabled = false
  optionsDisabled = true

  constructor(
    private accessControl: AccessControlService,
  ) { }

  ngOnInit() {
    this.movableEntity = false
    this.resourceClicked = this.expanded
    this.notEnabled = !this.accessControl.hasRole(this.entity.hasRole)
    if (['Resource', 'Channel Page', 'Knowledge Board', 'Knowledge Artifact'].indexOf(this.entity.name) > -1) {
      this.isResource = true
    } else if (['Program', 'Course', 'Module'].indexOf(this.entity.name) > -1) {
      this.notEnabled = true
      this.movableEntity = true
    }
path
      this.notEnabled = true
      this.movableEntity = true
      this.isResource = false
    }
  }

  entityClicked(content: IEntity, index: number) {
    if (content.name === 'Resource') {
      this.resourceClicked = !this.resourceClicked
    } else if (!this.notEnabled) {
      if (index <= 1) {
        this.step.emit(content)
      }
    }
  }
}
