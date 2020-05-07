/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { ISearchRequest } from './searchResponse.model';

export interface IToDoListResponse {
    name: string;
    completed: boolean;
}

export interface IAboutConfig {
    title: string;
    about: string;
}

export interface ISearchConfig {
    title: string;
    searchQuery: ISearchRequest;
}

export interface IProgramsConfig {
    title: string;
    programsList: IPrograms[];
}

export interface IPrograms {
    title: string;
    logo: string;
    searchQuery: ISearchRequest;
}

export interface IToDoListRequest {
    title: string;
    toDoId: string;
}

export interface IChampionsConfig {
    title: string;
    champions: IChampions[];
}

export interface IChampions {
    title: string;
    championsList: IChampionsDetails[];
}

export interface IChampionsDetails {
    firstName: string;
    lastName: string;
    emailId: string;
    desc: string;
}

export interface IDashboardConfig {
    title: string;
    dashboardsList: IDashboard[];
}

export interface IDashboard {
    title: string;
    titleKey: string;
}

export interface IInfluencerConfig {
    title: string;
    yammerGroupId?: string;
}

export interface ICoCreatorConfig {
    title: string;
    desc: string;
    contributionList: IContribution[];
}

export interface IContribution {
    name: string;
    iconName: string;
    emailText: string;
}

export interface IFeedbackConfig {
    title: string;
}

export interface IEventsConfig {
    title: string;
    eventsList: IEvent[];
}
export interface IEvent {
    timestamp: number;
    eventTitle: string;
    eventDesc: string;
    eventTime: string;
    category: string;
}

export interface IChannels {
    title: string;
    desc: string;
    logo?: string;
    icon?: string;
    routerLink: string;
    isAvailable: boolean;
}