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
  , onOpen: function(){
  	this.opened = true;
  	console && console.log && console.log('[CONNEXION OK]');
  	this.sendNotify();
  }
  , onMessage: function(evt){
  	//console.debug(evt.data);
  }
  , onClose: function(){
  	if(!this.opened){
  		window.webkitNotifications.__pageTest && alert('Le script NodeJS n\'est pas accessible');
  	}
  	
  	console && console.log && console.log('[CONNEXION FERMEE]');
  	this.opened = false;

  }
  , notify: function(icon, title, body){
  	this.queue.push({icon:icon, title:title, body:body});

  	if(!this.opened){
  		return;
  	}

  	this.sendNotify();
  }
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
  window.webkitNotifications.originalCreateNotification = window.webkitNotifications.createNotification;

  window.webkitNotifications.createNotification = function (iconUrl, title, body) {
      var n = window.webkitNotifications.originalCreateNotification(iconUrl, title, body);
      
      if(!GrowlNotifier.opened){
        return n;
      }
      
      n.show = function(){
        GrowlNotifier.notify(iconUrl, title, body);
      };
      return n;
  };
  
  window.webkitNotifications.originalCreateHTMLNotification = window.webkitNotifications.createHTMLNotification;
  
  //Fallback
  //TODO: Tenter une requête AJAX pour récupérer le contenu (s'il est sur le même domain)
  window.webkitNotifications.createHTMLNotification = function(url){
    if(!GrowlNotifier.opened){
      return window.webkitNotifications.originalCreateHTMLNotification(url);
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
