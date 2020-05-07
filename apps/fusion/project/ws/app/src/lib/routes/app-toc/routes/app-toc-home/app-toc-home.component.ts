/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, ComponentFactoryResolver, ViewChild } from '@angular/core'
import { AppTocHomeDirective } from './app-toc-home.directive'
import { AppTocHomeService } from './app-toc-home.service'
@Component({
  selector: 'ws-app-app-toc-home-root',
  templateUrl: './app-toc-home.component.html',
  styleUrls: ['./app-toc-home.component.scss'],
})
export class AppTocHomeComponent implements OnInit {
  @ViewChild(AppTocHomeDirective, { static: true }) wsAppAppTocHome!: AppTocHomeDirective

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appTocHomeSvc: AppTocHomeService,
  ) { }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.appTocHomeSvc.getComponent())
    const viewContainerRef = this.wsAppAppTocHome.viewContainerRef
    viewContainerRef.clear()
    viewContainerRef.createComponent(componentFactory)
  }

  ngOnInit() {
    this.loadComponent()
  }

}
