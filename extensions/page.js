Growl = function () {
    var swfID = "growlconnector";
    var swf;
    var scope = "Growl";
    var containerID = null;
    var defaultContainerID = "growlconnectorcontainer";
    var password = null;
    var passwordHashAlgorithm;
    var encryptionAlgorithm;

    function generateSWF(containerID, scope) {
        document.getElementById(containerID).innerHTML += '<embed height="1" width="1" flashvars="scope=' + scope + '" allowscriptaccess="always" quality="high" bgcolor="#ff00ff" name="growlconnector" id="growlconnector" style="" src="http://www.growlforwindows.com/gfw/examples/js/GrowlFlashConnector.swf" type="application/x-shockwave-flash">';
    }

    function oncallbackInternal(notificationID, action, context, type, timestamp) { }
    function onokInternal() { }
    function onerrorInternal(response) { }
    function onsecurityerrorInternal() { }

    return {
        oncallback: oncallbackInternal,
        onerror: onerrorInternal,
        onok: onokInternal,
        onsecurityerror: onsecurityerrorInternal,

        onready: function () {
            swf = document.getElementById(swfID);
            swf.setPassword(password);
            swf.setPasswordHashAlgorithm(passwordHashAlgorithm);
            swf.setEncryptionAlgorithm(encryptionAlgorithm);
            Growl.onready2();
        },

        onready2: function () { },

        init: function (config) {
            passwordHashAlgorithm = Growl.PasswordHashAlgorithm.MD5;
            encryptionAlgorithm = Growl.EncryptionAlgorithm.PlainText;
            Growl.onerror = onerrorInternal;

            if (config && config.scope) scope = config.scope;
            if (config && config.containerID) containerID = config.containerID;
            if (config && config.password) password = config.password;
            if (config && config.passwordHashAlgorithm) passwordHashAlgorithm = config.passwordHashAlgorithm;
            if (config && config.encryptionAlgorithm) encryptionAlgorithm = config.encryptionAlgorithm;
            if (config && config.oncallback) Growl.oncallback = config.oncallback;
            if (config && config.onok) Growl.onok = config.onok;
            if (config && config.onerror) Growl.onerror = config.onerror;
            if (config && config.onready2) Growl.onready2 = config.onready2;
            if (config && config.onnotrunning) Growl.onsecurityerror = config.onnotrunning;

            if (!containerID) {
                var container = document.createElement("div");
                container.id = defaultContainerID;
                document.body.appendChild(container);
                containerID = container.id;
            }
            generateSWF(containerID, scope);
        },

        register: function (application, notificationTypes) {
            swf.register(application, notificationTypes);
        },

        notify: function (appName, notification) {
            if (!notification.id) notification.id = new Date().getTime();
            swf.notify(appName, notification);
        },

        debug: function (msg) {
            prompt("DEBUG:", msg);
        }
    }
} ();

Growl.Application = function () {
    this.name = null;
    this.icon = null;
    this.customAttributes = {};
}

Growl.NotificationType = function () {
    this.name = null;
    this.displayName = null;
    this.icon = null;
    this.enabled = false;
}

Growl.Notification = function () {
    this.id = null;
    this.name = null;
    this.title = null;
    this.text = null;
    this.icon = null;
    this.priority = Growl.Priority.Normal;
    this.sticky = false;
    this.callback = {};
    this.callback.context = null;
    this.callback.type = null;
    this.callback.target = null;
    this.callback.method = Growl.CallbackTargetMethod.Get;
}

Growl.PasswordHashAlgorithm = {};
Growl.PasswordHashAlgorithm.MD5 = "MD5";
Growl.PasswordHashAlgorithm.SHA1 = "SHA1";
Growl.PasswordHashAlgorithm.SHA256 = "SHA256";

Growl.EncryptionAlgorithm = {};
Growl.EncryptionAlgorithm.PlainText = "NONE";
Growl.EncryptionAlgorithm.AES = "AES";
Growl.EncryptionAlgorithm.DES = "DES";
Growl.EncryptionAlgorithm.TripleDES = "3DES";

Growl.Priority = {};
Growl.Priority.Emergency = 2;
Growl.Priority.High = 1;
Growl.Priority.Normal = 0;
Growl.Priority.Moderate = -1;
Growl.Priority.VeryLow = -2;

Growl.CallbackAction = {};
Growl.CallbackAction.Click = "CLICK";
Growl.CallbackAction.Close = "CLOSE";
Growl.CallbackAction.TimedOut = "TIMEDOUT";

Growl.CallbackTargetMethod = {};
Growl.CallbackTargetMethod.Get = "GET";
Growl.CallbackTargetMethod.Post = "POST";


// -- above here is the Growl API wrapper only
// -- below here is the integration with Chrome/Webkit

if (window.webkitNotifications) {

    var ChromeGrowl = {
        isGrowlRunning: false,

        callbackHandler: function (notificationID, action, context, type, timestamp) {
            var s = "";
            s += "id: " + notificationID + "\r\n";
            s += "action: " + action + "\r\n";
            s += "context: " + context + "\r\n";
            s += "type: " + type + "\r\n";
            s += "timestamp: " + timestamp + "\r\n";
            alert(s);
        },

        errorHandler: function (errorCode, errorDescription) {
            alert("ERROR:\r\n\r\n" + errorCode + " - " + errorDescription);
        },

        okHandler: function () {

        },

        ready2Handler: function () {
            // STEP 3: if Growl is running, override the default notification handling routines
            if (!this.isGrowlRunning) {
                this.isGrowlRunning = true;

                ChromeGrowl.register();

                window.webkitNotifications.originalCreateNotification = window.webkitNotifications.createNotification;

                window.webkitNotifications.createNotification = function (iconUrl, title, body) {
                    var n = window.webkitNotifications.originalCreateNotification(iconUrl, title, body);
                    n.show = function () {
                        ChromeGrowl.notify(title, body, iconUrl);
                    }
                    return n;
                }
            }
        },

        register: function () {
            var application = new Growl.Application();
            application.name = "ChromeGrowl";
            application.icon = "http://www.growlforwindows.com/gfw/examples/js/growl.png";

            var notificationTypes = new Array();
            var nt1 = new Growl.NotificationType();
            nt1.name = "NT1";
            nt1.displayName = "Example Notification One";
            nt1.enabled = true;
            notificationTypes.push(nt1);

            Growl.register(application, notificationTypes);
        },

        notify: function (title, text, icon) {
            var notification = new Growl.Notification();
            notification.name = "NT1";
            notification.title = title;
            notification.text = text;
            notification.icon = icon;

            Growl.notify("ChromeGrowl", notification);
        }
    };


    // STEP 2: configure and initialize Growl
    Growl.init({
        oncallback: ChromeGrowl.callbackHandler,
        onerror: ChromeGrowl.errorHandler,
        onok: ChromeGrowl.okHandler,
        onready2: ChromeGrowl.ready2Handler
    });
}