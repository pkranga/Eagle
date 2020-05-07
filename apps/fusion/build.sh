#               "Copyright 2020 Infosys Ltd.
#               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
#               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" -->
#!/usr/bin/env node --max_old_space_size=8192
npm run i18n
ng build --prod --outputPath=dist/www/en --baseHref=/ --i18nLocale=en --verbose=true
langs=("ar zh-CN de es fr nl")
for lang in $langs
do
  ng build --prod --output-path=dist/www/$lang --baseHref=/ --i18nLocale=$lang --i18nFile=locale/messages.$lang.xlf --verbose=true
done
npm run compress:brotli
npm run compress:gzip
