/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from '../../../../services/config.service';
import { ITocMaterials } from '../../../../models/instanceConfig.model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {

  @Input() contentId: string;
  materials: ITocMaterials[];

  constructor(private configSvc: ConfigService, private matSnackBar: MatSnackBar) { }

  ngOnInit() {
    this.materials =
      this.configSvc.instanceConfig.features.toc.config.materials
        ? this.configSvc.instanceConfig.features.toc.config.materials
        : [];
  }

  downloadIntiated() {
    this.matSnackBar.open('Download Initiated');
  }
}

