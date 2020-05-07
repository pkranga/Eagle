/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-editor-quill',
  templateUrl: './editor-quill.component.html',
  styleUrls: ['./editor-quill.component.scss']
})
export class EditorQuillComponent implements OnInit {
  @Output() textData = new EventEmitter<{
    isValid: boolean;
    htmlText: string;
  }>();

  @Input() htmlText: string;
  @Input() minLength = '100';

  reset = false;

  constructor() {}

  ngOnInit() {}

  onContentChanged(editorEvent) {
    this.textData.emit({
      isValid: editorEvent.text.length > this.minLength,
      htmlText: editorEvent.html
    });
  }

  resetEditor() {
    this.reset = true;
    setTimeout(() => {
      this.reset = false;
    }, 0);
  }
}
