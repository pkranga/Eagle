/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { TenantAdminComponent } from './tenant-admin.component'
import { UserRegistrationComponent } from './routes/user-registration/user-registration.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'user-registration',
  },
  // {
  //   path: 'page/home',
  //   component: HomeComponent,
  // },
  {
    path: 'user-registration',
    component: UserRegistrationComponent,
  },
  {
    path: 'registered-users',
    loadChildren: () => import('./routes/registered-users/registered-users.module').then(u => u.RegisteredUsersModule),
  },
  // {
  //   path: 'user-roles',
  //   component: UserRolesComponent,
  // },
]

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: TenantAdminComponent,
        children: routes,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class TenantAdminRoutingModule { }
