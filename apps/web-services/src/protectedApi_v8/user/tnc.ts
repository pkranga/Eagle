/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from '../../utils/env'
import { logError } from '../../utils/logger'
import { ERROR } from '../../utils/message'
import { extractUserIdFromRequest } from '../../utils/requestExtract'

const apiEndpoints = {
  acceptTnC: `${CONSTANTS.SB_EXT_API_BASE_2}/v1/terms/accept`,
  tnc: `${CONSTANTS.SB_EXT_API_BASE_2}/v1/latest/terms`,
  tncPostProcessing: (userId: string) => `${CONSTANTS.SB_EXT_API_BASE}/v1/user/${userId}/postprocessing`,
}

export async function getCommonTnc(rootOrg: string, org: string) {
  try {
    return await axios({
      ...axiosRequestConfig,
      headers: {
        org,
        rootOrg,
      },
      method: 'GET',
      url: apiEndpoints.tnc,
    })
  } catch (e) {
    throw new Error(e)
  }
}

export async function getTnc(userId: string, rootOrg: string, org: string, locale = 'en') {
  try {
    const response = await axios.get(
      `${apiEndpoints.tnc}?userId=${userId}`,
      {
        ...axiosRequestConfig,
        headers: {
          langCode: locale,
          org,
          rootOrg,
        },
      }
    )
    const tncData = response.data
    const hasTerms = Boolean(Array.isArray(tncData.termsAndConditions) && tncData.termsAndConditions.length)
    return {
      ...tncData,
      isNewUser: Boolean(!tncData.isAccepted && hasTerms && !tncData.termsAndConditions[0].acceptedVersion),
    }
  } catch (err) {
    logError('Error occurred while getting user TNC. Trying to fetch common tnc >', err)
    try {
      const commonTnc = await getCommonTnc(rootOrg, org)
      return {
        ...commonTnc.data,
        isNewUser: true,
      }
    } catch (e) {
      logError('Error occurred while getting COMMON TNC >', e)
      throw new Error(e)
    }
  }
}

export async function getTncStatus(userId: string, rootOrg: string, org: string, locale?: string): Promise<boolean> {
  try {
    const tnc = await getTnc(userId, rootOrg, org, locale)
    return tnc.isAccepted
  } catch (e) {
    logError(`TNC STATUS ERROR:`, e)
    return false
  }
}

export const protectedTnc = Router()

protectedTnc.get('/status', async (req, res) => {
  try {
    const userId = extractUserIdFromRequest(req)
    const rootOrg = req.header('rootOrg')
    const org = req.header('org')
    // tslint:disable-next-line: no-commented-code
    // let locale = req.header('locale')
    let locale = 'en'
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    if (req.query.locale) {
      locale = req.query.locale
    }
    const response = await getTncStatus(userId, rootOrg, org, locale)
    res.send(response)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

protectedTnc.get('/', async (req, res) => {
  try {
    const userId = extractUserIdFromRequest(req)
    const rootOrg = req.header('rootOrg')
    const org = req.header('org')
    // tslint:disable-next-line: no-commented-code
    // let locale = req.header('locale')
    let locale = 'en'
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    if (req.query.locale) {
      locale = req.query.locale
    }
    const response = await getTnc(userId, rootOrg, org, locale)
    res.send(response)
  } catch (err) {
    logError('TNC SEND ERROR', err)
    res.status((err && err.response && err.response.status) || 500)
      .send((err && err.response && err.response.data) || err)
  }
})

protectedTnc.post('/accept', async (req, res) => {
  try {
    const userId = extractUserIdFromRequest(req)
    const body = {
      termsAccepted: req.body.termsAccepted,
      userId,
    }
    const rootOrg = req.header('rootOrg')
    const org = req.header('org')
    const langCode = req.header('langCode') || 'en'
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await axios({
      ...axiosRequestConfig,
      data: body,
      headers: {
        langCode,
        org,
        rootOrg,
      },
      method: 'POST',
      url: apiEndpoints.acceptTnC,
    })
    const data = response.data.result || ''
    if (data.toUpperCase() === 'SUCCESS') {
      res.status(204).send()
      return
    }
    res.status(500).send(response.data)
  } catch (err) {
    logError('ERROR WHILE ACCEPTING TNC', err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

protectedTnc.patch('/postprocessing', async (req, res) => {
  try {
    const rootOrg = req.header('rootOrg')
    const org = req.header('org')
    const langCode = req.header('langCode') || 'en'
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await axios({
      ...axiosRequestConfig,
      data: {},
      headers: {
        langCode,
        org,
        rootOrg,
      },
      method: 'POST',
      url: apiEndpoints.tncPostProcessing(extractUserIdFromRequest(req)),
    })
    res.status(response.data ? 200 : 204).send(response.data)
  } catch (err) {
    logError('ERROR WHILE POSTPROCESSING', err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
