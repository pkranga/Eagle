/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { S3ContentApiService } from '../apis/s3-content-api.service';
import { MIME_TYPE } from '../constants/mime.constants';
import { COMM_EVENT_TYPES, ICommEvent, IDataRequest, IDataResponse, TDataError } from '../models/comm-events.model';
import { IContent, IContinueStrip } from '../models/content.model';
import { IInteractiveVideo } from '../models/interactiveVideo.model';
import { ContentService } from './content.service';
import { HistoryService } from './history.service';
import { MiscService } from './misc.service';

const DATA_REQUEST_EVENT_NAME: COMM_EVENT_TYPES = 'DATA_REQUEST';
const DATA_RESPONSE_EVENT_NAME: COMM_EVENT_TYPES = 'DATA_RESPONSE';
const validMIMEs = new Set(Object.values(MIME_TYPE));

class DataResponseError extends Error {
  constructor(public code: TDataError) {
    super(code);
  }
}
export interface IProcessedViewerContent {
  content: IContent;
  resumeData?: string;
  quiz?: any;
  handsOn?: any;
  classDiagram?: any;
  rdbms?: any;
  webModule?: any;
  collectionResource?: any;
  video?: {
    file: string;
    streamingToken: string;
    manifest: string;
  };
  interactions?: IInteractiveVideo;
}

@Injectable({
  providedIn: 'root'
})
export class ViewerService {
  constructor(
    private http: HttpClient,
    private contentSvc: ContentService,
    private miscSvc: MiscService,
    private historySvc: HistoryService,
    private s3ContentApi: S3ContentApiService
  ) {
    this.initGlobalDataRequestResponder();
  }

  public updateViewCountAndHistoryOnLoad(contentId: string, resourceId: string): void {
    this.contentSvc.updateViewCount(resourceId).toPromise();
    if (contentId && contentId !== resourceId) {
      this.historySvc
        .saveContinueLearning(
          {
            contextPathId: contentId,
            resourceId,
            percentComplete: 0,
            data: JSON.stringify({ timestamp: Date.now() })
          },
          resourceId
        )
        .toPromise()
        .catch(err => console.warn(err));
    }

    this.historySvc.addToHistory(resourceId);
  }

  public async processResponse(dataRequest: IDataRequest): Promise<IDataResponse<IProcessedViewerContent>> {
    // initialize for resume point
    const response: IDataResponse<IProcessedViewerContent> = {
      id: dataRequest.id,
      data: null
    };
    const contentResumePromise: Promise<any> = this.resumePoint(dataRequest.contentId);
    try {
      const content = await this.fetchContentAndValidate(dataRequest.contentId);
      response.data = await this.transformContent(content);
      response.data.resumeData = await contentResumePromise;
    } catch (err) {
      response.error = err.code || 'UNKNOWN_ERROR';
    }
    return response;
  }

  public async fetchContentAndValidate(contentId: string): Promise<IContent> {
    try {
      const content = await this.contentSvc.fetchContent(contentId).toPromise();
      if (content.contentType !== 'Resource' && content.contentType !== 'Knowledge Artifact') {
        throw new DataResponseError('INVALID_RESOURCE');
      }
      if (!validMIMEs.has(content.mimeType)) {
        throw new DataResponseError('INVALID_MIME');
      }
      // Validate for MIME and content Mismatch
      return content;
    } catch (err) {
      throw new DataResponseError((err && err.code) || 'UNKNOWN_ERROR');
    }
  }
  private async transformContent(content: IContent): Promise<IProcessedViewerContent> {
    // call set cookie generic method if the artifact Url contains 'content-store'.
    if (content.artifactUrl.indexOf('content-store') >= 0) {
      await this.setS3Cookie(content.artifactUrl);
    }
    if (content.resourceType === 'Certification') {
      return {
        content: {
          ...content,
          mimeType: MIME_TYPE.certification
        }
      };
    }
    switch (content.mimeType) {
      case MIME_TYPE.mp4:
        const video = await this.transformVideo(content);
        return { content, video };
      case MIME_TYPE.m3u8:
        await this.setVideojsCookie(content.artifactUrl);
        return { content };
      case MIME_TYPE.quiz:
        const quiz = await this.transformQuiz(content);
        return { content, quiz };
      case MIME_TYPE.webModule:
      case MIME_TYPE.webModuleExercise:
        const webModule = await this.transformWebModule(content);
        return { content, webModule };
      case MIME_TYPE.collectionResource:
        const collectionResource = await this.transformCollectionResource(content);
        return { content, collectionResource };
      case MIME_TYPE.handson:
        const handsOn = await this.transformHandsOn(content);
        return { content, handsOn };
      case MIME_TYPE.classDiagram:
        const classDiagram = await this.transformClassDiagram(content);
        return { content, classDiagram };
      case MIME_TYPE.rdbms:
        const rdbms = await this.transformDbmsModule(content);
        return { content, rdbms };
      case MIME_TYPE.interaction:
        const interactions = await this.transformInteractions(content);
        const videoData = await this.transformVideo(content);
        return { content, interactions, video: videoData };
      default:
        return { content };
    }
  }

