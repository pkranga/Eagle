/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SkillQuotientComponent } from './components/skill-quotient/skill-quotient.component';
import { RoleQuotientComponent } from './components/role-quotient/role-quotient.component';
import { AddRoleComponent } from './components/add-role/add-role.component';
import { CreateProjectEndorsementComponent } from './components/create-project-endorsement/create-project-endorsement.component';
import { ViewProjectEndorsementComponent } from './components/view-project-endorsement/view-project-endorsement.component';
import { QuotientComponent } from './components/quotient/quotient.component';
import { EditRoleComponent } from './components/edit-role/edit-role.component';
import { PopularSkillsComponent } from './components/popular-skills/popular-skills.component';
import { CreateSkillGroupComponent } from './components/create-skill-group/create-skill-group.component';
import { ShareRoleComponent } from './components/share-role/share-role.component';
import { AllSkillsComponent } from './components/all-skills/all-skills.component';
import { SampleSkillQuotientComponent } from './components/sample-skill-quotient/sample-skill-quotient.component';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SkillQuotientComponent
  },
  {
    path: 'my-roles',
    component: RoleQuotientComponent
  },
  {
    path: 'add-role',
    component: AddRoleComponent
  },
  {
    path: 'edit-role',
    component: EditRoleComponent
  },
  {
    path: 'create-project-endorsement',
    component: CreateProjectEndorsementComponent
  },
  {
    path: 'view-project-endorsement',
    component: ViewProjectEndorsementComponent
  },
  {
    path: 'skills',
    component: QuotientComponent
  },
  {
    path: 'popular-skills',
    component: PopularSkillsComponent
  },
  {
    path: 'share-role',
    component: ShareRoleComponent
  },
  {
    path: 'add-skill-group',
    component: CreateSkillGroupComponent
  },
  {
    path: 'skill-quotient',
    component: SampleSkillQuotientComponent
  },
  {
    path: 'all-skills',
    component: AllSkillsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillQuotientRoutingModule {}
