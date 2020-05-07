/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Lab42Component } from './lab42.component';

describe('Lab42Component', () => {
  let component: Lab42Component;
  let fixture: ComponentFixture<Lab42Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Lab42Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Lab42Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
