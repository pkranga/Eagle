/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TreeCatalogMenuComponent } from './tree-catalog-menu.component'

describe('TreeCatalogMenuComponent', () => {
  let component: TreeCatalogMenuComponent
  let fixture: ComponentFixture<TreeCatalogMenuComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreeCatalogMenuComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeCatalogMenuComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
