/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'ws-auth-skills-select',
  templateUrl: './skills-select.component.html',
  styleUrls: ['./skills-select.component.scss'],
})
export class SkillsSelectComponent implements OnInit {

  skillsData: string[] = []
  selectedSkills: string[] = []
  updatedSkillsData: string[] = []

  constructor(
    public dialogRef: MatDialogRef<SkillsSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { skillsData: string[], selectedSkills: string[] },
  ) {
    this.skillsData = data.skillsData
    this.selectedSkills = data.selectedSkills
  }

  ngOnInit() {
    this.addCheckedKey()
  }

  updateSelected(event: any, skillValue: string, index: number) {
    if (event.checked) {
      this.selectedSkills.push(skillValue)
    } else {
      if (this.selectedSkills.indexOf(skillValue) > -1) {
        this.selectedSkills.splice(index, 1)
      }
    }

  }

  close() {
    this.dialogRef.close(this.selectedSkills)

  }

  addCheckedKey() {
    let checked = false
    this.skillsData.map((element: any) => {
      checked = this.checkSelectedSkill(element.skill)
      element['checked'] = checked
      this.updatedSkillsData.push(element)
    })
    // this.updatedSkillsData=JSON.stringify(this.updatedSkillsData)

  }

  checkSelectedSkill(skill: string): boolean {
    if (this.selectedSkills.indexOf(skill) > -1) {
      return true
    }
    return false
  }
}
