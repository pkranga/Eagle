/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { AuthInitService } from './../../../../services/init.service'
import { IFormMeta } from './../../../../interface/form'
import { EditorService } from './editor.service'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { NSContent } from '@ws/author/src/lib/interface/content'
import { AccessControlService } from '@ws/author/src/lib/modules/shared/services/access-control.service'
import { tap } from 'rxjs/operators'

@Injectable()
export class EditorContentService {

  originalContent: { [key: string]: NSContent.IContentMeta } = {}
  upDatedContent: { [key: string]: NSContent.IContentMeta } = {}
  public currentContent!: string
  public parentContent!: string
  public isSubmitted = false
  public changeActiveCont = new BehaviorSubject<string>('')

  constructor(
    private accessService: AccessControlService,
    private editorService: EditorService,
    private authInitService: AuthInitService,
  ) { }

  getOriginalMeta(id: string): NSContent.IContentMeta {
    return this.originalContent[id]
  }

  getUpdatedMeta(id: string): NSContent.IContentMeta {
    return JSON.parse(JSON.stringify({
      ...this.originalContent[id],
      ...(this.upDatedContent[id] ? this.upDatedContent[id] : {}),
    }))
  }

  setOriginalMeta(meta: NSContent.IContentMeta) {
    this.originalContent[meta.identifier] = JSON.parse(JSON.stringify(meta))
  }

  resetOriginalMeta(meta: NSContent.IContentMeta, id: string) {
    this.originalContent[id] = { ...this.originalContent[id], ...JSON.parse(JSON.stringify(meta)) }
    delete this.upDatedContent[id]
  }

  setUpdatedMeta(meta: NSContent.IContentMeta, id: string) {
    this.upDatedContent[id] = {
      ...(this.upDatedContent[id] ? this.upDatedContent[id] : {}),
      ...JSON.parse(JSON.stringify(meta)),
    }
  }

  reset() {
    this.originalContent = {}
    this.currentContent = ''
    this.isSubmitted = false
  }

  hasAccess(meta: NSContent.IContentMeta): boolean {
    return this.accessService.hasAccess(meta)
  }

  isLangPresent(lang: string): boolean {
    let isPresent = false
    Object.keys(this.originalContent).map(
      v => {
        isPresent = this.originalContent[v].locale === lang
      },
    )
    return isPresent
  }

  private getParentUpdatedMeta(): NSContent.IContentMeta {
    const meta = {} as any
    const parentMeta = this.getUpdatedMeta(this.parentContent)
    Object.keys(this.authInitService.authConfig).map(
      v => {
        // tslint:disable-next-line: no-console

        meta[v as keyof NSContent.IContentMeta] =
          parentMeta[v as keyof NSContent.IContentMeta] ?
            parentMeta[v as keyof NSContent.IContentMeta] :
            JSON.parse(
              JSON.stringify(this.authInitService.authConfig[v as keyof IFormMeta].defaultValue[parentMeta.contentType][0].value),
            )
      },
    )
    return meta
  }

  createInAnotherLanguage(language: string, meta = {}): Observable<NSContent.IContentMeta | boolean> {
    const parentContent = this.getParentUpdatedMeta()
    if (this.isLangPresent(language)) {
      return of(true)
    }
    const requestBody = {
      ...parentContent,
      name: 'Untitled Content',
      description: '',
      subTitle: '',
      body: '',
      thumbnail: '',
      posterImage: '',
      appIcon: '',
      locale: language,
      isTranslationOf: this.parentContent,
      ...meta,
    }
    delete requestBody.identifier
    delete requestBody.status
    delete requestBody.categoryType
    delete requestBody.accessPaths
    return this.editorService.createAndReadContent(requestBody).pipe(
      tap(v => this.setOriginalMeta(v)),
    )
  }

  isValid(id: string): boolean {
    let isValid = true
    Object.keys(this.authInitService.authConfig).map(v => {
      if (this.checkCondition(id, v, 'required') && !this.isPresent(v, id)) {
        isValid = false
      }
    })
    return isValid
  }

  checkCondition(id: string, meta: string, type: 'show' | 'required' | 'disabled'): boolean {
    let returnValue = false
    try {
      const data = this.getUpdatedMeta(id)
      let directType: 'showFor' | 'mandatoryFor' | 'disabledFor'
      let counterType: 'notShowFor' | 'notMandatoryFor' | 'notDisabledFor'
      switch (type) {
        case 'show':
          directType = 'showFor'
          counterType = 'notShowFor'
          break
        case 'required':
          directType = 'mandatoryFor'
          counterType = 'notMandatoryFor'
          break
        default:
          directType = 'disabledFor'
          counterType = 'notDisabledFor'
          break
      }
      if (
        !this.authInitService.authConfig[meta as keyof IFormMeta] ||
        !this.authInitService.authConfig[meta as keyof IFormMeta][directType][data.contentType]
      ) {
        returnValue = false
      } else if (
        this.authInitService.authConfig[meta as keyof IFormMeta][directType][data.contentType] &&
        this.authInitService.authConfig[meta as keyof IFormMeta][directType][data.contentType].length === 0
      ) {
        returnValue = true
      } else {
        this.authInitService.authConfig[meta as keyof IFormMeta][directType][data.contentType].map(
          condition => {
            let childReturnValue = false
            Object.keys(condition).map(childMeta => {
              if (
                condition[childMeta as keyof typeof condition].indexOf(true) > -1 &&
                this.isPresent(childMeta, id)
              ) {
                childReturnValue = true
              } else if (
                condition[childMeta as keyof typeof condition].indexOf(data[childMeta as keyof NSContent.IContentMeta]) > -1
              ) {
                childReturnValue = true
              }
            })
            if (childReturnValue) {
              returnValue = true
            }
          },
        )
      }
      if (
        this.authInitService.authConfig[meta as keyof IFormMeta] &&
        this.authInitService.authConfig[meta as keyof IFormMeta][counterType][data.contentType] &&
        this.authInitService.authConfig[meta as keyof IFormMeta][counterType][data.contentType].length === 0
      ) {
        returnValue = false
      } else if (
        this.authInitService.authConfig[meta as keyof IFormMeta] &&
        this.authInitService.authConfig[meta as keyof IFormMeta][counterType][data.contentType] &&
        this.authInitService.authConfig[meta as keyof IFormMeta][counterType][data.contentType].length > 0
      ) {
        this.authInitService.authConfig[meta as keyof IFormMeta][counterType][data.contentType].map(
          condition => {
            let childReturnValue = false
            Object.keys(condition).map(childMeta => {
              if (
                condition[childMeta as keyof typeof condition].indexOf(true) > -1 &&
                this.isPresent(childMeta, id)
              ) {
                childReturnValue = true
              } else if (
                condition[childMeta as keyof typeof condition].indexOf(data[childMeta as keyof NSContent.IContentMeta]) > -1
              ) {
                childReturnValue = true
              }
            })
            if (childReturnValue) {
              returnValue = false
            }
          },
        )
      }
    } catch (ex) {
      // tslint:disable-next-line: no-console
      console.log(ex)
      returnValue = false
    }
    return returnValue
  }

  isPresent(meta: string, id: string): boolean {
    let returnValue = false
    const data = this.getUpdatedMeta(id)[meta as keyof NSContent.IContentMeta]
    switch (this.authInitService.authConfig[meta as keyof IFormMeta].type) {
      case 'array':
      case 'string':
        returnValue = data && (data as any).length ? true : false
        break
      case 'object':
      case 'boolean':
        returnValue = data ? true : false
        break
      case 'number':
        returnValue = data > 0 ? true : false
        break
    }
    return returnValue
  }

}
