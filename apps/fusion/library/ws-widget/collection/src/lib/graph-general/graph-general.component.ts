/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  OnChanges,
} from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { Chart, ChartOptions } from 'chart.js'
import { IWidgetGraphData, TChartJsGraphType, TChartJsColorPalette } from './graph-general.model'
import { Validators, FormGroup, FormBuilder } from '@angular/forms'
import { COLOR_PALETTE, GRAPH_TYPES, colorPalettes } from './graph-general-color-palette'
@Component({
  selector: 'ws-widget-graph-general',
  templateUrl: './graph-general.component.html',
  styleUrls: ['./graph-general.component.scss'],
})
export class GraphGeneralComponent extends WidgetBaseComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges, NsWidgetResolver.IWidgetData<IWidgetGraphData> {
  @Input() widgetData!: IWidgetGraphData
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef<HTMLDivElement>
  generalChart: Chart | null = null
  customizeForm: FormGroup
  graphPalettes = COLOR_PALETTE
  graphTypes = GRAPH_TYPES
  graphDataType: TChartJsGraphType = ''
  graphPalette: TChartJsColorPalette = 'default'
  graphOptions = {}
  constructor(private _formBuilder: FormBuilder) {
    super()
    this.customizeForm = this._formBuilder.group({
      colorPalette: ['', Validators.required],
      graphType: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.graphDataType = this.widgetData.graphType
    this.graphPalette = this.widgetData.graphDefaultPalette
    if (this.generalChart) {
      this.customizeGraph(this.graphPalette)
    }
  }

  ngOnChanges() {
    if (this.generalChart) {
      this.generalChart.update()
    }
  }

  ngAfterViewInit() {
    this.generateGraph(this.widgetData)
  }

  customizeGraph(palette: TChartJsColorPalette) {
    this.graphPalette =
      palette === undefined ? (this.graphPalette = 'default') : (this.graphPalette = palette)
    if (this.generalChart && this.generalChart.data && this.generalChart.data.datasets) {
      this.generalChart.data.datasets.forEach((dataGraph: any) => {
        dataGraph.backgroundColor = colorPalettes[this.graphPalette]
      })
      this.generalChart.update()
    }
  }
  customizeGraphType(type: TChartJsGraphType) {
    this.graphDataType =
      type === undefined ? (this.graphDataType = 'pie') : (this.graphDataType = type)
    this.ngOnDestroy()
    this.generateGraph(this.widgetData)
  }
  generateGraph(widgetData: IWidgetGraphData) {
    const canvas = document.createElement('canvas')
    if (widgetData != null) {
      canvas.id = widgetData.graphId
      const defaultOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          easing: 'easeInExpo',
        },
        scales: {
          xAxes: [
            {
              type: 'category',
              ticks: {
                display: widgetData.graphTicksXAxisDisplay,
                fontFamily: '\'Open Sans Bold\', sans-serif',
                fontSize: widgetData.graphTicksFontSize,
                max: widgetData.graphXAxisMax,
                stepSize: widgetData.graphXAxisStepSize,
              },
              gridLines: {
                drawBorder: true,
                display: widgetData.graphGridLinesDisplay,
              },
              stacked: true,
            },
          ],
          yAxes: [
            {
              // type: 'category',
              gridLines: {
                display: widgetData.graphGridLinesDisplay,
              },
              ticks: {
                display: widgetData.graphTicksYAxisDisplay,
                fontFamily: '\'Open Sans Bold\', sans-serif',
                fontSize: widgetData.graphTicksFontSize,
                max: widgetData.graphYAxisMax,
                stepSize: widgetData.graphYAxisStepSize,
                beginAtZero: true,
                callback: function (value: any) {
                  return value.substring(0, 12)
                }.bind(this),
              },
              stacked: true,
            },
          ],
        },
        legend: {
          display: widgetData.graphLegend,
          position: widgetData.graphLegendPosition,
          labels: {
            fontColor: 'gray',
            fontSize: widgetData.graphLegendFontSize,
          },
        },
        elements: {
          rectangle: {
            borderSkipped: 'left',
          },
        },
      }
      this.chartContainer.nativeElement.appendChild(canvas)
      this.generalChart = new Chart(canvas.id, {
        type: this.graphDataType,
        data: { ...widgetData.graphData },
        options: this.getGraphOptions(widgetData.graphType, widgetData)
          ? this.getGraphOptions(widgetData.graphType, widgetData)
          : defaultOptions,
      })
    }
  }

