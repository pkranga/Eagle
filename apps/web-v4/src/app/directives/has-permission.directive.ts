/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { UserService } from '../services/user.service';

@Directive({
  selector: '[wsHasPermission]'
})
export class HasPermissionDirective {
  private reqRoles: string[] = [];
  private reqFeatures: string[] = [];
  private roleOp: 'AND' | 'OR' = 'AND';
  private featureOp: 'AND' | 'OR' = 'AND';
  private roleFeatureOp: 'AND' | 'OR' = 'AND';
  private condition = true;
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userSvc: UserService,
    private configSvc: ConfigService
  ) {}

  @Input()
  set wsHasPermission(val) {
    this.reqFeatures = val || [];
    this.updateView();
  }
  @Input()
  set wsHasPermissionRoles(val) {
    this.reqRoles = val || [];
    this.updateView();
  }
  @Input()
  set wsHasPermissionFeatureOp(val) {
    this.featureOp = val === 'AND' ? 'AND' : 'OR';
    this.updateView();
  }
  @Input()
  set wsHasPermissionRoleOp(val) {
    this.roleOp = val === 'AND' ? 'AND' : 'OR';
    this.updateView();
  }
  @Input()
  set wsHasPermissionRoleFeatureOp(val) {
    this.roleFeatureOp = val === 'AND' ? 'AND' : 'OR';
    this.updateView();
  }
  @Input()
  set wsHasPermissionCondition(val) {
    this.condition = val;
    this.updateView();
  }

  private updateView() {
    this.viewContainer.clear();
    if (this.checkPermission()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  private checkPermission(): boolean {
    if (!this.condition) {
      return false;
    }
    const hasRolesPermission =
      this.roleOp === 'AND' ? this.reqRoles.every(role => this.hasRole(role)) : this.reqRoles.some(role => this.hasRole(role));
    const hasFeaturesPermission =
      this.featureOp === 'AND' ? this.reqFeatures.every(f => this.hasFeature(f)) : this.reqFeatures.some(f => this.hasFeature(f));
    return this.roleFeatureOp === 'AND' ? hasRolesPermission && hasFeaturesPermission : hasRolesPermission || hasFeaturesPermission;
  }

  private hasRole = role => this.userSvc.userRoles.has(role);
  private hasFeature = feature => {
    return this.configSvc.instanceConfig.features[feature] && this.configSvc.instanceConfig.features[feature].enabled;
  }
}
