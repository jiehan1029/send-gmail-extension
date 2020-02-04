#!/bin/bash -e

browser=${1:-"chrome"}

echo "prepare package for $browser extension..."

# remove previous publish folder
rm -rf publish
mkdir publish

# build react apps
npm run build
# copy popup files
cp -v -R build/popup/. publish
# copy content files - only js and css
cp -v build/content/static/js/content.js publish
cp -v build/content/static/css/content.css publish
cp -v build/content/static/css/app.css publish


# copy manifest file and icons
cp -v manifests/manifest_${browser}.json publish/
cp -v -R manifests/extension_icons/. publish/
cd publish
cp -v manifest_${browser}.json manifest.json
rm -v manifest_${browser}.json
cd ..

# copy background.js
cp -v src/background.js publish/

# copy browser-polyfill from node_modules
cp -v node_modules/webextension-polyfill/dist/browser-polyfill.js publish/
cp -v node_modules/webextension-polyfill/dist/browser-polyfill.js.map publish/

	

