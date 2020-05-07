/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export const AUTHORING_BASE = `/apis/authApi/`
export const AUTHORING_SEARCH_BASE = `/apis/authSearchApi/`
export const AUTHORING_CONTENT_BASE = '/apis/authContent/'
const ACTION_BASE = `${AUTHORING_BASE}action/`
const CONTENT_FILE_BASE = 'content/'

export const SEARCH = `${AUTHORING_SEARCH_BASE}authsearch5`
export const STATUS_CHANGE = `${ACTION_BASE}content/status/change/`
export const UNPUBLISH = `${ACTION_BASE}content/unpublish`
export const CONTENT_READ_HIERARCHY_AND_DATA = `${AUTHORING_BASE}hierarchy/content/translation/`
export const CONTENT_CREATE = `${ACTION_BASE}content/create`
export const CONTENT_READ = `${ACTION_BASE}content/hierarchy/`
export const CONTENT_SAVE = `${ACTION_BASE}content/hierarchy/update`
export const CONTENT_DELETE = `${ACTION_BASE}content/delete`
export const ORDINALS = `${ACTION_BASE}meta/v2/ordinals/list`
export const INIT = `${AUTHORING_SEARCH_BASE}/v1/`

export const UPLOAD_APPICON = `${CONTENT_FILE_BASE}TestAuth/`
export const STREAM_FILES = `/assets/`
export const NON_STREAM_FILES = `/artifacts/`

export const EMPLOYEE_LIST = `${AUTHORING_SEARCH_BASE}v1/autoComplete/`

// File Base
export const CONTENT_BASE = `${AUTHORING_CONTENT_BASE}upload/`
export const CONTENT_BASE_ENCODE = `${AUTHORING_BASE}encode`
export const CONTENT_BASE_COPY = `${AUTHORING_BASE}copy`
export const CONTENT_BASE_STREAM = '/assets'
export const CONTENT_BASE_STATIC = '/artifacts'
export const CONTENT_BASE_WEBHOST = '/web-hosted'
export const CONTENT_BASE_WEBHOST_ASSETS = '/web-hosted/assets'
export const CONTENT_BASE_WEBHOST_ARTIFACT = '/web-hosted/artifact'
export const CONTENT_BASE_LIVE = '/content-store'
export const CONTENT_BASE_AUTHOR = '/contentv3/download'
export const CONTENT_VIDEO_ENCODE = `${AUTHORING_CONTENT_BASE}contentv3/video-transcoding/start/`
