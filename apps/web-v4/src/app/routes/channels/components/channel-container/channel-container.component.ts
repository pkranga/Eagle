/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { IChannels } from "src/app/models/wingspan-pages.model";
import { ConfigService } from '../../../../services/config.service'
@Component({
  selector: 'ws-channel-container',
  templateUrl: './channel-container.component.html',
  styleUrls: ['./channel-container.component.scss']
})
export class ChannelContainerComponent implements OnInit {
  isLeadershipTabAvailable = this.configSvc.instanceConfig.features.channels.subFeatures.leadershipTab;
  channels: IChannels[] = [
    {
      title: 'Unconscious Bias',
      desc: 'Making the right people decisions',
      logo: '',
      icon: 'scatter_plot',
      routerLink: '/pages/unconscious-bias',
      isAvailable: this.configSvc.instanceConfig.features.siemens.available
    },
    {
      title: 'Experience WOW',
      desc: 'Reimagining Infosys from the perspective of digital platforms and the way we do our business and work',
      logo: '',
      icon: 'call_merge',
      routerLink: '/experience-wow',
      isAvailable: this.configSvc.instanceConfig.features.navigateChange.available
    },
    {
      title: 'Digitalization Learning Channel',
      desc: 'Apply it to your business',
      logo: '',
      icon: 'nfc',
      routerLink: '/pages/digitalization',
      isAvailable: this.configSvc.instanceConfig.features.siemens.available
    },
    {
      title: 'Infosys Knowledge Institute',
      desc: 'Helps industry leaders develop a deeper understanding of business and technology',
      logo: '',
      icon: 'pages',
      routerLink: '/iki',
      isAvailable: this.configSvc.instanceConfig.features.iki.available
    },
    {
      title: 'CMT Learning Hub',
      desc: 'Making the right people decisions',
      logo: '',
      icon: 'bubble_chart',
      routerLink: '/cmt',
      isAvailable: this.configSvc.instanceConfig.features.cmt.available
    },
    {
      title: 'Full Stack Sales Leader',
      desc: 'Embark on the sales journey through a space mission',
      logo: '',
      icon: 'public',
      routerLink: '/salesleader',
      isAvailable: this.configSvc.instanceConfig.features.lab42.available
    }
  ];
  constructor(private configSvc: ConfigService) { }

  ngOnInit() {
  }

}
