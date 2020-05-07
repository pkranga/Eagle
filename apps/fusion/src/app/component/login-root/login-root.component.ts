/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core'
import { LoginRootDirective } from './login-root.directive'
import { LoginRootService } from './login-root.service'

@Component({
  selector: 'ws-login-root',
  templateUrl: './login-root.component.html',
  styleUrls: ['./login-root.component.scss'],
})
export class LoginRootComponent implements OnInit {

  @ViewChild(LoginRootDirective, { static: true }) wsLoginRoot!: LoginRootDirective
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private loginRootSvc: LoginRootService,
  ) { }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.loginRootSvc.getComponent())
    const viewContainerRef = this.wsLoginRoot.viewContainerRef
    viewContainerRef.clear()
    viewContainerRef.createComponent(componentFactory)
  }

  ngOnInit() {
    this.loadComponent()
  }

}
