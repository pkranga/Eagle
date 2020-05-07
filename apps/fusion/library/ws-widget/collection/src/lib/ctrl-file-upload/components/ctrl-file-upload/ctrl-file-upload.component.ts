/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, ViewChild, ElementRef, HostListener } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
  selector: 'ws-widget-ctrl-file-upload',
  templateUrl: './ctrl-file-upload.component.html',
  styleUrls: ['./ctrl-file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CtrlFileUploadComponent,
      multi: true,
    },
  ],
})
export class CtrlFileUploadComponent implements ControlValueAccessor {
  @ViewChild('btnSelect', { static: true }) btnSelect!: ElementRef<
    HTMLButtonElement
  >
  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef<
    HTMLInputElement
  >

  file: File | null
  onChange: Function

  constructor(private host: ElementRef<HTMLInputElement>) {
    this.file = null
    this.onChange = () => {}
  }

  @HostListener('change', ['$event.target.files'])
  emitFile(files: FileList) {
    this.file = files.item(0)
    this.onChange(this.file)
  }

  onClickBtnSelect() {
    this.fileInput.nativeElement.click()
  }

  writeValue() {
    this.host.nativeElement.value = ''
    this.file = null
  }

  registerOnChange(fn: Function) {
    this.onChange = fn
  }

  registerOnTouched() {}

  setDisabledState(isDisabled: boolean) {
    this.btnSelect.nativeElement.disabled = isDisabled
  }
}
