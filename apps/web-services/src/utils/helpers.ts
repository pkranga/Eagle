/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { format as formatDate } from 'date-fns'
import { CONSTANTS } from './env'

export function* range(end: number, step = 1) {
  for (let i = 0; i < end; i += step) {
    yield i
  }
}

export function getStringifiedQueryParams(obj: {
  [key: string]: string | number;
}) {
  return Object.entries(obj)
    .filter((u) => u[1])
    .map((u) => {
      return u[0] + '=' + u[1]
    })
    .join('&')
}

export function esBasicAuth() {
  return Buffer.from(
    CONSTANTS.ES_USERNAME + ':' + CONSTANTS.ES_PASSWORD
  ).toString('base64')
}

export function getEmailLocalPart(emailId: string) {
  try {
    const atIndex = emailId.indexOf('@')
    if (atIndex === -1) {
      return emailId
    }

    return emailId.substring(0, atIndex)
  } catch (e) {
    return emailId
  }
}

export function getDateRangeString(
  startDateStr: Date | string,
  endDateStr: Date | string
): string {
  try {
    let conciseRange: string
    let prefix: string
    let suffix: string
    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)
    const startMonth = formatDate(startDate, 'MMM')
    const endMonth = formatDate(endDate, 'MMM')
    const startYear = startDate.getFullYear()
    const endYear = endDate.getFullYear()

    if (startDate.getTime() === endDate.getTime()) {
      conciseRange = formatDate(endDate, 'DD MMM, YYYY')
      return conciseRange
    }

    if (startYear !== endYear) {
      const format = 'D MMM, YYYY'
      prefix = formatDate(startDate, format)
      suffix = formatDate(endDate, format)
      conciseRange = `${prefix} - ${suffix}`
      return conciseRange
    }

    if (startMonth !== endMonth) {
      prefix = formatDate(startDate, 'D MMM')
      suffix = formatDate(endDate, 'D MMM')
    } else {
      prefix = formatDate(startDate, 'D')
      suffix = formatDate(endDate, 'D MMM, YYYY')
    }

    conciseRange = `${prefix} - ${suffix}`
    return conciseRange
  } catch (e) {
    return ''
  }
}
