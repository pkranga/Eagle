/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IDndSnippet } from '../../models/dnd-quiz.model';

@Component({
  selector: 'app-dnd-snippet',
  templateUrl: './dnd-snippet.component.html',
  styleUrls: ['./dnd-snippet.component.scss']
})
export class DndSnippetComponent implements OnInit {
  @Input() snippetMeta: IDndSnippet;
  doneLoading = false;

  constructor() { }

  ngOnInit() {
    let i = 0;
    this.snippetMeta.fragments = this.snippetMeta.fragments.map(fragment => {
      if (fragment === '*$*') {
        return this.snippetMeta.ddOptions[i++];
      }
      return fragment;
    });
    this.doneLoading = true;
  }

  changeSelection(fragment: any, $event: any) {
    fragment.selectedValue = $event.value.text;
  }
}
