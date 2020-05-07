/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import {
  Directive,
  ElementRef,
  OnDestroy,
  Input,
  OnChanges
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

const customBreakPoints = {
  xs: '(max-width: 414px)',
  s: '(min-width: 414.001px) and (max-width: 768px)',
  m: '(min-width: 768.001px) and (max-width: 1024px)',
  l: '(min-width: 1024.001px) and (max-width: 1280px)',
  xl: '(min-width: 1280.001px)'
};

@Directive({
  selector: '[appResponsiveImageSrc]',
  jit: true
})
export class ResponsiveImageSrcDirective implements OnChanges, OnDestroy {
  @Input()
  appResponsiveImageSrc: {
    xs: string;
    s: string;
    m: string;
    l: string;
    xl: string;
  };

  private currentSize: string;

  private breakpointSubscription: Subscription;
  constructor(
    private elementRef: ElementRef,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe([
        customBreakPoints.xs,
        customBreakPoints.s,
        customBreakPoints.m,
        customBreakPoints.l,
        customBreakPoints.xl
      ])
      .pipe(distinctUntilChanged())
      .subscribe(data => {
        if (data.breakpoints[customBreakPoints.xl]) {
          this.currentSize = 'xl';
        } else if (data.breakpoints[customBreakPoints.l]) {
          this.currentSize = 'l';
        } else if (data.breakpoints[customBreakPoints.m]) {
          this.currentSize = 'm';
        } else if (data.breakpoints[customBreakPoints.s]) {
          this.currentSize = 's';
        } else if (data.breakpoints[customBreakPoints.xs]) {
          this.currentSize = 'xs';
        } else {
          this.currentSize = 'xl';
        }
        this.setSrc();
      });
  }
  ngOnChanges() {
    if (this.elementRef && this.appResponsiveImageSrc) {
      this.setSrc();
    }
  }

  private setSrc() {
    if (
      this.currentSize &&
      this.appResponsiveImageSrc &&
      this.appResponsiveImageSrc[this.currentSize]
    ) {
      this.elementRef.nativeElement.src = this.appResponsiveImageSrc[
        this.currentSize
      ];
    }
  }

  ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }
}
