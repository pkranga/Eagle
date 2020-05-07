/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/**
 * © 2017 - 2019 Infosys Limited, Bangalore, India. All Rights Reserved.
 * Version: 1.10
 * <p>
 * Except for any free or open source software components embedded in this Infosys proprietary software program (“Program”),
 * this Program is protected by copyright laws, international treaties and other pending or existing intellectual property rights in India,
 * the United States and other countries. Except as expressly permitted, any unauthorized reproduction, storage, transmission in any form or
 * by any means (including without limitation electronic, mechanical, printing, photocopying, recording or otherwise), or any distribution of
 * this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible
 * under the law.
 * <p>
 * Highly Confidential
 */
substitute url based on requirement

import com.fasterxml.jackson.databind.ObjectMapper;
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
substitute url based on requirement

    @Autowired
    private UserUtilityService userUtilService;

    @Override
    public Map<String, Object> getUserDetails(String userId, ArrayList<String> requiredFields) {

        Map<String, Object> response = new HashMap<>();

        String userRepositoryData;
        try {
            userRepositoryData = userUtilService.getUserEmailFromUserId("Infosys", userId);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Data not found for " + userId);
        }

        if (null != userRepositoryData)
            userId = userRepositoryData;
        else
            throw new ResourceNotFoundException("Data not found for " + userId);

substitute url based on requirement

        if (data.isPresent()) {
            @SuppressWarnings("unchecked")
			Map<String,Object> mappedValues = mapper.convertValue(data.get(), Map.class);
            if (null == requiredFields || requiredFields.size() == 0) {
                return mappedValues;
            } else {
                for (String field : requiredFields) {
                    response.put(field, mappedValues.get(field));
                }
            }
        }else{
            throw new ResourceNotFoundException("Data not found for " + userId);
        }
        return response;
    }
}