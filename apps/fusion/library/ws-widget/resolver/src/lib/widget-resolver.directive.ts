/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Directive, Input, ViewContainerRef, OnChanges } from '@angular/core'
import { LoggerService } from '@ws-widget/utils'
import { NsWidgetResolver } from './widget-resolver.model'
import { WidgetResolverService } from './widget-resolver.service'

@Directive({
  selector: '[wsResolverWidget]',
})
export class WidgetResolverDirective implements OnChanges {
  @Input() wsResolverWidget: NsWidgetResolver.IRenderConfigWithAnyData | null = null
  constructor(
    private viewContainerRef: ViewContainerRef,
    private widgetResolverSvc: WidgetResolverService,
    private logger: LoggerService,
  ) {}

  ngOnChanges() {
    if (!this.widgetResolverSvc.isInitialized) {
      this.logger.error(
        'Widgets Registration Not Done. Used Before Initialization.',
        this.wsResolverWidget,
      )
      return
    }
    if (this.wsResolverWidget) {
      const compRef = this.widgetResolverSvc.resolveWidget(
        this.wsResolverWidget,
        this.viewContainerRef,
      )
      if (compRef) {
        compRef.changeDetectorRef.detectChanges()
      }
    }
  }
}
