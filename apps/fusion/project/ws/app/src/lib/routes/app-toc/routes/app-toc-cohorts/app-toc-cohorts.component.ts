/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core'
import { AppTocCohortsService } from './app-toc-cohorts.service'
import { AppTocCohortsDirective } from './app-toc-cohorts.directive'

@Component({
  selector: 'ws-app-app-toc-cohorts',
  templateUrl: './app-toc-cohorts.component.html',
  styleUrls: ['./app-toc-cohorts.component.scss'],
})
export class AppTocCohortsComponent implements OnInit {

  @ViewChild(AppTocCohortsDirective, { static: true }) wsAppAppTocCohorts!: AppTocCohortsDirective
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appTocCohortsSvc: AppTocCohortsService,
  ) { }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.appTocCohortsSvc.getComponent())
    const viewContainerRef = this.wsAppAppTocCohorts.viewContainerRef
    viewContainerRef.clear()
    viewContainerRef.createComponent(componentFactory)
  }

  ngOnInit() {
    this.loadComponent()
  }

}
