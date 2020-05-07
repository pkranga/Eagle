/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PlayerYoutubeComponent } from './player-youtube.component'

describe('PlayerYoutubeComponent', () => {
  let component: PlayerYoutubeComponent
  let fixture: ComponentFixture<PlayerYoutubeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerYoutubeComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerYoutubeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