  getGraphOptions(type: TChartJsGraphType, widgetData: IWidgetGraphData): ChartOptions | undefined {
    if (widgetData) {
      const scalesForX = {
        xAxes: [
          {
            type: 'category',
            ticks: {
              display: widgetData.graphTicksXAxisDisplay,
              fontFamily: '\'Open Sans Bold\', sans-serif',
              fontSize: widgetData.graphTicksFontSize,
              fontcolor: 'gray',
              max: widgetData.graphXAxisMax,
              autoSkip: widgetData.graphIsXAxisAutoSkip,
              maxTicksLimit: widgetData.graphXAxisMaxLimit,
              stepSize: widgetData.graphXAxisStepSize,
              maxRotation: 0,
              callback: function (value: any) {
                return value.substring(0, 12)
              }.bind(this),
            },
            gridLines: {
              drawBorder: true,
              display: widgetData.graphGridLinesDisplay,
            },
            stacked: true,
          },
        ],
        yAxes: [
          {
            // type: 'category',
            // barPercentage: 0.1,
            gridLines: {
              drawBorder: true,
              display: widgetData.graphGridLinesDisplay,
            },
            ticks: {
              display: widgetData.graphTicksYAxisDisplay,
              fontFamily: '\'Open Sans Bold\', sans-serif',
              fontSize: widgetData.graphTicksFontSize,
              fontcolor: 'gray',
              max: widgetData.graphYAxisMax,
              stepSize: widgetData.graphYAxisStepSize,
              beginAtZero: true,
            },
            stacked: true,
          },
        ],
      }
      const scalesForY = {
        xAxes: [
          {
            // type: 'category',
            ticks: {
              display: widgetData.graphTicksXAxisDisplay,
              fontFamily: '\'Open Sans Bold\', sans-serif',
              fontSize: widgetData.graphTicksFontSize,
              fontcolor: 'gray',
            },
            gridLines: {
              drawBorder: true,
              display: widgetData.graphGridLinesDisplay,
            },
            stacked: true,
          },
        ],
        yAxes: [
          {
            // type: 'category',
            // barPercentage: 0.1,
            gridLines: {
              drawBorder: true,
              display: widgetData.graphGridLinesDisplay,
            },
            ticks: {
              display: widgetData.graphTicksYAxisDisplay,
              fontFamily: '\'Open Sans Bold\', sans-serif',
              fontSize: widgetData.graphTicksFontSize,
              fontcolor: 'gray',
              beginAtZero: true,
              callback: function (value: any) {
                return value.substring(0, 12)
              }.bind(this),
            },
            stacked: true,
          },
        ],
      }
      const optionsWithoutAxis = {
        maintainAspectRatio: false,
        legend: {
          display: widgetData.graphLegend,
          position: widgetData.graphLegendPosition,
          labels: {
            fontColor: 'gray',
            fontSize: widgetData.graphLegendFontSize,
          },
        },
        elements: {
          rectangle: {
            borderSkipped: 'left',
          },
        },
      }
      const optionsForX = {
        ...optionsWithoutAxis,
        scales: scalesForX,
        tooltips: {
          callbacks: {
            label(tooltipItem: any, data: any) {
              let label = data.labels[tooltipItem.index] || ''
              if (label) {
                label += ' : '
              }
              label += data.datasets[0].data[tooltipItem.index]
              return label
            },
          },
        },
      }
      const optionsForY = {
        ...optionsWithoutAxis,
        scales: scalesForY,
        tooltips: {
          callbacks: {
            label(tooltipItem: any, data: any) {
              let label = data.labels[tooltipItem.index] || ''
              if (label) {
                label += ' : '
              }
              label += data.datasets[0].data[tooltipItem.index]
              return label
            },
          },
        },
      }
      switch (type) {
        case 'pie':
        case 'doughnut':
        case 'radar':
          return optionsWithoutAxis
        case 'horizontalBar':
          return optionsForY
        default:
          return optionsForX
      }
    }
    return undefined
  }

  ngOnDestroy() {
    if (this.generalChart) {
      this.generalChart.destroy()
    }
  }
}
