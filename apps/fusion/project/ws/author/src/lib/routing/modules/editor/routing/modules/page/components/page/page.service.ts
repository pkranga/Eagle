/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { IGridLayoutData } from '@ws-widget/collection/src/public-api'
import { NsPage } from '@ws-widget/utils'
import { Injectable } from '@angular/core'
import { IRenderPage, IGridData } from './page.model'

@Injectable()
export class PageService {

  currentIndex = 0
  constructor() { }

  convertPageToRender(data: NsPage.IPage): IRenderPage {
    const returnObj: IRenderPage = {
      id: this.getUniqueId(),
      contentType: data.contentType,
      navigationBar: data.navigationBar,
      widgetSubType: data.pageLayout.widgetSubType,
      widgetType: data.pageLayout.widgetType,
      gutter: data.pageLayout.widgetData.gutter,
      gridList: [],
    }

    data.pageLayout.widgetData.widgets.map((v: IGridLayoutData[][]) => {
      const grid = {
        id: this.getUniqueId(),
        children: <any>[],
      }
      v.map((j: IGridLayoutData[]) => {
        grid.children.push({
          id: this.getUniqueId(),
          data: j,
        })
      })
      returnObj.gridList.push(grid)
    })
    return returnObj
  }

  convertRenderToPage(data: IRenderPage): NsPage.IPage {
    const returnObj: NsPage.IPage = {
      contentType: data.contentType,
      navigationBar: data.navigationBar,
      pageLayout: {
        widgetData: {
          gutter: data.gutter,
          widgets: <any>[],
        },
        widgetSubType: data.widgetSubType,
        widgetType: data.widgetType,
      },
    }
    data.gridList.map(v => {
      const children: IGridLayoutData[] = []
      v.children.map(j => {
        children.push(j.data)
      })
      returnObj.pageLayout.widgetData.widgets.push(children)
    })
    return returnObj
  }

  getUniqueId(): string {
    this.currentIndex += 1
    return (new Date().getTime() + this.currentIndex).toString()
  }

  pushRow(nos: number): IGridData {
    switch (nos) {
      case 1:
        return {
          id: this.getUniqueId(),
          children: [{
            id: this.getUniqueId(),
            data: {
              dimensions: <any>{},
              widget: {
                widgetData: undefined as any,
                widgetSubType: '',
                widgetType: '',
                widgetHostClass: '',
                widgetHostStyle: {},
              },
              styles: {},
              className: '',
            },
          }],
        }

      case 2:
        return {
          id: this.getUniqueId(),
          children: [{
            id: this.getUniqueId(),
            data: {
              dimensions: {
                large: 6,
                xLarge: 6,
                medium: 6,
                small: 12,
              },
              widget: {
                widgetData: undefined as any,
                widgetSubType: '',
                widgetType: '',
                widgetHostClass: '',
                widgetHostStyle: {},
              },
              styles: {},
              className: '',
            },
          }, {
            id: this.getUniqueId(),
            data: {
              dimensions: {
                large: 6,
                xLarge: 6,
                medium: 6,
                small: 12,
              },
              widget: {
                widgetData: undefined as any,
                widgetSubType: '',
                widgetType: '',
                widgetHostClass: '',
                widgetHostStyle: {},
              },
              styles: {},
              className: '',
            },
          }],
        }
      case 3:
        return {
          id: this.getUniqueId(),
          children: [{
            id: this.getUniqueId(),
            data: {
              dimensions: {
                large: 4,
                xLarge: 4,
                medium: 12,
                small: 12,
              },
              widget: {
                widgetData: undefined as any,
                widgetSubType: '',
                widgetType: '',
                widgetHostClass: '',
                widgetHostStyle: {},
              },
              styles: {},
              className: '',
            },
          }, {
            id: this.getUniqueId(),
            data: {
              dimensions: {
                large: 4,
                xLarge: 4,
                medium: 12,
                small: 12,
              },
              widget: {
                widgetData: undefined as any,
                widgetSubType: '',
                widgetType: '',
                widgetHostClass: '',
                widgetHostStyle: {},
              },
              styles: {},
              className: '',
            },
          }, {
            id: this.getUniqueId(),
            data: {
              dimensions: {
                large: 4,
                xLarge: 4,
                medium: 12,
                small: 12,
              },
              widget: {
                widgetData: undefined as any,
                widgetSubType: '',
                widgetType: '',
                widgetHostClass: '',
                widgetHostStyle: {},
              },
              styles: {},
              className: '',
            },
          }],
        }
      case 4:
        return {
          id: this.getUniqueId(),
          children: [{
            id: this.getUniqueId(),
            data: {
              dimensions: {
                large: 3,
                xLarge: 3,
                medium: 12,
                small: 12,
              },
              widget: {
                widgetData: undefined as any,
                widgetSubType: '',
                widgetType: '',
                widgetHostClass: '',
                widgetHostStyle: {},
              },
              styles: {},
              className: '',
            },
          }, {
            id: this.getUniqueId(),
            data: {
              dimensions: {
                large: 3,
                xLarge: 3,
                medium: 12,
                small: 12,
              },
              widget: {
                widgetData: undefined as any,
                widgetSubType: '',
                widgetType: '',
                widgetHostClass: '',
                widgetHostStyle: {},
              },
              styles: {},
              className: '',
            },
          }, {
            id: this.getUniqueId(),
            data: {
              dimensions: {
                large: 3,
                xLarge: 3,
                medium: 12,
                small: 12,
              },
              widget: {
                widgetData: undefined as any,
                widgetSubType: '',
                widgetType: '',
                widgetHostClass: '',
                widgetHostStyle: {},
              },
              styles: {},
              className: '',
            },
          }, {
            id: this.getUniqueId(),
            data: {
              dimensions: {
                large: 3,
                xLarge: 3,
                medium: 12,
                small: 12,
              },
              widget: {
                widgetData: undefined as any,
                widgetSubType: '',
                widgetType: '',
                widgetHostClass: '',
                widgetHostStyle: {},
              },
              styles: {},
              className: '',
            },
          }],
        }

      default:
        return {
          id: this.getUniqueId(),
          children: [{
            id: this.getUniqueId(),
            data: <IGridLayoutData>{
              dimensions: {},
              widget: {
                widgetData: undefined as any,
                widgetSubType: '',
                widgetType: '',
                widgetHostClass: '',
                widgetHostStyle: {},
              },
              styles: {},
              className: '',
            },
          }],
        }
    }
  }

}
