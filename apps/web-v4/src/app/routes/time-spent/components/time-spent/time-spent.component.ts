/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Chart } from 'chart.js';
import { ActivatedRoute, Router } from '@angular/router';
import { ITimeSpent } from '../../../../models/timeSpent.model';
import { RoutingService } from '../../../../services/routing.service';
import { ValuesService } from '../../../../services/values.service';
import { ConfigService } from '../../../../services/config.service';

const barThickness = 24;

@Component({
  selector: 'app-time-spent',
  templateUrl: './time-spent.component.html',
  styleUrls: ['./time-spent.component.scss']
})
export class TimeSpentComponent implements OnInit, AfterViewInit {
  @ViewChild('chartContainer', { static: true })
  chartContainer: ElementRef<HTMLDivElement>;
  @ViewChild('monthJan', { static: true })
  monthJan: ElementRef<HTMLInputElement>;
  @ViewChild('monthFeb', { static: true })
  monthFeb: ElementRef<HTMLInputElement>;
  @ViewChild('monthMar', { static: true })
  monthMar: ElementRef<HTMLInputElement>;
  @ViewChild('monthApr', { static: true })
  monthApr: ElementRef<HTMLInputElement>;
  @ViewChild('monthMay', { static: true })
  monthMay: ElementRef<HTMLInputElement>;
  @ViewChild('monthJun', { static: true })
  monthJun: ElementRef<HTMLInputElement>;
  @ViewChild('monthJul', { static: true })
  monthJul: ElementRef<HTMLInputElement>;
  @ViewChild('monthAug', { static: true })
  monthAug: ElementRef<HTMLInputElement>;
  @ViewChild('monthSep', { static: true })
  monthSep: ElementRef<HTMLInputElement>;
  @ViewChild('monthOct', { static: true })
  monthOct: ElementRef<HTMLInputElement>;
  @ViewChild('monthNov', { static: true })
  monthNov: ElementRef<HTMLInputElement>;
  @ViewChild('monthDec', { static: true })
  monthDec: ElementRef<HTMLInputElement>;
  @ViewChild('labelUserOverPeriod', { static: true }) labelUserOverPeriod: ElementRef<
    HTMLInputElement
  >;
  @ViewChild('labelUserAvg', { static: true }) labelUserAvg: ElementRef<HTMLInputElement>;
  @ViewChild('labelOrgAvg', { static: true }) labelOrgAvg: ElementRef<HTMLInputElement>;
  @ViewChild('labelX', { static: true }) labelX: ElementRef<HTMLInputElement>;
  @ViewChild('labelY', { static: true }) labelY: ElementRef<HTMLInputElement>;
  legendPosition: 'left' | 'right' | 'top' | 'bottom' = 'bottom';
  timeSpentData: ITimeSpent; //  = this.route.snapshot.data['timeSpentData'];
  pickerValue1: Date;
  pickerValue2: Date;
  firstDate: Date = new Date(2018, 3, 1);
  maxDate: Date = new Date();
  minDate: Date = new Date();
  today: Date = new Date();
  isBarChart = true;
  overRideToggle = 0;
  errorOccurred = false;
  userStatChart;
  monthArray = [];
  isSmall = false;
  showDateRange = false;
  isNextDateValid = false;
  // colors$: Observable<{ primary: string, accent: string, warn: string }> = this.valuesSvc.theme$.pipe(map(name => {
  //   return themesConfig[name.split('-')[0]]
  // }));
  color = this.configSvc.instanceConfig.features.settings.config.themes[0].colors;
  orgAvg: number;
  userAvg: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public routingSvc: RoutingService,
    private valuesSvc: ValuesService,
    private configSvc: ConfigService
  ) {
    const rangeTypeDisplay = localStorage.getItem('showDateRange');
    if (rangeTypeDisplay) {
      this.showDateRange = JSON.parse(rangeTypeDisplay);
    }
    this.valuesSvc.theme$.subscribe(themeObj => {
      this.color = themeObj.colors;
      if (this.userStatChart && this.timeSpentData) {
        this.updateChart();
      }
    });
    this.valuesSvc.isXSmall$.subscribe(isXSmall => {
      if (isXSmall) {
        this.isSmall = true;
      } else {
        this.isSmall = false;
      }
      if (this.userStatChart && this.timeSpentData) {
        this.updateChart();
      }
    });
  }

  ngOnInit() {
    this.errorOccurred = false;
    this.route.data.subscribe(data => {
      if (!data) {
        return;
      }
      this.timeSpentData = data.timeSpentData.data;
      this.pickerValue1 = data.timeSpentData.start;
      this.pickerValue2 = data.timeSpentData.end;
      const uavg = this.timeSpentData.userAvg / 60 || 0;
      const oavg = this.timeSpentData.orgAvg / 60 || 0;
      this.orgAvg = Math.ceil(oavg);
      this.userAvg = Math.ceil(uavg);
      this.maxDate.setTime(this.pickerValue2.getTime() - 86400000);
      this.minDate.setTime(this.pickerValue1.getTime() + 86400000);
      this.today.setTime(new Date().getTime() - 86400000);
      // console.log('this.pickerValue1 >', this.pickerValue1);
      // console.log('this.pickerValue2 >', this.pickerValue2);
      if (this.timeSpentData.org.length >= 15) {
        this.isBarChart = false;
      } else {
        this.isBarChart = true;
      }
      if (this.userStatChart) {
        this.updateChart();
      }
    });
  }

  ngAfterViewInit() {
    this.monthArray = [
      this.monthJan.nativeElement.value,
      this.monthFeb.nativeElement.value,
      this.monthMar.nativeElement.value,
      this.monthApr.nativeElement.value,
      this.monthMay.nativeElement.value,
      this.monthJun.nativeElement.value,
      this.monthJul.nativeElement.value,
      this.monthAug.nativeElement.value,
      this.monthSep.nativeElement.value,
      this.monthOct.nativeElement.value,
      this.monthNov.nativeElement.value,
      this.monthDec.nativeElement.value
    ];
    if (!this.userStatChart && this.timeSpentData) {
      this.errorOccurred = false;
      this.createChart();
    }
    if (!this.timeSpentData) {
      this.errorOccurred = true;
    }
  }

  dateChanged(startDate, endDate) {
    this.maxDate.setTime(endDate.getTime() - 86400000);
    this.minDate.setTime(startDate.getTime() + 86400000);
    this.today.setTime(new Date().getTime() - 86400000);
    this.router.navigate(['time-spent'], {
      queryParams: { start: startDate.getTime(), end: endDate.getTime() }
    });
  }

  toggleChartType() {
    this.isBarChart = !this.isBarChart;
    this.updateChart();
  }

  changeWeek(type: 'prev' | 'next') {
    const singleDay = 24 * 60 * 60 * 1000;
    let start;
    let end;
    if (type === 'next') {
      start = new Date(this.pickerValue1.getTime() + 7 * singleDay);
      end = new Date(this.pickerValue2.getTime() + 7 * singleDay);
    } else {
      start = new Date(this.pickerValue1.getTime() - 7 * singleDay);
      end = new Date(this.pickerValue2.getTime() - 7 * singleDay);
    }
    if (end < new Date().setTime(new Date().getTime() - 86400000)) {
      this.isNextDateValid = true;
      this.dateChanged(start, end);
    } else {
      this.isNextDateValid = false;
    }
  }

  changeRangeDisplay() {
    this.showDateRange = !this.showDateRange;
    localStorage.setItem('showDateRange', JSON.stringify(this.showDateRange));
    this.router.navigate(['time-spent']);
  }

  async createChart() {
    const canvas = document.createElement('canvas');
    canvas.id = 'userStatChartId';
    this.chartContainer.nativeElement.appendChild(canvas);
    // console.log(this.timeSpentData)
    const data = {
      labels: this.timeSpentData.org.map(
        u =>
          this.monthArray[new Date(u.day).getMonth()] +
          ' ' +
          new Date(u.day).getDate()
      ),
      datasets: [
        {
          label: this.labelUserAvg.nativeElement.value,
          data: this.timeSpentData.user.map(u =>
            Number((u.duration / 60).toFixed(1))
          ),
          borderColor: this.color.primary,
          fill: false,
          backgroundColor: Array(this.timeSpentData.user.length).fill(
            this.color.primary
          )
        },
        {
          label: this.labelOrgAvg.nativeElement.value,
          data: this.timeSpentData.org.map(u =>
            Number((u.duration / 60).toFixed(1))
          ),
          borderColor: this.color.accent,
          fill: false,
          backgroundColor: Array(this.timeSpentData.org.length).fill(
            this.color.accent
          )
        },
        {
          label: this.labelUserOverPeriod.nativeElement.value,
          data: Array(this.timeSpentData.user.length).fill(
            Number((this.timeSpentData.userAvg / 60).toFixed(1))
          ),
          borderColor: Array(this.timeSpentData.user.length).fill(
            this.color.primary
          ),
          type: 'line',
          lineTension: 1,
          borderDash: [5, 2]
        }
      ]
    };
    const options = {
      legend: {
        display: true,
        position: this.legendPosition,
        labels: {
          fontColor: this.color.primary,
          boxWidth: 10
        }
      },
      scales: {
        xAxes: [
          {
            maxBarThickness: barThickness,
            display: true,
            scaleLabel: {
              display: true,
              labelString: this.labelX.nativeElement.value
            },
            gridLines: {
              offsetGridLines: false
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: this.labelY.nativeElement.value
            },
            gridLines: {
              offsetGridLines: false
            }
          }
        ]
      }
    };
    const optionsForMobile = {
      legend: {
        display: true,
        position: this.legendPosition,
        labels: {
          fontColor: this.color.primary,
          boxWidth: 10
        }
      },
      scales: {
        xAxes: [
          {
            maxBarThickness: barThickness,
            display: true,
            ticks: {
              display: false
            },
            gridLines: {
              offsetGridLines: false
            }
          }
        ],
        yAxes: [
          {
            display: true,
            ticks: {
              display: true
            },
            gridLines: {
              offsetGridLines: false
            }
          }
        ]
      }
    };
    if (this.isSmall) {
      this.userStatChart = new Chart('userStatChartId', {
        type: this.isBarChart ? 'bar' : 'line',
        data,
        options: optionsForMobile
      });
    } else {
      this.userStatChart = new Chart('userStatChartId', {
        type: this.isBarChart ? 'bar' : 'line',
        data,
        options
      });
    }
  }

  updateChart() {
    const newData = {
      labels: this.timeSpentData.org.map(
        u =>
          this.monthArray[new Date(u.day).getMonth()] +
          ' ' +
          new Date(u.day).getDate()
      ),
      datasets: [
        {
          label: this.labelUserAvg.nativeElement.value,
          data: this.timeSpentData.user.map(u =>
            Number((u.duration / 60).toFixed(1))
          ),
          borderColor: this.color.primary,
          fill: false,
          backgroundColor: Array(this.timeSpentData.user.length).fill(
            this.color.primary
          )
        },
        {
          label: this.labelOrgAvg.nativeElement.value,
          data: this.timeSpentData.org.map(u =>
            Number((u.duration / 60).toFixed(1))
          ),
          borderColor: this.color.accent,
          fill: false,
          backgroundColor: Array(this.timeSpentData.org.length).fill(
            this.color.accent
          )
        },
        {
          label: this.labelUserOverPeriod.nativeElement.value,
          data: Array(this.timeSpentData.user.length).fill(
            Number((this.timeSpentData.userAvg / 60).toFixed(1))
          ),
          borderColor: Array(this.timeSpentData.user.length).fill(
            this.color.primary
          ),
          type: 'line',
          lineTension: 0.5,
          borderDash: [5, 2]
        }
      ]
    };
    const newOptions = {
      legend: {
        display: true,
        position: this.legendPosition,
        labels: {
          fontColor: this.color.primary,
          boxWidth: 10
        }
      },
      scales: {
        xAxes: [
          {
            maxBarThickness: barThickness,
            display: true,
            scaleLabel: {
              display: true,
              labelString: this.labelX.nativeElement.value
            },
            gridLines: {
              offsetGridLines: false
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: this.labelY.nativeElement.value
            },
            gridLines: {
              offsetGridLines: false
            }
          }
        ]
      }
    };
    const newOptionsForMobile = {
      legend: {
        display: true,
        position: this.legendPosition,
        labels: {
          fontColor: this.color.primary,
          boxWidth: 10
        }
      },
      scales: {
        xAxes: [
          {
            maxBarThickness: barThickness,
            display: true,
            ticks: {
              display: false
            },
            gridLines: {
              offsetGridLines: false
            }
          }
        ],
        yAxes: [
          {
            display: true,
            ticks: {
              display: true
            },
            gridLines: {
              offsetGridLines: false
            }
          }
        ]
      }
    };
    this.userStatChart.config.type = this.isBarChart ? 'bar' : 'line';
    this.userStatChart.config.data = newData;
    if (this.isSmall) {
      this.userStatChart.options = newOptionsForMobile;
    } else {
      this.userStatChart.options = newOptions;
    }
    this.userStatChart.update();
  }
}
