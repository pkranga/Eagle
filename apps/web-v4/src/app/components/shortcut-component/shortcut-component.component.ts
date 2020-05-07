/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-shortcut-component',
  templateUrl: './shortcut-component.component.html',
  styleUrls: ['./shortcut-component.component.scss']
})
export class ShortcutComponentComponent implements OnInit {
  systemOS = new FormControl('windows');
  osBrowser = new FormControl('googlechrome');
  isShowAll = false;
  showShortCuts = true;
  constructor(
    private authSvc: AuthService,
    public router: Router,
    public dialogRef: MatDialogRef<ShortcutComponentComponent>
  ) {}

  ngOnInit() {}

  confirmLogout() {
    this.authSvc.logout();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  toggleShowAll() {
    this.isShowAll = !this.isShowAll;
  }
}
