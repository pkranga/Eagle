# Notes for Development / Plans

Please do not modify this file. This is to record the requirements, ideas for implementation, etc

## IDEA: Implementation for multiple tenants

1. Multi-system > each with single installation
2. &#10004; Single System > multiple variation

## Application Load Flow

1. Get generic instance configuration (Could be hardcoded with application itself.)
2. Try login (use generic data configuration. Themes may be used from localstorage as well. User can remove it from the system)
3. (a) If not logged In, show the generic data @Stop_flow (b) If loggedIn try below
4. Get the configuration from the loggedIn detail. Find out the instance deatil name from loggedIn deatils
5. Get the user preference (Specific to user)
6. Check for the TNC, if the user has accepted as well
7. d

## Configuation files

1. Home Page banner jsons (banner.json, banner.lang-code.json)
2. Configurations for pages (Multiple pages)
3. Instance Configurations: instance-name.config.json
4. d

## Development Paths / Merge

1. All the pages required for banners etc should be displayed as Wingspan pages

## Things needs to be done

1. @Vaibhav, Get all the apis for navigator -> separate API for all the pages
2. @ShivaBala, Get the hosting of the configurations
3. @
