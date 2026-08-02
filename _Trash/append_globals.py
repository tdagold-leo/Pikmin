import codecs

funcs = [
    'addItem', 'applySyncId', 'autoDetectCountry', 'checkDatabaseForImage', 
    'clearPostcardTime', 'clearProfileAvatar', 'closeMapLightbox', 
    'closeModal', 'collapseAllPostcardGroups', 'copyCoords', 'deleteItem', 
    'deleteLandmark', 'deleteUserProfile', 'duplicatePostcard', 'editLandmark', 
    'fillAllSlots', 'goToMapCoords', 'handleProfileAvatarUpload', 
    'handleVisionOcrUpload', 'openAddModal', 'openClaimModalById', 
    'openGoogleLensSearch', 'openImageLightbox', 'openMapLightbox', 
    'openTimeModalById', 'pasteFromClipboard', 'renderLandmarks', 
    'saveAutoDeletePref', 'saveMushroomViewPref', 'saveProfileName', 
    'saveTimeSetterPref', 'saveTimezonePref', 'saveVisionApiKey', 
    'searchCoordsByName', 'setPostcardTime', 'shareToLineWindow', 
    'showTimeDiff', 'switchTab', 'toggleCollectPostcard', 'togglePcFav', 
    'togglePostcardTimeEdit', 'toggleSlot', 'triggerOCR', 'updateMapMarkers', 
    'updateView'
]

append_str = "\n\n// Expose functions to global scope for HTML inline handlers\n"
for f in funcs:
    append_str += f"window.{f} = {f};\n"

with open('js/main.js', 'a', encoding='utf-8') as f:
    f.write(append_str)

print("Appended exposed functions to main.js")
