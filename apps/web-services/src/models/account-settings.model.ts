/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IAccountSettings {

    user_id: string,
    user_name: string,
    role: string,
    role_privacy?: boolean,
    teaching_state: string,
    teaching_state_privacy?: boolean,
    organization: string,
    organization_privacy?: boolean,
    profile_image?: string,
    phone?: number [],
    phone_privacy?: boolean,
    public_profiles?: IAccountSocialDetails[]
}
export interface IAccountSocialDetails {
    field: string,
    data: string,
    privacy: boolean
}
