if (window.webkitNotifications) {
  
(function(){
  
  var GrowlNotifier = {
    ws:null
  , opened:false
  , queue:[]
  , proxy:function(func){
  	var ctx = this;
  	return function(){
  		func.apply(ctx, arguments);
  	};
  }
  
  , init: function(){
  	this.ws = new WebSocket("ws://127.0.0.1:8000");

  	this.ws.onopen = this.proxy(this.onOpen);
  	this.ws.onmessage = this.proxy(this.onMessage);
  	this.ws.onclose = this.proxy(this.onClose);
  }
  
  //Websocket::onopen
  , onOpen: function(){
  	this.opened = true;
  	console && console.log && console.log('[CONNEXION OK]');
  	this.sendNotify();
  }
  
  //Websocket::onmessage
  , onMessage: function(evt){
  	//console.debug(evt.data);
  }
  
  //Websocket::onclose
  , onClose: function(){
  	if(!this.opened){
  		window.webkitNotifications.__pageTest && alert('Le script NodeJS n\'est pas accessible');
  	}
  	
  	console && console.log && console.log('[CONNEXION FERMEE]');
  	this.opened = false;

  }
  
  //Appel depuis l'API
  , notify: function(icon, title, body){
  	this.queue.push({icon:icon, title:title, body:body});

  	if(!this.opened){
  		return;
  	}

  	this.sendNotify();
  }
  
  //Envoi les notifications
  , sendNotify: function(){
  	var i = this.queue.length;

  	while(i--){
  		console && console.log && console.log('[ENVOI] '+ this.queue[i].body);
  		this.ws.send(JSON.stringify(this.queue[i])); 
  	}

  	this.queue = [];
  }
  };
  
  GrowlNotifier.init();
  
  //Surcharger createNotification
  //http://www.chromium.org/developers/design-documents/desktop-notifications/api-specification
  var ctxWebkitNotif = window.webkitNotifications;
  var oldCreateNotification =  ctxWebkitNotif.createNotification;
  var oldCreateNotificationHTML = ctxWebkitNotif.createHTMLNotification;
  
  window.webkitNotifications.createNotification = function (iconUrl, title, body) {
      var n = oldCreateNotification.call(ctxWebkitNotif, iconUrl, title, body);
      
      if(!GrowlNotifier.opened){
        return n;
      }
      
      n.show = function(){
        GrowlNotifier.notify(iconUrl, title, body);
      };
      return n;
  };
  
  
  
  //Fallback
  //TODO: Tenter une requête AJAX pour récupérer le contenu (s'il est sur le même domain)
  window.webkitNotifications.createHTMLNotification = function(url){
    if(!GrowlNotifier.opened){
      return oldCreateNotificationHTML.call(ctxWebkitNotif, url);
    }
    
    var linkIcon = document.querySelectorAll('link[rel*=icon]');
    
    if(linkIcon.length){
      linkIcon = linkIcon[0].getAttribute('href');
    }
    return window.webkitNotifications.createNotification(linkIcon || '', document.querySelector('title').text, '');
  };
  
  window.webkitNotifications.__overrided = true;
  
})();

}
