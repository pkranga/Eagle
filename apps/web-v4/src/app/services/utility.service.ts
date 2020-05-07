/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UnavailableWarningComponent } from '../components/unavailable-warning/unavailable-warning.component';
import { DialogIntranetInfoComponent } from '../components/dialog-intranet-info/dialog-intranet-info.component';
import { hasFullScreenSupport } from '../utils/fullScreen';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

let RANDOM_ID_PER_USER = 0;

interface IRecursiveData {
  identifier: string;
  children: null | IRecursiveData[];
}
@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  private monthHash = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec'
  };
  warningMessage: 'CREATE_GOAL_NAVIGATOR' | 'DEFAULT' = 'DEFAULT';

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  get randomId() {
    return RANDOM_ID_PER_USER++;
  }

  // returns date in Mmm dd, yyyy
  getFormattedDate(dateString: string, withTime = false): string {
    try {
      const date = new Date(dateString);
      let formattedDate = this.monthHash[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
      if (withTime) {
        let hrs = date.getHours().toString();
        let mins = date.getMinutes().toString();
        let secs = date.getSeconds().toString();
        hrs = hrs.length === 1 ? '0' + hrs : hrs;
        mins = mins.length === 1 ? '0' + mins : mins;
        secs = secs.length === 1 ? '0' + secs : secs;
        formattedDate += ' ' + hrs + ':' + mins + ':' + secs;
      }
      return formattedDate;
    } catch (e) {
      return dateString.split(' ')[0];
    }
  }

  getLeafNodes<T extends IRecursiveData>(node: T, nodes: T[]): T[] {
    if ((node.children || []).length === 0) {
      nodes.push(node);
    } else {
      node.children.forEach(child => {
        this.getLeafNodes(child, nodes);
      });
    }
    return nodes;
  }

  getPath<T extends IRecursiveData>(node: T, id: string): T[] {
    const path: T[] = [];
    this.hasPath(node, path, id);
    return path;
  }

  getNode<T extends IRecursiveData>(node: T, id: string): T {
    const path = this.getPath(node, id);
    return path.pop();
  }

  private hasPath<T extends IRecursiveData>(node: T, pathArr: T[], id: string): boolean {
    if (node == null) {
      return false;
    }
    pathArr.push(node);
    if (node.identifier === id) {
      return true;
    }
    const children = node.children || [];
    if (children.some(u => this.hasPath(u, pathArr, id))) {
      return true;
    }
    pathArr.pop();
    return false;
  }

  get hasFullScreenSupport(): boolean {
    const elem = document.body;
    return hasFullScreenSupport(elem);
  }

  featureUnavailable(warningMessageType?: string) {
    this.dialog.open(UnavailableWarningComponent, {
      data: {
        type: warningMessageType ? warningMessageType : 'DEFAULT'
      }
    });
  }

  featureIntranetDialog(routeUrl: string) {
    this.dialog.open(DialogIntranetInfoComponent, {
      data: {
        url: routeUrl
      }
    });
  }

  getDataFromUrl(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
}
