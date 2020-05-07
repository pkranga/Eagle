/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface ISkills {
  assessment_skill_quotient: string;
  category: string;
  certification_count: number;
  certification_skill_quotient: string;
  content_created_skill_quotient: string;
  course_count: number;
  email_id: string;
  employee_id: string;
  horizon: string;
  image_url: string;
  project_experience_skill_quotient: string;
  skill_id: string;
  skill_name: string;
  total_skill_quotient: number;
  track: string;
}
export interface IApprover {
  is_approver: boolean;
}
export interface IAdmin {
  is_admin: boolean;
}
export interface IGetRoles {
  image_url: string;
  role_id: string;
  role_name: string;
  type: string;
}
export interface IProjectEndorsement {
  all_request: Array<IRequest>;
  approved_request: IRequest[];
  pending_request: IRequest[];
  rejected_request: IRequest[];
}
export interface IRequest {
  approver_email_id: string;
  created_on: Date;
  description: string;
  email_id: string;
  endorse_id: string;
  is_approver_viewed: boolean;
  is_deleted: boolean;
  is_inserted: boolean;
  last_updated_on: Date;
  project_code: string;
  rating: number;
  skill_id: string;
  skill_name: string;
  status: string;
}
export interface IAssessment {
  assessment_date: string;
  assessment_score: number;
  content_name: string;
  email_id: string;
  lex_id: string;
  max_score: number;
  min_score: number;
  percentile: number;
  skill_id: string;
  skill_name: string;
  type: string;
}
export interface ICertification {
  assessment_date: string;
  assessment_score: number;
  content_name: string;
  created_on: string;
  email_id: string;
  employee_id: string;
  lex_id: string;
  max_score: number;
  min_score: number;
  percentile: number;
  skill_id: string;
  type: string;
}
export interface IAvailableCourseOrgData {
  doc_count: number;
  key: string;
}
export interface IOrgWideStats {
  doc_count: number;
  from: number;
  key: string;
  to: number;
}
export interface IAvaialableCourse {
  content_name: string;
  course_group_id: string;
  lex_id: string;
  material_url: string;
  skill_id: number;
  skill_name: string;
  type: string;
}
export interface IAvailableCertification {
  content_name: string;
  course_group: string;
  lex_id: string;
  material_url: string;
  skill_id: number;
  skill_name: string;
  type: string;
}

export interface IAvailableCertificationRoles {
  content_name: string;
  course_group_id: string;
  lex_id: string;
  material_url: string;
  orgWideData: {
    data: IPieChartData;
    id: string;
    legend: boolean;
    materialUrl: string;
    name: string;
    totalUsers: number;
  };
  org_data: IAvailableCourseOrgData;
  skill_id: number;
  skill_name: string;
  type: string;
}
export interface ISkillQuotientResponse {
  assessment: Array<IAssessment>;
  available_certification: Array<IAvailableCertification>;
  available_certification_org_data: IAvailableCourseOrgData;
  available_course: Array<IAvaialableCourse>;
  available_course_org_data: IAvailableCourseOrgData;
  certification: Array<ICertification>;
  content_created: Array<any>;
  default_quotient: number;
  org_wide_stats: Array<IOrgWideStats>;
  project_endorsement: Array<any>;
  project_experience: {
    email_id: string;
    experience_in_months: number;
    skill_id: string;
    type: string;
  };
  related_skills: Array<IRelatedSkillData>;
  skill_details: IRelatedSkillData;
  skill_quotient: {
    assessment_skill_quotient: string;
    category: string;
    certification_count: number;
    certification_skill_quotient: string;
    content_created_skill_quotient: string | null;
    course_count: number;
    criticality: string;
    default_skill_quotient: number;
    email_id: string;
    employee_id: string;
    horizon: string;
    image_url: string;
    is_deleted: number | null;
    is_grouped: number | null;
    is_searchable: number | null;
    project_endorsement_skill_quotient: number;
    project_experience_skill_quotient: number;
    rank_number: number;
    skill_certification_comp: number;
    skill_course_comp: number;
    related_skill_id: number;
    related_skill_name: string;
    skill_id: number;
    skill_name: string;
    skill_type: string | null;
    total_skill_quotient: number;
    type: string;
  };
  total_user_count: number;
  type: string;
}

export interface IRelatedSkillData {
  category: string;
  certification_count: number;
  course_count: number;
  horizon: string;
  image_url: string;
  is_deleted: number | null;
  is_grouped: number | null;
  is_searchable: number | null;
  rank_number: number;
  related_skill_id: number;
  related_skill_name: string;
  skill_id: number;
  skill_name: string;
  skill_type: string | null;
}
export interface IRoleQuotientResponse {
  assessment_quotient: number;
  certification_quotient: number;
  default_quotient: number;
  image_url: string;
  role_quotient_details: IRoleDetails;
  total_quotient: number;
  type: string;
}

export interface IRoleDetails {
  image_url: string;
  role_id: string;
  skills: Array<ISkillsData>;
  role_name: string;
}
export interface ISkillsData {
  assessment: Array<any>;
  available_assessment: Array<any>;
  available_certification: ICourseData[];
  available_certification_org_data: Array<IAvailableCourseOrgData>;
  available_course: ICourseData[];
  available_course_org_data: Array<IAvailableCourseOrgData>;
  certification: Array<any>;
  skill_id: number;
  skill_name: string;
}

export interface ICourseData {
  content_name: string;
  course_group_id: string;
  lex_id: string;
  material_url: string;
  skill_id: number;
  skill_name: string;
  type: string;
}
export interface IPopularSkills {
  category: string;
  certification_count: number;
  course_count: number;
  horizon: string;
  image_url: string;
  is_deleted: boolean;
  is_grouped: boolean;
  is_searchable: number;
  rank_number: number;
  skill_id: number;
  skill_name: string;
}
export interface IAllSkills {
  category_wise_skill_count: Array<IAvailableCourseOrgData>;
  horizon_wise_skill_count: Array<IAvailableCourseOrgData>;
  is_pagination: boolean;
  skill_list: ISkillList[];
  total_skills: number;
}
export interface ISkillList {
  category: string;
  certification_count: number;
  course_count: number;
  horizon: string;
  image_url: string;
  is_deleted: boolean;
  is_grouped: boolean;
  is_searchable: number;
  rank_number: number;
  skill_id: number;
  skill_name: string;
}
export interface IGetExistingRoles {
  created_on: string;
  dev_role: number;
  email_id: string;
  image_url: string;
  role_id: string;
  role_name: string;
  type: string;
  skills: ISkillsRole[];
}
export interface ISkillsRole {
  skill_id: string;
  skill_name: string;
}
export interface IAvailableCertificationData {
  data: {
    color: string;
    key: string;
    y: any;
  }[];
  id: string;
  legend: boolean;
  materialUrl: string;
  name: string;
  totalUsers: number;
}

export interface ISearchObj {
  skill_name: string;
  skill_id: number;
  image_url: string;
  certification_count: number;
  course_count: number;
  track: string | undefined;
}

export interface IPieChartData {
  key: string;
  y: number | string;
  color: string;
}
export interface ISearchAutocomplete { }
