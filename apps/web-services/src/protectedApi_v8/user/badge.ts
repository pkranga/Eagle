/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { IBadgeRecent, IBadgeResponse } from '../../models/badge.model'
import {
  IUserNotification,
  IUserNotifications
} from '../../models/notification.model'
import { appendUrl } from '../../utils/contentHelpers'
import { CONSTANTS } from '../../utils/env'
import { extractUserIdFromRequest } from '../../utils/requestExtract'

const API_END_POINTS = {
  badge: `${CONSTANTS.SB_EXT_API_BASE_2}/v3/users`,
  updateBadge: `${CONSTANTS.SB_EXT_API_BASE_2}/v1/User`,
}

export const badgeApi = Router()
// all badges data
badgeApi.get('/', async (req, res) => {
  const userId = extractUserIdFromRequest(req)
  const rootOrg = req.header('rootOrg')
  const langCode = req.header('locale')
  const url = `${API_END_POINTS.badge}/${userId}/badges`
  try {
    const response = await axios.get(url, {
      ...axiosRequestConfig,
      headers: { rootOrg, langCode },
    })
    res.send(processAllBadges(response.data))
  } catch (err) {
    return err
  }
})

badgeApi.post('/update', async (req, res) => {
  const userId = extractUserIdFromRequest(req)
  const rootOrg = req.header('rootOrg')
  const url = `${API_END_POINTS.updateBadge}/${userId}/recalculatebadges`
  try {
    const response = await axios.post(
      url,
      {},
      {
        ...axiosRequestConfig,
        headers: { rootOrg },
      }
    )

    res.json(response.data)
  } catch (err) {
    res.status(500).send(err)
  }
})

// recent badges
badgeApi.get('/notification', async (req, res) => {
  const userId = extractUserIdFromRequest(req)
  const rootOrg = req.header('rootOrg')
  const langCode = req.header('locale')
  const url = `${API_END_POINTS.badge}/${userId}/achievements/recent`

  try {
    const response = await axios.get(url, {
      ...axiosRequestConfig,
      headers: { rootOrg, langCode },
    })
    let result: IUserNotifications = {
      recent_badge: null,
      totalPoints: [],
    }
    if (response.data && response.data.result) {
      result = processRecentBadges(response.data.result.response)
    }
    res.send(result)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

function processRecentBadges(badges: IUserNotifications): IUserNotifications {
  let recentBadgeData = badges.recent_badge
  const totalPointsData = badges.totalPoints
  if (recentBadgeData) {
    recentBadgeData = processRecent(recentBadgeData)
  }
  return {
    recent_badge: recentBadgeData,
    totalPoints: totalPointsData,
  }
}

function processRecent(badge: IUserNotification): IUserNotification {
  return {
    ...badge,
    image: appendUrl(badge.image),
  }
}

function processAllBadges(badges: IBadgeResponse): IBadgeResponse {
  let earnedData = badges.earned
  let canEarnData = badges.canEarn
  let closeToEarningData = badges.closeToEarning
  const lastUpdatedDate = badges.lastUpdatedDate
  let recentData = badges.recent
  const totalPointsData = badges.totalPoints

  earnedData = processBadgeRecentArray(earnedData)
  canEarnData = processBadgeRecentArray(canEarnData)
  closeToEarningData = processBadgeRecentArray(closeToEarningData)
  recentData = processBadgeRecentArray(recentData)

  return {
    canEarn: canEarnData,
    closeToEarning: closeToEarningData,
    earned: earnedData,
    lastUpdatedDate,
    recent: recentData,
    totalPoints: totalPointsData,
  }
}

function processBadgeRecentArray(badges: IBadgeRecent[]): IBadgeRecent[] {
  let count = 0
  badges.forEach((badge: IBadgeRecent) => {
    const dataFetch = processBadgesRecent(badge)
    badges[count] = dataFetch
    count += 1
  })
  return badges
}

function processBadgesRecent(badge: IBadgeRecent): IBadgeRecent {
  if (!badge) {
    return badge
  }
  return {
    ...badge,
    image: appendUrl(badge.image),
  }
}
