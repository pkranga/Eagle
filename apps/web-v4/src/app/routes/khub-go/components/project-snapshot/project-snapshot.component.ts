/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IKhubProject, IItemsList } from '../../../../models/khub.model';

@Component({
  selector: 'app-project-snapshot',
  templateUrl: './project-snapshot.component.html',
  styleUrls: ['./project-snapshot.component.scss']
})
export class ProjectSnapshotComponent implements OnInit {
  @Input() projectDetails: IKhubProject;
  @Input() isIntranet: boolean;
  @Input() islargeScreen: boolean;
  url = '';
  toolsRisksContributions: Array<IItemsList> = [];

  constructor() {}

  ngOnInit() {
    this.url = `http://10.66.87.62:6789/view?source=promt&type=project&itemId=${this.projectDetails.itemId}&ref=home`;
    this.projectDetails.mstBusinessContext =
      this.projectDetails.mstBusinessContext === null ? '' : this.projectDetails.mstBusinessContext;
    this.projectDetails.mstInfosysRole =
      this.projectDetails.mstInfosysRole === null ? '' : this.projectDetails.mstInfosysRole;
    this.projectDetails.mstInfyObjectives =
      this.projectDetails.mstInfyObjectives === null ? '' : this.projectDetails.mstInfyObjectives;
    this.projectDetails.mstProjectScope =
      this.projectDetails.mstProjectScope === null ? '' : this.projectDetails.mstProjectScope;
    this.projectDetails.risks.map(function(risk, index, arr) {
      if (arr[index].name === 'NA') {
        arr[index].description =
          arr[index].description.length > 50 ? arr[index].description.substring(0, 50) + '...' : arr[index].description;
        arr[index].name = 'Risk - ' + arr[index].id + ' : ' + arr[index].description;
      }
    });
    this.projectDetails.tools = this.projectDetails.tools.filter(function(tool) {
      return tool.name !== null;
    });
    this.projectDetails.strategies = this.projectDetails.strategies.filter(function(strategy) {
      return strategy.name !== null;
    });
    this.toolsRisksContributions = [
      {
        data: this.projectDetails.contributions,
        type: 'contribution',
        itemsMinShown: 3,
        headingText: 'Contribution' + (this.projectDetails.contributions.length > 1 ? 's' : '')
      },
      // {
      //   data: this.projectDetails.risks,
      //   type: 'risk',
      //   itemsMinShown: 3,
      //   headingText:
      //     'References of Risk' +
      //     (this.projectDetails.risks.length > 1 ? 's' : '')
      // },
      // {
      //   data: this.projectDetails.strategies,
      //   type: 'strategy',
      //   itemsMinShown: 3,
      //   headingText:
      //     'Strateg' +
      //     (this.projectDetails.strategies.length > 1 ? 'ies' : 'y') +
      //     ' implemented'
      // },
      {
        data: this.projectDetails.tools,
        type: 'tool',
        itemsMinShown: 3,
        headingText:
          'Innovation' +
          (this.projectDetails.tools.length > 1 ? 'Tools and Components Used' : 'Tool and Component Used')
      }
    ];
  }
}
