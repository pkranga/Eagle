/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from '../../utils/env'
import { logError } from '../../utils/logger'
import { extractUserIdFromRequest } from '../../utils/requestExtract'

const REGISTRATION_BASE = `${CONSTANTS.SB_EXT_API_BASE_2}/v1/content-sources`
const API_ENDPOINTS = {
    deregisterUsers: (source: string) => `${REGISTRATION_BASE}/${source}/deregistered-users`,
    listUsers: (source: string) => `${REGISTRATION_BASE}/${source}/users`,
    registrationStatus: REGISTRATION_BASE,
}

export const userRegistrationApi = Router()

userRegistrationApi.get('/listUsers/:source', async (req, res) => {
    try {
        const rootOrg = req.header('rootOrg')
        const source = req.params.source
        const response = await axios.get(
            API_ENDPOINTS.listUsers(source),
            { headers: { rootOrg } }
        )
        res.json(response.data)
    } catch (err) {
        logError('ERROR ON GET ALL REGISTERED USERS >', err)
        res.status((err && err.response && err.response.status) || 500)
            .send(err && err.response && err.response.data || {})
    }
})

userRegistrationApi.post('/deregisterUsers/:source', async (req, res) => {
    try {
        const rootOrg = req.header('rootOrg')
        const source = req.params.source
        const response = await axios.post(
            API_ENDPOINTS.deregisterUsers(source),
            req.body,
            { headers: { rootOrg } }
        )
        res.json(response.data)
    } catch (err) {
        logError('ERROR ON DEREGISTER USERS >', err)
        res.status((err && err.response && err.response.status) || 500)
            .send(err && err.response && err.response.data || {})
    }
})

userRegistrationApi.get('/getAllSources', async (req, res) => {
    try {
        const rootOrg = req.header('rootOrg')
        const response = await axios.get(`${API_ENDPOINTS.registrationStatus}?registrationProvided=false`, {
            ...axiosRequestConfig,
            headers: { rootOrg },
        })
        const data = response.data.filter((o: { registrationUrl: string | null }) => o.registrationUrl !== null)
        res.json(data || {})
    } catch (err) {
        logError('ERROR ON GET ALL SOURCES >', err)
        res.status((err && err.response && err.response.status) || 500)
            .send(err && err.response && err.response.data || {})
    }
})

userRegistrationApi.get('/getSourceDetail/:id', async (req, res) => {
    try {
        const rootOrg = req.header('rootOrg')
        const source = req.params.id
        const response = await axios.get(`${API_ENDPOINTS.registrationStatus}/${source}`, {
            ...axiosRequestConfig,
            headers: { rootOrg },
        })
        res.json(response.data || {})
    } catch (err) {
        logError('ERROR ON GET SOURCE DETAILS >', err)
        res.status((err && err.response && err.response.status) || 500)
            .send(err && err.response && err.response.data || {})
    }
})

userRegistrationApi.get('/checkUserRegistrationContent/:source', async (req, res) => {
    try {
        const source = req.params.source
        const uuid = extractUserIdFromRequest(req)
        const rootOrg = req.header('rootOrg')
        const response = await axios.get(
            `${API_ENDPOINTS.registrationStatus}/${source}/users/${uuid}`, {
            ...axiosRequestConfig,
            headers: { rootOrg },
        })
        res.json(response.data || {})
    } catch (err) {
        logError('ERROR ON CHECK SOURCE REGISTRATION STATUS >', err)
        res.status((err && err.response && err.response.status) || 500)
            .send(err && err.response && err.response.data || {})
    }
})

userRegistrationApi.post('/register', async (req, res) => {
    try {
        const source = req.body.source
        const rootOrg = req.header('rootOrg')
        const response = await axios.post(
            `${API_ENDPOINTS.registrationStatus}/${source}/users`,
            req.body.items,
            {
                ...axiosRequestConfig,
                headers: {
                    rootOrg,
                },
            }
        )
        res.json(response.data || {})
    } catch (err) {
        logError('ERROR ON REGISTRATIO USERS >', err)
        res.status((err && err.response && err.response.status) || 500)
            .send(err && err.response && err.response.data || {})
    }
})
