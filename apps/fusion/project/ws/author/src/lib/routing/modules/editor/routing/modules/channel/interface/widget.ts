/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export type tDimensions = 'small' | 'medium' | 'large' | 'xLarge'
export type tSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface IWidgetAuthor {
  id: string
  widgetType: string
  widgetSubType: string
  data: any
  dimensions: Record<tDimensions, tSize>
  addOnData: { [key: string]: any }
  widgetHostClass?: string
  widgetHostStyle?: { [key: string]: string }
  rowNo: number
  purpose?: string
  children: string[]
  className?: string
  styles?: { [key: string]: string }
  parent: string
  isValid: boolean
  widgetInstanceId: string
}