  private async transformVideo(content: IContent): Promise<any> {
    const videoObj = {
      file: content.artifactUrl,
      streamingToken: null,
      manifest: null
    };
    if (!(content.msArtifactDetails && content.msArtifactDetails.channelId && content.msArtifactDetails.videoId)) {
      return videoObj;
    }
    try {
      const { manifest, streamingToken } = await this.miscSvc
        .fetchVideoTokens(content.msArtifactDetails.channelId, content.msArtifactDetails.videoId)
        .toPromise();
      videoObj.streamingToken = streamingToken;
      videoObj.manifest = manifest;
      return videoObj;
    } catch (err) { }
    return videoObj;
  }
  private async transformQuiz(content: IContent): Promise<any> {
    const quizJSON = await this.http
      .get<any>(content.artifactUrl)
      .toPromise()
      .catch(err => {
        throw new DataResponseError('MANIFEST_FETCH_FAILED');
      });
    return quizJSON;
  }
  private async transformHandsOn(content: IContent): Promise<any> {
    const handsOnJson = await this.http
      .get<any>(content.artifactUrl)
      .toPromise()
      .catch(err => {
        throw new DataResponseError('MANIFEST_FETCH_FAILED');
      });
    return handsOnJson;
  }

  private async transformClassDiagram(content: IContent): Promise<any> {
    const clsDiagramJson = await this.http
      .get<any>(content.artifactUrl)
      .toPromise()
      .catch(err => {
        throw new DataResponseError('MANIFEST_FETCH_FAILED');
      });
    return clsDiagramJson;
  }

  private async transformDbmsModule(content: IContent): Promise<any> {
    const dbmsJson = await this.http
      .get<any>(content.artifactUrl)
      .toPromise();
    return dbmsJson;
  }

  private async transformWebModule(content: IContent): Promise<any> {
    const manifestFile = await this.http
      .get<any>(content.artifactUrl)
      .toPromise()
      .catch(err => {
        throw new DataResponseError('MANIFEST_FETCH_FAILED');
      });
    return manifestFile;
  }

  private async transformCollectionResource(content: IContent): Promise<any> {
    const manifestFile = await this.http
      .get<any>(content.artifactUrl)
      .toPromise()
      .catch(err => {
        throw new DataResponseError('MANIFEST_FETCH_FAILED');
      });
    return manifestFile;
  }

  private async transformInteractions(content: IContent): Promise<IInteractiveVideo> {
    const manifest = await this.http
      .get<IInteractiveVideo>(content.artifactUrl)
      .toPromise()
      .catch(err => {
        throw new DataResponseError('MANIFEST_FETCH_FAILED');
      });
    return manifest;
  }

  private async resumePoint(contentId: string): Promise<string> {
    try {
      const resourceToLoad: IContinueStrip = await this.historySvc.fetchContentContinueLearning(contentId).toPromise();
      if (
        resourceToLoad &&
        Array.isArray(resourceToLoad.results) &&
        resourceToLoad.results.length > 0 &&
        resourceToLoad.results[0].continueLearningData
      ) {
        return resourceToLoad.results[0].continueLearningData.data;
      }
    } catch (err) { }
    return null;
  }
  private async setVideojsCookie(path) {
    await this.s3ContentApi
      .setVideoCookie(path)
      .toPromise()
      .catch(err => {
        throw new DataResponseError('COOKIE_SET_FAILURE');
      });
    return;
  }
  private async setS3Cookie(path) {
    await this.s3ContentApi
      .setS3Cookie(path)
      .toPromise()
      .catch(err => {
        throw new DataResponseError('COOKIE_SET_FAILURE');
      });
    return;
  }
  private initGlobalDataRequestResponder() {
    fromEvent<MessageEvent>(window, 'message')
      .pipe(
        filter(
          event =>
            event &&
            event.data &&
            event.data.type === DATA_REQUEST_EVENT_NAME &&
            Boolean(event.data.data.contentId) &&
            Boolean(event.source) &&
            typeof event.source.postMessage === 'function'
        )
      )
      .subscribe(async (event: MessageEvent) => {
        const contentWindow = event.source as Window;
        const commEvent: ICommEvent<IDataRequest> = event.data;
        const data = await this.processResponse(commEvent.data);

        const response: ICommEvent<IDataResponse<any>> = {
          app: 'WEB_PLAYER',
          data,
          plugin: 'NONE',
          state: 'NONE',
          type: DATA_RESPONSE_EVENT_NAME
        };
        contentWindow.postMessage(response, '*');
      });
  }

  resumePointStringToProgressNumber(dataStr?: string): number {
    try {
      const data = JSON.parse(dataStr);
      const progress = parseInt(data.progress.toString(), 10);
      if (!Number.isNaN(progress) && Math.round(progress) === progress) {
        return progress;
      }
      return 0;
    } catch {
      return 0;
    }
  }
}
