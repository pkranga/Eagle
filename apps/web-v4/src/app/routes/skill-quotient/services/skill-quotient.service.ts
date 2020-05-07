/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constants } from '../utils/constant.utils';
import { ConfigService } from '../../../services/config.service';

@Injectable({
  providedIn: 'root'
})
export class SkillQuotientService {
  isSiemensInstance = this.configSvc.instanceConfig.features.siemens.enabled;
  // isSiemensInstance = true;
  constructor(private http: HttpClient, private configSvc: ConfigService) {}
  getSkills(): Observable<any> {
    try {
      return this.http.get(`${constants.ROOT_URL}/skills`);
      // , UtilMethods.getAuthHeaders());
    } catch (e) {
      console.error(e);
    }
  }
  getSkillQuotient(skill_id?: string): Observable<any> {
    try {
      return this.http.get(`${constants.ROOT_URL}/skillquotient?skill_id=${skill_id}`);
      // , UtilMethods.getAuthHeaders());
    } catch (e) {
      console.error(e);
    }
  }
  getRoles(): Observable<any> {
    try {
      return this.http.get(`${constants.ROOT_URL}/role/get`);
      // , UtilMethods.getAuthHeaders());
    } catch (e) {
      console.log(e);
    }
  }
  getRoleQuotient(role_id?: string): Observable<any> {
    try {
      return this.http.get(`${constants.ROOT_URL}/rolequotient?role_id=${role_id}`);
      // , UtilMethods.getAuthHeaders());
    } catch (e) {
      console.log(e);
    }
  }
  getAvailableRoles(): Observable<any> {
    try {
      return this.http.get(`${constants.ROOT_URL}/role/getExisting`);
      // , UtilMethods.getAuthHeaders())
    } catch (e) {
      console.log(e);
    }
  }
  getAddRoles(addRole?: Object): Observable<any> {
    try {
      return this.http.post<Object>(`${constants.ROOT_URL}/role/add`, addRole);
      // , UtilMethods.getAuthHeaders());
    } catch (e) {
      console.log(e);
    }
  }
  addSkill(addRole?: Object): Observable<any> {
    try {
      return this.http.post<Object>(`${constants.ROOT_URL}/skills/add`, addRole);
      // return this.http.post<Object>(`${constants.ROOT_URL}/role/add`, addRole);
      // , UtilMethods.getAuthHeaders());
    } catch (e) {
      console.log(e);
    }
  }
  shareRole(shareRole?: Object): Observable<any> {
    try {
      return this.http.post<Object>(`${constants.ROOT_URL}/role/shareRole`, shareRole);
      // return this.http.post<Object>(`${constants.ROOT_URL}/role/add`, addRole);
      // , UtilMethods.getAuthHeaders());
    } catch (e) {
      console.log(e);
    }
  }
  autocomplete(searchText): Observable<any> {
    try {
      return this.http.get(`${constants.ROOT_URL}/skill/search?search_text=${searchText}`);
      // , UtilMethods.getAuthHeaders());
    } catch (e) {
      console.log(e);
    }
  }
  deleteRole(roleId): Observable<any> {
    try {
      return this.http.delete(`${constants.ROOT_URL}/role/delete?role_id=${roleId}`);
      // , UtilMethods.getAuthHeaders())
    } catch (e) {
      console.log(e);
    }
  }
  popularSkills(): Observable<any> {
    try {
      return this.http.get(`${constants.ROOT_URL}/recommendedSkills`);
      // , UtilMethods.getAuthHeaders())
    } catch (e) {
      console.log(e);
    }
  }

  allSkills(allSkillsObj): Observable<any> {
    try {
      if (this.isSiemensInstance) {
        return this.http.get(
          `${constants.ROOT_URL}/allSkills?search_text=${allSkillsObj.search}&criticality=${
            allSkillsObj.criticality
          }&page_number=${allSkillsObj.pageNo}`
        );
      }
      if (!this.isSiemensInstance) {
        return this.http.get(
          `${constants.ROOT_URL}/allSkills?search_text=${allSkillsObj.search}&horizon=${
            allSkillsObj.horizon
          }&category=${allSkillsObj.category}&page_number=${allSkillsObj.pageNo}`
        );
      }

      // , UtilMethods.getAuthHeaders())
    } catch (e) {
      console.log(e);
    }
  }
  updateRole(updateRole?: Object): Observable<any> {
    try {
      return this.http.post(`${constants.ROOT_URL}/role/update`, updateRole);
      // , UtilMethods.getAuthHeaders())
    } catch (e) {
      console.log(e);
    }
  }

  getAdmin(): Observable<any> {
    try {
      return this.http.get(`${constants.ROOT_URL}/isAdmin`);
      // , UtilMethods.getAuthHeaders())
    } catch (e) {
      console.log(e);
    }
  }
  getApprover(): Observable<any> {
    try {
      return this.http.get(`${constants.ROOT_URL}/isApprover`);
      // , UtilMethods.getAuthHeaders())
    } catch (e) {
      console.log(e);
    }
  }

  popularSkillData(skillId?: string): Observable<any> {
    try {
      return this.http.get(
        `${constants.ROOT_URL}/skillData?skill_id=${skillId}`
        // UtilMethods.getAuthHeaders()
      );
    } catch (e) {
      console.log(e);
    }
  }
}
