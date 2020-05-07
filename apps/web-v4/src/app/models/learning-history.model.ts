/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
// Please check this enum
export enum ELearningHistoryContentTypeMessage {
    Program = 'Learning Path',
    Course = 'Course',
    LearningModule = 'Collection',
    Resource = 'Resource'
}

export enum ELearningHistoryContentType {
    Program = 'learning path',
    Course = 'course',
    LearningModule = 'learning module',
    Resource = 'resource'
}

export enum ELearningHistoryProgressType {
    InProgress = 'inprogress',
    Completed = 'completed'
}

export interface ILearningHistoryItem {
    identifier: string;
    name: string;
    contentType: string;
    progress: number;
    totalDuration: number;
    children: string[];
    pending?: number;
    timeLeft?: number;
    last_ts?: number;
    thumbnail?: string;
    lastUpdated?: string;
}

export interface ILearningHistory {
    count: number;
    results: ILearningHistoryItem[];
}

export interface ILearningHistoryApiResponse {
    result: {
        response: ILearningHistory;
    };
}
