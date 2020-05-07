#               "Copyright 2020 Infosys Ltd.
#               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
#               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"
cd $2
echo "generating route for $1 at below path"
pwd
ng g m $1 --routing
mkdir $1/components
ng g c $1/components/$1
