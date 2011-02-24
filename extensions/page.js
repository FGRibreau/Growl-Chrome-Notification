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
  	this.sendNotify();
  }
  , onMessage: function(evt){
  	//console.debug(evt.data);
  }
  , onClose: function(){
  	if(!this.opened){
  		alert('Le script NodeJS n\'est pas accessible');
  	}
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
  		console.log('[ENVOI] '+ this.queue[i].body);
  		this.ws.send(JSON.stringify(this.queue[i])); 
  	}

  	this.queue = [];
  }
  };

  //Surcharger createNotification
  //http://www.chromium.org/developers/design-documents/desktop-notifications/api-specification
  window.webkitNotifications.originalCreateNotification = window.webkitNotifications.createNotification;

  window.webkitNotifications.createNotification = webkitNotifications.createNotification = function (iconUrl, title, body) {
      var n = window.webkitNotifications.originalCreateNotification(iconUrl, title, body);
      n.show = function(){
        GrowlNotifier.notify(iconUrl, title, body);
      };
      
      GrowlNotifier.notify(iconUrl, title, body);
      console.debug(n);
      
      
      return n;
  };
  
  GrowlNotifier.init();
})();

}
