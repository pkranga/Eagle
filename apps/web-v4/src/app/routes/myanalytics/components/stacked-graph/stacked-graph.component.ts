/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ServiceObj } from '../../../../models/myAnalytics.model';
import { ValuesService } from '../../../../services/values.service';
import { AnalyticsServiceService } from '../../services/analytics-service.service';
@Component({
  selector: 'app-stacked-graph',
  templateUrl: './stacked-graph.component.html',
  styleUrls: ['./stacked-graph.component.scss']
})
export class StackedGraphComponent implements OnInit, OnDestroy {
  @Input() loader2: boolean;
  @Input() stackedGraphList: Array<any> = [];
  @Input() stackedGraphData: Array<any> = [];
  @Input() dates: {
    start: string;
    end: string;
    count: number;
  };
  @Input() refactorProgram: any;
  @Input() navigator: any;
  serviveObj: ServiceObj;
  options: any;
  varientsdata = {
    data: [],
    selected: 0
  };
  nsoArray1 = [];
  nsoSelected = '';
  nsoName = '';
  more = true;
  loader = false;
  loginas: any;
  dataToConsider: any;
  private defaultSideNavBarOpenedSubscription;
  isLtMedium$ = this.valueSvc.isLtMedium$;
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? true : false)));
  screenSizeIsLtMedium: boolean;
  constructor( private valueSvc: ValuesService,
               private analyticsDataSer: AnalyticsServiceService,
               private myElement: ElementRef) { }

  ngOnInit() {
    this.onStackedGraphCreate();
    this.nsoSelected = Object.keys(this.stackedGraphData)[0];
    this.nsoName = this.stackedGraphList[0].role_name;
    this.nsoArray1 = this.stackedGraphList.slice(0, 5);
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(
        isLtMedium => {
          this.screenSizeIsLtMedium = isLtMedium;
        }
    );
    this.formatData();
  }
  onStackedGraphCreate() {
    this.options = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 300,
            margin : {
            top: 30,
            right: 10,
            bottom: 60,
            left: 70
            },
            x(d) { return  d.label; },
            // y: function(d) { debugger; return  (d.value > 98 && d.value < 102 ) ? 100 : d.value; },
            y(d) {  return  d.value; },
            showControls: false,
            showValues: true,
            stacked: true,
            duration: 500,
            noData: 'Refactoring details not present',
            showLegend: false,
            xAxis: {
                showMaxMin: false,
                tickFormat(d) {
                    let val = '';
                    if (d.length > 10) {
                        val = d.slice(0, 8) + '..';
                    } else {
                        val = d;
                    }
                    return val;
                },
                ticks: 4,
            },
            yAxis: {
                axisLabel: 'Progress',
                tickFormat(d) {
                    return (d > 98 && d < 102 ) ? 100 : d3.format(',f')(d);
                },
                ticks: 4,
            } ,
            tooltip: {
                contentGenerator(e) {
                  const series = e.series[0];
                  if (series.value === null) {
                    return;
                  } else if (series.value === undefined) {
                    return;
                  } else {
                    const header =
                      '<thead >' +
                        '<tr>' +
                          '<td class=\'key\'><strong>' + e.data.key +
                           ' : ' + e.data.label + ' : ' + e.data.count
                           + ' users </strong></td>' +
                        '</tr>' +

                        // "<tr>" +
                        // "<td class='key'><strong> Scored "+ e.data.count + "</strong></td>" +
                        // "</tr>" +
                      '</thead>';
                    let body = '';
                    if (e.data.present) {
                        body = '<tr>' +
                        '<td class=\'key\'><strong>You stand Here with :'
                         + Math.ceil(e.data.percent * 100) + ' % completion</strong></td>' +
                        '</tr>' ;
                    }
                    return '<table>' +
                        header +
                        '<tbody>' +
                          body +
                        '</tbody>' +
                      '</table>';
                  }

                }
            },
            legend: {
                width: 150,
                maxKeyLength: 10,
                padding: 18,
                updateState: false,
            },
            callback() {
              const line1: any = d3.selectAll('.nv-multiBarHorizontalChart .nv-bar > text');
              line1[0].map( (cur: any) => {
                if (cur.__data__.present > 0 ) {
                  cur.outerHTML =
                  '<text  title=\'You stand here\' transform=\'translate(3,40)\' style=\'font-size:30px;fill: white !important;\' >' +
                  '&nbsp;&#9872;</text>';
                }
              });
            }
        }
    };
  }
  formatData() {
    try {
      const keys  = Object.keys(this.stackedGraphData[this.nsoSelected].variants);
      keys.map((cur: any) => {
        const obj = {
        key: cur,
        name: this.stackedGraphData[this.nsoSelected].variants[cur].variant_name,
        data: this.formatVarient(this.stackedGraphData[this.nsoSelected].variants[cur].groups)
        };
        this.varientsdata.data.push(obj);
        // if(this.stackedGraphData[this.nsoSelected].variants.length === i+1){
        //   this.loader = true;
        // }
      });
      this.loader = true;
    // console.log(this.varientsdata);
    } catch (e) {
    throw(e);
    }
  }
  formatVarient(varientData: any) {
    try {
      const  groupData = [];
      varientData.map((cur) => {
      cur.group_members.sort((a, b) => {
          return a.progress.user_progress > b.progress.user_progress ? -1 : 1;
      });
      groupData.push(cur.group_members[0]);
      });
      const data = [
          {
          key: '0 - 25 %',
          color: 'rgb(179, 55, 113)',
          values: [ ]
          },
          {
          key: '25 - 50 %',
          color: 'rgb(250, 130, 49)',
          values: [ ]
          },
          {
          key: '50 - 75 %',
          color: 'rgb(247, 183, 49)',
          values: [ ]
          },
          {
          key: '75 - 100 %',
          color: 'rgb(106, 176, 76)',
          values: [ ]
          }
      ];
      groupData.map((cur ) => {
        let count = 0;
        const details = Object.assign(cur);
        if (cur.progress.org_wide_progress_range) {
          cur.progress.org_wide_progress_range.map((cur1) => { count += cur1.doc_count; });
          cur.progress.org_wide_progress_range.map((cur2, i) => {
              const obj = {
                  label : details.content_name ,
                  value : Math.round((cur2.doc_count / count) * 100),
                  // value: 25,
                  count : cur2.doc_count,
                  present: this.presentDetect(details.progress.user_progress, i),
                  percent: details.progress.user_progress
              };
              if (i < 4 ) {
              data[i].values.push(obj);
              }
          });
        }
      });
      return data;
    } catch (e) {
       throw(e);
    }
  }
  presentDetect(percent, i) {
    const completion = Math.round(percent * 100);
    i += 1;
    if (completion > (i - 1) * 25 && completion <= i * 25) {
      return true;
    } else {
      return false;
    }
  }
  showMoreLess(type: string) {
    this.more = !this.more;
    if (type === 'more') {
      this.nsoArray1 = this.stackedGraphList;
    } else {
      this.nsoArray1 = this.stackedGraphList.slice(0, 5);
    }
  }

  selectNso(nso: any) {
    if (!this.loader) {
      return;
    }
    this.nsoSelected = nso.role_id;
    this.nsoName = nso.role_name;
    this.loader = false;
    const el = this.myElement.nativeElement.ownerDocument.getElementById('stackNso');
    el.scrollIntoView();
    this.getFilteredCourse();
    // setInterval( () => {
    //   this.loader = true;
    // },2000);
  }
  selectVarience(index: number) {
    this.varientsdata.selected = index;
    this.loader = false;
    this.loginas = setInterval( () => {
      this.loader = true;
    }, 500);
  }
  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe();
    }
    clearInterval(this.loginas);
  }

  getFilteredCourse() {
    try {
      this.serviveObj = {
        type: 'nsoArtifactsAndCollaborators',
        contentType: 'Course',
        endDate: this.dates.end,
        startDate: this.dates.start,
        isCompleted: 0
      };
      this.analyticsDataSer.getNsoSelected(this.serviveObj, this.nsoSelected)
      .subscribe((data: any) => {
        this.stackedGraphData = data.nso_content_progress;
        this.varientsdata = {
            data: [],
            selected: 0
          };
        this.formatData();
      });
    } catch (e) {
     throw(e);
    }
  }
}
