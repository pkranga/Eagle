/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Buffer } from 'buffer'
import { Router } from 'express'
import { UploadedFile } from 'express-fileupload'
import FormData from 'form-data'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from '../../utils/env'
import { logError } from '../../utils/logger'

const API_END_POINTS = {
    createContentDirectory: (contentId: string) => `${CONSTANTS.CONTENT_API_BASE}/content/submissions/${contentId}`,
    uploadFile: (contentId: string) => `${CONSTANTS.CONTENT_API_BASE}/content/submissions/${contentId}/artifacts`,
}

export const exerciseApi = Router()

exerciseApi.post('/createContentDirectory/:contentId', async (req, res) => {
    try {
        const contentId = req.params.contentId
        const response = await axios.post
            (
                API_END_POINTS.createContentDirectory(contentId),
                req.body,
                axiosRequestConfig
            )
        res.status(response.status)
    } catch (err) {
        logError('ERROR CREATE CONTENT DIRECTORY ->', err)
        res.status((err && err.response && err.response.status) || 500)
            .send((err && err.response && err.response.data) || err)
    }
})

exerciseApi.post('/uploadFileToContentDirectory/:contentId', async (req, res) => {
    try {
        if (req.files && req.files.file) {
            const file: UploadedFile = req.files.file as UploadedFile
            const formData = new FormData()
            formData.append('content', Buffer.from(file.data), {
                contentType: file.mimetype,
                filename: file.name,
            })
            const contentId = req.params.contentId
            formData.submit(API_END_POINTS.uploadFile(contentId), (err, response) => {
                if (response.statusCode === 200 || response.statusCode === 201) {
                    response.on('data', (data) => {
                        res.send(JSON.parse(data.toString('utf8')))
                    })
                } else {
                    res.send(err)
                }
            })
        } else {
            throw new Error('File not found')
        }
    } catch (err) {
        logError('ERROR UPLOAD FILE TO CONTENT DIRECTORY ->', err)
        res.status((err && err.response && err.response.status) || 500)
            .send((err && err.response && err.response.data) || err)
    }
})
