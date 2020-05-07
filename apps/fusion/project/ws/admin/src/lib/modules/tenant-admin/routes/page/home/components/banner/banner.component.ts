/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { EditBannersDialogComponent } from '../edit-banners-dialog/edit-banners-dialog.component'

@Component({
  selector: 'ws-admin-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {

  @Input()
  bannerData!: any
  constructor(
    public editBannersDialog: MatDialog,
  ) { }

  openEditBannerDialog(banner: any): void {
    const dialogRef = this.editBannersDialog.open(EditBannersDialogComponent, {
      height: '600px',
      width: '800px',
      data: { banner },
    })

    dialogRef.afterClosed().subscribe(_result => {
    })
  }

  ngOnInit() {
  }

}
