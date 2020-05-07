/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface ISkillsRole {
  role_name: string;
  role_desc: string;
  skills: ISkills;
}
export interface ISkills {
  available_course: IAvailableCourse[];
  available_program_list: IAvailableProgramList[];
  image_url: string;
  isCertificationMandatory: number;
  is_skill_mandatory: number;
  skill_group_id: number;
  skill_group_name: string;
  skill_desc: string;
}
export interface IAvailableCourse {
  image_url: string;
  content_name: string;
  learning_type: string;
  lex_course_id: string;
  linked_program: number;
  linked_program_name: string;
  skill_id: number;
  skill_name: string;
  skill_type: string;
  type: string;
}
export interface IAvailableProgramList {
  available_certifications: IAvailableCourse[];
  available_courses: IAvailableCourse[];
  content_name: string;
  lex_id: number;
  learning_path_desc: string;
}
// export interface IAvailableCertifications {
//   content_name: string;
//   learning_type: string;
//   lex_course_id: string;
//   linked_program: number;
//   linked_program_name: string;
//   skill_id: number;
//   skill_name: string;
//   skill_type: string;
//   type: string;
// }
export interface IAvailableData {
  available_certifications: IAvailableCourse[];
  available_courses: IAvailableCourse[];
  content_name: string;
  lex_id: number;
}
