/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Input, OnChanges } from '@angular/core'
import { SafeUrl } from '@angular/platform-browser'

export interface IPreviewDevice {
  value: string
  viewValue: string
  height: string
  width: string
}

@Component({
  selector: 'ws-auth-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})

export class ViewerComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @ViewChild('mobile', { static: true }) mobile: ElementRef<any> | null = null
  @ViewChild('tab', { static: true }) tab: ElementRef<any> | null = null
  @ViewChild('desktop', { static: true }) desktop: ElementRef<any> | null = null
  @Input() identifier: string | null = null
  @Input() mimeTypeRoute: string | null = null
  iframeUrl: SafeUrl = `/viewer/${this.mimeTypeRoute}/${this.identifier}?preview=true`
  previewDevices: IPreviewDevice[] = [
    { value: 'mobile', viewValue: this.mobile ? this.mobile.nativeElement.value : '', height: '812px', width: '375px' },
    { value: 'tab', viewValue: this.tab ? this.tab.nativeElement.value : '', height: '1024px', width: '768px' },
    {
      value: 'desktop',
      viewValue: this.desktop
        ? this.desktop.nativeElement.value ? this.desktop.nativeElement.value : 'Desktop'
        : 'Desktop',
      height: '950px',
      width: '1400px',
    },
  ]
  selected: IPreviewDevice = this.previewDevices[2]
  // = {
  //   value: 'desktop',
  //   viewValue: this.desktop
  //     ? this.desktop.nativeElement.value ? this.desktop.nativeElement.value : 'Desktop'
  //     : 'Desktop',
  //   height: '950px',
  //   width: '1280px',
  // }
  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.iframeUrl = `/viewer/${this.mimeTypeRoute}/${this.identifier}?preview=true`
  }

  ngAfterViewInit() {
    this.previewDevices = [
      { value: 'mobile', viewValue: this.mobile ? this.mobile.nativeElement.value : '', height: '812px', width: '375px' },
      { value: 'tab', viewValue: this.tab ? this.tab.nativeElement.value : '', height: '1024px', width: '768px' },
      {
        value: 'desktop',
        viewValue: this.desktop
          ? this.desktop.nativeElement.value ? this.desktop.nativeElement.value : 'Desktop'
          : 'Desktop',
        height: '950px',
        width: '1400px',
      },
    ]
    this.selected = this.previewDevices[2]
    // = {
    //   value: 'desktop',
    //   viewValue: this.desktop
    //     ? this.desktop.nativeElement.value ? this.desktop.nativeElement.value : 'Desktop'
    //     : 'Desktop',
    //   height: '950px',
    //   width: '1280px',
    // }
  }

  ngOnDestroy() {
  }

}
