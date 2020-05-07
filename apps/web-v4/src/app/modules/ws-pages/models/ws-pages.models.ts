/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export type IWsPagesConfig = IWsPageConfigTypeGrid | IWsPageConfigTypeB

export interface IWsPageConfigTypeGrid {
    type: 'Grid',
    data: [
        [{
            width: 100,
            widget: {
                widgetType: 'Banner',
                data: string
            }
        }],
        [{
            width: 100,
            widgetType: 'ContentStrip',
            data: number
        }],
        [{
            widht: 40
            widget: {
                widgetType: 'Calender'
                data: number
            }
        }, {
                width: 60
                widgetType: 'Todo'
                data: number
            }]
    ]
}

export interface IWsPageConfigTypeB {
    type: 'sample',
    data: number;
}