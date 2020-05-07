/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { IContent } from '../../../../models/content.model';
import { TrainingsService } from '../../../../services/trainings.service';

@Component({
  selector: 'app-btn-watchlist',
  templateUrl: './btn-watchlist.component.html',
  styleUrls: ['./btn-watchlist.component.scss']
})
export class BtnWatchlistComponent implements OnInit {
  @Input() content: IContent;
  @ViewChild('error', { static: true }) errorSnackbar: TemplateRef<any>;
  @ViewChild('success', { static: true }) successSnackbar: TemplateRef<any>;
  snackbarConfig: MatSnackBarConfig = {
    horizontalPosition: 'center',
    duration: 2000,
    panelClass: 'snackbar'
  };
  existsInWatchlist: boolean;

  constructor(private snackbar: MatSnackBar, private trainingsSvc: TrainingsService) {}

  ngOnInit() {
    this.trainingsSvc.getWatchlist().subscribe(
      (watchlist: string[]) => {
        const watchSet = new Set(watchlist);
        this.existsInWatchlist = watchSet.has(this.content.identifier) ? true : false;
      },
      () => {
        this.existsInWatchlist = false;
      }
    );
  }

  onBtnWatchClick() {
    let watch$: Observable<any>;
    if (this.existsInWatchlist) {
      watch$ = this.trainingsSvc.removeFromWatchlist(this.content.identifier);
    } else {
      watch$ = this.trainingsSvc.addToWatchlist(this.content.identifier);
    }

    const watchSubscription = watch$.subscribe(
      () => {
        this.existsInWatchlist = !this.existsInWatchlist;
        this.snackbar.openFromTemplate(this.successSnackbar, this.snackbarConfig);
      },
      err => {
        this.snackbar.openFromTemplate(this.errorSnackbar, this.snackbarConfig);
      },
      () => {
        watchSubscription.unsubscribe();
      }
    );
  }
}
