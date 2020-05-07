/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { ROOT_WIDGET_CONFIG } from '@ws-widget/collection'
import { NSProfileData } from '../../../../models/profile.model'
@Component({
  selector: 'ws-app-history-card',
  templateUrl: './history-card.component.html',
  styleUrls: ['./history-card.component.scss'],
})
export class HistoryCardComponent implements OnInit {
  @Input() pieData: any
  @Input() completed = 0
  @Input() source = ''
  @Input() progress = ''
  @Input() title = ''
  widgetPieGraph: NSProfileData.IGraphWidget = {} as NSProfileData.IGraphWidget
  margin = {
    top: 25,
    right: 20,
    bottom: 25,
    left: 20,
  }
  graphData1: number[] = []
  labels: string[] = []
  constructor() { }

  ngOnInit() {
    // this.graphData(this.pieData)
  }
  graphData(pieData: any) {
    this.labels = ['0-25%', '25-50%', '50-75%', '75-100%']
    pieData.data.map((cur: any) => {
      this.graphData1.push(cur.y)
    })
    this.widgetPieGraph = {
      widgetType: ROOT_WIDGET_CONFIG.graph._type,
      widgetSubType: ROOT_WIDGET_CONFIG.graph.graphGeneral,
      widgetData: {
        graphId: pieData.id,
        graphType: 'pie',
        graphHeight: '60px',
        graphWidth: '90%',
        graphLegend: false,
        graphLegendFontSize: 11,
        graphTicksFontSize: 11,
        graphGridLinesDisplay: false,
        graphDefaultPalette: 'default',
        graphData: {
          labels: this.labels,
          datasets: [
            {
              data: this.graphData1,
              backgroundColor: [
                'rgb(179, 55, 113)',
                'rgb(250, 130, 49)',
                'rgb(247, 183, 49)',
                'rgb(106, 176, 76)',
              ],
              borderWidth: 1,
            },
          ],
        },
      },
    }
  }
}
