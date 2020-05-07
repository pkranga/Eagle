/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillQuotientComponent } from './components/skill-quotient/skill-quotient.component';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';
import { CreateSkillGroupComponent } from './components/create-skill-group/create-skill-group.component';
import { SkillQuotientRoutingModule } from './skill-quotient-routing.module';
import { DemoMaterialModule } from './materialmodule';
import 'd3';
import 'nvd3';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NvD3Module } from 'ng2-nvd3';
import { EditRoleComponent } from './components/edit-role/edit-role.component';
import { QuotientComponent } from './components/quotient/quotient.component';
import { CreateProjectEndorsementComponent } from './components/create-project-endorsement/create-project-endorsement.component';
import { BoxPlotChartComponent } from './components/box-plot-chart/box-plot-chart.component';
import { CardComponent } from './components/card/card.component';
import { RouterModule } from '@angular/router';
import { ScrollHandlerModule } from '../../modules/scroll-handler/scroll-handler.module';
import { UtilityModule } from '../../modules/utility/utility.module';
import { ProgressModule } from '../../modules/progress/progress.module';
import { RoleQuotientComponent } from './components/role-quotient/role-quotient.component';
import { AddRoleComponent } from './components/add-role/add-role.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ProgressSpinnerModule } from '../../modules/progress-spinner/progress-spinner.module';

import { SpinnerModule } from '../../modules/spinner/spinner.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// tslint:disable:max-line-length
import {
  ViewProjectEndorsementComponent
  // DialogRejectProjectEndorsementComponent,
  // DialogApproveProjectEndorsementComponent
} from './components/view-project-endorsement/view-project-endorsement.component';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { PopularSkillsComponent } from './components/popular-skills/popular-skills.component';
import { LineGraphComponent } from './components/line-graph/line-graph.component';
import { DetailedViewComponent } from './components/detailed-view/detailed-view.component';
import { CourseCardComponent } from './components/course-card/course-card.component';
import { DialogApproveRequestComponent } from './components/dialog-approve-request/dialog-approve-request.component';
import { DialogRejectRequestComponent } from './components/dialog-reject-request/dialog-reject-request.component';
import { DialogDeleteRoleComponent } from './components/dialog-delete-role/dialog-delete-role.component';
import { HomeComponent } from './components/home/home.component';
import { SkillsTabComponent } from './components/skills-tab/skills-tab.component';
import { SampleSkillQuotientComponent } from './components/sample-skill-quotient/sample-skill-quotient.component';
import { SampleRoleTabComponent } from './components/sample-role-tab/sample-role-tab.component';
import { AllSkillsComponent } from './components/all-skills/all-skills.component';
import { ShareRoleComponent } from './components/share-role/share-role.component';
import { SampleRolesComponent } from './components/sample-roles/sample-roles.component';

@NgModule({
  declarations: [
    SkillQuotientComponent,
    DonutChartComponent,
    BoxPlotChartComponent,
    CardComponent,
    RoleQuotientComponent,
    AddRoleComponent,
    QuotientComponent,
    CreateProjectEndorsementComponent,
    ViewProjectEndorsementComponent,
    EditRoleComponent,
    DonutChartComponent,
    BoxPlotChartComponent,
    SkillQuotientComponent,
    CardComponent,
    RoleQuotientComponent,
    AddRoleComponent,
    CreateProjectEndorsementComponent,
    ViewProjectEndorsementComponent,
    // DialogRejectProjectEndorsementComponent,
    // DialogApproveProjectEndorsementComponent,
    QuotientComponent,
    CreateSkillGroupComponent,
    EditRoleComponent,
    PopularSkillsComponent,
    LineGraphComponent,
    DetailedViewComponent,
    CourseCardComponent,
    DialogApproveRequestComponent,
    DialogRejectRequestComponent,
    DialogDeleteRoleComponent,
    HomeComponent,
    SkillsTabComponent,
    SampleSkillQuotientComponent,
    SampleRoleTabComponent,
    AllSkillsComponent,
    ShareRoleComponent,
    SampleRolesComponent
  ],
  entryComponents: [
    DialogApproveRequestComponent,
    DialogRejectRequestComponent,
    DialogDeleteRoleComponent
    // DialogRejectProjectEndorsementComponent,
    // DialogDeleteRole
    // DialogApproveProjectEndorsementComponent
  ],

  imports: [
    CommonModule,
    SkillQuotientRoutingModule,
    DemoMaterialModule,
    NvD3Module,
    SpinnerModule,
    CustomDirectivesModule,
    RouterModule,
    ProgressModule,
    UtilityModule,
    ScrollHandlerModule,
    FormsModule,
    HttpClientModule,
    ProgressSpinnerModule,
    // BrowserAnimationsModule,
    // ReactiveFormsModule,
    HttpModule
  ],
  providers: []
})
export class SkillQuotientModule { }
