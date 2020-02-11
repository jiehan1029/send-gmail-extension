#!/bin/bash -e

browser=${1:-"chrome"}

echo "prepare package for $browser extension..."

# remove previous publish folder
rm -rf publish
mkdir publish

# build react apps
npm run build
# copy popup files
cp -R build/popup/. publish
# copy content files - only js and css
cp build/content/static/js/content.js publish
cp build/content/static/css/content.css publish
cp build/content/static/css/app.css publish


# copy manifest file and icons
cp manifests/manifest_${browser}.json publish/
cp -R manifests/extension_icons/. publish/
cd publish
cp manifest_${browser}.json manifest.json
rm manifest_${browser}.json
cd ..

# copy background.js
cp src/background.js publish/

# copy browser-polyfill from node_modules
cp node_modules/webextension-polyfill/dist/browser-polyfill.js publish/
cp node_modules/webextension-polyfill/dist/browser-polyfill.js.map publish/
# copy gmail.js from node_modules
cp node_modules/gmail-js/src/gmail.js publish/
# copy jquery from node_modules
cp node_modules/jquery/dist/jquery.min.js publish/