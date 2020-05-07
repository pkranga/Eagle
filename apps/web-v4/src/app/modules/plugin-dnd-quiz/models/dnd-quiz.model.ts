/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface IDndQuiz {
    timeLimit: number;
    isAssessment: boolean;
    dndQuestions: IDndQuestion;
    optionsList?: IDndSnippet[];    // For UI only
}

export interface IDndQuestion {
    question: string;
    questionId: string;
    options: {
        answerOptions: IDndSnippet[];
        additionalOptions: IDndSnippet[];
    };
}

export interface IDndSnippet {
    id: string;
    text: string;
    hasDropDown: boolean;
    ddOptions: IDndDropdown[];
    // for UI only
    fragments?: any[];
}

export interface IDndDropdown {
    id: string;
    selectedValue?: string;   // For UI only
    ddownOptions: IDDOption[];
}

export interface IDDOption {
    text: string;
    isCorrect: boolean;
}
