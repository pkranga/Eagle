/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export function getStringifiedQueryParams(obj: { [key: string]: number | string | undefined }) {
  return Object.entries(obj)
    .filter(u => u[1])
    .map(u => {
      return `${u[0]}=${u[1]}`
    })
    .join('&')
}
