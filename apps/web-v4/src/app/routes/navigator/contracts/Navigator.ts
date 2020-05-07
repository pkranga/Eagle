/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export namespace NSNavigator {
  export interface ISlide {
    title: string;
    description?: string;
    href?: string;
    bannerUrl: string;
    buttonTitle?: string;
    buttonBlink?: boolean;
  }
  export interface Icourse {
    course_id: number;
    course_description: string;
    course_time: number;
    course_name: string;
    course_lex_link: string;
    course_classroom_link: string;
    course_image: string;
  }
  export interface Iprofile {
    profile_id: number;
    profile_name: string;
    profile_display_name: string;
    profile_description: string;
    technology: string[];
    profile_time: number;
    attached: boolean;
    profile_image: string;
    courses: Icourse[];
  }
  export interface IlpPlayground {
    playground_id: number;
    playground_name: string;
    playground_description: string;
    playground_link: string;
  }
  export interface IlpInternalCertification {
    lp_internal_certification_id: number;
    lp_internal_certification_name: string;
    lp_internal_certification_description: string;
    lp_internal_certification_link: string;
  }
  export interface IlpExternalCertification {
    lp_external_certification_id: number;
    lp_external_certification_name: string;
    lp_external_certification_description: string;
    lp_external_certification_link: string;
  }
  export interface IlpData {
    lp_name: string;
    lp_id: number;
    lp_description: string;
    lp_recommendation: string;
    capstone_description: string;
    lp_capstone: string;
    linked_program: string;
    lp_alternate: number[];
    lp_image: string;
    profiles: Iprofile[];
    lp_playground: IlpPlayground[];
    lp_internal_certification: IlpInternalCertification[];
    lp_external_certification: IlpExternalCertification[];
  }
  export interface IDATA {
    lp_data: IlpData[];
  }
  export interface Icourse2 {
    course_id: number;
    course_name: string;
    course_description: string;
    course_link: string;
    course_image: string;
  }

  export interface IdmData {
    arm_id: number;
    arm_name: string;
    courses: Icourse2[];
  }

  export interface IDMDATA {
    dm_data: IdmData[];
  }

  export interface IfsCourse {
    course_id: number;
    course_name: string;
    course_desc: string;
    course_time: number;
    course_image: string;
    course_lex_link: string;
  }

  // export interface Ifs_playground {}

  // export interface Ifs_internal_certification {}

  // export interface Ifs_external_certification {}

  export interface IfsData {
    fs_id: number;
    fs_name: string;
    fs_desc: string;
    fs_image: string;
    fs_linked_program: string;
    fs_course: IfsCourse[];
    fs_playground: [];
    fs_internal_certification: [];
    fs_external_certification: [];
  }

  export interface IFSDATA {
    fs_data: IfsData[];
  }

  export interface IGroupMember {
    lp_groupmember_id: number;
    lp_linked_id: number;
    lp_linked_profile_id: number;
  }

  export interface Igroup {
    lp_groupid: number;
    lp_groupname: string;
    lp_groupdesc: string;
    lp_groupimage: string;
    group_member: IGroupMember[];
  }

  export interface Ivariant {
    variant_id: number;
    variant_name: string;
    variant_description: string;
    variant_image: string;
    group: Igroup[];
  }

  export interface Irole {
    role_id: number;
    role_name: string;
    role_description: string;
    role_image: string;
    variants: Ivariant[];
  }

  export interface INsoData {
    arm_id: number;
    arm_name: string;
    roles: Irole[];
  }

  export interface INSODATA {
    nso_data: INsoData[];
  }
}
