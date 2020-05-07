/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IChannels } from '../../../../models/wingspan-pages.model';
import { RoutingService } from '../../../../services/routing.service';
import { ConfigService } from '../../../../services/config.service'
@Component({
  selector: 'ws-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {
  @Input() showNavBar = true;

  channels: IChannels[] = [
    {
      title: 'Unconscious Bias',
      desc: 'Making the right people decisions',
      logo: '',
      icon: 'scatter_plot',
      routerLink: '/pages/unconscious-bias',
      isAvailable: this.configSvc.instanceConfig.features.channels.subFeatures.unconsciousBias.available
    },
    {
      title: 'Experience WOW',
      desc: 'Reimagining Infosys from the perspective of digital platforms and the way we do our business and work',
      logo: '',
      icon: 'call_merge',
      routerLink: '/experience-wow',
      isAvailable: this.configSvc.instanceConfig.features.channels.subFeatures.experienceWow.available
    },
    {
      title: 'Digitalization Learning Channel',
      desc: 'Apply it to your business',
      logo: '',
      icon: 'nfc',
      routerLink: '/pages/digitalization',
      isAvailable: this.configSvc.instanceConfig.features.channels.subFeatures.digitalizationLearningChannel.available
    }
  ];
  constructor(public routingSvc: RoutingService, private configSvc: ConfigService) { }

  ngOnInit() { }
}
