/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface IRootOrg {
  id: string;
  identifier: string;
  channel: string;
  description: string;
  hashTagId: string;
  orgCode: string;
  orgName: string;
  preferredLanguage: string;
  slug: string;

  addressId: any;
  approvedBy: any;
  approvedDate: any;
  communityId: any;
  contactDetail: string; // Need to parse
  createdBy: any;
  createdDate: any;
  dateTime: any;
  externalId: any;
  homeUrl: any;
  imgUrl: any;
  isApproved: any;
  isDefault: boolean;
  isRootOrg: boolean;
  noOfMembers: number;
  orgType: any;
  parentOrgId: any;
  provider: any;
  rootOrgId: any;
  status: any;
  theme: any;
  updatedBy: string;
  updatedDate: string;
}

export interface IOrganisation {
  roles: any[];
  organisationId: string;
  orgName: string;
}

export interface IUserProfile {
  id: string;
  email: string;
  encEmail?: string;
  location: any;
}

export interface IUserGeneralProfile {
  id: string;
  name: string;
  email: string;
  userName: string;
  token: string;
}

export interface IProfileResponse {
  response: IUserProfile;
}

export interface IUserProfileGraph {
  city?: string;
  companyName?: string;
  department: string;
  givenName: string;
  imageUrl?: string;
  jobTitle: string;
  mobilePhone: string;
  onPremisesUserPrincipalName: string;
  surname: string;
  usageLocation: string;
}
export interface IUserProfileGraphResponse {
  response: IUserProfileGraph;
}
export interface IAuthorsProfileGraphResponse {
  response: IUserProfileGraph[];
}
// IAP user profile
export interface IIapUserProfile {
  PolicyAccepted: any;
  inProgress: any[];
  name: string;
  progress: IIapUserProgress[];
  reviewer: boolean;
  role: string;
  userId: string;
}
export interface IIapUserProgress {
  badge: string;
  bestPercentage: number;
  noOfAttempts: number;
  secured: boolean;
  threshold: number;
}
export interface ITncAcceptRequest {
  termsAccepted: Array<{
    docName: string;
    version: string;
  }>;
}
export interface ITncResponse {
  response: ITncFetch;
}
export interface ITncFetch {
  isAccepted: boolean;
  termsAndConditions: ITnc[];
}
export interface ITnc {
  acceptedDate: Date;
  acceptedVersion: string;
  content: string;
  isAccepted: boolean;
  name: string;
  version: string;
}
export interface ITncAcceptResponse {
  response: 'SUCCESS' | 'FAILED';
}

export interface IEmailUserId {
  email: string;
  userId: string;
}

export interface IUserFollowEntity {
  email: string;
  id: string;
  firstname: string;
}

export interface IUserFollow {
  followers: IUserFollowEntity[];
  following: IUserFollowEntity[];
}

export interface IUserRealTimeProgressUpdateRequest {
  max_size: number; // the max pages or score or time
  current: string[]; // a list of all pages seen or score achieved
  user_id_type: 'email' | 'uuid';
  mime_type: string;
  content_type: string;
}
