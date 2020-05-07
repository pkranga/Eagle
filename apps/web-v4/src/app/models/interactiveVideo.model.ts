/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface IInteractiveVideo {
  videoUrl: string;
  interactions: IInteractionMeta[];
  interactionEvent: IInteractionEvent;
}

export interface IInteractionMeta {
  time: number;
  id: string;
  canSkip: boolean;
  preamble: string;
  postamble: string;
}
export interface IInteractionEvent {
  [id: string]: IInteraction[];
}
export interface IInteraction {
  type: 'SCQ' | 'MCQ' | 'FB';
  question: string;
  ifCorrect: string;
  ifWrong: string;
  canSkip: boolean;
  options: IInteractionOption[];
  // for UI
  isSubmitted?: boolean;
}

export interface IInteractionOption {
  isCorrect: boolean;
  text: string;
  video?: string;
}

// for UI
export interface IInteractionGroupMeta {
  groupId: string;
  baseVideoUrl: {
    baseUrl: string;
    query: string;
  };
  canSkip?: boolean;
  preamble?: string;
  postamble?: string;
}
