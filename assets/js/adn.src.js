/* eslint-env browser */
/* e7b842ae3000a385374e0c90ff910f09b2f96b7e */
'use strict';

var adn = adn || {};
adn.calls = adn.calls || [];

try {
  (function(adn, doc, win) {
    var DEV_SCRIPT_ID = "ADN_DEV_SCRIPT",
      isDevScript = !!(doc.getElementById(DEV_SCRIPT_ID) || {}).src;
    if (adn.out && !isDevScript) {
      return adn.out.devOutput("adn.out is already defined", "initial check");
    }
    var ENUMS = {
        env: {
          localhost: {
            id: 'localhost',
            as: 'localhost:8078'
          },
          dev: {
            id: 'dev',
            as: 'adserver.dev.adn.bitshift.technology'
          },
          staging: {
            id: 'staging',
            as: 'adserver.staging.adn.bitshift.technology'
          },
          production: {
            id: 'production',
            as: 'delivery.adnuntius.com'
          }
        },
        methodEnums: {
          ifr: 'ifr',
          composed: 'composed',
          preview: 'preview'
        },
        loadEnums: {
          lazy: 'lazy',
          lazyRequest: 'lazyRequest'
        },
        postMessageType: {
          toParentImpression: 'toParentImpression',
          toParentPageLoad: 'toParentPageLoad',
          toParentResize: 'toParentResize',
          toParentUpdateAd: 'toParentUpdateAd',
          toParentSubscribe: 'toParentSubscribe',
          toParentGetAdUnitInfo: 'toParentGetAdUnitInfo',
          toParentAllChildrenViewed: 'toParentAllChildrenViewed',
          toParentAdVisibilityEvent: 'toParentAdVisibilityEvent',
          toParentCustomEvent: 'toParentCustomEvent',
          toParentIsolateAdVisibilityEvent: 'toParentIsolateAdVisibilityEvent',
          toChildViewability: 'toChildViewability',
          toChildPubs: 'toChildPubs',
          toChildAdUnitInfo: 'toChildAdUnitInfo'
        },
        composedRequest: {
          noRequest: 'noRequest',
          requestMade: 'requestMade',
          requestReturned: 'requestReturned'
        },
        container: {
          iframe: 'iframe',
          div: 'div'
        },
        feedback: {
          console: {
            all: 'all',
            warnings: 'warnings',
            errors: 'errors',
            silent: 'silent'
          },
          inScreen: {
            inAdUnit: 'inAdUnit',
            silent: 'silent'
          }
        },
        adWrapperClass: 'adWrapper',
        adIdPrefix: 'adn-id-',
        longestTime: 900000,
        defaultProximity: 200,
        defaultVisibilityPercentage: 1,
        postMessageSrcKey: 'messageSrc',
        postMessageSrcValue: 'adn',
        functionContext: {
          parent: 'parent',
          inIframe: 'inIframe'
        },
        viewabilityStatus: {
          notViewed: 'notViewed',
          viewed: 'viewed',
          viewSent: 'viewSent'
        },
        visibilityStatus: {
          notVisible: 'notVisible',
          visible: 'visible',
          visibleSent: 'visibleSent'
        },
        displayStatus: {
          notDisplayed: 'notDisplayed',
          displayed: 'displayed'
        },
        adStatus: {
          init: 'init',
          processed: 'processed',
          procured: 'procured',
          distributed: 'distributed'
        },
        scriptOverride: {
          bitshift: {
            id: 'bitshift',
            url: 'https://bitshift.com.au/video-demo/adn.dev.src.js'
          }
        },
        errorStatus: {
          noTarget: 'noTarget'
        },
        previewId: 'appPreviewId',
        previewIdContainer: 'appPreviewIdContainer'
      },
      gUseLocalStorage = true,
      gUseCookies = true,
      gWidgetSpecs = {},
      gAdLocs = {},
      gAdSpecs = {},
      gComposedAds = {},
      gWindowStats = {},
      gRequestInfo = {},
      gDevMode = false,
      gUserIds = {
        userId: null,
        sessionId: null
      },
      RT_DATA_ATTR = 'data-response-token',
      TOP_WINDOW_DATA_ATTR = 'data-parent-top',
      ENV_DATA_ATTR = 'data-env',
      CONSOLE_DATA_ATTR = 'data-adn-console',
      SCRIPT_OVERRIDE_QSTRING = 'script-override',
      DEBUG_UI_URL_STRING = "adndebug123",
      DEBUG_UI_CONSOLE_ID = "adnDebugDivConsole",
      DEBUG_UI_MAIN_DATA_DIV_ID = "adnDebugDataDiv",
      DEBUG_UI_DATA_DIV_PREFIX = "adn-data-div-",
      STORAGE_METADATA_KEY = "adn.metaData",
      STORAGE_CONSENT_KEY = "adn.consent",
      VALID_CONSENT_VALUES = {PROFILE: 'PROFILE', COUNTS: 'COUNTS', EXTERNAL: 'EXTERNAL', TARGETING: 'TARGETING'},
      requestMethods,
      gScriptOverride,
      gFeedback = {console: ENUMS.feedback.console.warnings, inScreen: ENUMS.feedback.inScreen.silent},
      gComposedRequest = ENUMS.composedRequest.noRequest;

    adn.util = {
      dimension: function(value) {
        if (adn.util.isString(value)) {
          var theString = adn.util.trim(value);
          if (theString.length === 0 || adn.util.endsWith(theString, '%') || adn.util.endsWith(theString, 'px')) {
            return theString;
          }
          return theString + "px";
        }
        if (adn.util.isNumber(value)) {
          return value + "px";
        }
        return value;
      },
      isLoopable: function(item) {
        if (adn.util.isArray(item)) {
          return true;
        }
        var protoString = Object.prototype.toString.call(item);
        return protoString === '[object HTMLCollection]' || protoString === '[object NodeList]';
      },
      isArray: function(item) {
        if (Array.isArray) {
          return Array.isArray(item);
        }
        return Object.prototype.toString.call(item) === '[object Array]';
      },
      isObject: function(item) {
        return typeof item === 'object' && item !== null && !adn.util.isArray(item);
      },
      isInteger: function(value) {
        return parseInt(value, 10) === value;
      },
      isNumber: function(value) {
        return typeof value === 'number' && isFinite(value);
      },
      isString: function(item) {
        return typeof item === 'string';
      },
      isDefined: function(item) {
        return typeof item !== 'undefined' && item !== null;
      },
      isNotBlankString: function(item) {
        return adn.util.isString(item) && adn.util.trim(item).length > 0;
      },
      isBlankString: function(item) {
        return adn.util.isString(item) && adn.util.trim(item).length === 0;
      },
      isFunction: function(method) {
        return Object.prototype.toString.call(method) === '[object Function]';
      },
      noop: function() {
      },
      isTopWindow: function() {
        return win.top === win.self || (win.location.host === 'localhost:9876');
      },
      trim: function(val) {
        if (!adn.util.isString(val)) {
          return val;
        }
        return String.prototype.trim ? val.trim() : val.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
      },
      getFrameElement: function() {
        try {
          return win.frameElement;
        } catch(e) {
          adn.out.devOutput("Error looking up frame element");
        }
      },
      endsWith: function(aString, endString) {
        return adn.util.isNotBlankString(aString) && adn.util.isNotBlankString(endString) && aString.substr(aString.length - endString.length, endString.length) === endString;
      },
      createDelegate: function(instance, method) {
        if ((!adn.util.isObject(instance) && instance !== null) || !adn.util.isFunction(method)) {
          return adn.out.output("Args not sufficient", "createDelegate", instance, method);
        }
        var outerArgs = Array.prototype.slice.call(arguments, 2);
        return function() {
          return method.apply(instance, outerArgs.length > 0 ? Array.prototype.slice.call(arguments, 0).concat(outerArgs) : arguments);
        };
      },
      detachEventListener: function(object, eventName, handler) {
        if (!adn.util.isObject(object) || !eventName) {
          return adn.out.output("Args not sufficient", "detachEventListener", object, eventName);
        }
        if (adn.util.isFunction(object.removeEventListener)) {
          return object.removeEventListener(eventName, handler, false);
        } else if (object.detachEvent) {
          return object.detachEvent('on' + eventName, handler);
        }
        return adn.out.output("Object to attach event listeners is not sufficient", "detachEventListener", object, eventName);
      },
      addEventListener: function(object, eventName, handler) {
        if (!adn.util.isObject(object) || !eventName) {
          return adn.out.output("Args not sufficient", "addEventListener", object, eventName, handler);
        }
        if (adn.util.isFunction(object.addEventListener)) {
          return object.addEventListener(eventName, handler, false);
        } else if (object.attachEvent) {
          return object.attachEvent('on' + eventName, handler);
        }
        return adn.out.output("Object to attach event listeners is not sufficient", "addEventListener", object, eventName, handler);
      },
      getWindowDims: function() {
        // this is here for backwards-compatibility
        var winDims = adn.util.getWindowSize();
        return {
          w: winDims.width,
          h: winDims.height
        };
      },
      getWindowSize: function() {
        var windowSize = {
          width: 0,
          height: 0
        };
        if (adn.util.isNumber(win.innerWidth)) {
          windowSize.width = win.innerWidth;
          windowSize.height = win.innerHeight;
        } else if (doc.documentElement && (doc.documentElement.clientWidth || doc.documentElement.clientHeight)) {
          windowSize.width = doc.documentElement.clientWidth;
          windowSize.height = doc.documentElement.clientHeight;
        } else if (doc.body && (doc.body.clientWidth || doc.body.clientHeight)) {
          windowSize.width = doc.body.clientWidth;
          windowSize.height = doc.body.clientHeight;
        }
        return windowSize;
      },
      getScrollPos: function() {
        var scrollPos = {
          left: 0,
          top: 0
        };
        if (adn.util.isNumber(win.pageYOffset)) {
          scrollPos.top = win.pageYOffset;
          scrollPos.left = win.pageXOffset;
        } else if (doc.body && (doc.body.scrollLeft || doc.body.scrollTop)) {
          scrollPos.top = doc.body.scrollTop;
          scrollPos.left = doc.body.scrollLeft;
        } else if (doc.documentElement && (doc.documentElement.scrollLeft || doc.documentElement.scrollTop)) {
          scrollPos.top = doc.documentElement.scrollTop;
          scrollPos.left = doc.documentElement.scrollLeft;
        }
        return scrollPos;
      },
      getElementPosition: function(el) {
        var elementPos = {
          left: 0,
          top: 0
        };
        if (el.offsetParent) {
          do {
            elementPos.left += el.offsetLeft;
            elementPos.top += el.offsetTop;
            el = el.offsetParent;
          } while(el);
        }
        return elementPos;
      },
      getNewAjax: function(method, url, func) {
        if (adn.util.isDefined(win.XDomainRequest)) {
          // if XDomainRequest is defined and not IE10
          if (win.navigator.appVersion.indexOf("MSIE 10") === -1) {
            var ajaxIe = new win.XDomainRequest();
            ajaxIe.open(method, url);
            ajaxIe.contentType = "text/plain";
            ajaxIe.onerror = adn.util.noop;
            ajaxIe.ontimeout = adn.util.noop;
            ajaxIe.onprogress = adn.util.noop;
            ajaxIe.timeout = adn.util.noop;
            ajaxIe.onload = adn.util.noop;
            if (adn.util.isFunction(func)) {
              ajaxIe.onload = func;
            }
            return ajaxIe;
          }
        }
        var ajax = new XMLHttpRequest();
        ajax.open(method, url);
        ajax.setRequestHeader("Content-Type", "text/plain");
        if (adn.util.isFunction(func)) {
          ajax.onreadystatechange = func;
        }
        return ajax;
      },
      hasValue: function(collection, checkValue) {
        var hasValue = false;
        adn.util.forEach(collection, function(value) {
          if (value === checkValue) {
            hasValue = true;
            return false;
          }
        });
        return hasValue;
      },
      find: function(collection, callback) {
        if (!adn.util.isFunction(callback) || (!adn.util.isObject(collection) && !adn.util.isLoopable(collection)) || !adn.util.isDefined(collection)) {
          return adn.out.output("Args not sufficient", "find", collection, callback);
        }
        var foundElement = null;
        adn.util.forEach(collection, function(element, i) {
          if (callback.call(collection, element, i) === true) {
            foundElement = element;
            return false;
          }
        });
        return foundElement;
      },
      filter: function(collection, callback) {
        if (!adn.util.isFunction(callback) || adn.util.isString(collection) || !adn.util.isDefined(collection)) {
          return adn.out.output("Args not sufficient", "filter");
        }
        var els = [];
        adn.util.forEach(collection, function(element, i) {
          if (callback.call(collection, element, i) === true) {
            els.push(element);
          }
        });
        return els;
      },
      forEach: function(collection, callback) {
        if (!adn.util.isFunction(callback) || (!adn.util.isObject(collection) && !adn.util.isLoopable(collection)) || !adn.util.isDefined(collection)) {
          return adn.out.output("Args not sufficient", "forEach");
        }
        var val;
        if (adn.util.isLoopable(collection)) {
          var len = collection.length;
          for (var i = 0; i < len; i++) {
            val = collection[i];
            if (callback.call(collection, val, i) === false) {
              return val;
            }
          }
        } else {
          for (var prop in collection) {
            if (collection.hasOwnProperty(prop)) {
              val = collection[prop];
              if (callback.call(collection, val, prop) === false) {
                return val;
              }
            }
          }
        }
      },
      hasProperties: function(obj) {
        if (!adn.util.isObject(obj)) {
          return false;
        }
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            return true;
          }
        }
        return false;
      },
      getElementDimensions: function(el) {
        try {
          var rect = el.getBoundingClientRect();
          var width = rect.width || rect.right - rect.left;
          var height = rect.height || rect.top - rect.bottom;
          return {
            w: width,
            h: height
          };
        } catch(e) {
          return adn.out.output("element dimensions failed", "getElementDimensions: catch block", e);
        }
      },
      isTrue: function(val) {
        return val === true || val === 'true';
      }
    };

    (function() {
      adn.out = {
        devOutput: function(message, context) {
          if (gDevMode || gFeedback.console === ENUMS.feedback.console.all) {
            return adn.out.output(message, context, Array.prototype.slice.call(arguments, 2));
          }
          return false;
        },
        output: function(message, context) {
          if (gFeedback.console === ENUMS.feedback.console.silent) {
            return;
          }
          var allArgs = Array.prototype.slice.call(arguments, 2);
          var onErrors = adn.util.filter(allArgs, function(a) {
            return adn.util.isFunction(a);
          });
          var nextArgs = adn.util.filter(allArgs, function(a) {
            return !adn.util.isFunction(a);
          });
          var outputError = function(method, context, message) {
            method(context, message);
            adn.util.forEach(onErrors, function(errFunc) {
              errFunc({context: context, message: message, args: nextArgs});
            });
          };
          var outputArgs = function(method, messageAdder) {
            if (nextArgs && nextArgs.length) {
              adn.util.forEach(nextArgs, function(a, index) {
                if (adn.util.isFunction(a)) {
                  onErrors.push(a);
                } else {
                  method("Arg #" + index, a);
                  messageAdder += "<div>Arg #" + index + ": " + a + "</div>";
                }
              });
            }
            return messageAdder;
          };
          if (!win.console || !win.console.warn || !win.console.error || !win.console.log) {
            return false;
          }

          var messageAdder = "",
            dataDiv;
          if (gFeedback.inScreen === ENUMS.feedback.inScreen.inAdUnit) {
            dataDiv = doc.getElementById(DEBUG_UI_CONSOLE_ID);
            if (!dataDiv) {
              dataDiv = doc.createElement("div");
              dataDiv.id = DEBUG_UI_CONSOLE_ID;
              var style = "position: absolute; top: 0px; right: 0px;";
              style += "border: 1px solid orange; background-color: yellow; padding: 5px;opacity: 0.8;";
              style += "max-width: 400px;max-height: 500px; overflow: auto";
              dataDiv.style.cssText = style;
              doc.body.appendChild(dataDiv);
            }
            messageAdder = dataDiv.innerHTML;
          }

          if (adn.util.isObject(message) && message.lineNumber >= 0) {
            outputError(win.console.error, "At " + context + ":", message);
            messageAdder += "<div style='background-color: red'><strong>At " + context + ":" + message + "</strong></div>";
            messageAdder = outputArgs(win.console.log, messageAdder);
          } else {
            outputError(win.console.warn, "At " + context + ":", message);
            messageAdder += "<div><strong>At " + context + ":" + message + "</strong></div>";
            messageAdder = outputArgs(win.console.log, messageAdder);
          }
          if (dataDiv) {
            dataDiv.innerHTML = messageAdder;
          }

          return false;
        },
        warn: function(message) {
          if (gFeedback.console !== ENUMS.feedback.console.all && gFeedback.console !== ENUMS.feedback.console.warnings) {
            return;
          }
          if (win.console && win.console.warn) {
            win.console.warn(message);
          }
        }
      };

      adn.lib = {
        setDevMode: function(modeValue) {
          gDevMode = modeValue === true;
        },
        testingHook: function(hook) {
          if (win.location.origin.indexOf('http://localhost') === 0) {
            gWidgetSpecs = {};
            gComposedAds = {};
            gAdSpecs = {};
            hook.adn = adn;
            hook.CONSTANTS = ENUMS;
            hook.ev = ev;
            hook.dom = dom;
            hook.readings = readings;
            hook.misc = misc;
            hook.gComposedAds = gComposedAds;
            hook.gWidgetSpecs = gWidgetSpecs;
            hook.gAdSpecs = gAdSpecs;
            hook.gAdLocs = gAdLocs;
            hook.gDevMode = gDevMode;
            hook.gUserIds = gUserIds;
            hook.storageMetadataKey = STORAGE_METADATA_KEY;
            hook.cookies = cookies;
            hook.parentMethods = parentMethods;
            hook.pFrameMethods = pFrameMethods;
            hook.requestMethods = requestMethods;
          }
        },
        isParentTopWindow: function() {
          var dataAttr = adn.inIframe.getIframeArgs()[TOP_WINDOW_DATA_ATTR];
          if (adn.util.isTrue(dataAttr)) {
            return true;
          }
          var bodyTag = doc.getElementsByTagName("body")[0];
          if (bodyTag && bodyTag.hasAttribute(TOP_WINDOW_DATA_ATTR)) {
            return adn.util.isTrue(bodyTag.getAttribute(TOP_WINDOW_DATA_ATTR));
          }
          var iframe = adn.util.getFrameElement();
          return adn.util.isDefined(iframe) ? adn.util.isTrue(iframe.getAttribute(TOP_WINDOW_DATA_ATTR)) : false;
        },
        getEnv: function() {
          var dataAttr = adn.inIframe.getIframeArgs()[ENV_DATA_ATTR];
          if (adn.util.isNotBlankString(dataAttr) && ENUMS.env[dataAttr]) {
            return ENUMS.env[dataAttr].id;
          }
          var bodyTag = doc.getElementsByTagName("body")[0];
          dataAttr = bodyTag ? bodyTag.getAttribute(ENV_DATA_ATTR) : '';
          if (adn.util.isNotBlankString(dataAttr) && ENUMS.env[dataAttr]) {
            return ENUMS.env[dataAttr].id;
          }
          return ENUMS.env.production.id;
        },
        getRequestLocs: function(args, checkImmeasurable) {
          var server, protocol, serverUrlBase, baseRequestLoc, impRequestLoc, viewImpRequestLoc, visImpRequestLoc,
            customRequestLoc, retargetingLoc, convLoc, previewLoc, renderedImpRequestLoc;

          var theEnvId = args.env || ENUMS.env.production.id;
          server = ENUMS.env[theEnvId] ? ENUMS.env[theEnvId] : ENUMS.env.production;

          var defaultProtocol = 'http' + ((misc.isTestAddress(win.location.href) || theEnvId === ENUMS.env.localhost.id || win.location.protocol === 'http:') ? '' : 's');
          protocol = (args.protocol === 'https' || args.protocol === 'http' ? args.protocol : defaultProtocol) + '://';

          var testEnv = misc.isTestAddress(theEnvId);
          gDevMode = testEnv || gDevMode;
          serverUrlBase = gDevMode && (theEnvId || '').indexOf("http") === 0 ? theEnvId : protocol + server.as;
          baseRequestLoc = serverUrlBase + (testEnv ? "?" : "/i?") + "tzo=" + new Date().getTimezoneOffset();

          var urlArgs = {};
          var qParams = ['usi', 'siteId', 'latitude', 'longitude', 'segments', 'ctx'];
          misc.copyArgValues(urlArgs, args, qParams);
          if (args.useCookies === false || gUseCookies === false) {
            urlArgs.noCookies = true;
          }
          if (checkImmeasurable && !adn.util.isTopWindow() && !misc.supportsIntersectionObserver()) {
            urlArgs.immeasurable = true;
          }
          impRequestLoc = baseRequestLoc + misc.encodeAsUrlParams(urlArgs, true);
          renderedImpRequestLoc = baseRequestLoc.replace("/i?", "/b?");
          viewImpRequestLoc = baseRequestLoc.replace("/i?", "/v?");
          visImpRequestLoc = baseRequestLoc.replace("/i?", "/s?");
          customRequestLoc = baseRequestLoc.replace("/i?", "/u?");
          retargetingLoc = baseRequestLoc.replace("/i?", "/r?");
          convLoc = baseRequestLoc.replace("/i?", "/conv?");
          previewLoc = serverUrlBase + (testEnv ? "?" : "/preview?");
          return {
            imp: impRequestLoc,
            rendered: renderedImpRequestLoc,
            viewable: viewImpRequestLoc,
            visible: visImpRequestLoc,
            custom: customRequestLoc,
            retargeting: retargetingLoc,
            conversion: convLoc,
            preview: previewLoc
          };
        },
        sendRenderedImps: function(rTokens, renderedLoc) {
          if (!adn.util.isArray(rTokens)) {
            return adn.out.devOutput("No tokens to speak of", "sendRenderedImps", rTokens, renderedLoc);
          }
          if (rTokens.length < 1) {
            return;
          }
          if (!renderedLoc || adn.util.isBlankString(renderedLoc)) {
            return adn.out.devOutput("Missing a location", "sendRenderedImps", rTokens, renderedLoc);
          }
          var ajax = adn.util.getNewAjax("POST", renderedLoc, function(ajax) {
            if (ajax.readyState && ajax.readyState !== 4) {
              return false;
            }
            if ((!ajax.status || ajax.status === 200) && adn.util.isNotBlankString(ajax.responseText)) {
              var jsonResponse = {};
              try {
                jsonResponse = JSON.parse(ajax.responseText);
              } catch(e) {
                return adn.out.output(e, "ajax.onreadystatechange: catch block send event", ajax);
              }
              if (jsonResponse && jsonResponse.metaData) {
                cookies.writeLs(jsonResponse.metaData);
              }
            }
          });
          var data = {
            rts: rTokens
          };
          misc.setAndReturnMetaData(data);
          ajax.send(JSON.stringify(data));
        },
        showAdContent: function(adUnitArgs, adData) {
          var targetEl = misc.getDocEl(adUnitArgs);
          var c = gComposedAds[adUnitArgs.targetId];
          if (!targetEl) {
            if (c) {
              c.errorStatus = ENUMS.errorStatus.noTarget;
            }
            return adn.out.warn("Unable to find HTML element on page with the following id: " + adUnitArgs.targetId);
          }
          if (c) {
            c.errorStatus = '';
          }

          var adContent = adData.html;
          var matchedAdCount = adData.matchedAdCount;
          if (adUnitArgs.container === ENUMS.container.div && adn.util.isNumber(matchedAdCount)) {
            if (targetEl.getElementsByTagName("div").length > 0) {
              return;
            }
            targetEl.innerHTML = misc.getAdContentOnly(adContent, adUnitArgs.widgetId);

            var elementsByTagName = targetEl.getElementsByTagName("script");
            adn.util.forEach(elementsByTagName, function(el) {
              if (!el) {
                return;
              }
              if (el.src) {
                var allAttr = {};
                adn.util.forEach(el.attributes, function(attr) {
                  if (attr.specified) {
                    allAttr[attr.name] = attr.value;
                  }
                });
                var src = el.src;
                el.parentNode.removeChild(el);
                misc.loadScriptSrc(src, adUnitArgs.widgetId, allAttr);
              } else {
                var innerHtml = el.innerHTML;
                el.parentNode.removeChild(el);
                misc.loadScriptContent(innerHtml, adUnitArgs.widgetId);
              }
            });
            dom.showTargetDiv(targetEl, adUnitArgs);
            return true;
          }
          // foundIframeContainer protects against double rendering
          var foundIframeContainer = adn.util.find(targetEl.childNodes, function(node) {
            return node.id === adUnitArgs.widgetId;
          });
          if (!foundIframeContainer) {
            adUnitArgs.serverUrl = null;
            var ifr = dom.insIframe(adUnitArgs, targetEl);
            var scriptOverride = misc.getScriptOverride();
            if (scriptOverride) {
              adContent = adContent.replace(/<script type="?text\/javascript"? src="?https?:\/\/[A-Za-z_0-9:.-]{5,50}\/adn.(src.)?js"?><\/script>/g, "<script type=\"text/javascript\" src=\"" + scriptOverride + "\" id=\"" + DEV_SCRIPT_ID + "\"></script>");
            }

            var bodyReplace = "<body id='" + adUnitArgs.widgetId + "' " + TOP_WINDOW_DATA_ATTR + "='" + adn.util.isTopWindow() + "'";
            if (adUnitArgs.env && adUnitArgs.env !== ENUMS.env.production.id) {
              bodyReplace += " " + ENV_DATA_ATTR + "='" + adUnitArgs.env + "'";
            }
            adContent = adContent.replace("<body", bodyReplace);

            if (misc.supportsSrcDoc() && adUnitArgs.isolateFrame) {
              ifr.setAttribute("srcdoc", adContent);
            } else {
              var iframeDoc = ifr.contentDocument || ifr.contentWindow;
              if (iframeDoc && iframeDoc.document) {
                iframeDoc = iframeDoc.document;
              }
              if (!iframeDoc) {
                adn.out.devOutput("Couldn't find iframeDoc", "showAdContent", targetEl, ifr, iframeDoc);
              }
              iframeDoc.open();
              iframeDoc.write(adContent);
              iframeDoc.close();
            }

            if (gFeedback.inScreen === ENUMS.feedback.inScreen.inAdUnit) {
              var dataDiv = doc.createElement("div");
              dataDiv.id = DEBUG_UI_DATA_DIV_PREFIX + adUnitArgs.widgetId;
              var style = "position: absolute;top: 0; left: 0; text-align: left;";
              style += "border: 1px solid red; background-color: pink; padding: 5px;z-index: 10000;opacity: 0.9;";
              style += "min-width: 250px;max-width: " + Math.max(ifr.width, 350) + "px; max-height: 500px; overflow: auto";
              dataDiv.style.cssText = style;
              dataDiv.className = DEBUG_UI_MAIN_DATA_DIV_ID;

              var ads = [];
              adn.util.forEach(adUnitArgs.ads, function(ad) {
                ads.push({
                  adId: ad.id,
                  lineItemId: ad.lineItemId,
                  creativeId: ad.creativeId,
                  cost: ad.cost ? ad.cost.amount + ad.cost.currency : 'n/a',
                  bid: ad.bid ? ad.bid.amount + ad.bid.currency : 'n/a'
                });
              });

              var output = "<div style='min-height: 1em;'>AU Tag id: <a target='_blank' href='https://admin.adnuntius.com/search?q=" + adUnitArgs.auId + "'>" + adUnitArgs.auId + "</a></strong></div>";
              output += "<div style='padding-bottom: 2px; margin-bottom: 2px; border-bottom: 1px dashed #333;'><small>";
              adn.util.forEach(adUnitArgs.requestArgs, function(val, key) {
                if (key === 'adUnits') {
                  var thisAdUnit = adn.util.find(val, function(v) {
                    return v.auId === adUnitArgs.auId && (!v.targetId || v.targetId === adUnitArgs.targetId) && (!v.targetClass || v.targetClass === adUnitArgs.targetClass);
                  });
                  if (thisAdUnit) {
                    adn.util.forEach(thisAdUnit, function(auVal, auKey) {
                      if (auKey === 'auId') {
                        return;
                      }
                      output += misc.dataOutput(auKey, auVal);
                    });
                  }
                  return;
                } else if (key === 'userId' || key === 'sessionId') {
                  return;
                }
                output += misc.dataOutput(key, val);
              });
              var idsAsObj = cookies.getIdsAsObj(adUnitArgs);
              if (idsAsObj.userId) {
                output += misc.dataOutput('userId', idsAsObj.userId);
              }
              if (idsAsObj.sessionId) {
                output += misc.dataOutput('sessionId', idsAsObj.sessionId);
              }
              output += "</small></div>";
              if (ads.length === 0) {
                output += "<div><strong>No ads returned for ad call</strong></div>";
              }
              adn.util.forEach(ads, function(ad) {
                output += "<div style='min-height: 1em;'>LI: <a target='_blank' href='http://admin.adnuntius.com/line-items/line-item/" + ad.lineItemId + "'>" + ad.lineItemId + "</a>" +
                  " | Cr: <a target='_blank' href='http://admin.adnuntius.com/creatives/creative/" + ad.creativeId + "'>" + ad.creativeId + "</a>" +
                  " | cost: " + ad.cost + " | bid: " + ad.bid + "</div>";
              });
              output += "<div><small>";
              adn.util.forEach(['Segments', 'Keywords'], function(key) {
                var adUnitKey = "returned" + key;
                if (adUnitArgs[adUnitKey] && adUnitArgs[adUnitKey].length > 0) {
                  output += misc.dataOutput(key.toLowerCase(), adUnitArgs[adUnitKey]);
                }
              });
              output += "</small></div>";
              dataDiv.innerHTML = output;
              ifr.parentNode.insertBefore(dataDiv, ifr);
              targetEl.style.border = "2px solid red";
              targetEl.style.position = "relative";
            }
            return true;
          }
        }
      };
    }());

    var misc = {
        supportsSrcDoc: function() {
          return !!("srcdoc" in doc.createElement("iframe"));
        },
        isSrcdocFrame: function() {
          return misc.getLocationHref() === "about:srcdoc" || win.location.origin === "null";
        },
        getLocationHref: function() {
          return win.location.href;
        },
        supportsIntersectionObserver: function() {
          // don't check for isIntersecting because of bug in Edge 15. See more in intersection-polyfill.js.
          return 'IntersectionObserver' in win &&
            'IntersectionObserverEntry' in win &&
            'intersectionRatio' in win.IntersectionObserverEntry.prototype;
        },
        getParam: function(aObj, aParam) {
          if (adn.util.isObject(aObj)) {
            return aObj[aParam];
          }
        },
        onScriptLoad: function(scriptEl, callback) {
          // NOTE: Does not handle case of script already loaded.
          if (!scriptEl || !adn.util.isFunction(callback)) {
            return adn.out.output("Args not sufficient", "onScriptLoad", scriptEl, callback);
          }
          if (scriptEl.readyState) {  //IE
            scriptEl.onreadystatechange = function() {
              if (scriptEl.readyState === "loaded" || scriptEl.readyState === "complete") {
                scriptEl.onreadystatechange = null;
                return callback();
              }
            };
          } else {  //Others
            scriptEl.onload = function() {
              return callback();
            };
          }
        },
        loadScriptSrc: function(src, targetId, attrs, onloadCallback) {
          if (!adn.util.isString(src)) {
            return adn.out.output("src should be a string", "loadScriptSrc", src);
          }
          try {
            var scriptEl = doc.createElement('script');
            scriptEl.type = 'text/javascript';
            adn.util.forEach(attrs, function(attrValue, attrKey) {
              scriptEl.setAttribute(attrKey, attrValue);
            });
            scriptEl.src = src;
            var returnData = adn.util.isFunction(onloadCallback) ? misc.onScriptLoad(scriptEl, onloadCallback) : '';

            if (targetId) {
              doc.getElementById(targetId).appendChild(scriptEl);
            } else {
              var targetEl = doc.getElementsByTagName('script')[0];
              targetEl.parentNode.insertBefore(scriptEl, targetEl);
            }
            return returnData;
          } catch(e) {
            return adn.out.output(e, "loadScriptSrc: in catch block");
          }
        },
        loadScriptContent: function(content, targetId) {
          if (!adn.util.isString(content)) {
            return adn.out.output("content should be a string", "loadScriptContent", content);
          }
          try {
            var scriptEl = doc.createElement('script');
            scriptEl.type = 'text/javascript';
            var scriptContent = doc.createTextNode(content);
            scriptEl.appendChild(scriptContent);
            var targetEl = doc.getElementById(targetId) || doc.body;
            targetEl.appendChild(scriptEl);
          } catch(e) {
            return adn.out.output(e, "loadScriptContent: in catch block");
          }
        },
        applyStyle: function(element, style) {
          return adn.util.forEach(style, function(val, prop) {
            element.style[prop] = val;
          });
        },
        parseHashArgs: function() {
          var getHashFragment = function() {
            // FireFox decodes its URL value when you try to read it, and it becomes impossible to parse as a URL afterwards.
            // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1093611
            var href = win.location.href || '';
            var hashIndex = href.indexOf('#');
            return (hashIndex > -1) ? href.substr(hashIndex + 1) : '';
          };
          return misc.decodeUrlEncodedPairs(getHashFragment());
        },
        parseUrlArgs: function() {
          return misc.decodeUrlEncodedPairs(win.location.search);
        },
        clone: function(item) {
          var baseObject = adn.util.isObject(item) ? {} : adn.util.isArray(item) ? [] : null;
          return baseObject ? misc.assign(baseObject, item) : item;
        },
        assign: function(target, source) {
          var assignArray = function(target, source) {
            for (var i = 0; i < source.length; i++) {
              target.push(misc.clone(source[i]));
            }
            return target;
          };

          adn.util.forEach(source, function(lVal, lProp) {
            if (adn.util.isObject(lVal)) {
              if (!adn.util.isObject(target[lProp])) {
                target[lProp] = {};
              }
              misc.assign(target[lProp], lVal);
            } else if (adn.util.isArray(lVal)) {
              if (!adn.util.isArray(target[lProp])) {
                target[lProp] = [];
              }
              assignArray(target[lProp], lVal);
            } else {
              target[lProp] = lVal;
            }
          });
          return target;
        },
        copyArgValues: function(dest, source, params) {
          if (!adn.util.isArray(params) || !adn.util.isObject(dest) || !adn.util.isObject(source)) {
            return adn.out.output("Args not sufficient", "copyArgValues", dest, source, params);
          }
          adn.util.forEach(source, function(value, param) {
            if (!!value && adn.util.hasValue(params, param)) {
              dest[param] = value;
            }
          });
          return dest;
        },
        decodeUrlEncodedPairs: function(urlEncodedPairs) {
          if (!adn.util.isString(urlEncodedPairs)) {
            return adn.out.output("urlEncodedPairs should be a string", "decodeUrlEncodedPairs");
          }
          var object = {};
          var pairs = urlEncodedPairs.replace(/\?/, '').replace(/#/, '').split('&');
          for (var i = 0; i < pairs.length; i++) {
            var pairElements = pairs[i].split('=');
            if (pairElements.length === 2) {
              var name = decodeURIComponent(pairElements[0]);
              var value = decodeURIComponent(pairElements[1]);

              if (adn.util.isDefined(object[name])) { // Check if we already have a value for this name
                if (!adn.util.isArray(object[name])) { // If so, convert to array if not already an array
                  object[name] = [object[name]];
                }
                object[name].push(value);
              } else {
                object[name] = value;
              }
            }
          }
          return object;
        },
        combineArgs: function() {
          var allArgs = {},
            argLength = arguments.length;
          for (var i = 0; i < argLength; i++) {
            var theArg = arguments[i];
            if (adn.util.isObject(theArg)) {
              misc.assign(allArgs, arguments[i]);
            }
          }
          return allArgs;
        },
        getQueryParamsByName: function(aQp) {
          if (!adn.util.isString(aQp) || adn.util.isBlankString(aQp)) {
            return null;
          }
          var url = misc.getLocationHref();
          var qp = aQp.replace(/[[\]]/g, "\\$&");
          var regex = new RegExp("[?&]" + qp + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
          if (!results) {
            return null;
          }
          return !results[2] ? '' : decodeURIComponent(results[2].replace(/\+/g, " "));
        },
        encodeAsUrlParams: function(obj, prefixFirst) {
          if (adn.util.isString(obj)) {
            return obj;
          }
          var pairs = [];
          adn.util.forEach(obj, function(val, prop) {
            var encodedPropEquals = encodeURIComponent(prop) + '=';
            if (adn.util.isArray(val)) {
              adn.util.forEach(val, function(v) {
                pairs.push(encodedPropEquals + encodeURIComponent(v));
              });
            } else if (adn.util.isObject(val)) {
              pairs.push(encodedPropEquals + encodeURIComponent(JSON.stringify(val)));
            } else {
              if ((adn.util.isDefined(val) && !adn.util.isBlankString(val))) {
                pairs.push(encodedPropEquals + encodeURIComponent(val));
              }
            }
          });
          if (pairs.length === 0) {
            return '';
          }
          var urlParams = pairs.join('&');
          return prefixFirst ? '&' + urlParams : urlParams;
        },
        isAdnPrice: function(data) {
          return adn.util.isObject(data) && adn.util.isNumber(data.amount) && data.amount > 0 && adn.util.isString(data.currency) && data.currency.length === 3;
        },
        postMessageToParent: function(msgObject) {
          if (!adn.util.isObject(win.parent) || !win.parent.postMessage || !adn.util.isObject(msgObject)) {
            return adn.out.output("Attributes not sufficient", "postMessageToParent");
          }
          if (msgObject.isDivContainer) {
            return ev.handlePostMessage(msgObject);
          }
          msgObject[ENUMS.postMessageSrcKey] = ENUMS.postMessageSrcValue;
          win.parent.postMessage(JSON.stringify(msgObject), '*');
        },
        postMessageToChild: function(childFrame, msgObject) {
          if (!adn.util.isObject(msgObject)) {
            return adn.out.output("Expected an object for a message", "postMessageToChild", msgObject);
          }
          if (adn.util.isTrue(msgObject.isDivContainer)) {
            return ev.handlePostMessage(msgObject);
          }
          if (!childFrame || !childFrame.contentWindow) {
            return adn.out.output("Childframe isn't really a child frame", "postMessageToChild", childFrame, msgObject);
          }
          if (!childFrame.contentWindow.postMessage) {
            return adn.out.output("Childframe doesn't support postMessage", "postMessageToChild", childFrame, msgObject);
          }
          msgObject[ENUMS.postMessageSrcKey] = ENUMS.postMessageSrcValue;
          childFrame.contentWindow.postMessage(JSON.stringify(msgObject), childFrame.src || '*');
        },
        dataOutput: function(key, val) {
          return key + ": " + (adn.util.isObject(val) || adn.util.isArray(val) ? JSON.stringify(val) : val) + " | ";
        },
        getUnixTimestamp: function(addDays) {
          var unixTimestamp = Math.floor((new Date()).getTime() / 1000);
          return unixTimestamp + (adn.util.isNumber(addDays) ? (1000 * 60 * 60 * 24 * addDays) : 0);
        },
        getDocEl: function(specs) {
          if (specs.targetClass) {
            return doc.getElementsByClassName(specs.targetClass)[0];
          }
          return doc.getElementById(specs.targetId);
        },
        isTestAddress: function(loc) {
          if (adn.util.isString(loc) && loc.indexOf("http://localhost") === 0 && loc.indexOf("/test") > 0) {
            gDevMode = true;
            return true;
          }
          return false;
        },
        getEnvFromHref: function(url) {
          return adn.util.forEach(ENUMS.env, function(env) {
            // need a false here to stop the repeated checking
            return url.indexOf('://' + env.as) < 1;
          });
        },
        getAdContentOnly: function(adContent, newResponseCtrId) {
          var startString = "<div id=\"" + adn.inIframe.getResponseCtrId() + "\"";
          var replacementString = "<div id=\"" + newResponseCtrId + "\"";
          var jsString = "adn.inIframe.processAdResponse({";
          var replaceJsString = jsString + " widgetId: '" + newResponseCtrId + "', ";
          var endString = "</body>";
          var startStringIndex = adContent.indexOf(startString);
          var endStringIndex = adContent.indexOf(endString);
          if (startStringIndex < 1 || endStringIndex < 1) {
            adn.out.output("Something unexpected has gone on with the content of the ad server response", "getAdContentOnly", startString, endString, startStringIndex, endStringIndex, adContent);
            return;
          }
          var htmlAdContentOnly = adContent.substring(startStringIndex, endStringIndex);
          return htmlAdContentOnly.replace(startString, replacementString).replace(jsString, replaceJsString);
        },
        gatherDataParams: function(aDataSrc, aFilterCb, aCb, deleteFromObj) {
          var data = [],
            filterCb = adn.util.isFunction(aFilterCb) ? aFilterCb : function() {
              return true;
            },
            cb = adn.util.isFunction(aCb) ? aCb : adn.util.noop,
            deleteMeObj = deleteFromObj || {};
          var theKeys = ['auId', 'creativeId', 'networkId', 'targetId', 'c', 'kv', 'ps', 'auml', 'floorPrice'];
          adn.util.forEach(aDataSrc, function(a) {
            if (filterCb(a) === true) {
              var params = {};
              adn.util.forEach(theKeys, function(key) {
                params[key] = a[key];
              });
              if (a.floorPrice && !misc.isAdnPrice(a.floorPrice)) {
                adn.out.output("Floor price is not valid", "gatherDataParams", a);
                delete params.floorPrice;
              }
              data.push(params);
              cb(a);
            }
          });
          adn.util.forEach(theKeys, function(key) {
            delete deleteMeObj[key];
          });
          return data;
        },
        getScriptOverride: function() {
          if (adn.util.isString(gScriptOverride)) {
            return gScriptOverride;
          }
          var scriptOverrideId = misc.getQueryParamsByName(SCRIPT_OVERRIDE_QSTRING);
          gScriptOverride = "";
          if (adn.util.isString(scriptOverrideId) && scriptOverrideId.length > 0) {
            gScriptOverride = (adn.util.find(ENUMS.scriptOverride, function(so) {
              return so.id === scriptOverrideId;
            }) || {}).url || "";
          }
          return gScriptOverride;
        },
        gatherExclusions: function(dataSrc) {
          var arrayCheck = function(targetObj, sourceObj, param) {
            if (adn.util.isArray(sourceObj[param]) && sourceObj[param].length > 0) {
              targetObj[param] = sourceObj[param];
            }
          };

          var exclusions = {};
          if (adn.util.isArray(dataSrc)) {
            adn.util.forEach(dataSrc, function(a) {
              arrayCheck(exclusions, a, 'excludedLineItems');
              arrayCheck(exclusions, a, 'excludedCreatives');
            });
          } else {
            arrayCheck(exclusions, dataSrc, 'excludedLineItems');
            arrayCheck(exclusions, dataSrc, 'excludedCreatives');
          }
          return exclusions;
        },
        encodeUrlParams: function(baseUrl, paramsObj, args) {
          var theArgs = args || {};
          misc.copyArgValues(paramsObj, theArgs, ['auml', 'ps', 'c']);
          if (theArgs.kv) {
            // need this here because the kv needs to be an array that is stringified as an array
            paramsObj.kv = JSON.stringify(theArgs.kv);
          }
          if (misc.isAdnPrice(theArgs.floorPrice)) {
            paramsObj.fp = JSON.stringify(theArgs.floorPrice);
          } else if (theArgs.floorPrice) {
            adn.out.output("Not a valid floorprice supplied.", "encodeUrlParams", theArgs);
          }
          try {
            baseUrl += misc.encodeAsUrlParams(paramsObj, true);
            return baseUrl;
          } catch(e) {
            return adn.out.output("encoding urls failed", "insIframe: catch block", e);
          }
        },
        setAndReturnMetaData: function(theData) {
          var ajaxData = theData;
          var metaData = cookies.getAllStorageAsObj();
          if (adn.util.hasProperties(metaData)) {
            ajaxData = ajaxData || {};
            ajaxData.metaData = metaData;
          }
          return ajaxData;
        },
        normalise: function(aObj) {
          var toStringParams = {
            auW: 'auW',
            auH: 'auH'
          };
          adn.util.forEach(aObj, function(v, k) {
            if (toStringParams[k]) {
              aObj[k] = v.toString();
            }
          });
          return aObj;
        }
      },
      pixel = {
        regDestination: function() {
          var meta = misc.getQueryParamsByName("adnMeta");
          if (!adn.util.isNotBlankString(meta)) {
            return;
          }
          var jsonString = win.atob(meta);
          var metaDataObj;
          try {
            metaDataObj = JSON.parse(jsonString);
          } catch(e) {
            return adn.out.output("JSON Parse string for adnMeta failed", "regDestination", jsonString);
          }
          cookies.writeLs(metaDataObj);
        }
      },
      ev = {
        handleChildPageLoad: function(eventData, hasDelayedResize) {
          var adsDivEl = doc.getElementById(adn.inIframe.getResponseCtrId());
          if (!adsDivEl) {
            return adn.out.devOutput("Can't find container ID", "handleChildPageLoad", adn.inIframe.getResponseCtrId());
          }
          var contentDims = adn.util.getElementDimensions(adsDivEl);
          var resizeToContent = adn.inIframe.isResizeToContent();
          var messageType = hasDelayedResize ? ENUMS.postMessageType.toParentResize : ENUMS.postMessageType.toParentPageLoad;

          var iframe = adsDivEl.getElementsByTagName("iframe")[0];
          if (iframe) {
            // need to do this in order to cover for when the iframe is position: fixed or position: absolute and weird things happen.
            var iframeDims = adn.util.getElementDimensions(iframe);
            if (iframeDims.w > contentDims.w) {
              contentDims.w = iframeDims.w;
            }
            if (iframeDims.h > contentDims.h) {
              contentDims.h = iframeDims.h;
            }
          }
          if ((contentDims.w < 1 || contentDims.h < 1) && !hasDelayedResize) {
            resizeToContent = false;
          }
          misc.postMessageToParent({
            widgetId: adn.inIframe.getIframeId(),
            messageType: messageType,
            w: contentDims.w,
            h: contentDims.h,
            resizeToContent: resizeToContent
          });
          if (!hasDelayedResize) {
            win.setTimeout(function() {
              ev.handleChildPageLoad({}, true);
            }, 750);
          }
        },
        handleChildSubs: function(e, args) {
          var msgObject = {
            messageType: ENUMS.postMessageType.toChildPubs,
            windowDims: adn.util.getWindowDims(),
            widgetId: args.widgetId,
            event: args.event,
            isDivContainer: args.isDivContainer
          };
          if (adn.util.isDefined(args.functionCalls)) {
            msgObject.functionCalls = args.functionCalls;
          }
          misc.postMessageToChild(doc.getElementById(args.widgetId), msgObject);
        },
        handlePostMessage: function(aMessage) {
          if (!adn.util.isObject(aMessage)) {
            return adn.out.output("Handle post aMessage is being used in weird ways", "handlePostMessage", aMessage);
          }
          if (!adn.util.isString(aMessage.data) && !adn.util.isTrue(aMessage.isDivContainer)) {
            // if message.data is not coming back as a string, it's coming from somewhere else.
            return;
          }

          var args = {};
          if (adn.util.isTrue(aMessage.isDivContainer)) {
            args = misc.clone(aMessage);
          } else {
            try {
              args = JSON.parse(aMessage.data);
            } catch(e) {
              return adn.out.devOutput("Couldn't handle parsing", "handlePostMessage", aMessage.data, aMessage);
            }
            if (args[ENUMS.postMessageSrcKey] !== ENUMS.postMessageSrcValue) {
              // could be many other window.postMessage messages going round, so just skipping early without debug info.
              return false;
            }
          }

          var widgetSpec = gWidgetSpecs[args.widgetId] || {};
          if (args.messageType === ENUMS.postMessageType.toChildPubs) {
            if (!adn.util.isString(args.event) || !adn.util.isString(args.widgetId)) {
              return adn.out.output("Requires more data", "handlePostMessage", args);
            }
            var msgObject = {
              widgetId: args.widgetId,
              event: args.event,
              windowDims: args.windowDims
            };
            if (adn.util.isDefined(args.functionCalls)) {
              msgObject.functionCalls = args.functionCalls;
            }
            pFrameMethods.handleChildPubs(msgObject);
          } else if (args.messageType === ENUMS.postMessageType.toChildAdUnitInfo) {
            if (!adn.util.isString(args.adUnitInfoId)) {
              return adn.out.output("Requires more data", "handlePostMessage", args);
            }
            pFrameMethods.handleAdUnitInfo(args);
          } else if (args.messageType === ENUMS.postMessageType.toParentGetAdUnitInfo) {
            if (!adn.util.isString(args.adUnitInfoId) || !adn.util.hasProperties(widgetSpec)) {
              return adn.out.output("Needs ad unit info id and widget id", "handlePostMessage", args, widgetSpec);
            }
            misc.postMessageToChild(doc.getElementById(args.widgetId), {
              adUnitInfoId: args.adUnitInfoId,
              messageType: ENUMS.postMessageType.toChildAdUnitInfo,
              adUnitInfo: widgetSpec,
              isDivContainer: args.isDivContainer
            });
          } else if (args.messageType === ENUMS.postMessageType.toParentIsolateAdVisibilityEvent) {
            if (!adn.util.isString(args.impRequestLoc) || !adn.util.isObject(args.spec) || !adn.util.isString(args.feedbackText)) {
              return adn.out.output("Missing required data to send isolate visibility event", "handlePostMessage", args);
            }
            readings.sendEventFromParent(args.impRequestLoc, args.spec, args.feedbackText);
          } else if (args.messageType === ENUMS.postMessageType.toParentCustomEvent) {
            if (!adn.util.isDefined(args.args) || !adn.util.isObject(args.customArgs) || !adn.util.isObject(args.pAdSpec)) {
              return adn.out.output("Missing required data to send custom event info", "handlePostMessage", args);
            }
            adn.inIframe.sendCustomEvent(args.args, args.customArgs, args.pAdSpec);
          } else if (args.messageType === ENUMS.postMessageType.toParentAdVisibilityEvent) {
            if (!adn.util.hasProperties(widgetSpec) || !adn.util.isFunction(widgetSpec[args.callbackProp])) {
              return adn.out.output("Need widget info", "toParentAdViewable", args, widgetSpec);
            }
            widgetSpec[args.callbackProp]({
              widgetId: args.widgetId,
              auId: widgetSpec.auId,
              adId: args.adId,
              creativeId: args.creativeId,
              viewability: args.viewability
            });
            var dataDiv = doc.getElementById(DEBUG_UI_DATA_DIV_PREFIX + widgetSpec.widgetId);
            if (dataDiv && args.debugMessage) {
              dataDiv.innerHTML += "<div><small>" + args.debugMessage + " - " + args.creativeId + "</small></div>";
            }
          } else if (args.messageType === ENUMS.postMessageType.toParentSubscribe) {
            if (!adn.util.isString(args.event) || !adn.util.isString(args.widgetId)) {
              return adn.out.output("Requires on event", "handlePostMessage", args);
            }
            adn.util.addEventListener(win, args.event, adn.util.createDelegate(ev, ev.handleChildSubs, {
              widgetId: args.widgetId,
              event: args.event,
              isDivContainer: args.isDivContainer
            }));
          } else if (args.messageType === ENUMS.postMessageType.toParentPageLoad || args.messageType === ENUMS.postMessageType.toParentResize) {
            if (widgetSpec.resizeOnPageLoad !== false && (!adn.util.isFunction(widgetSpec.resizeOnPageLoad) || widgetSpec.resizeOnPageLoad(args) !== false)) {
              if (adn.util.isTrue(args.resizeToContent)) {
                parentMethods.iframeResizer({widgetId: widgetSpec.widgetId, w: args.w, h: args.h}, false);
              }
            }
            if (args.messageType === ENUMS.postMessageType.toParentPageLoad) {
              if (adn.util.isFunction(widgetSpec.onPageLoad)) {
                var pageLoadArgs = {};
                misc.copyArgValues(pageLoadArgs, widgetSpec, ['auId', 'widgetId', 'auW', 'auH', 'retAdsW', 'retAdsH', 'retAdCount', 'targetId', 'kv', 'c', 'ps', 'auml', 'floorPrice', 'requestArgs']);
                pageLoadArgs.w = args.w;
                pageLoadArgs.h = args.h;
                widgetSpec.onPageLoad(misc.normalise(pageLoadArgs));
              }
            }
          } else {
            if (!adn.util.isString(args.method)) {
              return adn.out.output("args should have a method to call", "handlePostMessage");
            }

            try {
              if (args.functionContext === ENUMS.functionContext.inIframe) {
                adn.util.isFunction(pFrameMethods[args.method]) ?
                  pFrameMethods[args.method].call(adn.inIframe, args)
                  : adn.inIframe[args.method].call(adn.inIframe, args);
              } else {
                parentMethods[args.method].call(parentMethods, args);
              }
            } catch(e) {
              return adn.out.output(e, "catch block for calling method", args, e);
            }

            if (args.messageType === ENUMS.postMessageType.toParentImpression) {
              misc.copyArgValues(widgetSpec, args, ['retAdsW', 'retAdsH', 'retAdCount']);
              if (adn.util.isFunction(widgetSpec.onImpressionResponse)) {
                var returnArgs = {};
                misc.copyArgValues(returnArgs, widgetSpec, ['auId', 'widgetId', 'auW', 'auH', 'retAdsW', 'retAdsH', 'retAdCount', 'targetId', 'kv', 'c', 'ps', 'auml', 'floorPrice', 'requestArgs']);
                widgetSpec.onImpressionResponse(misc.normalise(returnArgs));
              }
              ev.handleChildSubs({}, {
                event: 'impRegistered',
                widgetId: args.widgetId,
                functionCalls: widgetSpec.functionCalls,
                isDivContainer: args.isDivContainer
              });
            }
          }
        },
        registerListeners: function() {
          adn.util.addEventListener(win, 'message', adn.util.createDelegate(adn.lib, ev.handlePostMessage));
          if (!adn.util.isTopWindow()) {
            adn.util.addEventListener(win, 'load', adn.util.createDelegate(adn.lib, ev.handleChildPageLoad));
          }
        },
        setFeedbackOptions: function(args) {
          if (adn.util.isObject(args)) {
            if (adn.util.isString(args.console) && !!ENUMS.feedback.console[args.console]) {
              gFeedback.console = args.console;
            }
            if (adn.util.isString(args.inScreen) && !!ENUMS.feedback.inScreen[args.inScreen]) {
              gFeedback.inScreen = args.inScreen;
            }
          }
          if (win.location.href.toLowerCase().indexOf(DEBUG_UI_URL_STRING) > 0) {
            gFeedback.inScreen = ENUMS.feedback.inScreen.inAdUnit;
          }
          var consoleQv = misc.getQueryParamsByName("console") || (adn.util.getFrameElement() ? adn.util.getFrameElement().getAttribute(CONSOLE_DATA_ATTR) : null);
          if (adn.util.isString(consoleQv) && !!ENUMS.feedback.console[consoleQv]) {
            gFeedback.console = consoleQv;
          }
          var inScreenQv = misc.getQueryParamsByName("inScreen");
          if (adn.util.isString(inScreenQv) && !!ENUMS.feedback.inScreen[inScreenQv]) {
            gFeedback.inScreen = inScreenQv;
          }
        }
      },
      cookies = (function() {
        var providerKeys = {
          cxense: {
            userId: 'cX_P',
            sessionId: 'cX_S'
          }
        };

        var getStorageData = function(storageType, storageKey) {
          var storageString = storageType.getItem(storageKey);
          if (adn.util.isString(storageString) && storageString.length > 0) {
            try {
              return JSON.parse(storageString);
            } catch(e) {
              return adn.out.output("Error reading from local storage", "cookie.getLs", e, storageType, storageString);
            }
          }
          return {};
        };

        var getLocalStorage = function(storageKey, raw) {
          var storageArray = getStorageData(win.localStorage, storageKey);
          if (!adn.util.isArray(storageArray)) {
            storageArray = [];
          }
          if (raw === true) {
            return storageArray;
          }

          if (storageKey === STORAGE_CONSENT_KEY) {
            var vettedConsentArray = [];
            adn.util.forEach(storageArray, function(consentItem) {
              if (VALID_CONSENT_VALUES[consentItem] === consentItem) {
                vettedConsentArray.push(consentItem);
              }
            });
            return vettedConsentArray;
          }
          var storageObj = {};
          adn.util.forEach(storageArray, function(el) {
            // just sanity-checking the key, which should have a exclamation point somewhere
            if (adn.util.isNotBlankString(el.key) && el.key.indexOf('!') > 0) {
              storageObj[el.key] = el.value;
            }
          });
          return storageObj;
        };

        var getSessionStorage = function() {
          var storageObj = getStorageData(win.sessionStorage, STORAGE_METADATA_KEY);
          if (!adn.util.isObject(storageObj)) {
            storageObj = {};
          }
          var vettedObj = {};
          adn.util.forEach(storageObj, function(val, key) {
            // just sanity-checking the key, which should have a exclamation point somewhere
            if (adn.util.isNotBlankString(key) && key.indexOf('!') > 0) {
              vettedObj[key] = val;
            }
          });
          return vettedObj;
        };

        return {
          getIdsAsObj: function(args) {
            if (!args.userId || !args.sessionId) {
              cookies.getIds();
              if (!gUserIds) {
                return adn.out.output("No user ids specified");
              }
            }
            return {
              userId: args.userId || gUserIds.userId,
              sessionId: args.sessionId || gUserIds.sessionId
            };
          },
          getIds: function(provider) {
            if (gUserIds && gUserIds.sessionId && gUserIds.userId) {
              return;
            }
            var ids = providerKeys[provider || 'cxense'];
            adn.util.forEach(ids, function(providerId, adnId) {
              gUserIds[adnId] = cookies.get(providerId);
            });
          },
          get: function(key) {
            var name = key ? key + "=" : null;
            var cookieObj = name ? null : {};
            var decodedCookie = decodeURIComponent(doc.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
              var c = ca[i];
              while(c.charAt(0) === ' ') {
                c = c.substring(1);
              }
              if (!name) {
                var kv = c.split('=');
                cookieObj[kv[0]] = kv[1];
              } else if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
              }
            }
            return adn.util.isObject(cookieObj) ? cookieObj : "";
          },
          set: function(cookieObj) {
            adn.util.forEach(cookieObj, function(value, key) {
              var date = new Date();
              date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
              var expires = "; expires=" + date.toUTCString();
              doc.cookie = key + "=" + (value || "") + expires + "; path=/";
            });
          },
          clearLocalStorage: function() {
            win.localStorage.removeItem(STORAGE_CONSENT_KEY);
            win.localStorage.removeItem(STORAGE_METADATA_KEY);
            win.sessionStorage.removeItem(STORAGE_METADATA_KEY);
          },
          writeConsent: function(consentArray) {
            if (!consentArray || !adn.util.isArray(consentArray)) {
              return adn.out.devOutput("Not a valid consent object", "writeConsent", consentArray);
            }
            if (!gUseLocalStorage) {
              return;
            }
            var writeConsentArray = [];
            adn.util.forEach(consentArray, function(consentItem) {
              if (VALID_CONSENT_VALUES[consentItem] === consentItem) {
                writeConsentArray.push(consentItem);
              } else {
                adn.out.devOutput("Invalid consent item", "writeConsent", consentArray);
              }
            });
            if (writeConsentArray.length < 1) {
              win.localStorage.removeItem(STORAGE_CONSENT_KEY);
            } else {
              win.localStorage.setItem(STORAGE_CONSENT_KEY, JSON.stringify(writeConsentArray));
            }
          },
          getConsent: function() {
            if (!gUseLocalStorage) {
              return [];
            }
            return getLocalStorage(STORAGE_CONSENT_KEY);
          },
          writeLs: function(cookieObj) {
            if (!adn.util.isObject(cookieObj) || !adn.util.hasProperties(cookieObj)) {
              return adn.out.devOutput("Not an object of data", "writeLs");
            }
            if (!gUseLocalStorage) {
              return;
            }
            var sessionParams = {},
              lsArray = [],
              currentStorage = getLocalStorage(STORAGE_METADATA_KEY, true);

            adn.util.forEach(currentStorage, function(el) {
              if (adn.util.isNotBlankString(el.value) && adn.util.isNotBlankString(el.key) && el.key.indexOf('!') > 0 && !cookieObj[el.key] && el.exp && el.exp > misc.getUnixTimestamp()) {
                lsArray.push(el);
              }
            });

            adn.util.forEach(cookieObj, function(value, key) {
              if (key.indexOf("session") > -1) {
                sessionParams[key] = value;
              } else if (key.indexOf("!") > 0) {
                lsArray.push({exp: misc.getUnixTimestamp(100), key: key, value: value});
              }
            });

            var sessionObj = {};
            adn.util.forEach(sessionParams, function(value, key) {
              sessionObj[key] = value;
            });

            win.sessionStorage.setItem(STORAGE_METADATA_KEY, JSON.stringify(sessionObj));
            win.localStorage.setItem(STORAGE_METADATA_KEY, JSON.stringify(lsArray));
          },
          getAllStorageAsObj: function() {
            if (!gUseLocalStorage) {
              return {};
            }
            return misc.assign(getLocalStorage(STORAGE_METADATA_KEY), getSessionStorage(STORAGE_METADATA_KEY));
          }
        };
      }()),
      pFrameMethods = {},
      dom = {
        distributeComposedAds: function(composedAds) {
          var initProximity = false;
          var rTokens = [];
          var renderedLoc = "";
          adn.util.forEach(composedAds.adUnits || composedAds, function(au) {
            var adUnitArgs = adn.util.find(gWidgetSpecs, function(theAdUnit) {
              return theAdUnit.targetId === au.targetId;
            });
            if (!adUnitArgs) {
              adn.out.output("No ad unit data found, mismatched target probably", "composed", adUnitArgs);
              return;
            }
            if (adUnitArgs.adStatus === ENUMS.adStatus.processed) {
              return;
            }
            adUnitArgs.ads = au.ads;
            adUnitArgs.returnedKeywords = composedAds.keywords;
            adUnitArgs.returnedSegments = composedAds.segments;
            renderedLoc = adUnitArgs.renderedImpRequestLoc;

            if (au.matchedAdCount === 0) {
              adUnitArgs.adStatus = ENUMS.adStatus.processed;
              var dataArgs = misc.copyArgValues({
                matchedAdCount: au.matchedAdCount,
                html: au.html
              }, adUnitArgs, ['auId', 'targetId', 'auW', 'auH', 'kv', 'c', 'ps', 'auml', 'floorPrice', 'requestArgs']);
              dataArgs.retAdCount = 0;
              dataArgs.retAdsW = 0;
              dataArgs.retAdsH = 0;
              dataArgs.h = 0;
              dataArgs.w = 0;
              if (adn.util.isFunction(adUnitArgs.onNoMatchedAds)) {
                adUnitArgs.onNoMatchedAds(dataArgs);
              }
              if (adn.util.isFunction(adUnitArgs.onPageLoad)) {
                adUnitArgs.onPageLoad(dataArgs);
              }
            } else if (misc.getParam(adUnitArgs.requestParams, 'load') === ENUMS.loadEnums.lazy && !adUnitArgs.withinBounds) {
              initProximity = true;
              adUnitArgs.adStatus = ENUMS.adStatus.procured;
              au.renderedImpRequestLoc = renderedLoc;

              var targetEl = misc.getDocEl(adUnitArgs);
              var c = gComposedAds[au.targetId];
              if (targetEl && c) {
                c.errorStatus = '';
                dom.showTargetDiv(targetEl, adUnitArgs);
                targetEl.style.width = adn.util.dimension(adUnitArgs.auW);
                targetEl.style.height = adn.util.dimension(adUnitArgs.auH);
              } else {
                c.errorStatus = ENUMS.errorStatus.noTarget;
                adn.out.output("Unable to find target element", "distributeComposedAds", adUnitArgs);
              }
            } else {
              var result = adn.lib.showAdContent(adUnitArgs, au);
              if (adn.util.isTrue(result)) {
                adn.util.forEach(au.rts || [], function(rp) {
                  rTokens.push(rp);
                });
              }
            }
          });
          adn.lib.sendRenderedImps(rTokens, renderedLoc);

          if (initProximity) {
            readings.initProximity();
          }
        },
        showTargetDiv: function(targetEl, args) {
          if (!targetEl) {
            return;
          }
          if (adn.util.isString(args.display) && targetEl.style.display !== args.display) {
            targetEl.style.display = args.display;
          } else if (targetEl.style.display === 'none') {
            targetEl.style.display = 'block';
          }
        },
        insIframe: function(args, targetElement, onBeforeInsertion) {
          var targetEl = (targetElement && targetElement.targetId === args.targetId) || misc.getDocEl(args);
          if (!targetEl) {
            adn.out.warn("Unable to find HTML element on page with the following id or class: " + args.targetId + " - " + args.targetClass);
            return adn.out.output("No targetId was found.", "insIframe");
          }

          var ifr = doc.createElement('iframe');
          ifr.id = args.widgetId;
          ifr.name = args.widgetId;
          ifr.setAttribute(TOP_WINDOW_DATA_ATTR, adn.util.isTopWindow());
          ifr.allowTransparency = true;

          ifr.setAttribute(CONSOLE_DATA_ATTR, gFeedback.console);

          var paramsObj = {ifrId: ifr.id};
          if (args.serverUrl) {
            if (args.env && args.env !== ENUMS.env.production.id && ENUMS.env[args.env]) {
              paramsObj[ENV_DATA_ATTR] = args.env;
            }
            var serverSrc = misc.encodeUrlParams(args.serverUrl, paramsObj, args);
            if (args.serverUrl.length > 5) {
              // means this is a call to the ad server for the iframe.
              serverSrc += misc.encodeAsUrlParams(cookies.getIdsAsObj(args), true);

              var consent = cookies.getConsent();
              if (consent.length > 0) {
                serverSrc += misc.encodeAsUrlParams({consent: consent}, true);
              }
              if (!adn.util.isTopWindow()) {
                var topWindowParams = {};
                topWindowParams[TOP_WINDOW_DATA_ATTR] = false;
                serverSrc += misc.encodeAsUrlParams(topWindowParams, true);
              }
            }
            if (!serverSrc) {
              return adn.out.output("Failure to create server src", "insIframe", serverSrc);
            }
            ifr.src = serverSrc;
          }

          ifr.width = adn.util.isString(args.auW) || args.auW > 0 ? args.auW : 0;
          targetEl.style.width = adn.util.isNumber(args.auW) && args.auW > 0 ? adn.util.dimension(ifr.width) : ifr.width;

          ifr.height = adn.util.isString(args.auH) || args.auH > 0 ? args.auH : 0;
          targetEl.style.height = adn.util.isNumber(args.auH) && args.auH > 0 ? adn.util.dimension(ifr.height) : ifr.height;

          ifr.setAttribute('style', 'display: block; margin: 0; borderWidth: 0; padding: 0;');
          ifr.setAttribute('scrolling', 'no');
          ifr.frameBorder = '0';

          if (args.isolateFrame && misc.supportsSrcDoc()) {
            ifr.setAttribute("sandbox", "allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation");
          }

          if (onBeforeInsertion) {
            onBeforeInsertion(ifr);
          }

          targetEl.appendChild(ifr);

          dom.showTargetDiv(targetEl, args);
          return ifr;
        }
      },
      readings = (function() {
        var mViewabilityRunner = false;

        var sendEvent = function(eventLoc, spec, feedbackText) {
          var loc = eventLoc;
          var isFullLoc = !spec || !spec.rt;
          try {
            if (!isFullLoc) {
              loc = loc + misc.encodeAsUrlParams({rt: spec.rt}, true);
            }
            if (misc.isTestAddress(loc) || misc.isTestAddress(misc.getLocationHref())) {
              adn.out.devOutput(feedbackText + " being sent", "sending" + feedbackText + "Event", loc);
            } else {
              var ajax = adn.util.getNewAjax(isFullLoc ? "GET" : "POST", loc, function() {
                if (ajax.readyState && ajax.readyState !== 4) {
                  return false;
                }
                if ((!ajax.status || ajax.status === 200) && adn.util.isNotBlankString(ajax.responseText)) {
                  var jsonResponse = {};
                  try {
                    jsonResponse = JSON.parse(ajax.responseText);
                  } catch(e) {
                    return adn.out.output(e, "ajax.onreadystatechange: catch block send event", ajax);
                  }
                  if (jsonResponse && jsonResponse.metaData) {
                    cookies.writeLs(jsonResponse.metaData);
                  }
                }
              });
              ajax.withCredentials = !misc.isTestAddress(loc);
              var metaData;
              if (!gWindowStats || !gWindowStats.metaData) {
                metaData = misc.setAndReturnMetaData();
              } else {
                metaData = gWindowStats.metaData;
              }
              if (metaData) {
                ajax.send(JSON.stringify(metaData));
              } else {
                ajax.send();
              }
            }
            return true;
          } catch(e) {
            adn.out.output("sending a " + feedbackText + " event failed", e);
            return false;
          }
        };

        var sendImpression = function(impRequestProp, specProp, constantCheckProp, constantPostProp, feedbackText, callbackProp) {
          adn.util.forEach(gAdSpecs, function(spec) {
            if (!adn.util.isString(spec.rt)) {
              return adn.out.output("Need a response token on the spec object to send imp", "send" + feedbackText + "Impression", spec);
            }
            var impRequestLoc = gAdLocs[impRequestProp];
            if (!adn.util.isString(impRequestLoc)) {
              return adn.out.output("Missing a imp request location", "send" + feedbackText + "Impression", gAdLocs, impRequestProp);
            }
            if (spec.displayStatus === ENUMS.displayStatus.displayed && spec[specProp] === ENUMS[specProp][constantCheckProp]) {
              if (misc.isSrcdocFrame()) {
                misc.postMessageToParent({
                  impRequestLoc: impRequestLoc,
                  spec: spec,
                  feedbackText: feedbackText,
                  messageType: ENUMS.postMessageType.toParentIsolateAdVisibilityEvent
                });
              } else {
                sendEvent(impRequestLoc, spec, feedbackText);
              }
              spec[specProp] = ENUMS[specProp][constantPostProp];
              misc.postMessageToParent({
                messageType: ENUMS.postMessageType.toParentAdVisibilityEvent,
                widgetId: spec.widgetId,
                adId: spec.adId,
                creativeId: spec.creativeId,
                viewability: spec.viewability,
                callbackProp: callbackProp,
                debugMessage: feedbackText + ' sent',
                isDivContainer: spec.isDivContainer
              });
            }
          });
        };

        return {
          sendEventFromParent: function(impRequestLoc, spec, feedbackText) {
            sendEvent(impRequestLoc, spec, feedbackText);
          },
          sendClick: function(clickLoc) {
            sendEvent(clickLoc, null, 'Click');
          },
          sendVisibilityImpressions: function() {
            sendImpression('visible', 'visibilityStatus', 'visible', 'visibleSent', 'Visible', 'onVisible');
          },
          sendViewableImpressions: function() {
            sendImpression('viewable', 'viewabilityStatus', 'viewed', 'viewSent', 'Viewable', 'onViewable');
          },
          cancelProximityListeners: function() {
            adn.util.detachEventListener(win, 'resize', readings.takeProximity);
            adn.util.detachEventListener(win, 'scroll', readings.takeProximity);
          },
          cancelViewabilityListeners: function() {
            adn.util.detachEventListener(win, 'resize', readings.takeViewability);
            adn.util.detachEventListener(win, 'scroll', readings.takeViewability);
          },
          initViewability: function() {
            if (adn.util.isTopWindow()) {
              readings.takeViewability();
              if (mViewabilityRunner === false) {
                // interval time is set to a little more than 200 to make cover off any idiosyncracies in timing too early or whatnot
                mViewabilityRunner = win.setInterval(readings.takeViewability, 203);
              }
              adn.util.addEventListener(win, 'resize', readings.takeViewability);
              adn.util.addEventListener(win, 'scroll', readings.takeViewability);
            }
          },
          initProximity: function() {
            if (adn.util.isTopWindow()) {
              readings.takeProximity();
              adn.util.addEventListener(win, 'resize', readings.takeProximity);
              adn.util.addEventListener(win, 'scroll', readings.takeProximity);
            }
          },
          takeProximity: function() {
            var windowSize,
              scrollPos,
              wSpecs = adn.util.filter(gWidgetSpecs, function(w) {
                return (w.adStatus === ENUMS.adStatus.procured || misc.getParam(w.requestParams, 'load') === ENUMS.loadEnums.lazyRequest) && !w.withinBounds;
              });

            if (wSpecs.length === 0) {
              readings.cancelProximityListeners();
              return adn.out.devOutput("No more ads to proximity check", "takeProximityReading", gWidgetSpecs);
            }

            if (!adn.util.isTopWindow()) {
              return;
            }

            try {
              windowSize = adn.util.getWindowSize();
            } catch(e) {
              adn.out.output("takeProximityReading window size calcs off", e);
            }
            try {
              scrollPos = adn.util.getScrollPos();
            } catch(e) {
              adn.out.output("takeProximityReading scroll calcs off", e);
            }

            var rTokens = [];
            var renderedImpRequestLoc = "";
            adn.util.forEach(wSpecs, function(spec) {
              try {
                var widgetEl = misc.getDocEl(spec);
                if (!widgetEl) {
                  adn.out.devOutput("Missing appearance of element", "takeProximity", widgetEl, spec);
                  return;
                }
                var previousDisplay = widgetEl.style.display;
                if (previousDisplay.toLowerCase() === 'none') {
                  widgetEl.style.display = 'block';
                }

                var widgetPos = adn.util.getElementPosition(widgetEl),
                  widgetSize = {
                    width: widgetEl.offsetWidth,
                    height: widgetEl.offsetHeight
                  },
                  proximityLimit = adn.util.isNumber(misc.getParam(spec.requestParams, 'proximity')) ? misc.getParam(spec.requestParams, 'proximity') : ENUMS.defaultProximity;

                var viewportPos = {
                    top: scrollPos.top,
                    left: scrollPos.left,
                    bottom: scrollPos.top + windowSize.height,
                    right: scrollPos.left + windowSize.width
                  },
                  adPos = {
                    top: widgetPos.top,
                    left: widgetPos.left,
                    bottom: widgetPos.top + widgetSize.height,
                    right: widgetPos.left + widgetSize.width
                  },
                  distanceAdTopToViewportBottom = adPos.top - viewportPos.bottom,
                  distanceAdBottomToViewportTop = adPos.bottom - viewportPos.top,
                  distanceAdLeftToViewportRight = adPos.left - viewportPos.right,
                  withinYBounds = distanceAdTopToViewportBottom < proximityLimit && distanceAdBottomToViewportTop > (proximityLimit * -1),
                  withinXBounds = distanceAdLeftToViewportRight < proximityLimit;
                if (withinYBounds && withinXBounds) {
                  spec.withinBounds = true;
                  if (spec.adStatus === ENUMS.adStatus.procured) {
                    spec.adStatus = ENUMS.adStatus.distributed;

                    var composedAd = gComposedAds[spec.targetId];
                    if (!adn.util.isObject(composedAd)) {
                      return adn.out.output("Can't find composed ad details", "proximity", gComposedAds, spec);
                    }
                    var result = adn.lib.showAdContent(spec, composedAd);
                    if (adn.util.isTrue(result)) {
                      adn.util.forEach(composedAd.rts || [], function(rp) {
                        rTokens.push(rp);
                      });
                      renderedImpRequestLoc = composedAd.renderedImpRequestLoc;
                    }
                  }
                }
                widgetEl.style.display = previousDisplay;
              } catch(e) {
                adn.out.output("some catch error for takeProximityReading", e);
              }
            });
            adn.lib.sendRenderedImps(rTokens, renderedImpRequestLoc);
          },
          takeViewability: function(pTreatAsChildWindow) {
            var windowSize,
              triggerSendViewableImp = false,
              triggerSendVisibleImp = false,
              treatAsChildWindow = adn.util.isTrue(pTreatAsChildWindow),
              allSpecs = adn.util.isTopWindow() && !treatAsChildWindow ? gWidgetSpecs : gAdSpecs,
              specs = adn.util.filter(allSpecs, function(s) {
                return s.displayStatus === ENUMS.displayStatus.displayed && s.viewabilityStatus === ENUMS.viewabilityStatus.notViewed && !s.isNested;
              }),
              cancelIntervals = function() {
                win.clearInterval(mViewabilityRunner);
                mViewabilityRunner = false;
              };

            if (specs.length === 0) {
              readings.cancelViewabilityListeners();
              cancelIntervals();
              if (!adn.util.isTopWindow() || treatAsChildWindow) {
                misc.postMessageToParent({
                  messageType: ENUMS.postMessageType.toParentAllChildrenViewed,
                  widgetId: adn.inIframe.getIframeId(),
                  functionContext: ENUMS.functionContext.parent,
                  method: 'allChildrenViewed'
                });
              }
              return adn.out.devOutput("No more ads to viewability check", "takeViewabilityReadings", gWidgetSpecs, gAdSpecs, adn.util.isTopWindow());
            }

            try {
              windowSize = adn.util.getWindowSize();
              windowSize.width = Math.max(windowSize.width, 1);
              windowSize.height = Math.max(windowSize.height, 1);
              if (gWindowStats.prevWindowWidth !== windowSize.width || gWindowStats.prevWindowHeight !== windowSize.height) {
                gWindowStats.prevWindowWidth = windowSize.width;
                gWindowStats.prevWindowHeight = windowSize.height;
              }
            } catch(e) {
              adn.out.output("takeViewabilityReading window size calcs off", e);
            }
            var scrollPos;
            try {
              scrollPos = adn.util.getScrollPos();
              if (gWindowStats.prevScrollLeft !== scrollPos.left || gWindowStats.prevScrollTop !== scrollPos.top) {
                gWindowStats.prevScrollLeft = scrollPos.left;
                gWindowStats.prevScrollTop = scrollPos.top;
              }
              gWindowStats.maxViewLeft = Math.max(scrollPos.left + windowSize.width, gWindowStats.maxViewLeft);
              gWindowStats.maxViewTop = Math.max(scrollPos.top + windowSize.height, gWindowStats.maxViewTop);
            } catch(e) {
              adn.out.output("takeViewabilityReading scroll calcs off", e);
            }
            var now = new Date().getTime();
            var timeDelta;

            if (treatAsChildWindow) {
              gWindowStats.childPrevTime = gWindowStats.childPrevTime || {};
              var widgetId = specs[0].widgetId;
              gWindowStats.childPrevTime[widgetId] = gWindowStats.childPrevTime[widgetId] || new Date().getTime();
              timeDelta = now - gWindowStats.childPrevTime[widgetId];
              gWindowStats.childPrevTime[widgetId] = now;
            } else {
              gWindowStats.prevTime = gWindowStats.prevTime || new Date().getTime();
              timeDelta = now - gWindowStats.prevTime;
              gWindowStats.prevTime = now;
            }

            adn.util.forEach(specs, function(spec) {
              try {
                var widgetEl = doc.getElementById(spec.adId || spec.widgetId),
                  widgetPos = adn.util.getElementPosition(widgetEl),
                  widgetSize = {
                    width: Math.max(widgetEl.offsetWidth, 1),
                    height: Math.max(widgetEl.offsetHeight, 1)
                  },
                  overlapLeft = Math.max(widgetPos.left, scrollPos.left),
                  overlapRight = Math.min(widgetPos.left + widgetSize.width, scrollPos.left + windowSize.width),
                  overlapTop = Math.max(widgetPos.top, scrollPos.top),
                  overlapBottom = Math.min(widgetPos.top + widgetSize.height, scrollPos.top + windowSize.height),
                  metricsFromParent = gWindowStats.metricsFromParent;

                if (metricsFromParent) {
                  var parentLeft = metricsFromParent.overlapPos.left + scrollPos.left,
                    parentRight = metricsFromParent.overlapPos.left + metricsFromParent.overlapSize.width + scrollPos.left,
                    parentTop = metricsFromParent.overlapPos.top + scrollPos.top,
                    parentBottom = metricsFromParent.overlapPos.top + metricsFromParent.overlapSize.height + scrollPos.top;

                  overlapLeft = Math.max(parentLeft, overlapLeft);
                  overlapRight = Math.min(parentRight, overlapRight);
                  overlapTop = Math.max(parentTop, overlapTop);
                  overlapBottom = Math.min(parentBottom, overlapBottom);
                }
                var overlapWidth = Math.max(overlapRight - overlapLeft, 0),
                  overlapHeight = Math.max(overlapBottom - overlapTop, 0),
                  viewablePercent = Math.round(overlapWidth * overlapHeight / (widgetSize.width * widgetSize.height) * 100);

                if (viewablePercent > ENUMS.defaultVisibilityPercentage && spec.visibilityStatus === ENUMS.visibilityStatus.notVisible) {
                  if (!adn.util.isTopWindow() || treatAsChildWindow) {
                    spec.visibilityStatus = ENUMS.visibilityStatus.visible;
                    triggerSendVisibleImp = true;
                  }
                }
                if (viewablePercent === 100 && spec.viewability.prevPercent === 100 && spec.viewability.timeFully < ENUMS.longestTime) {
                  spec.viewability.timeFully += timeDelta;
                }
                if (viewablePercent >= 50 && spec.viewability.prevPercent >= 50 && spec.viewability.timeHalf < ENUMS.longestTime) {
                  spec.viewability.timeHalf += timeDelta;
                }
                if (viewablePercent > 0 && spec.viewability.prevPercent > 0 && spec.viewability.timePartly < ENUMS.longestTime) {
                  spec.viewability.timePartly += timeDelta;
                } else {
                  spec.viewability.timeNone += timeDelta;
                }
                if (viewablePercent > spec.viewability.maxPercent) {
                  spec.viewability.maxPercent = viewablePercent;
                }
                spec.viewability.prevPercent = viewablePercent;

                if ((spec.viewability.timeFully > 1000 || spec.viewability.timeHalf > 1000) && spec.viewabilityStatus === ENUMS.viewabilityStatus.notViewed) {
                  if (!adn.util.isTopWindow() || treatAsChildWindow) {
                    spec.viewabilityStatus = ENUMS.viewabilityStatus.viewed;
                    triggerSendViewableImp = true;
                  }
                }

                if (adn.util.isTopWindow() && !treatAsChildWindow) {
                  var metrics = [now, scrollPos.left, scrollPos.top, windowSize.width, windowSize.height, widgetPos.left, widgetPos.top, widgetSize.width, widgetSize.height, overlapLeft - widgetPos.left, overlapTop - widgetPos.top, overlapWidth, overlapHeight];
                  adn.util.forEach(metrics, function(m, i) {
                    metrics[i] = Math.round(m);
                  });
                  misc.postMessageToChild(widgetEl, {
                    messageType: ENUMS.postMessageType.toChildViewability,
                    functionContext: ENUMS.functionContext.inIframe,
                    method: 'updateMetricsFromParent',
                    metricsFromParent: metrics.join(","),
                    metaData: cookies.getAllStorageAsObj(),
                    isDivContainer: spec.container === ENUMS.container.div || spec.isDivContainer
                  });
                }
              } catch(e) {
                adn.out.output("takeViewabilityReading off", e);
              }
            });
            if (triggerSendVisibleImp) {
              readings.sendVisibilityImpressions();
            }
            if (triggerSendViewableImp) {
              readings.sendViewableImpressions();
            }
          }
        };
      }()),
      parentMethods = (function() {
        var checkArgs = function(args, func, theWidget) {
          var widgetSpec = gWidgetSpecs[args.widgetId];
          if (!widgetSpec && args.widgetId !== ENUMS.previewId) {
            return adn.out.output("Couldn't find widget specs for " + args.widgetId, "checkArgs");
          }
          var widget = theWidget || doc.getElementById(args.widgetId) || doc.getElementById(ENUMS.previewId);
          if (!widget) {
            return adn.out.output("Couldn't find widget in the document", "checkArgs");
          }
          if (widgetSpec) {
            return func.call(parentMethods, widget, widgetSpec, args);
          }
        };

        return {
          allChildrenViewed: function(args) {
            var wSpec = gWidgetSpecs[args.widgetId];
            if (wSpec) {
              wSpec.visibilityStatus = ENUMS.visibilityStatus.visible;
              wSpec.viewabilityStatus = ENUMS.viewabilityStatus.viewed;
            }
          },
          updateIframe: function(args) {
            return checkArgs(args, function(widget, widgetSpec, args) {
              if (adn.util.isDefined(args.w)) {
                widget.width = args.w;
              }
              if (adn.util.isDefined(args.h)) {
                widget.height = args.h;
              }

              var targetEl = widget.parentNode;
              if (args.stack === 'relative') {
                targetEl.style.position = 'relative';
                widget.style.position = 'absolute';
              } else if (args.stack === 'absolute') {
                if (!adn.util.isBlankString(targetEl.style.position) && targetEl.style.position === 'relative') {
                  targetEl.style.position = 'static';
                }
                widget.style.position = 'absolute';
              } else {
                if (!adn.util.isBlankString(widget.style.position) && widget.style.position !== 'static') {
                  widget.style.position = 'static';
                }

                if (adn.util.isDefined(widget.width)) {
                  targetEl.style.width = adn.util.dimension(widget.width);
                }
                if (adn.util.isDefined(widget.height)) {
                  targetEl.style.height = adn.util.dimension(widget.height);
                }
              }

              if (adn.util.isDefined(args.ifrStyle) && !adn.util.isBlankString(args.ifrStyle)) {
                misc.applyStyle(widget, args.ifrStyle);
              }
              if (adn.util.isDefined(args.targetStyle) && !adn.util.isBlankString(args.targetStyle)) {
                misc.applyStyle(targetEl, args.targetStyle);
              }
            });
          },
          triggerViewabilityReading: function(args) {
            checkArgs(args, function(widget, widgetSpec) {
              widgetSpec.adStatus = ENUMS.adStatus.processed;
              widgetSpec.displayStatus = ENUMS.displayStatus.displayed;
              readings.initViewability();
            });
          },
          iframeResizer: function(args, displayNone, collapsible) {
            return checkArgs(args, function(widget, widgetSpec, args) {
              var parseW = parseInt(args.w, 10),
                parseH = parseInt(args.h, 10),
                isCollapsible = adn.util.isDefined(collapsible) ? collapsible : widgetSpec.collapsible;
              if (parseW < 0 || parseH < 0) {
                return adn.out.output("Invalid width (" + args.w + ") and height (" + args.h + ") for resize", "iframeResizer");
              }
              var zeroW = parseW === 0,
                zeroH = parseH === 0;

              if ((zeroW || zeroH) && !isCollapsible) {
                return adn.out.devOutput("Resize to zero not allowed -- ad unit is not collapsible", "iframeResizer", args, isCollapsible);
              }

              widget.width = args.w;
              widget.height = args.h;

              var targetEl = widget.parentNode;
              targetEl.style.width = adn.util.dimension(args.w);
              targetEl.style.height = adn.util.dimension(args.h);

              if ((zeroW || zeroH) && displayNone) {
                widget.style.display = 'none';
                targetEl.style.display = 'none';
              }
            });
          },
          styleFromAds: function(args) {
            var adCount = parseInt(args.retAdCount, 10);
            var widgetSpec = gWidgetSpecs[args.widgetId];
            if (adCount === 0) {
              parentMethods.iframeResizer({widgetId: args.widgetId, w: 0, h: 0}, gFeedback.inScreen !== ENUMS.feedback.inScreen.inAdUnit);
            } else if (adn.util.isNumber(adCount) && adCount > 0) {
              if (!widgetSpec || !adn.util.hasProperties(widgetSpec)) {
                return adn.out.output("Missing widget spec", "styleFromAds", args);
              }
              widgetSpec.displayStatus = ENUMS.displayStatus.displayed;
              readings.initViewability();
              parentMethods.iframeResizer({
                widgetId: args.widgetId,
                w: parseInt(args.retAdsW, 10),
                h: parseInt(args.retAdsH, 10)
              }, false, false);
            } else {
              return adn.out.output("adCount is not valid: " + adCount, "styleFromAds");
            }
          }
        };
      }());

    adn.inIframe = (function() {
      var resizeToContent = true,
        responseCtrId = 'responseCtr',
        windowEventSubs = {},
        onUpdateMetricsFromParent = [],
        onProcessAd = [],
        regFunctions = [],
        adInfoHandlers = {};

      misc.isTestAddress(win.location.href); // required to set dev mode

      pFrameMethods = {
        handleAdUnitInfo: function(args) {
          if (!args || !adn.util.isString(args.adUnitInfoId)) {
            return adn.out.output("Missing ad unit info id for ad unit info response", "handleAdUnitInfo", args);
          }
          var infoHandlers = adInfoHandlers[args.adUnitInfoId];
          if (!infoHandlers || !adn.util.isArray(infoHandlers) || infoHandlers.length < 1) {
            return adn.out.output("Missing some ad unit info response handlers", "handleAdUnitInfo", adInfoHandlers, args);
          }
          var adUnitInfo = args.adUnitInfo;
          var abridgedAdUnitInfo = misc.copyArgValues({}, adUnitInfo, ["auId", "latitude", "longitude", "adStatus", "auH", "auW", "collapsible", "display", "c", "kv", "auml", "ps", "displayStatus", "targetId", "targetClass", "widgetId", "functionCalls", "requestParams", "method", "onNoMatchedAds", "onImpressionResponse", "onPageLoad", "usi", "siteId", "userId", "sessionId", "segments", "resizeOnPageLoad", "ctx"]);
          adn.util.forEach(infoHandlers, function(h) {
            h(abridgedAdUnitInfo);
          });
        },
        handleChildPubs: function(args) {
          if (!adn.util.isObject(args) || !adn.util.isString(args.widgetId) || !adn.util.isString(args.event)) {
            return adn.out.output("Missing some args", "handleChildPubs", args);
          }
          adn.util.forEach(args.functionCalls || [], function(fc) {
            if (!fc.name) {
              adn.out.output("Missing a name parameter for a function call", "handleChildPubs", args);
              return;
            }
            var regFuncsToCall = adn.util.filter(regFunctions, function(regFunc) {
              return regFunc.name === fc.name && adn.util.isFunction(regFunc.func) && regFunc.isCalled !== true;
            });
            adn.util.forEach(regFuncsToCall || [], function(fToCall) {
              fToCall.func(fc.args);
              fToCall.isCalled = true;
            });
          });
          adn.util.forEach(windowEventSubs[args.event] || [], function(eventFunc) {
            if (eventFunc.widgetId !== args.widgetId) {
              return;
            }
            var funcArgs = {};
            if (adn.util.isObject(args.windowDims)) {
              funcArgs.windowDims = args.windowDims;
            }
            eventFunc.cb(funcArgs);
          });
        },
        updateMetricsFromParent: function(args) {
          if (!args || !adn.util.isObject(args)) {
            return adn.out.devOutput("Missing required args", "updateMetricsFromParent", args);
          }
          if (args.metricsFromParent && !args.isDivContainer) {
            var values = args.metricsFromParent.split(",");
            adn.util.forEach(values, function(v, k) {
              values[k] = parseInt(v, 10);
            });
            gWindowStats.metricsFromParent = {
              updateTime: values[0],
              scrollPos: {
                left: values[1],
                top: values[2]
              },
              windowSize: {
                width: values[3],
                height: values[4]
              },
              widgetPos: {
                left: values[5],
                top: values[6]
              },
              widgetSize: {
                width: values[7],
                height: values[8]
              },
              overlapPos: {
                left: values[9],
                top: values[10]
              },
              overlapSize: {
                width: values[11],
                height: values[12]
              }
            };
          }
          if (args.metaData) {
            gWindowStats.metaData = args.metaData;
          }
          adn.util.forEach(onUpdateMetricsFromParent, function(func) {
            func();
          });
          onUpdateMetricsFromParent = [];
          readings.takeViewability(adn.util.isTrue(args.isDivContainer));
        }
      };

      var processAd = function(iframeId, containerId, matchedAdCount) {
        var contentDims = {},
          ads = [],
          adsDivEl;
        try {
          adsDivEl = doc.getElementById(containerId);
          contentDims = adn.util.getElementDimensions(adsDivEl);
          ads = adn.util.filter(adsDivEl.getElementsByTagName("div"), function(el) {
            return el.className.indexOf(ENUMS.adWrapperClass) > -1 && el.id.indexOf(ENUMS.adIdPrefix) === 0;
          });
        } catch(e) {
          contentDims = {};
        }

        gAdLocs = adn.lib.getRequestLocs({env: gDevMode ? 'http://localhost:8000/test' : adn.lib.getEnv()}, false);

        // isNested lets you know if the Adnuntius ad is a third-party creative in another ad server
        var isDivContainer = adsDivEl && adsDivEl.tagName.toLowerCase() === 'div' && containerId !== adn.inIframe.getResponseCtrId();
        var isNested = !isDivContainer && (!iframeId || !adn.lib.isParentTopWindow());
        adn.util.forEach(ads, function(a) {
          gAdSpecs[a.id] = {
            widgetId: iframeId,
            isNested: isNested,
            isDivContainer: isDivContainer,
            adId: a.id,
            creativeId: a.getAttribute('data-creative-id'),
            rt: a.getAttribute(RT_DATA_ATTR),
            adStatus: ENUMS.adStatus.processed,
            displayStatus: ENUMS.displayStatus.displayed,
            viewabilityStatus: ENUMS.viewabilityStatus.notViewed,
            visibilityStatus: ENUMS.visibilityStatus.notVisible,
            viewability: {
              maxPercent: 0,
              prevPercent: 0,
              timeNone: 0,
              timePartly: 0,
              timeHalf: 0,
              timeFully: 0,
              timeIntersect: 0,
              timeStart: 0
            }
          };

          if (isNested && misc.supportsIntersectionObserver()) {
            var adId = a.id;
            var observer = false;
            var callback = function(data) {
              var adSpec = gAdSpecs[adId];
              if (adSpec.visibilityStatus === ENUMS.visibilityStatus.notVisible && data[0].intersectionRatio > 0) {
                adSpec.visibilityStatus = ENUMS.visibilityStatus.visible;
                readings.sendVisibilityImpressions();
                var stillGoing = adn.util.find(gAdSpecs, function(adSpec) {
                  return adSpec.isNested && adSpec.visibilityStatus === ENUMS.visibilityStatus.notVisible;
                });
                if (!stillGoing && observer) {
                  observer.disconnect();
                }
              }
            };
            observer = new win.IntersectionObserver(callback, {
              root: null,
              rootMargin: '0px',
              threshold: 0.01
            });
            observer.observe(doc.getElementById(adId));

            var viewabilityTimeout = false;
            var viewObserver = false;
            var viewCallback = function(data) {
              var adSpec = gAdSpecs[adId];
              var now = new Date().getTime();

              var successCallback = function() {
                adSpec.viewability.timeIntersect = adSpec.viewability.timeIntersect + new Date().getTime() - adSpec.viewability.timeStart;
                adSpec.viewabilityStatus = ENUMS.viewabilityStatus.viewed;
                readings.sendViewableImpressions();
                win.clearTimeout(viewabilityTimeout);
                viewabilityTimeout = false;

                var stillGoing = adn.util.find(gAdSpecs, function(adSpec) {
                  return adSpec.isNested && adSpec.viewabilityStatus === ENUMS.viewabilityStatus.notViewed;
                });
                if (!stillGoing && viewObserver) {
                  viewObserver.disconnect();
                }
              };
              if (adSpec.viewabilityStatus === ENUMS.viewabilityStatus.notViewed) {
                if (data[0].intersectionRatio >= 0.5) {
                  adSpec.viewability.timeStart = now;

                  var successTime = 1000 - adSpec.viewability.timeIntersect;
                  viewabilityTimeout = win.setTimeout(successCallback, successTime);
                } else {
                  if (viewabilityTimeout && adSpec.viewability.timeStart > 0) {
                    adSpec.viewability.timeIntersect = adSpec.viewability.timeIntersect + new Date().getTime() - adSpec.viewability.timeStart;
                    adSpec.viewability.timeStart = 0;
                    win.clearTimeout(viewabilityTimeout);
                    viewabilityTimeout = false;
                  }
                }
              }
            };
            viewObserver = new win.IntersectionObserver(viewCallback, {
              root: null,
              rootMargin: '0px',
              threshold: 0.5
            });
            viewObserver.observe(doc.getElementById(adId));
          }
        });

        // this section is for SSP creatives and overlaying a click counter where necessary.
        var containers = doc.getElementsByClassName('adn-external-container');
        adn.util.forEach(containers, function(contEl) {
          var adWrapperEl = contEl.parentNode;
          if (!adWrapperEl || !adWrapperEl.className || adWrapperEl.className.indexOf('adWrapper') < 0 || !contEl.href) {
            return;
          }
          adn.util.addEventListener(adWrapperEl, 'click', function(e) {
            var linkNode = e.target;
            while(linkNode && linkNode.nodeName.toLowerCase() !== 'a') {
              linkNode = linkNode.parentNode;
            }
            if (linkNode && !misc.getEnvFromHref(linkNode.href)) {
              readings.sendClick(contEl.href);
            }
          });
        });

        adn.util.forEach(onProcessAd, function(func) {
          func();
        });
        onProcessAd = [];

        misc.postMessageToParent({
          messageType: ENUMS.postMessageType.toParentImpression,
          method: adn.inIframe.isResizeToContent() ? 'styleFromAds' : 'triggerViewabilityReading',
          retAdCount: matchedAdCount,
          retAdsW: contentDims.w,
          retAdsH: contentDims.h,
          widgetId: iframeId,
          isDivContainer: isDivContainer
        });
      };

      return {
        sendCustomEvent: function(args, customArgs, pAdSpec) {
          var adId = misc.getParam(args, 'id') || args;
          if (!adn.util.isDefined(adId) || !adn.util.isString(misc.getParam(customArgs, 'customType'))) {
            return adn.out.output("Missing an ad ID or customType to perform the custom event", "sendCustomEvent", args, customArgs);
          }
          var sendCustomEventFunc = function(adSpec) {
            if (!adn.util.isObject(adSpec)) {
              return adn.out.output("Need an ad spec to send a custom event", "sendCustomEvent", gAdSpecs, args, customArgs);
            }
            if (!adn.util.isString(adSpec.rt)) {
              return adn.out.output("Need a response token on the spec object to send imp", "sendCustomEvent", adSpec, gAdSpecs, args, customArgs);
            }
            var customRequestLoc = adn.lib.getRequestLocs({env: gDevMode ? 'http://localhost:8000/test' : adn.lib.getEnv()}).custom;
            if (adSpec && gWidgetSpecs && gWidgetSpecs[adSpec.widgetId]) {
              customRequestLoc = gWidgetSpecs[adSpec.widgetId].customRequestLoc;
            }
            if (!customRequestLoc) {
              return adn.out.output("Need a custom request loc", "sendCustomEvent", customRequestLoc, adSpec, gAdSpecs, args, customArgs);
            }
            try {
              var customValue = parseInt(customArgs.customValue, 10);
              var qParams = {
                rt: adSpec.rt,
                customType: customArgs.customType,
                customValue: adn.util.isNumber(customValue) ? customValue : 0
              };
              if (qParams.customValue === 0) {
                delete qParams.customValue;
              }
              var loc = customRequestLoc + misc.encodeAsUrlParams(qParams, true);
              if (misc.isTestAddress(loc)) {
                adn.out.devOutput("Custom request loc being send", "sending", adSpec, loc);
              } else {
                var ajax = adn.util.getNewAjax("GET", loc);
                ajax.withCredentials = !misc.isTestAddress(loc);
                ajax.send();
              }
            } catch(e) {
              adn.out.output("sending a custom event failed", e, gAdSpecs, args, customArgs);
            }
          };

          var findAdSpec = function() {
            return pAdSpec || adn.util.find(gAdSpecs, function(a) {
              return a.adId === adId;
            });
          };
          var makeEventHappen = function(adSpec) {
            if (misc.isSrcdocFrame() && !pAdSpec) {
              return misc.postMessageToParent({
                args: args,
                customArgs: customArgs,
                pAdSpec: adSpec,
                messageType: ENUMS.postMessageType.toParentCustomEvent
              });
            }
            sendCustomEventFunc(adSpec);
          };
          var adSpec = findAdSpec();
          if (adSpec) {
            makeEventHappen(adSpec);
          } else {
            onProcessAd.push(function() {
              return makeEventHappen(findAdSpec());
            });
          }
        },
        getResponseCtrId: function() {
          return responseCtrId;
        },
        blockResizeToContent: function() {
          resizeToContent = false;
        },
        isResizeToContent: function() {
          return resizeToContent;
        },
        getAdRequestInfo: function(args) {
          if (!args || !adn.util.isFunction(args.onInfoReceived)) {
            return adn.out.output("Need onData function populated", "getAdRequestInfo", args);
          }
          var adUnitInfoId = args.adUnitInfoId || "adUnitInfoId-" + Math.random();
          adInfoHandlers[adUnitInfoId] = adInfoHandlers[adUnitInfoId] || [];
          adInfoHandlers[adUnitInfoId].push(args.onInfoReceived);
          misc.postMessageToParent({
            messageType: ENUMS.postMessageType.toParentGetAdUnitInfo,
            adUnitInfoId: adUnitInfoId,
            widgetId: adn.inIframe.getIframeId()
          });
        },
        registerFunction: function(args) {
          if (!adn.util.isString(args.name) || !adn.util.isFunction(args.func)) {
            return adn.out.output("Missing important parameters", args);
          }
          regFunctions.push(args);
        },
        processAdResponse: function(args) {
          if (!args || !adn.util.isNumber(args.matchedAdCount)) {
            return adn.out.output("Missing the necessary args in " + args, "resizeAds");
          }
          var iframeId = args.widgetId;
          var containerId = args.widgetId;
          if (!iframeId) {
            iframeId = adn.inIframe.getIframeId();
            containerId = adn.inIframe.getResponseCtrId();
          }
          if (!iframeId && adn.lib.isParentTopWindow()) {
            return adn.out.devOutput("Unable to find iframeId", "processAdResponse", iframeId, args);
          }
          processAd(iframeId, containerId, args.matchedAdCount);
        },
        getIframeArgs: function() {
          return misc.combineArgs(misc.parseUrlArgs(), misc.parseHashArgs());
        },
        getIframeId: function() {
          var iframeId = doc.getElementsByTagName("body")[0].id;
          if (iframeId) {
            return iframeId;
          }
          var urlIfrId = adn.inIframe.getIframeArgs().ifrId;
          if (adn.util.isNotBlankString(urlIfrId) && urlIfrId !== ENUMS.previewId) {
            return urlIfrId;
          }
          var fallbackId = "";
          if (urlIfrId === ENUMS.previewId) {
            fallbackId = ENUMS.previewId;
          }
          var iframe = adn.util.getFrameElement();
          return adn.util.isDefined(iframe) ? iframe.id : fallbackId;
        },
        parentSubscribeEvent: function(args) {
          if (!adn.util.isObject(args) || !adn.util.isString(args.event) || !adn.util.isString(args.ifrId) || !adn.util.isFunction(args.cb)) {
            return adn.out.output("Need better args", "parentSubscribeEvent", args);
          }
          misc.postMessageToParent({
            messageType: ENUMS.postMessageType.toParentSubscribe,
            event: args.event,
            widgetId: args.ifrId
          });
          windowEventSubs[args.event] = windowEventSubs[args.event] || [];
          windowEventSubs[args.event].push({widgetId: args.ifrId, cb: args.cb});
        },
        updateAd: function(args) {
          if (!args || !args.ifrId) {
            return adn.out.output("Need arguments and an iframe id", "inIframe", args);
          }
          var method = args.method || 'updateIframe';
          var targetStyle = args.targetStyle || args.parentStyle; // here for backwards-compatibility
          var message = {
            messageType: ENUMS.postMessageType.toParentUpdateAd,
            method: method,
            w: args.ifrW || '',
            h: args.ifrH || '',
            params: adn.util.isObject(args.params) ? args.params : '',
            ifrStyle: adn.util.isObject(args.ifrStyle) ? args.ifrStyle : '',
            targetStyle: adn.util.isObject(targetStyle) ? targetStyle : '',
            widgetId: args.ifrId,
            stack: args.stack || 'static'
          };
          if (!args.el || !args.event) {
            misc.postMessageToParent(message);
            return;
          }
          adn.util.addEventListener(args.el, args.event, adn.util.createDelegate(adn.util, function(e) {
            misc.postMessageToParent(message);

            if (args.cb) {
              if (!adn.util.isFunction(args.cb)) {
                return adn.out.output("Callback supplied not a function", "inIframe");
              }
              args.cb(e, args);
            }
          }));
        }
      };
    }());

    (function() {
      var mAdUnits, mCreatives;

      var initMemberVariables = function(args) {
        var locs = adn.lib.getRequestLocs(args, true);
        mAdUnits = [];
        mCreatives = [];

        var initAdUnit = function(dataStore, argsAu, argsParent, requestArgs) {
          var pArgs = adn.util.isObject(argsParent) ? misc.clone(argsParent) : {};
          var data = {
            auId: argsAu.auId || argsAu.targetId,
            requestArgs: requestArgs,
            creativeId: argsAu.creativeId,
            creativeData: argsAu.creativeData,
            networkId: argsAu.networkId || pArgs.networkId,
            widgetId: 'adn-widget-' + Math.random(),
            auW: argsAu.auW || argsAu.creativeWidth || 0,
            auH: argsAu.auH || argsAu.creativeHeight || 0,
            display: argsAu.display || undefined,
            c: argsAu.c || pArgs.c || undefined,
            ctx: argsAu.ctx || pArgs.ctx || undefined,
            kv: argsAu.kv || pArgs.kv || undefined,
            auml: argsAu.auml || undefined,
            segments: argsAu.segments || pArgs.segments,
            ps: adn.util.isNumber(argsAu.ps) ? argsAu.ps : undefined,
            adStatus: ENUMS.adStatus.init,
            displayStatus: ENUMS.displayStatus.notDisplayed,
            container: ENUMS.container[(argsAu.container || pArgs.container || 'nothing')] || ENUMS.container.iframe,
            env: argsAu.env || pArgs.env || ENUMS.env.production.id,
            viewabilityStatus: ENUMS.viewabilityStatus.notViewed,
            visibilityStatus: ENUMS.visibilityStatus.notVisible,
            impRequestLoc: locs.imp,
            floorPrice: argsAu.floorPrice || pArgs.floorPrice || undefined,
            protocol: argsAu.protocol || pArgs.protocol || undefined,
            renderedImpRequestLoc: locs.rendered,
            viewImpRequestLoc: locs.viewable,
            visImpRequestLoc: locs.visible,
            customRequestLoc: locs.custom,
            previewLoc: locs.preview,
            headerBids: argsAu.headerBids || pArgs.headerBids,
            functionCalls: argsAu.functionCalls || pArgs.functionCalls,
            requestParams: misc.assign(pArgs.requestParams || {}, argsAu.requestParams || {}),
            collapsible: argsAu.collapsible !== false,
            method: pArgs.method || argsAu.method,
            devScript: argsAu.devScript || false,
            excludedCreatives: pArgs.excludedCreatives || [],
            excludedLineItems: pArgs.excludedLineItems || [],
            onError: argsAu.onError || pArgs.onError || adn.util.noop,
            onVisible: argsAu.onVisible || pArgs.onVisible || adn.util.noop,
            onViewable: argsAu.onViewable || pArgs.onViewable || adn.util.noop,
            onNoMatchedAds: argsAu.onNoMatchedAds || pArgs.onNoMatchedAds,
            onImpressionResponse: argsAu.onImpressionResponse || pArgs.onImpressionResponse,
            onPageLoad: argsAu.onPageLoad || pArgs.onPageLoad,
            siteId: argsAu.siteId || pArgs.siteId,
            usi: argsAu.usi || pArgs.usi,
            userId: argsAu.userId || pArgs.userId,
            useCookies: !(argsAu.useCookies === false || pArgs.useCookies === false),
            sessionId: argsAu.sessionId || pArgs.sessionId,
            latitude: argsAu.latitude || pArgs.latitude,
            longitude: argsAu.longitude || pArgs.longitude,
            targetId: argsAu.targetId || ("adn-" + (argsAu.auId || argsAu.creativeId)),
            targetClass: pArgs.targetClass || argsAu.targetClass,
            isolateFrame: adn.util.isDefined(argsAu.isolateFrame) ? argsAu.isolateFrame : (pArgs.isolateFrame || false),
            serverUrl: locs.imp + "&auId=" + argsAu.auId,
            resizeOnPageLoad: adn.util.isDefined(argsAu.resizeOnPageLoad) ? argsAu.resizeOnPageLoad : pArgs.resizeOnPageLoad,
            viewability: {
              maxPercent: 0,
              prevPercent: 0,
              timeNone: 0,
              timePartly: 0,
              timeHalf: 0,
              timeFully: 0
            }
          };
          if (data.devScript) {
            data.serverUrl += "&isDevScript=true";
          }
          dataStore.push(data);

          gWidgetSpecs[data.widgetId] = data;
        };

        var parentArgs = misc.assign({}, args);
        delete parentArgs.adUnits;
        delete parentArgs.creatives;
        if (adn.util.isArray(args.adUnits)) {
          adn.util.forEach(adn.util.isArray(args.adUnits) ? args.adUnits : [], function(lAdUnitArgs) {
            initAdUnit(mAdUnits, lAdUnitArgs, parentArgs, args);
          });
        } else if (adn.util.isArray(args.creatives)) {
          adn.util.forEach(adn.util.isArray(args.creatives) ? args.creatives : [], function(creativeArgs) {
            initAdUnit(mCreatives, creativeArgs, parentArgs, args);
          });
        } else {
          initAdUnit(mAdUnits, args, undefined, args);
        }
      };

      var singleIframe = function(onBeforeInsertion) {
        var mAs = mAdUnits[0];
        if (!mAs || !mAs.auId) {
          return adn.out.output("No auId was found.", "singleIframe");
        }
        dom.insIframe(mAs, {}, onBeforeInsertion);
      };
      var getWidgetEl = function() {
        var mAs = mAdUnits[0];
        var targetEl = misc.getDocEl(mAs);
        if (!targetEl) {
          adn.out.warn("Unable to find HTML element on page with the following id: " + mAs.targetId);
          return adn.out.output("No target element was found.", "getWidgetEl");
        }
        return targetEl.firstChild;
      };

      requestMethods = (function() {

        return {
          ifr: function() {
            return singleIframe();
          },
          preview: function() {
            if (mCreatives.length < 1) {
              return adn.out.output("No creatives to make request for", "preview");
            }
            var previewLoc = mCreatives[0].previewLoc;
            misc.gatherDataParams(mCreatives, null, function(creative) {
              gWidgetSpecs[creative.widgetId].preview = true;
            });

            adn.util.forEach(mCreatives, function(creative) {

              if (!adn.util.isString(creative.networkId) || !(adn.util.isString(creative.creativeId) || adn.util.isObject(creative.creativeData))) {
                return adn.out.output("Insufficient creative information for preview", "preview", creative, creative.onError);
              }

              var method = "POST",
                url = previewLoc + "context=" + creative.networkId;
              if (adn.util.isString(creative.creativeId)) {
                method = "GET";
                url += "&creativeId=" + creative.creativeId;
              }

              var ajax = adn.util.getNewAjax(method, url, function() {
                if (ajax.readyState && ajax.readyState !== 4) {
                  return false;
                }
                if (!ajax.status || ajax.status === 200) {
                  var adContent;
                  try {
                    adContent = ajax.responseText;
                  } catch(e) {
                    return adn.out.output(e, "ajax.onreadystatechange: catch block", creative.onError);
                  }

                  var targetEl = misc.getDocEl(creative);
                  if (!targetEl) {
                    return adn.out.output("Couldn't find target element", "Creative preview", creative, targetEl, creative.onError);
                  }
                  // foundIframeContainer protects against double rendering
                  var foundIframeContainer = adn.util.find(targetEl.childNodes, function(node) {
                    return node.id === creative.widgetId;
                  });
                  if (!foundIframeContainer) {
                    creative.serverUrl = null;
                    var ifr = dom.insIframe(creative, targetEl);
                    var iframeDoc = ifr.contentDocument || ifr.contentWindow.document;
                    iframeDoc.open();
                    iframeDoc.write(adContent);
                    iframeDoc.close();
                  }
                  return;
                }
                return adn.out.output("Error status returned", "composed", ajax, creative.onError);
              });
              ajax.withCredentials = !misc.isTestAddress(previewLoc);
              var jsonData;
              if (adn.util.isObject(creative.creativeData)) {
                jsonData = JSON.stringify(creative.creativeData);
              }
              ajax.send(jsonData);
            });
          },
          composed: function(aUnsentAdUnits, aAdUnitRequestData) {
            var wAdUnits = adn.util.isArray(misc.getParam(aAdUnitRequestData, 'adUnits')) ? aAdUnitRequestData.adUnits : mAdUnits;
            if (wAdUnits.length < 1) {
              return adn.out.output("No ad units to make request for", "composed");
            }
            var adUnitsCheckUnsent = adn.util.isArray(aUnsentAdUnits) ? aUnsentAdUnits : mAdUnits;
            readings.takeProximity();

            var impRequestLoc = wAdUnits[0].impRequestLoc,
              headerBids = wAdUnits[0].headerBids,
              unsentAdUnits = [],
              requestId = misc.getParam(aAdUnitRequestData, 'requestId');

            var sendAdUnits = misc.gatherDataParams(adUnitsCheckUnsent, function(au) {
              var theWidget = gWidgetSpecs[au.widgetId];
              var sendRequestForThisAdUnit = (misc.getParam(theWidget.requestParams, 'load') !== ENUMS.loadEnums.lazyRequest || theWidget.withinBounds);
              if (!sendRequestForThisAdUnit) {
                unsentAdUnits.push(au);
              }
              if (sendRequestForThisAdUnit && au.auId === 'dummyadunit-ignore') {
                if (adn.util.isFunction(au.onNoMatchedAds)) {
                  au.onNoMatchedAds(au.requestArgs);
                }
                return false;
              }
              return sendRequestForThisAdUnit;
            }, function(adUnit) {
              gWidgetSpecs[adUnit.widgetId].composed = true;
            });

            if (sendAdUnits.length > 0) {
              impRequestLoc += misc.encodeAsUrlParams(cookies.getIdsAsObj(wAdUnits[0]), true);

              if (!requestId) {
                requestId = "request-" + Math.random();
              }

              var responseStyle = gFeedback.inScreen === ENUMS.feedback.inScreen.inAdUnit ? "format=json" : "tt=multi";
              var ajax = adn.util.getNewAjax(misc.isTestAddress(impRequestLoc) ? "GET" : "POST", impRequestLoc + "&" + responseStyle, function() {
                if (ajax.readyState && ajax.readyState !== 4) {
                  return false;
                }
                if (!ajax.status || ajax.status === 200) {
                  gComposedRequest = ENUMS.composedRequest.requestReturned;
                  var ads;
                  try {
                    ads = JSON.parse(ajax.responseText);
                  } catch(e) {
                    return adn.out.output(e, "ajax.onreadystatechange: catch block", wAdUnits[0].onError);
                  }
                  if (!ads.adUnits) {
                    return adn.out.output("No ad units defined in returned data", "composed", wAdUnits[0].onError);
                  }
                  if (ads.metaData) {
                    cookies.writeLs(ads.metaData);
                  }
                  adn.util.forEach(ads.adUnits, function(a) {
                    gComposedAds[a.targetId] = a;
                  });
                  gRequestInfo[requestId] = {
                    requestId: requestId,
                    duplicateFilter: misc.getParam(ads, 'duplicateFilter')
                  };
                  dom.distributeComposedAds(ads);
                  return;
                }
                return adn.out.output("Error status returned", "composed", ajax, wAdUnits[0].onError);
              });

              ajax.withCredentials = !misc.isTestAddress(impRequestLoc);
              var adUnitsSend = misc.gatherExclusions(wAdUnits);
              adUnitsSend.adUnits = sendAdUnits;

              misc.setAndReturnMetaData(adUnitsSend);

              if (adn.util.isArray(headerBids)) {
                adUnitsSend.headerBids = headerBids;
              }
              var duplicateFilter = misc.getParam(gRequestInfo[requestId], 'duplicateFilter');
              if (duplicateFilter) {
                adUnitsSend.duplicateFilter = duplicateFilter;
              }
              var consent = cookies.getConsent();
              if (consent.length > 0) {
                adUnitsSend.consent = consent;
              }

              ajax.send(JSON.stringify(adUnitsSend));
              gComposedRequest = ENUMS.composedRequest.requestMade;
            }

            if (unsentAdUnits.length > 0) {
              var composedFunc = function() {
                requestMethods.composed(unsentAdUnits, {requestId: requestId, adUnits: wAdUnits});
              };
              win.setTimeout(composedFunc, 203);
            }
          }
        };
      }());

      var displayMethods = (function() {
        var onElementFound = function(callback) {
          var element = adn.util.getFrameElement() || getWidgetEl();
          if (!element) {
            return;
          }
          callback(element);
        };

        return {
          style: function(args) {
            var styleElement = function(element) {
              misc.applyStyle(element, args.style);
            };
            onElementFound(styleElement);
          },
          resize: function(args) {
            var resizeElement = function(element) {
              if (adn.util.isDefined(args.width)) {
                element.style.width = adn.util.dimension(args.width);
              }
              if (adn.util.isDefined(args.height)) {
                element.style.height = adn.util.dimension(args.height);
              }
            };
            onElementFound(resizeElement);
          }
        };
      }());

      var init = function(args, methods, defaultMethod) {
        var method = args.method || defaultMethod;
        if (!methods[method]) {
          return adn.out.output("Matching method not found for " + method, "init");
        }
        return methods[method].call(this, args);
      };

      adn.clearLocalStorage = function() {
        cookies.clearLocalStorage();
      };

      adn.useLocalStorage = function(useLocalStorage) {
        gUseLocalStorage = useLocalStorage !== false;
      };

      adn.useCookies = function(useCookies) {
        gUseCookies = useCookies !== false;
      };

      adn.consent = function(args) {
        var theArgs = adn.util.isArray(args) ? {consent: args} : args;
        if (!theArgs.consent || (!adn.util.isString(theArgs.consent) && !adn.util.isArray(theArgs.consent))) {
          return adn.out.output("Not a valid network id or array object", "adn.regConsent", args);
        }
        cookies.writeConsent(adn.util.isArray(theArgs.consent) ? theArgs.consent : [theArgs.consent]);
      };

      adn.regTargets = function(args) {
        if (!adn.util.isString(args.network) || !adn.util.isArray(args.keyValues)) {
          return adn.out.output("Not a valid network id or array object", "adn.regTarget", args);
        }
        var verifiedTargets = [];
        adn.util.forEach(args.keyValues, function(entry) {
          if (adn.util.isString(entry.key) && adn.util.isString(entry.value)) {
            var entryCopy = {key: entry.key, value: entry.value};
            if (entry.expiry && adn.util.isInteger(entry.expiry)) {
              entryCopy.expiry = entry.expiry;
            }
            verifiedTargets.push(entryCopy);
          } else {
            adn.out.output("Missing an appropriate key and value for registering a target", "adn.regTarget", entry, args);
          }
        });
        if (verifiedTargets.length < 1) {
          return adn.out.output("Missing appropriate targets to register", "adn.regTarget", args);
        }
        var reqLoc = adn.lib.getRequestLocs(args).retargeting;
        if (!reqLoc) {
          return adn.out.output("Couldn't generate req url", "regTargets", reqLoc, args);
        }
        var ajax = adn.util.getNewAjax("POST", reqLoc, function() {
          if (ajax.readyState && ajax.readyState !== 4) {
            return false;
          }
          if (!ajax.status || ajax.status === 200) {
            return true;
          }
          var errorFamily = Math.floor(ajax.status / 100);
          if (errorFamily === 4) {
            return adn.out.output("400 error", "ajax.onreadystatechange in regTargets", ajax);
          }
          if (errorFamily === 5) {
            return adn.out.output("500 error", "ajax.onreadystatechange in regTargets", ajax);
          }
          return adn.out.output("Misc error", "ajax.onreadystatechange in regTargets", ajax);
        });
        ajax.open("POST", reqLoc);
        ajax.withCredentials = !misc.isTestAddress(reqLoc);
        ajax.send(JSON.stringify({network: args.network, keyValues: verifiedTargets}));
      };

      adn.renderComposedAds = function() {
        var getErrorWidgets = function() {
          return adn.util.filter(gComposedAds, function(ca) {
            return ca.errorStatus === ENUMS.errorStatus.noTarget;
          });
        };
        if (gComposedRequest !== ENUMS.composedRequest.requestReturned) {
          return -1;
        }
        var noTargetWidgets = getErrorWidgets();
        if (noTargetWidgets.length < 1) {
          return 0;
        }
        dom.distributeComposedAds(noTargetWidgets);
        return getErrorWidgets().length;
      };

      adn.contentWidget = function(args) {
        if (!args) {
          return adn.out.output("Insufficient args to make a content widget", "adn.contentWidget", args);
        }
        if (adn.util.isNotBlankString(args.auId)) {
          if (!adn.util.isArray(args.adPositions) || args.adPositions.length < 1) {
            return adn.out.output("Insufficient args to make a content widget -- if auId is specified, need adPositions array", "adn.contentWidget", args);
          }
          if (!args.widgetId && !adn.util.isNotBlankString(args.template)) {
            return adn.out.output("Insufficient args to make a content widget -- need a widget ID or a template if only an auId has been specified", "adn.contentWidget", args);
          }
        }
        if (!args.widgetId && !args.auId) {
          return adn.out.output("Insufficient args to make a content widget -- need a widgetId or an auId specified", "adn.contentWidget", args);
        }

        var renderWidget = function(contentData, adData) {
          var ads = (adData && adData.responseJSON && adData.responseJSON.adUnits.length > 0) ? adData.responseJSON.adUnits[0].ads : false;
          var html = '';
          var adTick = 0;
          var response = {};
          if (contentData) {
            try {
              response = JSON.parse(contentData);
            } catch(e) {
              adn.out.output("JSON parsing ajax content call failed", "contentWidget", e, args);
            }
          }
          response.template = args.template || response.template;

          var loopItems = [];
          if (adn.util.isArray(response.items)) {
            loopItems = response.items;
          } else if (adn.util.isArray(args.adPositions) && adn.util.isArray(ads)) {
            loopItems = args.adPositions.length > ads.length ? ads : args.adPositions;
          }
          adn.util.forEach(loopItems, function(item, index) {
            if (ads && ads[adTick]) {
              if (args.adPositions.indexOf(index) > -1) {
                item = {};
                var adAssets = ads[adTick].assets;
                var adTexts = ads[adTick].text;
                var adLabelText = args.adLabelText || 'Ad';
                item.ad_label = (args.adLabel) ? args.adLabel : '<div class="adLabel">' + adLabelText + '</div>';
                item.click_url = ads[adTick].urls ? ads[adTick].urls.destination : '';
                item.dominantimage = adAssets && adAssets.image ? adAssets.image.cdnId : '';
                item.title = adTexts && adTexts.title ? adTexts.title.content : '';
                item.description = adTexts && adTexts.description ? adTexts.description.content : '';
                adTick++;
              }
            }

            var output = response.template;
            var templateItem = output.match(/{{(\b\w*|\w*-\w*\b)}}/g);
            adn.util.forEach(templateItem, function(arg) {
              var argItem = arg.replace('{{', '').replace('}}', '');
              var re = new RegExp(arg, "g");
              if (item[argItem]) {
                output = output.replace(re, item[argItem]);
              } else {
                output = output.replace(re, '');
              }
            });
            html += output;
          });

          var targetId = args.targetId || 'adn-' + (args.widgetId ? args.widgetId : args.auId);
          var targetElement = doc.getElementById(targetId);
          if (!targetElement) {
            return adn.out.output("Couldn't find target targetElement", "adn.contentWidget", targetId, args);
          }
          targetElement.innerHTML = html;
        };

        var adnResponse,
          contentResponse;

        var renderWidgetCoordinator = function(data) {
          if (data.response) {
            contentResponse = data.response;
          } else {
            adnResponse = data;
          }
          if (args.auId && args.widgetId) {
            if (contentResponse && adnResponse) {
              return renderWidget(contentResponse, adnResponse);
            }
          } else if (args.auId && adnResponse) {
            return renderWidget(null, adnResponse);
          } else if (args.widgetId && contentResponse) {
            return renderWidget(contentResponse);
          }
        };

        if (args.auId) {
          adn.requestData({
            auId: args.auId,
            onSuccess: renderWidgetCoordinator
          });
        }
        if (!args.widgetId) {
          return;
        }
        var ajax = adn.util.getNewAjax("POST", "https://api.cxense.com/public/widget/data", function() {
          if (ajax.readyState && ajax.readyState !== 4) {
            return false;
          }
          if (!ajax.status || ajax.status === 200) {
            return renderWidgetCoordinator(ajax);
          }
          return adn.out.output("Poor response from cxense", "adn.contentWidget", ajax);
        });
        var cxWidgetData = {
          "widgetId": args.widgetId,
          "user": {"ids": {"usi": args.usi || cookies.get('cX_P')}},
          "context": {"url": args.url || win.location.href}
        };
        ajax.send(JSON.stringify(cxWidgetData));
      };

      adn.requestData = function(args) {
        if (!adn.util.isDefined(args.auId) && !adn.util.isArray(args.adUnits)) {
          return adn.out.output("Need an ad unit id or adUnits to make this work.", "adn.requestData", args);
        }
        var reqArgs = misc.assign({}, args);
        if (!adn.util.isFunction(reqArgs.onSuccess) && !adn.util.isFunction(reqArgs.onResponse)) {
          return adn.out.output("Need a callback function to make the call worthwhile", "adn.requestData", reqArgs, args);
        }
        reqArgs.onSuccess = adn.util.isFunction(reqArgs.onSuccess) ? reqArgs.onSuccess : adn.util.noop;
        reqArgs.onError = adn.util.isFunction(reqArgs.onError) ? reqArgs.onError : adn.util.noop;
        reqArgs.onResponse = adn.util.isFunction(reqArgs.onResponse) ? reqArgs.onResponse : adn.util.noop;

        var impRequestLoc = adn.lib.getRequestLocs(reqArgs, true).imp;
        var queryParams = {format: 'json'};

        var serverUrl,
          adUnits = [],
          userIdObj = {};
        if (reqArgs.auId && !adn.util.isArray(reqArgs.adUnits)) {
          adUnits = misc.gatherDataParams([reqArgs], null, null, args);
          userIdObj = reqArgs;
        } else {
          adUnits = misc.gatherDataParams(reqArgs.adUnits);
          userIdObj = adUnits[0];
        }
        serverUrl = misc.encodeUrlParams(impRequestLoc, queryParams, args);

        if (!serverUrl) {
          return adn.out.output("Couldn't generate server url", "requestData", serverUrl, args);
        }
        serverUrl += misc.encodeAsUrlParams(cookies.getIdsAsObj(userIdObj), true);
        var ajax = adn.util.getNewAjax("POST", serverUrl, function() {
          if (ajax.readyState && ajax.readyState !== 4) {
            return false;
          }
          var makeResponse = function(info, secondCallback) {
            var callbackArg = misc.assign(info, {
              responseCode: ajax.status,
              responseText: ajax.responseText
            });
            reqArgs.onResponse(callbackArg);

            var callback = secondCallback || reqArgs.onError;
            callback(callbackArg);
          };

          if (!ajax.status || ajax.status === 200) {
            try {
              var jsonData = JSON.parse(ajax.responseText);
              makeResponse({responseJSON: jsonData}, reqArgs.onSuccess);
              if (jsonData.metaData) {
                cookies.writeLs(jsonData.metaData);
              }
              return jsonData;
            } catch(e) {
              makeResponse({error: e, errorText: "Error with parsing the response text"});
              return adn.out.output("Parsing response text fail", "ajax.onreadystatechange: catch block", e);
            }
          }
          var errorFamily = Math.floor(ajax.status / 100);
          if (errorFamily === 4) {
            makeResponse({errorText: 'Likely error in request made'});
            return adn.out.output("400 error", "ajax.onreadystatechange", ajax);
          }
          if (errorFamily === 5) {
            makeResponse({errorText: 'Likely error in service'});
            return adn.out.output("500 error", "ajax.onreadystatechange", ajax);
          }
          makeResponse({errorText: 'Error'});
          return adn.out.output("Misc error", "ajax.onreadystatechange", ajax);
        });
        var adUnitsSend = misc.gatherExclusions(reqArgs);

        misc.setAndReturnMetaData(adUnitsSend);
        adUnitsSend.adUnits = adUnits;
        var consent = cookies.getConsent();
        if (consent.length > 0) {
          adUnitsSend.consent = consent;
        }
        ajax.send(JSON.stringify(adUnitsSend));
      };

      adn.regConversion = function(args) {
        if (!adn.util.isNotBlankString(args.network) || !adn.util.isNotBlankString(args.adSource) || !adn.util.isNotBlankString(args.eventType)) {
          return adn.out.output("Missing a value for network, adSource or eventType", "regConversion", args);
        }
        if (args.eventValue && !adn.util.isNumber(args.eventValue)) {
          return adn.out.output("The event value must be a number", "regConversion", args);
        }
        var convLocs = adn.lib.getRequestLocs(args).conversion;
        var ajax = adn.util.getNewAjax(misc.isTestAddress(convLocs) ? "GET" : "POST", convLocs, function() {
          if (ajax.readyState && ajax.readyState !== 4) {
            return false;
          }
          if (!ajax.status || ajax.status === 200) {
            var ajaxResponse;
            try {
              ajaxResponse = JSON.parse(ajax.responseText);
            } catch(e) {
              return adn.out.output(e, "ajax.onreadystatechange: catch block", ajax);
            }
            if (ajaxResponse.metaData) {
              cookies.writeLs(ajaxResponse.metaData);
            }
            return;
          }
          return adn.out.output("Error status returned", "composed", ajax);
        });

        ajax.withCredentials = true;
        var payload = misc.copyArgValues({}, args, ['network', 'adSource', 'eventType', 'eventValue']);
        misc.setAndReturnMetaData(payload);
        ajax.send(JSON.stringify(payload));
      };

      adn.chbRequest = function(adUnits, adnRequest, config) {
        if (!adn.util.isArray(adnRequest.adUnits)) {
          adn.out.output("Need to supply an array of Adnuntius ad units", "headerBid", adnRequest);
        }
        var adCodes = [];
        adn.util.forEach(adUnits, function(au) {
          if (adn.util.isString(au.code)) {
            adCodes.push(au.code);
          }
        });
        if (adCodes.length < 1) {
          adn.out.output("Missing required ad codes", "headerBid", adUnits);
        }

        var PREBID_TIMEOUT = 1000;
        var FAILSAFE_TIMEOUT = 3000;

        var pbjs = win.pbjs || {};
        pbjs.que = pbjs.que || [];

        pbjs.que.push(function() {
          if (config) {
            pbjs.setConfig(config);
          }

          pbjs.addAdUnits(adUnits);

          pbjs.requestBids({
            bidsBackHandler: initAdserver,
            timeout: PREBID_TIMEOUT
          });
        });

        function initAdserver() {
          if (pbjs.initAdserverSet) return;
          pbjs.initAdserverSet = true;

          adn.calls.push(function() {
            pbjs.que.push(function() {
              var resps = pbjs.getBidResponses();
              var isDebugMode = adn.util.isTrue(misc.getParam(config, 'debug'));
              if (isDebugMode) {
                adn.out.output("Raw bid responses from prebid", "headerBidRequest", resps);
              }
              adnRequest.headerBids = (adn.util.find(resps, function(resp, respId) {
                return !!adn.util.find(adCodes, function(ac) {
                  return ac === respId;
                });
              }) || {}).bids || [];

              if (isDebugMode) {
                adn.out.output("Header bids sent through to Adnuntius", "headerBidRequest", adnRequest.headerBids);
              }

              adn.request(adnRequest);
            });
          });
        }

        // in case PBJS doesn't load
        win.setTimeout(function() {
          initAdserver();
        }, FAILSAFE_TIMEOUT);
      };

      adn.request = function(args) {
        initMemberVariables(args);
        var method = ENUMS.methodEnums.ifr;
        if (adn.util.isArray(args.adUnits)) {
          method = ENUMS.methodEnums.composed;
        } else if (adn.util.isArray(args.creatives)) {
          method = ENUMS.methodEnums.preview;
        }
        init(args, requestMethods, method);
      };
      adn.display = function(args) {
        init(args, displayMethods, 'style');
      };
      adn.setFeedbackOptions = function(args) {
        ev.setFeedbackOptions(args);
      };
    })();

    (function() {
      if (!isDevScript) {
        var scriptOverride = misc.getScriptOverride();
        if (scriptOverride) {
          var scriptEl = doc.createElement('script');
          scriptEl.type = 'text/javascript';
          scriptEl.id = DEV_SCRIPT_ID;
          scriptEl.src = scriptOverride;
          doc.body.appendChild(scriptEl);
          return;
        }
      }
      pixel.regDestination();
      ev.registerListeners();
      ev.setFeedbackOptions();

      var executeCalls = function() {
        try {
          var call;
          while((call = adn.calls.shift())) {
            try {
              call();
            } catch(e) {
              adn.out.output(e, "executeCalls: inside while catch block", call, adn.calls);
            }
          }
        } catch(e) {
          adn.out.output(e, "executeCalls: outside while catch block", adn.calls);
        }
      };
      win.setTimeout(executeCalls, 25);

      adn.calls.push = function() {
        Array.prototype.push.apply(this, arguments);
        win.setTimeout(executeCalls, 1);
        return this.length;
      };
    })();
  })(adn, document, window);
} catch(e) {
  adn.out.output(e, "Blanket catch block");
}
