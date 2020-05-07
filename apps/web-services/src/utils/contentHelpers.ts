/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { IContent, IContentMinimal, TContentType } from '../models/content.model'
const CONTENT_URL_PREFIX_SLICE_REGEX = /http:\/\/private-[^/]+/

export function processContent(content: IContent): IContent {
  if (!content) {
    return content
  }
  return {
    ...content,
    appIcon: processUrl(content.appIcon),
    artifactUrl: processUrl(content.artifactUrl),
    children: Array.isArray(content.children) ? content.children.map((u) => processContent(u)) : [],

    displayContentType: processDisplayContentType(content.contentType, content.resourceType),
    downloadUrl: processDownloadUrl(content.downloadUrl || ''),
    introductoryVideo: processUrl(content.introductoryVideo),
    introductoryVideoIcon: processUrl(content.introductoryVideoIcon),
    isExternal: processIsExternal(content.isExternal),
    playgroundResources: (content.playgroundResources || []).map((u) => ({
      ...u,
      artifactUrl: processUrl(u.artifactUrl),
    })),
    subTitles: (content.subTitles || []).map((u) => ({
      ...u,
      url: processUrl(u.url),
    })),
  }
}

export function getMinimalContent(content: IContent): IContentMinimal {
  return {
    appIcon: processUrl(content.appIcon),
    artifactUrl: content.artifactUrl,
    complexityLevel: content.complexityLevel,
    contentType: content.contentType,
    creatorDetails: content.creatorDetails || content.creatorContacts,
    description: content.description,
    displayContentType: processDisplayContentType(content.contentType, content.resourceType),
    duration: content.duration,
    identifier: content.identifier,
    learningMode: content.learningMode,
    mimeType: content.mimeType,
    name: content.name,
    status: content.status,
  }
}

function processIsExternal(isExternal: string | boolean): boolean {
  if (typeof isExternal === 'boolean') {
    return isExternal
  }
  return typeof isExternal === 'string' ? isExternal.toLowerCase() === 'yes' : false
}

export function processUrl(url: string | null | undefined) {
  return (url || '').replace(CONTENT_URL_PREFIX_SLICE_REGEX, '/apis/proxies/v8')
}
export function appendUrl(url: string) {
  return '/apis/proxies/v8' + url
}

export function appendProxiesUrl(url: string) {
  return '/apis/proxies/v8/web-hosted/navigator/images/' + url
}

export function processDisplayContentType(contentType: TContentType, resourceType?: string) {
  return resourceType || contentType
}

export function processDownloadUrl(url: string) {
  return processUrl(url).replace(/%/g, '%25')
}
