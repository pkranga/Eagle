/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { Router, ActivatedRoute } from '@angular/router'
import { NSProfileData } from '../../../../models/profile.model'
import { TFetchStatus, ValueService, ConfigurationsService } from '@ws-widget/utils'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Chart } from 'chart.js'
import {
  TChartJsGraphType,
  ROOT_WIDGET_CONFIG,
  IBubbleData,
  TChartJsColorPalette,
  COLOR_PALETTE,
  GRAPH_TYPES,
  colorPalettes,
  IBubbleGraphDataSets,
} from '@ws-widget/collection'
import { ProfileService } from '../../../../services/profile.service'
import { NSLearningGraph, ITimeSpent } from '../../models/learning.models'

@Component({
  selector: 'ws-app-learning-time',
  templateUrl: './learning-time.component.html',
  styleUrls: ['./learning-time.component.scss'],
})
export class LearningTimeComponent implements OnInit, AfterViewInit, OnDestroy {
  monthWiseCourseTaken = false
  isAPIReady = false
  myLearningHours = false
  learningTimePerDay = false

  @ViewChild('chartContainer', { static: true })
  chartContainer: ElementRef<HTMLDivElement> | null = null
  @ViewChild('monthJan', { static: true })
  monthJan: ElementRef<HTMLInputElement> | null = null
  @ViewChild('monthFeb', { static: true })
  monthFeb: ElementRef<HTMLInputElement> | null = null
  @ViewChild('monthMar', { static: true })
  monthMar: ElementRef<HTMLInputElement> | null = null
  @ViewChild('monthApr', { static: true })
  monthApr: ElementRef<HTMLInputElement> | null = null
  @ViewChild('monthMay', { static: true })
  monthMay: ElementRef<HTMLInputElement> | null = null
  @ViewChild('monthJun', { static: true })
  monthJun: ElementRef<HTMLInputElement> | null = null
  @ViewChild('monthJul', { static: true })
  monthJul: ElementRef<HTMLInputElement> | null = null
  @ViewChild('monthAug', { static: true })
  monthAug: ElementRef<HTMLInputElement> | null = null
  @ViewChild('monthSep', { static: true })
  monthSep: ElementRef<HTMLInputElement> | null = null
  @ViewChild('monthOct', { static: true })
  monthOct: ElementRef<HTMLInputElement> | null = null
  @ViewChild('monthNov', { static: true })
  monthNov: ElementRef<HTMLInputElement> | null = null
  @ViewChild('monthDec', { static: true })
  monthDec: ElementRef<HTMLInputElement> | null = null
  @ViewChild('labelUserOverPeriod', { static: true }) labelUserOverPeriod: ElementRef<
    HTMLInputElement
  > | null = null
  @ViewChild('labelUserAvg', { static: true }) labelUserAvg: ElementRef<
    HTMLInputElement
  > | null = null
  @ViewChild('labelOrgAvg', { static: true }) labelOrgAvg: ElementRef<
    HTMLInputElement
  > | null = null
  @ViewChild('labelX', { static: true }) labelX: ElementRef<HTMLInputElement> | null = null
  @ViewChild('labelY', { static: true }) labelY: ElementRef<HTMLInputElement> | null = null
  legendPosition: 'left' | 'right' | 'top' | 'bottom' = 'bottom'
  timeSpentData: ITimeSpent | null = null
  pickerValue1: Date | null = null
  pickerValue2: Date | null = null
  firstDate: Date = new Date(2018, 3, 1)
  maxDate: Date = new Date()
  minDate: Date = new Date()
  today: Date = new Date()
  isBarChart = true
  overRideToggle = 0
  errorOccurred = false
  userStatChart: any
  monthArray: string[] = []
  isSmall = false
  showDateRange = false
  isNextDateValid = false
  orgAvg = 0
  userAvg = 0
  apiFetchStatus: TFetchStatus = 'none'
  startDate = '2018-04-01'
  endDate = `${new Date().getFullYear()}-${`0${new Date().getMonth() + 1}`.slice(-2)}-${`0${new Date().getDate()}`.slice(-2)}`
  paramSubscription: Subscription | null = null
  learningTimeData: NSProfileData.ITimeSpentResponse | null = null
  userPointsEarned = 0
  orgWidePointsPercent = 0
  totalLearningHours = -1
  timeSpent = 0
  graphFetchStatus: TFetchStatus | null = null
  monthForm: FormGroup
  selectedMonth = 'April'
  selectedYear = '2019'
  viewTime = false
  timeEvent = new Date()
  monthDict: {
    [key: string]: string;
  } = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12',
  }

  trackGraphDataLabel = ''
  trackWiseData: NSLearningGraph.ITrackWiseData | null = null
  trackWiseLabels: string[] = []
  trackWiseGraphData: IBubbleGraphDataSets[] = []
  trackWiseTimeSpent = 0
  specialDates: number[] = []
  tempData: NSProfileData.IMonthWiseData[] = []
  trackDataChart: NSProfileData.IGraphWidget = {} as NSProfileData.IGraphWidget
  trackDataBarChart: NSProfileData.IGraphWidget = {} as NSProfileData.IGraphWidget
  categoryWiseChart: NSProfileData.IGraphWidget = {} as NSProfileData.IGraphWidget
  jlWiseChart: NSProfileData.IGraphWidget = {} as NSProfileData.IGraphWidget
  unitWiseChart: NSProfileData.IGraphWidget = {} as NSProfileData.IGraphWidget
  radarChart: NSProfileData.IGraphWidget = {} as NSProfileData.IGraphWidget
  contentType = 'Course'
  isCompleted = 0
  showTime = false
  timeSpentObj: IBubbleData | null = null
  defaultBackgroundGraphColors: string[] = []
  selectedPalette: TChartJsColorPalette = 'default'
  selectedType: TChartJsGraphType = 'pie'
  paletteArray = COLOR_PALETTE
  graphArray = GRAPH_TYPES
  yearArray = ['2018', '2019']
  currentMonthGraph = 'Sep_2019'
  jlWiseData: NSProfileData.IPieCharts[] = []
  categoryWiseData: NSProfileData.IPieCharts[] = []
  unitWiseData: NSProfileData.IPieCharts[] = []
  orgWideData: NSProfileData.IPieCharts[] = []
  jlWiseLabels: string[] = []
  unitWiseLabels: string[] = []
  categoryWiseLabels: string[] = []
  radarLabels: string[] = []
  jlWiseChartData: number[] = []
  categoryWiseChartData: number[] = []
  unitWiseChartData: number[] = []
  radarChartData: number[] = []
  orgWideChartData: number[] = []
  trackObj: IBubbleGraphDataSets | null = null
  trackDataObj: IBubbleData[] = []
  trackEachLabel: string[] = []
  bubbleData: NSProfileData.IBubbleChart[] = []
  prefChangeSubscription: Subscription | null = null
  enabledTab = this.route.snapshot.data.pageData.data.enabledTabs.learning
  chartsList = this.route.snapshot.data.pageData.data.enabledTabs.learning.subTabs.learningTime.charts
  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private profileSvc: ProfileService,
    private valuesSvc: ValueService,
    private route: ActivatedRoute,
    private configSvc: ConfigurationsService,

  ) {
    this.monthForm = this._formBuilder.group({
      monthName: ['', Validators.required],
      yearName: ['', Validators.required],
    })

    const rangeTypeDisplay = localStorage.getItem('showDateRange')
    if (rangeTypeDisplay) {
      this.showDateRange = JSON.parse(rangeTypeDisplay)
    }
    this.prefChangeSubscription = this.configSvc.prefChangeNotifier.subscribe(() => {
      this.updateChart()
    })
    if (this.userStatChart && this.timeSpentData) {
      this.updateChart()
    }
    this.valuesSvc.isXSmall$.subscribe(isXSmall => {
      if (isXSmall) {
        this.isSmall = true
      } else {
        this.isSmall = false
      }
      if (this.userStatChart && this.timeSpentData) {
        this.updateChart()
      }
    })
  }

  ngOnInit() {
    this.apiFetchStatus = 'fetching'
    this.monthArray = Object.keys(this.monthDict)
    this.errorOccurred = false
    this.route.data.subscribe(data => {
      if (!data) {
        return
      }
      this.timeSpentData = data.timeSpentData.data
      this.pickerValue1 = data.timeSpentData.start
      this.pickerValue2 = data.timeSpentData.end
      const uavg = data.timeSpentData.data.userAvg / 60 || 0
      const oavg = data.timeSpentData.data.orgAvg / 60 || 0
      this.orgAvg = Math.ceil(oavg)
      this.userAvg = Math.ceil(uavg)
      this.maxDate.setTime(data.timeSpentData.end.getTime() - 86400000)
      this.minDate.setTime(data.timeSpentData.start.getTime() + 86400000)
      this.today.setTime(new Date().getTime() - 86400000)
      if (data.timeSpentData.data.org.length >= 15) {
        this.isBarChart = false
      } else {
        this.isBarChart = true
      }
      if (this.userStatChart) {
        this.updateChart()
      }
    })
    this.profileSvc.timeSpent(this.startDate, this.endDate, this.contentType, this.isCompleted).subscribe(
      (timeSpentTrack: NSProfileData.ITimeSpentResponse) => {
        this.learningTimeData = timeSpentTrack
        if (this.learningTimeData) {
          this.apiFetchStatus = 'done'
          this.userPointsEarned = this.learningTimeData.points_and_ranks.user_points_earned
          this.orgWidePointsPercent = Math.round(
            this.learningTimeData.timespent_user_vs_org_wide.usage_percent,
          )
          this.totalLearningHours = Math.round(this.learningTimeData.time_spent_by_user)
          this.getMonths(this.learningTimeData)
          this.piChartDataFetch(this.learningTimeData)
          this.specialDatesSet()
        }
      },
      () => {
        this.apiFetchStatus = 'error'
      },
    )
  }

  specialDatesSet() {
    if (this.learningTimeData) {
      const timeSpentDateWise = this.learningTimeData.date_wise.filter(data => data.value !== 0)
      this.specialDates = timeSpentDateWise.map(data => data.key)
    }
  }
  piChartDataFetch(learningTimeData: NSProfileData.ITimeSpentResponse) {
    this.jlWiseData = learningTimeData.JL_wise
    this.categoryWiseData = learningTimeData.category_wise
    this.unitWiseData = learningTimeData.unit_wise
    this.orgWideData = learningTimeData.org_wide_category_time_spent
    this.jlWiseData.forEach((jl: NSProfileData.IPieCharts) => {
      this.jlWiseLabels.push(jl.key)
      this.jlWiseChartData.push(jl.value)
    })
    this.categoryWiseData.forEach((category: NSProfileData.IPieCharts) => {
      this.categoryWiseLabels.push(category.key)
      this.categoryWiseChartData.push(category.value)
      this.orgWideChartData.push(Number((category.value / 60).toFixed(2)))

    })
    this.unitWiseData.forEach((unit: NSProfileData.IPieCharts) => {
      this.unitWiseLabels.push(unit.key)
      this.unitWiseChartData.push(unit.value)
    })
    this.orgWideData.forEach((radar: NSProfileData.IPieCharts) => {
      this.radarLabels.push(radar.key)
      this.radarChartData.push(Number((radar.value / 60).toFixed(2)))
    })
    this.defaultBackgroundGraphColors = colorPalettes[this.selectedPalette]
    this.pieChartData(this.defaultBackgroundGraphColors, this.selectedType)
  }
  showInfo(tab: string) {
    if (tab === 'monthWiseCourseTaken') {
      this.monthWiseCourseTaken = !this.monthWiseCourseTaken
    } else if (tab === 'myLearningHours') {
      this.myLearningHours = !this.myLearningHours
    } else if (tab === 'learningTimePerDay') {
      this.learningTimePerDay = !this.learningTimePerDay
    }
  }
  onClose() {
    this.showTime = false
  }
  getMonths(learningTimeData: any) {
    this.trackWiseData = learningTimeData.track_wise_user_timespent
    if (this.trackWiseData) {
      for (const key in this.trackWiseData) {
        if (this.trackWiseData.hasOwnProperty(key)) {
          this.trackWiseData[key].forEach((track: NSProfileData.IMonthWiseData) => {
            this.trackDataObj = []
            this.trackEachLabel.push(track.track)
            this.trackDataObj.push({ x: track.month_year, y: track.number_of_content_accessed, r: track.timespent_in_mins })
            this.trackObj = {
              label: track.track,
              data: this.trackDataObj,
              backgroundColor: 'default',
              borderWidth: 1,
            }
            this.trackWiseGraphData.push(this.trackObj)
          })
        }
      }
      const keys = Object.keys(this.trackWiseData)
      const monthKv: {
        [key: string]: any,
      } = {
        Jan: 13, Feb: 14, Mar: 15, Apr: 4, May: 5, Jun: 6,
        Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
      }
      keys.map((k: any) => {
        if (this.trackWiseData) {
          this.trackWiseData[k].sort((a, b) => {
            return a.timespent_in_mins > b.timespent_in_mins ? -1 : 1
          })
          this.trackWiseData[k].map((r, i) => {
            if (i < 3) {
              this.bubbleData.push({
                x: monthKv[k.split('_')[0]] + (.2 * i),
                y: r.number_of_content_accessed,
                r: ((r.timespent_in_mins / 10) <= 3) ? 3 :
                  ((r.timespent_in_mins / 10) > 3 && r.timespent_in_mins / 10 <= 30) ?
                    r.timespent_in_mins / 10 : 30,
                actual: r.timespent_in_mins,
                text: r.track,
              })

            }
          })
        }
      })
    }
    this.chartData()
  }
  chartData() {
    this.trackDataBarChart = {
      widgetType: ROOT_WIDGET_CONFIG.graph._type,
      widgetSubType: ROOT_WIDGET_CONFIG.graph.graphGeneral,
      widgetData: {
        graphId: 'trackChart',
        graphType: 'bubble',
        graphHeight: '300px',
        graphWidth: '100%',
        graphLegend: false,
        graphLegendPosition: 'top',
        graphLegendFontSize: 11,
        graphTicksFontSize: 11,
        graphGridLinesDisplay: false,
        graphTicksXAxisDisplay: true,
        graphTicksYAxisDisplay: true,
        graphDefaultPalette: 'default',
        graphYAxisMax: 4,
        graphYAxisStepSize: 1,
        graphData: {
          labels: [''],
          datasets: [
            {
              label: '',
              data: this.bubbleData,
              backgroundColor: 'default',
              borderWidth: 1,
            },
          ],
        },
      },
    }
  }

  pieChartData(backgroundGraphColors: string[], defaultGraphType: TChartJsGraphType) {
    this.jlWiseChart = {
      widgetType: ROOT_WIDGET_CONFIG.graph._type,
      widgetSubType: ROOT_WIDGET_CONFIG.graph.graphGeneral,
      widgetData: {
        graphId: 'jlChart',
        graphType: defaultGraphType,
        graphHeight: '200px',
        graphWidth: '100%',
        graphLegend: false,
        graphLegendPosition: 'top',
        graphLegendFontSize: 11,
        graphTicksFontSize: 11,
        graphGridLinesDisplay: false,
        graphDefaultPalette: 'default',
        graphData: {
          labels: this.jlWiseLabels,
          datasets: [
            {
              label: '',
              data: this.jlWiseChartData,
              backgroundColor: backgroundGraphColors,
              borderWidth: 1,
            },
          ],
        },
      },
    }
    this.unitWiseChart = {
      widgetType: ROOT_WIDGET_CONFIG.graph._type,
      widgetSubType: ROOT_WIDGET_CONFIG.graph.graphGeneral,
      widgetData: {
        graphId: 'unitWiseChart',
        graphType: defaultGraphType,
        graphHeight: '200px',
        graphWidth: '100%',
        graphLegend: false,
        graphLegendPosition: 'top',
        graphLegendFontSize: 11,
        graphTicksFontSize: 11,
        graphGridLinesDisplay: false,
        graphDefaultPalette: 'default',
        graphData: {
          labels: this.unitWiseLabels,
          datasets: [
            {
              label: '',
              data: this.unitWiseChartData,
              backgroundColor: backgroundGraphColors,
              borderWidth: 1,
            },
          ],
        },
      },
    }
    this.categoryWiseChart = {
      widgetType: ROOT_WIDGET_CONFIG.graph._type,
      widgetSubType: ROOT_WIDGET_CONFIG.graph.graphGeneral,
      widgetData: {
        graphId: 'categoryWiseChart',
        graphType: defaultGraphType,
        graphHeight: '200px',
        graphWidth: '100%',
        graphLegend: false,
        graphLegendPosition: 'top',
        graphLegendFontSize: 11,
        graphTicksFontSize: 11,
        graphGridLinesDisplay: false,
        graphDefaultPalette: 'default',
        graphData: {
          labels: this.categoryWiseLabels,
          datasets: [
            {
              label: '',
              data: this.categoryWiseChartData,
              backgroundColor: backgroundGraphColors,
              borderWidth: 1,
            },
          ],
        },
      },
    }
    this.radarChart = {
      widgetType: ROOT_WIDGET_CONFIG.graph._type,
      widgetSubType: ROOT_WIDGET_CONFIG.graph.graphGeneral,
      widgetData: {
        graphId: 'radarChart',
        graphType: 'radar',
        graphHeight: '300px',
        graphWidth: '100%',
        graphLegend: true,
        graphLegendPosition: 'top',
        graphLegendFontSize: 11,
        graphTicksFontSize: 11,
        graphGridLinesDisplay: false,
        graphDefaultPalette: 'default',
        graphData: {
          labels: this.radarLabels,
          datasets: [
            {
              label: 'You',
              backgroundColor: backgroundGraphColors,
              data: this.orgWideChartData,
            },
            {
              label: 'Org-Wide',
              backgroundColor: backgroundGraphColors,
              data: this.radarChartData,
            },
          ],
        },
      },
    }
  }
  calendarEvent(event: string) {
    this.timeEvent = new Date(event)
    const clickedDate = this.timeEvent.getTime() + 330 * 60000
    if (this.learningTimeData) {
      this.learningTimeData.date_wise.reverse().find((cur: NSProfileData.IProfileData) => {
        if (clickedDate === cur.key) {
          this.timeSpent = cur.value
          return
        }
      })
    }
    this.showTime = true
  }

  ngAfterViewInit() {
    if (
      this.monthJan &&
      this.monthFeb &&
      this.monthMar &&
      this.monthMay &&
      this.monthApr &&
      this.monthJun &&
      this.monthJul &&
      this.monthAug &&
      this.monthSep &&
      this.monthNov &&
      this.monthOct &&
      this.monthDec
    ) {
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
        this.monthDec.nativeElement.value,
      ]
    }
    if (!this.userStatChart && this.timeSpentData) {
      this.errorOccurred = false
      this.createChart()
    }
    if (!this.timeSpentData) {
      this.errorOccurred = true
    }
  }

  dateChanged(startDate: Date, endDate: Date) {
    this.maxDate.setTime(endDate.getTime() - 86400000)
    this.minDate.setTime(startDate.getTime() + 86400000)
    this.today.setTime(new Date().getTime() - 86400000)
    this.router.navigate(['app', 'profile', 'learning', 'time'], {
      queryParams: { start: startDate.getTime(), end: endDate.getTime() },
    })
  }

  toggleChartType() {
    this.isBarChart = !this.isBarChart
    this.updateChart()
  }

  changeWeek(type: 'prev' | 'next') {
    if (this.pickerValue1 && this.pickerValue2) {
      const singleDay = 24 * 60 * 60 * 1000
      let start
      let end
      if (type === 'next') {
        start = new Date(this.pickerValue1.getTime() + 7 * singleDay)
        end = new Date(this.pickerValue2.getTime() + 7 * singleDay)
      } else {
        start = new Date(this.pickerValue1.getTime() - 7 * singleDay)
        end = new Date(this.pickerValue2.getTime() - 7 * singleDay)
      }
      if (end < new Date(new Date().getTime() - 86400000)) {
        this.isNextDateValid = true
        this.dateChanged(start, end)
      } else {
        this.isNextDateValid = false
      }
    }
  }

  changeRangeDisplay() {
    this.showDateRange = !this.showDateRange
    localStorage.setItem('showDateRange', JSON.stringify(this.showDateRange))
    this.router.navigate(['app', 'profile', 'learning', 'time'])
  }

  async createChart() {
    const barThickness = 24
    if (
      this.chartContainer &&
      this.timeSpentData &&
      this.labelUserAvg &&
      this.labelOrgAvg &&
      this.labelUserOverPeriod &&
      this.labelX &&
      this.labelY
    ) {
      const canvas = document.createElement('canvas')
      canvas.id = 'userStatChartId'
      this.chartContainer.nativeElement.appendChild(canvas)
      const data = {
        labels: this.timeSpentData.org.map(
          u => `${this.monthArray[new Date(u.day).getMonth()]} ${new Date(u.day).getDate()}`,
        ),
        datasets: [
          {
            label: this.labelUserAvg.nativeElement.value,
            data: this.timeSpentData.user.map(u => Number((u.duration / 60).toFixed(1))),
            borderColor: this.configSvc.activeThemeObject
              ? this.configSvc.activeThemeObject.color.primary
              : '',
            fill: false,
            backgroundColor: Array(this.timeSpentData.user.length).fill(this.configSvc.activeThemeObject
                  ? this.configSvc.activeThemeObject.color.primary
                  : ''),
          },
          {
            label: this.labelOrgAvg.nativeElement.value,
            data: this.timeSpentData.org.map(u => Number((u.duration / 60).toFixed(1))),
            borderColor: this.configSvc.activeThemeObject
              ? this.configSvc.activeThemeObject.color.accent
              : '',
            fill: false,
            backgroundColor: Array(this.timeSpentData.org.length).fill(this.configSvc.activeThemeObject
              ? this.configSvc.activeThemeObject.color.accent
              : ''),
          },
          {
            label: this.labelUserOverPeriod.nativeElement.value,
            data: Array(this.timeSpentData.user.length).fill(
              Number((this.timeSpentData.userAvg / 60).toFixed(1)),
            ),
            borderColor: Array(this.timeSpentData.user.length).fill(this.configSvc.activeThemeObject
              ? this.configSvc.activeThemeObject.color.primary
              : ''),
            type: 'line',
            lineTension: 1,
            borderDash: [5, 2],
          },
        ],
      }
      const options = {
        legend: {
          display: true,
          position: this.legendPosition,
          labels: {
            fontColor: this.configSvc.activeThemeObject
              ? this.configSvc.activeThemeObject.color.primary
              : '',
            boxWidth: 10,
          },
        },
        scales: {
          xAxes: [
            {
              maxBarThickness: barThickness,
              display: true,
              scaleLabel: {
                display: true,
                labelString: this.labelX.nativeElement.value,
              },
              gridLines: {
                offsetGridLines: false,
              },
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: this.labelY.nativeElement.value,
              },
              gridLines: {
                offsetGridLines: false,
              },
            },
          ],
        },
      }
      const optionsForMobile = {
        legend: {
          display: true,
          position: this.legendPosition,
          labels: {
            fontColor: this.configSvc.activeThemeObject
              ? this.configSvc.activeThemeObject.color.primary
              : '',
            boxWidth: 10,
          },
        },
        scales: {
          xAxes: [
            {
              maxBarThickness: barThickness,
              display: true,
              ticks: {
                display: false,
              },
              gridLines: {
                offsetGridLines: false,
              },
            },
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                display: true,
              },
              gridLines: {
                offsetGridLines: false,
              },
            },
          ],
        },
      }
      if (this.isSmall) {
        this.userStatChart = new Chart('userStatChartId', {
          data,
          type: this.isBarChart ? 'bar' : 'line',
          options: optionsForMobile,
        })
      } else {
        this.userStatChart = new Chart('userStatChartId', {
          data,
          options,
          type: this.isBarChart ? 'bar' : 'line',
        })
      }
    }
  }
  ngOnDestroy() {
    if (this.prefChangeSubscription) {
      this.prefChangeSubscription.unsubscribe()
    }
  }

  updateChart() {
    const barThickness = 24
    if (
      this.timeSpentData &&
      this.labelUserAvg &&
      this.labelOrgAvg &&
      this.labelUserOverPeriod &&
      this.labelX &&
      this.labelY
    ) {
      const newData = {
        labels: this.timeSpentData.org.map(
          u => `${this.monthArray[new Date(u.day).getMonth()]} ${new Date(u.day).getDate()}`,
        ),
        datasets: [
          {
            label: this.labelUserAvg.nativeElement.value,
            data: this.timeSpentData.user.map(u => Number((u.duration / 60).toFixed(1))),
            borderColor: this.configSvc.activeThemeObject
              ? this.configSvc.activeThemeObject.color.primary
              : '',
            fill: false,
            backgroundColor: Array(this.timeSpentData.user.length).fill(this.configSvc.activeThemeObject
                  ? this.configSvc.activeThemeObject.color.primary
                  : ''),
          },
          {
            label: this.labelOrgAvg.nativeElement.value,
            data: this.timeSpentData.org.map(u => Number((u.duration / 60).toFixed(1))),
            borderColor: this.configSvc.activeThemeObject
              ? this.configSvc.activeThemeObject.color.accent
              : '',
            fill: false,
            backgroundColor: Array(this.timeSpentData.org.length).fill(this.configSvc.activeThemeObject
              ? this.configSvc.activeThemeObject.color.accent
              : ''),
          },
          {
            label: this.labelUserOverPeriod.nativeElement.value,
            data: Array(this.timeSpentData.user.length).fill(
              Number((this.timeSpentData.userAvg / 60).toFixed(1)),
            ),
            borderColor: Array(this.timeSpentData.user.length).fill(this.configSvc.activeThemeObject
                  ? this.configSvc.activeThemeObject.color.primary
                  : ''),
            type: 'line',
            lineTension: 0.5,
            borderDash: [5, 2],
          },
        ],
      }
      const newOptions = {
        legend: {
          display: true,
          position: this.legendPosition,
          labels: {
            fontColor: this.configSvc.activeThemeObject
              ? this.configSvc.activeThemeObject.color.primary
              : '',
            boxWidth: 10,
          },
        },
        scales: {
          xAxes: [
            {
              maxBarThickness: barThickness,
              display: true,
              scaleLabel: {
                display: true,
                labelString: this.labelX.nativeElement.value,
              },
              gridLines: {
                offsetGridLines: false,
              },
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: this.labelY.nativeElement.value,
              },
              gridLines: {
                offsetGridLines: false,
              },
            },
          ],
        },
      }
      const newOptionsForMobile = {
        legend: {
          display: true,
          position: this.legendPosition,
          labels: {
            fontColor: this.configSvc.activeThemeObject
              ? this.configSvc.activeThemeObject.color.primary
              : '',
            boxWidth: 10,
          },
        },
        scales: {
          xAxes: [
            {
              maxBarThickness: barThickness,
              display: true,
              ticks: {
                display: false,
              },
              gridLines: {
                offsetGridLines: false,
              },
            },
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                display: true,
              },
              gridLines: {
                offsetGridLines: false,
              },
            },
          ],
        },
      }
      this.userStatChart.config.type = this.isBarChart ? 'bar' : 'line'
      this.userStatChart.config.data = newData
      if (this.isSmall) {
        this.userStatChart.options = newOptionsForMobile
      } else {
        this.userStatChart.options = newOptions
      }
      this.userStatChart.update()
    }
  }
}
