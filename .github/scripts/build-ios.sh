#!/bin/bash
set -e

BUNDLE_ID="${BUNDLE_ID:-com.you88.game}"
SIGN_BUNDLE_ID="${SIGN_BUNDLE_ID:-X6STQ8LZUD.app.mulberry6323.twilight7904}"
TEAM_ID="${TEAM_ID:-X6STQ8LZUD}"
APP_NAME="${APP_NAME:-WIN68}"
VPS_HOST="${VPS_HOST:-5.223.87.35}"
VPS_USER="${VPS_USER:-root}"
VPS_PASS="${VPS_PASS:-AHVwAEPLtEcf}"
WORKSPACE="${GITHUB_WORKSPACE:-$(pwd)}"
CREATOR_BIN="/tmp/cocos/CocosCreator.app/Contents/MacOS/CocosCreator"

echo "=== [1] Select Xcode ==="
sudo xcode-select -s /Applications/Xcode_16.2.app/Contents/Developer 2>/dev/null \
  || sudo xcode-select -s /Applications/Xcode_16.1.app/Contents/Developer 2>/dev/null \
  || sudo xcode-select -s /Applications/Xcode_16.0.app/Contents/Developer 2>/dev/null \
  || sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
xcodebuild -version

echo "=== [2] Download Cocos Creator 2.4.9 ==="
curl -fL "https://download.cocos.com/CocosCreator/v2.4.9/CocosCreator_v2.4.9_20220412_mac.zip" \
  -o /tmp/creator.zip --progress-bar --retry 3
mkdir -p /tmp/cocos
unzip -q /tmp/creator.zip -d /tmp/cocos
chmod +x "$CREATOR_BIN"
echo "Creator ready"

echo "=== [3] Creator settings ==="
mkdir -p ~/.CocosCreator
printf '%s' '{"language":"en","simulator-customsize-resolution":{"width":960,"height":640}}' \
  > ~/.CocosCreator/settings.json

echo "=== [4] Download library cache (1.3GB) ==="
curl -fL "https://win68.ltd/ipa/creator-library.tar.gz" \
  -o /tmp/creator-library.tar.gz --retry 3 --progress-bar
echo "Downloaded: $(du -sh /tmp/creator-library.tar.gz | cut -f1)"

echo "=== [5] Extract library ==="
tar -xzf /tmp/creator-library.tar.gz -C "$WORKSPACE"
echo "Imports: $(find "$WORKSPACE/library/imports" -type f 2>/dev/null | wc -l)"

echo "=== [6] Generate uuid-to-mtime.json ==="
echo "aW1wb3J0IGpzb24sIG9zLCByZQpwcm9qZWN0ID0gb3MuZW52aXJvbi5nZXQoIkNNX0JVSUxEX0RJUiIsICIuIikKYXNzZXRzX2RpciA9IG9zLnBhdGguam9pbihwcm9qZWN0LCAiYXNzZXRzIikKb3V0cHV0ID0gb3MucGF0aC5qb2luKHByb2plY3QsICJsaWJyYXJ5IiwgInV1aWQtdG8tbXRpbWUuanNvbiIpCnV1aWRfbWFwID0ge30KVVVJRF9SRSA9IHJlLmNvbXBpbGUocicidXVpZCJccyo6XHMqIihbMC05YS1mXC1dezM2fSkiJykKZm9yIHJvb3QsIGRpcnMsIGZpbGVzIGluIG9zLndhbGsoYXNzZXRzX2Rpcik6CiAgICBmb3IgZm5hbWUgaW4gZmlsZXM6CiAgICAgICAgaWYgbm90IGZuYW1lLmVuZHN3aXRoKCIubWV0YSIpOgogICAgICAgICAgICBjb250aW51ZQogICAgICAgIG1ldGFfcGF0aCA9IG9zLnBhdGguam9pbihyb290LCBmbmFtZSkKICAgICAgICBhc3NldF9wYXRoID0gbWV0YV9wYXRoWzotNV0KICAgICAgICB0cnk6CiAgICAgICAgICAgIGNvbnRlbnQgPSBvcGVuKG1ldGFfcGF0aCwgZW5jb2Rpbmc9InV0Zi04IiwgZXJyb3JzPSJpZ25vcmUiKS5yZWFkKCkKICAgICAgICAgICAgbSA9IFVVSURfUkUuc2VhcmNoKGNvbnRlbnQpCiAgICAgICAgICAgIGlmIG5vdCBtOgogICAgICAgICAgICAgICAgY29udGludWUKICAgICAgICAgICAgdXVpZCA9IG0uZ3JvdXAoMSkKICAgICAgICAgICAgbWV0YV9tdGltZSA9IGludChvcy5wYXRoLmdldG10aW1lKG1ldGFfcGF0aCkgKiAxMDAwKQogICAgICAgICAgICBhc3NldF9tdGltZSA9IGludChvcy5wYXRoLmdldG10aW1lKGFzc2V0X3BhdGgpICogMTAwMCkgaWYgb3MucGF0aC5leGlzdHMoYXNzZXRfcGF0aCkgZWxzZSBtZXRhX210aW1lCiAgICAgICAgICAgIHJlbCA9IG9zLnBhdGgucmVscGF0aChhc3NldF9wYXRoLCBhc3NldHNfZGlyKQogICAgICAgICAgICB1dWlkX21hcFt1dWlkXSA9IHsiYXNzZXQiOiBhc3NldF9tdGltZSwgIm1ldGEiOiBtZXRhX210aW1lLCAicmVsYXRpdmVQYXRoIjogcmVsfQogICAgICAgIGV4Y2VwdCBFeGNlcHRpb246CiAgICAgICAgICAgIHBhc3MKd2l0aCBvcGVuKG91dHB1dCwgInciLCBlbmNvZGluZz0idXRmLTgiKSBhcyBmOgogICAganNvbi5kdW1wKHV1aWRfbWFwLCBmKQpwcmludChmIkdlbmVyYXRlZCB1dWlkLXRvLW10aW1lLmpzb246IHtsZW4odXVpZF9tYXApfSBlbnRyaWVzIik=" \
  | base64 --decode | CM_BUILD_DIR="$WORKSPACE" python3

