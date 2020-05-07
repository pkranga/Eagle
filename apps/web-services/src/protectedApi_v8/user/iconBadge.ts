/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from '../../utils/env'
import { extractUserIdFromRequest } from '../../utils/requestExtract'

const API_END_POINTS = {
    unreadNotificationCount: CONSTANTS.NOTIFICATIONS_API_BASE + '/v1/users',
}

export const iconBadgeApi = Router()

iconBadgeApi.get('/unseenNotificationCount', async (req, res) => {
    try {
        const uuid = extractUserIdFromRequest(req)
        const rootOrg = req.header('rootOrg')
        const response = await axios.get(
            `${API_END_POINTS.unreadNotificationCount}/${uuid}/notification-summary`,
            {
                ...axiosRequestConfig,
                headers: { rootOrg },
            }
        )
        res.json(response.data.totalCount)
    } catch (err) {
        res.status((err && err.response && err.response.status) || 500).send(err)
    }
})
