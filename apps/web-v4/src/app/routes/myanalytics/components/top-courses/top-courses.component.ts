/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-courses',
  templateUrl: './top-courses.component.html',
  styleUrls: ['./top-courses.component.scss']
})
export class TopCoursesComponent implements OnInit {
  @Input() userprogressData;
  @Input() loader2: boolean;
  public topContentJL: Array<any> = [];
  public topContentUnit: Array<any> = [];
  constructor() {}

  ngOnInit() {
    this.userprogressData.top_content_jl.map((cur: any, i) => {
      const others = cur.progress_range.length;
      if (others === 5) {
        const obj = {
          name: cur.content_name,
          id: cur.lex_id,
          data: [
            {
              key: '0-25%',
              y: cur.progress_range[0].doc_count
            },
            {
              key: '25-50%',
              y: cur.progress_range[1].doc_count
            },
            {
              key: '50-75%',
              y: cur.progress_range[2].doc_count
            },
            {
              key: '75-100%',
              y: cur.progress_range[3].doc_count + cur.progress_range[4].doc_count
            }
          ]
        };
        this.topContentJL.push(obj);
      }
    });

    this.userprogressData.top_content_unit.map((cur: any) => {
      const others = cur.progress_range.length;
      if (others === 5) {
        const obj = {
          name: cur.content_name,
          id: cur.lex_id,
          data: [
            {
              key: '0-25%',
              y: cur.progress_range[0].doc_count
            },
            {
              key: '25-50%',
              y: cur.progress_range[1].doc_count
            },
            {
              key: '50-75%',
              y: cur.progress_range[2].doc_count
            },
            {
              key: '75-100%',
              y: cur.progress_range[3].doc_count + cur.progress_range[4].doc_count
            }
          ]
        };
        this.topContentUnit.push(obj);
      }
    });
  }
}
