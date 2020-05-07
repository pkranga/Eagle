/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDevelopmentPlanComponent } from './candidate-development-plan.component';

describe('CandidateDevelopmentPlanComponent', () => {
  let component: CandidateDevelopmentPlanComponent;
  let fixture: ComponentFixture<CandidateDevelopmentPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateDevelopmentPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateDevelopmentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
