/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RecipientDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3151337997511614236L;

	@JsonProperty(value = "recipient")
	private String recipient;

	@JsonProperty(value = "modes")
	private List<ModesDTO> modes;

	@JsonProperty(value = "classified_as")
	private String classification;
}
