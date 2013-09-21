# Growl Notification pour Google Chrome (proof of concept) [![Gittip](http://badgr.co/gittip/fgribreau.png)](https://www.gittip.com/fgribreau/)

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

### Donate
[Donate Bitcoins](https://coinbase.com/checkouts/fc3041b9d8116e0b98e7d243c4727a30)
