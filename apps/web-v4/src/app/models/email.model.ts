/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { IContact } from './content.model';

export interface IEmailContact {
  name?: string;
  email: string;
}

export interface IEmailArtifact {
  identifier: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  authors: IContact[];
  duration: string;
  track: string;
  url: string;
  downloadUrl?: string;
  size?: number;
  artifactUrl?: string;
}
export interface IEmailRequest {
  emailTo: IEmailContact[];
  ccTo?: IEmailContact[];
  bccTo?: IEmailContact[];
  sharedBy: IEmailContact[];
  body: { text: string, isHTML: boolean };
  timestamp: number;
  appURL: string;
  artifacts: IEmailArtifact[];
  emailType?: string;
}

export interface IEmailTextRequest {
  emailTo: IEmailContact[];
  ccTo?: IEmailContact[];
  bccTo?: IEmailContact[];
  sharedBy: IEmailContact[];
  body: { text: string }
  timestamp: number;
  appURL: string;
  subject: string;
}
export interface IEmailPlaylistGoalShareRequest {
  emailTo: IEmailContact[];
  emailType: string;
  sharedBy: IEmailContact[];
  ccTo: IEmailContact[];
  body: { text: string, isHTML: boolean };
  timestamp: number;
  appURL: string;
  artifact: IArtifactDetails[];
}

export interface IArtifactDetails {
  identifier: string;
  title: string;
  description: string;
  content: string[];
}

export interface IEmailResponse {
  response: string;
  invalidIds?: string[];
}