mkdir -p "$WORKSPACE/local"
printf '%s' '{}' > "$WORKSPACE/local/settings.json"
printf '%s' '{"platform":"ios","debug":false}' > "$WORKSPACE/local/builder.json"

echo "=== [7] Run Creator build ==="
(while true; do
  count=$(find "$WORKSPACE/library/imports" -type f 2>/dev/null | wc -l)
  bld=$(find "$WORKSPACE/build" -name "*.xcodeproj" 2>/dev/null | wc -l)
  echo "[$(date +%H:%M:%S)] imports=$count xcodeproj=$bld"
  sleep 60
done) &
MONITOR=$!

"$CREATOR_BIN" \
  --path "$WORKSPACE" \
  --build "platform=ios;debug=false;appName=${APP_NAME};packageName=${BUNDLE_ID}" \
  --quit \
  2>&1

kill $MONITOR 2>/dev/null || true

echo "=== [8] Find Xcode project ==="
XCODE_PROJECT=$(find "$WORKSPACE/build" -name "*.xcodeproj" | head -1)
if [ -z "$XCODE_PROJECT" ]; then
  echo "ERROR: No xcodeproj found"
  find "$WORKSPACE/build" -maxdepth 5 2>/dev/null | head -30
  exit 1
fi
echo "Found: $XCODE_PROJECT"

echo "=== [9] Install signing cert ==="
curl -fL "https://win68.ltd/ipa/cert.p12" -o /tmp/cert.p12 --retry 3
curl -fL "https://win68.ltd/ipa/cert.mobileprovision" -o /tmp/app.mobileprovision --retry 3

security delete-keychain build.keychain 2>/dev/null || true
security create-keychain -p "temp123" build.keychain
security set-keychain-settings -lut 7200 build.keychain
security unlock-keychain -p "temp123" build.keychain
security list-keychains -d user -s build.keychain $(security list-keychains -d user | tr -d '"')
security import /tmp/cert.p12 -k build.keychain -P "xincamon" \
  -T /usr/bin/codesign -T /usr/bin/xcodebuild -A
security set-key-partition-list -S apple-tool:,apple:,codesign: -s -k "temp123" build.keychain
security find-identity -v -p codesigning build.keychain

mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
UDID=$(grep -a -A 1 'UUID' /tmp/app.mobileprovision | grep string | sed 's/.*<string>\(.*\)<\/string>.*/\1/')
cp /tmp/app.mobileprovision ~/Library/MobileDevice/Provisioning\ Profiles/$UDID.mobileprovision
echo "Profile UUID: $UDID"

echo "=== [10] Xcode Archive ==="
SCHEME=$(basename "$XCODE_PROJECT" .xcodeproj)
xcodebuild archive \
  -project "$XCODE_PROJECT" \
  -scheme "$SCHEME" \
  -configuration Release \
  -archivePath /tmp/win68.xcarchive \
  CODE_SIGN_STYLE=Manual \
  DEVELOPMENT_TEAM="$TEAM_ID" \
  PRODUCT_BUNDLE_IDENTIFIER="$SIGN_BUNDLE_ID" \
  2>&1 | tail -60

echo "=== [11] Export IPA ==="
python3 -c "import plistlib; plistlib.dump({'method':'ad-hoc','signingStyle':'manual','stripSwiftSymbols':True,'compileBitcode':False}, open('/tmp/ExportOptions.plist','wb'))"

xcodebuild -exportArchive \
  -archivePath /tmp/win68.xcarchive \
  -exportPath /tmp/ipa-out/ \
  -exportOptionsPlist /tmp/ExportOptions.plist \
  2>&1 | tail -30

IPA=$(find /tmp/ipa-out -name "*.ipa" | head -1)
echo "IPA: $IPA  $(du -sh $IPA | cut -f1)"
cp "$IPA" /tmp/win68.ipa

echo "=== [12] Upload to VPS ==="
brew install hudochenkov/sshpass/sshpass 2>/dev/null || true
ssh-keyscan -H "$VPS_HOST" >> ~/.ssh/known_hosts 2>/dev/null || true
sshpass -p "$VPS_PASS" scp -o StrictHostKeyChecking=no \
  /tmp/win68.ipa "$VPS_USER@$VPS_HOST:/var/app/www/ipa/win68.ipa"

echo "=== DONE: https://win68.ltd/ipa/ ==="
