/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { UtilityService } from '../../../../services/utility.service';

let TWEET_SCRIPT_ID = 'tweetScript';

@Component({
  selector: 'ws-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.scss']
})
export class TweetsComponent implements OnInit {
  @Input() twitterUrl: string;
  hasTweetScriptLoaded = false;
  twitterScriptUrl = 'https://platform.twitter.com/widgets.js';
  constructor(
    private utilSvc: UtilityService
  ) { }

  ngOnInit() {
    this.loadScript(true);
  }

  loadScript(forced = false) {
    if (forced) {
      TWEET_SCRIPT_ID += '_' + this.utilSvc.randomId;
    }
    if (this.hasTweetScriptLoaded) {
      return;
    }
    const existingScriptElement = document.getElementById(TWEET_SCRIPT_ID);
    if (existingScriptElement) {
      return fromEvent(existingScriptElement, 'load')
        .pipe(
          first(),
          tap(() => this.hasTweetScriptLoaded = true)
        )
        .toPromise();
    }

    const newScriptElement = document.createElement('script');
    newScriptElement.setAttribute('id', TWEET_SCRIPT_ID);
    newScriptElement.setAttribute('src', this.twitterScriptUrl);
    document.body.appendChild(newScriptElement);
    return fromEvent(newScriptElement, 'load')
      .pipe(
        first(),
        tap(() => this.hasTweetScriptLoaded = true)
      )
      .toPromise();
  }

}
