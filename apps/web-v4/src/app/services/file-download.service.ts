/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable, Inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { WINDOW } from './window.service';

@Injectable()
export class FileDownloadService {
  constructor(@Inject(WINDOW) private window: Window) {}

  base64ToBlob(base64String: string): Blob {
    try {
      const byteString = this.window.atob(base64String);
      const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array: Uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; ++i) {
        int8Array[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([int8Array]);

      return blob;
    } catch (e) {
      return null;
    }
  }

  saveBlobToDevice(blob: Blob, documentName: string): boolean {
    try {
      // IE Download
      if (this.window.navigator && this.window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, documentName);
        return;
      }

      // For other browsers
      const file: File = new File([blob], documentName);
      const document: Document = this.window.document;

      const downloadLink = document.createElement('a');
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.setAttribute('href', window.URL.createObjectURL(file));
      downloadLink.setAttribute('download', documentName);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      return true;
    } catch (e) {
      return false;
    }
  }

  saveFile(base64String: string, documentName: string): Observable<any> {
    const blob = this.base64ToBlob(base64String);

    if (!blob) {
      return throwError({});
    }

    return this.saveBlobToDevice(blob, documentName) ? of({}) : throwError({});
  }
}
