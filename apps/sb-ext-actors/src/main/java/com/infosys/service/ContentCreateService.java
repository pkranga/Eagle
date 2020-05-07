/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
package com.infosys.service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface ContentCreateService {

    public Map<String, String> createService(Map<String, Object> createRequest);
    
    public ResponseEntity<Boolean> uploadService(Map<String,String> fileAttributes, MultipartFile file);

}