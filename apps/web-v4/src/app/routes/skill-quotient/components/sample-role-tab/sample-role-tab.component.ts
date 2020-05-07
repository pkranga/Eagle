/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sample-role-tab',
  templateUrl: './sample-role-tab.component.html',
  styleUrls: ['./sample-role-tab.component.scss']
})
export class SampleRoleTabComponent implements OnInit {
  image = '/public-assets/common/images/skill_images/wingspan.jpg';
  roles = [
    {
      skill_name: 'DI_Engineer_Analytics',
      image_url: '/public-assets/common/images/skill_images/card_img.jpg'
    },
    {
      skill_name: 'DI_Engineer_Automation',
      image_url: '/public-assets/common/images/skill_images/card_img.jpg'
    }
  ];
  constructor() {}

  ngOnInit() {}
}
