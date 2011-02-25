# Growl Notification pour Google Chrome (proof of concept) #

### Objectif ###
Utiliser Growl pour les notifications.


### Architecture ###
Chrome + [Extension::websocket] <-> nodejs <-> GrowlNotify



### Requis ###
* Node >= 0.2.0
* Google Chrome

### Bugs connus ###
Pas de support des notifications HTML (besoin du cross-domain), donc fallback sur une notification classique.


### Sources ###
http://www.chromium.org/developers/design-documents/desktop-notifications/api-specification
https://chrome.google.com/extensions/detail/efihdfpglnibppjnmnpbmdglmlljgcbk?hl=en