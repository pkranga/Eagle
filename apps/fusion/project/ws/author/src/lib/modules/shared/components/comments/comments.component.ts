/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NSContent } from '@ws/author/src/lib/interface/content'
import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-auth-root-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {

  @Input() comments: NSContent.IComments[] = []
  constructor() { }

  ngOnInit() {
  }

}
