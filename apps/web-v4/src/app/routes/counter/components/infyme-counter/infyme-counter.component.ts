/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs';
import { Chart } from 'chart.js';

import { ResolveResponse } from '../../../../models/routeResolver.model';
import { ICounterInfyMeResponse, ICounterInfyMePlotData } from '../../../../models/counter.model';

import { CounterService } from '../../../../services/counter.service';
import { RoutingService } from '../../../../services/routing.service';

@Component({
  selector: 'ws-infyme-counter',
  templateUrl: './infyme-counter.component.html',
  styleUrls: ['./infyme-counter.component.scss']
})
export class InfymeCounterComponent implements AfterViewInit {
  hasErrorFetching = false;
  counterResolverResponse: ResolveResponse<ICounterInfyMeResponse> = this.route.snapshot.data.infyme;
  counterData: ICounterInfyMeResponse;
  graphs: ICounterInfyMePlotData = {
    data: [],
    meta: {
      chartId: 'infyme',
      graphLabel: 'Downloads',
      graphTitle: 'Downloads',
      graphType: 'line',
      xLabel: 'time',
      yLabel: 'Downloads',
      borderColor: '#f69b1e',
      backgroundColor: '#fdf1de'
    }
  };
  constructor(private route: ActivatedRoute, private counterSvc: CounterService, public routingSvc: RoutingService) {
    if (this.counterResolverResponse.error) {
      this.hasErrorFetching = true;
    } else {
      this.counterData = this.counterResolverResponse.data;
    }
  }

  ngAfterViewInit() {
    if (!this.counterResolverResponse.error) {
      this.processCounterData();
    }
    interval(1000 * 60 * 2).subscribe(() => {
      this.fetchCounterData();
    });
  }

  fetchCounterData() {
    this.counterSvc.fetchInfyMeCounterData().subscribe(
      data => {
        this.hasErrorFetching = false;
        this.counterData = data;
        this.processCounterData();
      },
      err => {
        this.hasErrorFetching = true;
      }
    );
  }

  private processCounterData() {
    this.graphs.data = this.counterData.downloads;
    this.updateChart();
  }

  private updateChart() {
    const ctx = (document.getElementById(this.graphs.meta.chartId) as HTMLCanvasElement).getContext('2d');
    const myChart = new Chart(ctx, {
      type: this.graphs.meta.graphType,
      data: {
        labels: this.graphs.data.map(obj => new Date(obj.date).toDateString()),
        datasets: [
          {
            label: this.graphs.meta.graphLabel,
            data: this.graphs.data.map(obj => obj.count),
            fill: false,
            borderColor: this.graphs.meta.borderColor,
            borderWidth: 1.2,
            lineTension: 0.4,
            pointStyle: 'circle',
            pointRadius: 0.5,
            pointHoverRadius: 3.6,
            pointHitRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: this.graphs.meta.xLabel
              }
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: this.graphs.meta.yLabel
              }
            }
          ]
        },
        layout: {
          padding: {
            left: 0
          }
        },
        legend: {
          display: true
        },
        title: {
          display: true,
          position: 'top',
          text: this.graphs.meta.graphTitle
        }
      }
    });
  }
}
