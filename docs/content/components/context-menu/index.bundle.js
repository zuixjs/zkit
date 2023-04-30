zuix.setComponentCache([{componentId:"/zkit/lib/1.2/components/context-menu",controller:function(){"use strict";let t={};return t.exports=function(n){let i,t,e,o=!0;function s(){o&&!i.isPlaying()&&(o=!1,e.show(),i.playTransition({onEnd:function(t,e){n.trigger("open")}}),i.css("bottom",0).get().focus(),t.css("opacity",1))}function r(){o||i.isPlaying()||(o=!0,i.playTransition({onEnd:function(){e.hide(),n.trigger("close")}}),t.css("opacity",0),i.css("bottom",-i.position().rect.height+"px"))}n.create=function(){(i=n.field("menu")).css("bottom",-i.position().rect.height+"px"),e=n.view().hide(),t=e.find(".menu-overlay"),e.find(".container").on({click:r,keydown:function(t){27===(t=t||window.event).keyCode&&r()}}),zuix.load("https://zuixjs.github.io/zkit/lib/1.1/controllers/gesture-helper",{view:e,on:{"gesture:pan":function(t,e){i.hasClass("no-transition")||i.addClass("no-transition"),0<e.shiftY&&i.css("bottom",-e.shiftY+"px")},"gesture:release":function(t,e){i.removeClass("no-transition"),e.velocity<=0&&"up"===e.direction?i.css("bottom",0):"down"===e.direction&&r()}}}),n.expose("show",s),n.expose("hide",r)}},t.exports}(),css:".menu-overlay {\n    position: fixed;\n    bottom:0;\n    left:0;\n    right: 0;\n    top: 0;\n    opacity: 0;\n    -ms-touch-action: none;\n    touch-action: none;\n    background: rgba(73,73,73,0.5);\n    z-index: 1001;\n    transition: opacity 0.4s ease-in;\n}\n.container {\n    position: fixed;\n    bottom:0;\n    left:0;\n    right: 0;\n    top: 0;\n    -ms-touch-action: none;\n    touch-action: none;\n    z-index: 1002;\n}\n.menu {\n    outline: none !important;\n    margin-left: auto;\n    margin-right: auto;\n    left: 50%;\n    transform: translateX(-50%);\n    position: absolute;\n    width: 100%;\n    max-width: 420px;\n    background: white;\n    border: solid 1px rgba(0,0,0,0.1);\n    border-radius: 16px 16px 0 0;\n    box-shadow: 0 -5px 5px -5px #333;\n    transition: bottom 0.3s ease-in-out;\n    transition-delay: 0.1s;\n}\nbutton {\n    width: 100%;\n    height:48px;\n    padding: 16px;\n    background: none;\n    border: none;\n}\nbutton span {\n    font-family: sans-serif, Helvetica;\n    font-size: 120%;\n    margin-left: 24px;\n}\nbutton i {\n    color: dimgray;\n    font-size: 24px;\n    margin-left: 8px;\n}\nbutton:hover {\n    background: rgba(0,0,0,0.1);\n}\n.no-transition {\n    transition: none;\n}\n",view:'<div class="menu-overlay"></div>\n<div class="container">\n    <div #menu="" class="menu" tabindex="0"></div>\n</div>\n'},{componentId:"/zkit/lib/1.2/controllers/header-auto-hide",controller:function(){"use strict";let t={};return t.exports=function(r){let a,e,l,c,u,p=0,d;function h(){null!=a&&a.hasClass("header-collapse")&&a.removeClass("header-collapse").addClass("header-expand"),null!=e&&e.hasClass("footer-collapse")&&e.removeClass("footer-collapse").addClass("footer-expand"),d&&d.check()}function f(){a.hasClass("header-collapse")||a.removeClass("header-expand").addClass("header-collapse"),null==e||e.hasClass("footer-collapse")||e.removeClass("footer-expand").addClass("footer-collapse")}r.init=function(){r.options().css=!1,r.options().html=!1},r.create=function(){l=r.options().showEnd,a=r.options().header;const n=r.options().zIndex||10;if(!a)throw new Error("Header element not specified.");if(0===(a=zuix.field(a)).length())throw new Error('Header element not found: "'+a+'".');const i=getComputedStyle(a.get());zuix.$.appendCss(`
/* Header bar shrink/expand */
@keyframes header-collapse-anim {
  from { top: 0; }
  to { top: var(--header-height); }
}
@keyframes header-expand-anim {
  from { top: var(--header-height); }
  to { top: 0; }
}
.header-collapse {
  animation-fill-mode: forwards;
  animation-name: header-collapse-anim;
  animation-duration: 0.5s;
  top: var(--header-height);
}
.header-expand {
  animation-fill-mode: forwards;
  animation-name: header-expand-anim;
  animation-duration: 0.5s;
  top: 0px;
}
`,null,"zkit_header_auto_hide");var t=r.options().footer;let o=null;null!=t&&((e=zuix.field(t)).css({position:"fixed",zIndex:n}),o=getComputedStyle(e.get()),zuix.$.appendCss(`
/* Footer bar shrink/expand */
@keyframes footer-collapse-anim {
  from { bottom: 0; }
  to { bottom: var(--footer-height); }
}
@keyframes footer-expand-anim {
  from { bottom: var(--footer-height); }
  to { bottom: 0; }
}
.footer-collapse {
  animation-fill-mode: forwards;
  animation-name: footer-collapse-anim;
  animation-duration: 0.5s;
  bottom: var(--footer-height);
}
.footer-expand {
  animation-fill-mode: forwards;
  animation-name: footer-expand-anim;
  animation-duration: 0.5s;
  bottom: 0;
}
`,null,"zkit_header_auto_hide"));const s=r.options().scrollHost||r.view();zuix.load("@lib/controllers/scroll-helper",{view:s,on:{"scroll:change":function(t,e){c=parseFloat(i.height),"fixed"!==i.position&&"absolute"!==i.position&&(p=c),document.documentElement.style.setProperty("--header-height",-c+"px"),o&&(u=parseFloat(o.height),document.documentElement.style.setProperty("--footer-height",-u+"px")),"scroll"===e.event&&e.info.viewport.y<-p?e.info.shift.y<-4?(0<p&&"fixed"!==a.css("position")&&(s.css({paddingTop:c+"px"}),a.hide().css({position:"fixed",zIndex:n})),f()):4<e.info.shift.y&&(a.show(),h()):"hit-bottom"===e.event&&l?(a.show(),h()):0<p&&0===e.info.viewport.y&&(s.css({paddingTop:null}),a.show().css({position:null,zIndex:null})),r.trigger("page:scroll",e)}},ready:function(t){d=t,r.expose("scroll",{get:function(){return d}}),r.trigger("scroll:ready",d)}}),r.expose("show",h),r.expose("hide",f)}},t.exports}()},{componentId:"/zkit/lib/1.2/controllers/scroll-helper",controller:function(){"use strict";let t={};function i(n,i){let o=void 0,s=void 0;return function(){const t=this,e=arguments;s?(clearTimeout(o),o=setTimeout(function(){Date.now()-s>=i&&(n.apply(t,e),s=Date.now())},i-(Date.now()-s))):(n.apply(t,e),s=Date.now())}}return t.exports=function(){const s={timestamp:0,size:{width:0,height:0},viewport:{x:0,y:0,width:0,height:0}};let e,n,o,r=0,a;const l=this;function c(){null!=e&&clearTimeout(e);var t=(new Date).getTime();if(100<t-s.timestamp?u():e=setTimeout(function(){u()},99),!(t<r&&t-a<66)){a=t;const i="scroll-helper-visible";null!=n&&null!=o&&n.each(function(t,e){const n=this.position();if(!n.visible&&this.hasClass(i))this.removeClass(i),n.event="exit";else if(n.visible){if(!n.visible)return;this.hasClass(i)?n.event="scroll":(n.event="enter",this.addClass(i))}else n.event="off-scroll";o(this,n)})}}function u(){const t=l.view().get();var e=t.getBoundingClientRect();const n={top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.width,height:e.height,x:e.x,y:e.y};n.y=-l.view().get().scrollTop||n.y||0,n.height=l.view().get().scrollHeight||n.height||0,s.size.width=n.width,s.size.height=n.height,t===document.body?(s.size.width=document.body.offsetWidth,s.size.height=document.body.offsetHeight,s.viewport.width=document.documentElement.clientWidth||s.size.width,s.viewport.height=document.documentElement.clientHeight||s.size.height):(s.viewport.width=t.offsetWidth,s.viewport.height=t.offsetHeight),s.timestamp=(new Date).getTime(),s.shift={x:n.x-s.viewport.x,y:n.y-s.viewport.y},s.viewport.x=n.x,s.viewport.y=n.y,0==s.size.height+n.y-s.viewport.height||0===n.y?l.trigger("scroll:change",{event:0===n.y?"hit-top":"hit-bottom",info:s}):l.trigger("scroll:change",{event:"scroll",info:s})}function p(t,e){if((t instanceof Element||t instanceof zuix.$.ZxQuery)&&(t=zuix.$(t).position().y-s.viewport.y),-1===e)return d(t);var n=Date.now(),n=(e=(r=null!=e?n+e:r)-n,l.view().get());let i=0;i=n===document.body?void 0!==window.pageYOffset?window.pageYOffset:(document.documentElement||document.body.parentNode||document.body).scrollTop:n.scrollTop;n=t-i;if(e<=0||0==n)return d(t),void c();const o=i+n/e*33;requestAnimationFrame(function(){d(o),p(t)})}function d(t){const e=l.view().get();e===document.body?(document.documentElement.scrollTop=t,document.body.scrollTop=t):e.scrollTop=t}l.init=function(){l.options().html=!1,l.options().css=!1},l.create=function(){l.view().get()===document.body?0<l.options().throttle?window.onscroll=i(c,l.options().throttle):window.onscroll=c:0<l.options().throttle?l.view().on("scroll",{handler:i(c,l.options().throttle),passive:!0}):l.view().on("scroll",{handler:c,passive:!0});l.expose("watch",function(t,e){return t=t,e=e,o=null!=t?(n=l.view(t),e):n=null,l.context}),l.expose("scrollStart",function(t){return p(0,t=null==t?-1:t),l.context}).expose("scrollEnd",function(t){return null==t&&(t=-1),p(s.size.height,t),l.context}).expose("scrollTo",function(t,e){return p(t,e=null==e?-1:e),l.context}).expose("info",function(){return s}).expose("check",c)}},t.exports}()},{componentId:"/zkit/lib/1.2/controllers/mdl-button",controller:function(){"use strict";let t={};return t.exports=function(){this.init=()=>{var t=this.options().theme||"indigo-pink";this.view().parent().get().mode&&(this.options().fetchOptions={priority:"low"},MaterialButton||this.using("script","@cdnjs/material-design-lite/1.3.0/material.min.js"),this.using("style","@cdnjs/material-design-lite/1.3.0/material."+t+".min.css"),this.using("style","https://fonts.googleapis.com/icon?family=Material+Icons&display=swap"))},this.create=()=>{const e=this.view(),t=this.options();var n=t.type||"raised";if(e.addClass("mdl-button mdl-js-button mdl-button--"+n+" mdl-js-ripple-effect"),t.class){const i=t.class.split(" ");i.forEach(t=>{e.addClass("mdl-button--"+t)})}"fab"===n&&-1===e.html().indexOf("material-icons")&&(n=e.get().textContent,e.html(`<i class="material-icons">${n}</i>`)),n=e,zuix.activeRefresh(n,n,null,(t,e,n,i)=>{window.componentHandler?componentHandler.upgradeElements(t.get()):i(n,33,!0)}).start()}},t.exports}()},{componentId:"https://zuixjs.github.io/zkit/lib/1.1/controllers/gesture-helper",controller:function(){"use strict";let t={};return t.exports=function(){const n=0,o=1,s=2,i=750;let r=n,a,l=!1,c=!0,u=-1,p,d,h,f=!1,m=(new Date).getTime();Math.sign=Math.sign||function(t){return(0<t)-(t<0)||+t};const g=this;function x(t,e,n){var i=(new Date).getTime();a={event:t,cancel:function(){a.event.cancelBubble=!0,c||a.event.preventDefault()},startX:e,startY:n,startTime:i,shiftX:0,shiftY:0,endTime:0,stepX:0,stepY:0,stepTime:i,velocity:0,x:e,y:n,scrollIntent:function(){switch(r){case o:return"horizontal";case s:return"vertical"}return!1}},h=function(i){let o;function t(){i.stepTime=i.endTime,i.stepX=i.shiftX,i.stepY=i.shiftY,i.stepSpeed=0,i.stepDistance=0}function s(){o=i.direction,r.time=(new Date).getTime(),r.x=i.x,r.y=i.y,i.velocity=0,i.distance=0,t()}const r={time:0,x:0,y:0},a={time:0,x:0,y:0};return s(),{update:function(){var t,e,n;a.time=(new Date).getTime(),a.x=i.x,a.y=i.y,null!=o&&o!==i.direction?s():(null==o&&i.direction!==o&&(o=i.direction),t=a.time-r.time,e={x:a.x-r.x,y:a.y-r.y},n=Math.sqrt(e.x*e.x+e.y*e.y),n=(i.distance=n)/t,i.velocity="left"===i.direction||"up"===i.direction?-n:n,i.stepTime=i.endTime-i.stepTime,e={x:i.shiftX-i.stepX,y:i.shiftY-i.stepY},i.stepDistance=Math.sqrt(e.x*e.x+e.y*e.y),i.stepSpeed=i.stepDistance/i.stepTime)},step:t}}(a),g.trigger("gesture:touch",a)}function e(t,e,n){null!=a&&(a.event=t,a.x=e,a.y=n,a.shiftX=e-a.startX,a.shiftY=n-a.startY,a.endTime=(new Date).getTime(),null!=(t=v())&&!1!==p&&(d=null!=d&&d!==a.direction?(p=!1,"cancel"):(p=t,a.direction)),g.trigger("gesture:pan",a))}function w(t){null!=a&&(h.update(),a.event=t,null!=(p=null==p?v():p)&&!1!==p&&g.trigger(p,a)),g.trigger("gesture:release",a),r=n,d=null,p=null,a=null}function v(){let t=null;h.update();var e=180*Math.atan2(a.shiftY-a.stepY,a.shiftX-a.stepX)/Math.PI;return 0===a.shiftX&&0===a.shiftY&&a.startTime>m+100&&a.stepTime<i?(m=(new Date).getTime(),t="gesture:tap"):(r===n||r===o)&&2<a.stepDistance&&(135<=e&&e<=180||-180<=e&&e<=-135)?(a.direction="left",t="gesture:swipe",r=o):(r===n||r===o)&&2<a.stepDistance&&(0<=e&&e<=45||-45<=e&&e<0)?(a.direction="right",t="gesture:swipe",r=o):(r===n||r===s)&&2<a.stepDistance&&45<e&&e<135?(a.direction="down",t="gesture:swipe",r=s):(r===n||r===s)&&2<a.stepDistance&&-135<e&&e<-45&&(a.direction="up",t="gesture:swipe",r=s),2<a.stepDistance&&h.step(),t}g.init=function(){const t=g.view(),e=g.options();e.html=!1,e.css=!1,c=!1!==e.passive&&"false"!==t.attr("data-o-passive"),u=e.startGap||t.attr("data-o-startgap")},g.create=function(){const t=c?zuix.$(window):g.view();t.on("dragstart",{handler:function(t){l||c||t.preventDefault()},passive:c}).on("mousedown",{handler:function(t){const e=zuix.$(t.target);1===t.which&&0===e.parent('[class*="no-gesture"]').length()&&t.x>u?(f=!0,l=!1,e.get().draggable=!1,x(t,t.x,t.y)):l=!0},passive:c}).on("mousemove",{handler:function(t){!l&&f&&e(t,t.x,t.y)},passive:c}).on("mouseup",function(t){1!==t.which||l||(f=!1,w(t))}).on("touchstart",{handler:function(t){const e=zuix.$(t.target);0===e.parent('[class*="no-gesture"]').length()&&t.touches[0].clientX>u?(l=!1,e.get().draggable=!1,x(t,t.touches[0].clientX,t.touches[0].clientY)):l=!0},passive:c}).on("touchmove",{handler:function(t){l||e(t,t.touches[0].clientX,t.touches[0].clientY)},passive:c}).on("touchend",function(t){l||w(t)})}},t.exports}()},{componentId:"/zkit/lib/1.2/controllers/drawer-layout",controller:function(){"use strict";let t={};return t.exports=function(){let i=!0,o=!1,e=!1,s=!1,r=!0,a=null,l=null,c=null,u=280,t=960,p=!1,d=0;const h=this;function f(){l.visibility("initial").css("left",0).get().focus(),e&&(l.find("a").one("click",function(){m()}),a.css("opacity","initial"),a.show()),i||(i=!0,h.trigger("drawer:open",{smallScreen:e}))}function m(){var t;e&&(t=function(){i||l.visibility("hidden")},l.one("transitionend transitioncancel",function(){t()}),l.css("left",-u+"px"),a.hide(),i&&(i=!1,h.trigger("drawer:close",{smallScreen:e}))),i=!1,l.find("a").off("click")}function g(){return i}function x(){(window.innerWidth||document.body.clientWidth)<t||-1===t||p?(e&&!r||(e=!0,o=!1,n()),m()):(e||r)&&(e&&(a.hide(),i&&m()),e=!1,o=!0,n(),f())}function n(){var t;r||w(),c&&(t=parseFloat(getComputedStyle(c.get(),null).getPropertyValue("padding-left")),e?c.css({paddingLeft:t-u+"px"}):c.css({paddingLeft:u+t+"px"})),h.trigger("layout:change",{smallScreen:e,drawerLocked:o})}function w(){var t;s||(s=!0,t="ease .15s",l.css({"transition-property":"left",transition:t}),a.css({"transition-property":"opacity",transition:t}))}h.init=function(){this.options().html=!1,this.options().css=!1,isNaN(this.options().drawerWidth)||(u=parseInt(this.options().drawerWidth));isNaN(this.options().autoHideWidth)||(t=parseInt(this.options().autoHideWidth))},h.create=function(){l=h.view(),c=h.options().mainContent,(a=zuix.$(document.createElement("div"))).css({position:"fixed",top:0,left:0,bottom:0,right:0,"z-index":100,"background-color":"rgba(0, 0, 0, 0.5)"}).on("click",function(){o||m()}).hide(),l.parent().append(a.get()),l.css({position:"fixed","overflow-y":"auto",left:0,width:u+"px",top:0,bottom:0,"z-index":101,"-webkit-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","-moz-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)"}).attr("tabindex",0);let n=!1;zuix.load("@lib/controllers/gesture-helper",{view:document.documentElement,on:{"gesture:touch":function(t,e){o||(w(),d=i&&e.startX<u?u-e.startX:0)},"gesture:release":function(t,e){o||n&&(n=!1,w(),(0<e.velocity?f:m)())},"gesture:pan":function(t,e){if(!o&&"horizontal"===e.scrollIntent()&&((n||i)&&e.x<u||!n&&e.x<50)){n=n||!0,w();{let t=e.x;0<t&&t<=u-d&&(t=-u+t+d,"hidden"===l.visibility()&&l.visibility("initial"),l.css("left",t+"px"),"none"===a.display()&&a.show(),a.css("opacity",(u+t)/u))}s&&(s=!1,l.css({transition:"none"}),a.css({transition:"none"}))}}}}),h.expose("toggle",function(){w(),(i?m:f)()}),h.expose("open",function(){w(),f()}),h.expose("close",function(){w(),m()}),h.expose("isOpen",g),h.expose("lock",function(t){if(null==t)return o;o=t}),h.expose("float",function(t){if(null==t)return p;p=t,x()}),l.on("keydown",function(t){27===(t=t||window.event).keyCode&&m()}),x(),r=!1,window.addEventListener("resize",function(){x()})}},t.exports}()},{componentId:"/zkit/lib/1.2/controllers/gesture-helper",controller:function(){"use strict";let t={};return t.exports=function(){const n=0,o=1,s=2,i=750;let r=n,a,l=!1,c=!0,u=-1,p,d,h,f=!1,m=(new Date).getTime();Math.sign=Math.sign||function(t){return(0<t)-(t<0)||+t};const g=this;function x(t,e,n){var i=(new Date).getTime();a={event:t,cancel:function(){a.event.cancelBubble=!0,c||a.event.preventDefault()},startX:e,startY:n,startTime:i,shiftX:0,shiftY:0,endTime:0,stepX:0,stepY:0,stepTime:i,velocity:0,x:e,y:n,scrollIntent:function(){switch(r){case o:return"horizontal";case s:return"vertical"}return!1}},h=function(i){let o;function t(){i.stepTime=i.endTime,i.stepX=i.shiftX,i.stepY=i.shiftY,i.stepSpeed=0,i.stepDistance=0}function s(){o=i.direction,r.time=(new Date).getTime(),r.x=i.x,r.y=i.y,i.velocity=0,i.distance=0,t()}const r={time:0,x:0,y:0},a={time:0,x:0,y:0};return s(),{update:function(){var t,e,n;a.time=(new Date).getTime(),a.x=i.x,a.y=i.y,null!=o&&o!==i.direction?s():(null==o&&i.direction!==o&&(o=i.direction),t=a.time-r.time,e={x:a.x-r.x,y:a.y-r.y},n=Math.sqrt(e.x*e.x+e.y*e.y),n=(i.distance=n)/t,i.velocity="left"===i.direction||"up"===i.direction?-n:n,i.stepTime=i.endTime-i.stepTime,e={x:i.shiftX-i.stepX,y:i.shiftY-i.stepY},i.stepDistance=Math.sqrt(e.x*e.x+e.y*e.y),i.stepSpeed=i.stepDistance/i.stepTime)},step:t}}(a),g.trigger("gesture:touch",a)}function e(t,e,n){null!=a&&(a.event=t,a.x=e,a.y=n,a.shiftX=e-a.startX,a.shiftY=n-a.startY,a.endTime=(new Date).getTime(),null!=(t=v())&&!1!==p&&(d=null!=d&&d!==a.direction?(p=!1,"cancel"):(p=t,a.direction)),g.trigger("gesture:pan",a))}function w(t){null!=a&&(h.update(),a.event=t,null!=(p=null==p?v():p)&&!1!==p&&g.trigger(p,a)),g.trigger("gesture:release",a),r=n,d=null,p=null,a=null}function v(){let t=null;h.update();var e=180*Math.atan2(a.shiftY-a.stepY,a.shiftX-a.stepX)/Math.PI;return 0===a.shiftX&&0===a.shiftY&&a.startTime>m+100&&a.stepTime<i?(m=(new Date).getTime(),t="gesture:tap"):(r===n||r===o)&&2<a.stepDistance&&(135<=e&&e<=180||-180<=e&&e<=-135)?(a.direction="left",t="gesture:swipe",r=o):(r===n||r===o)&&2<a.stepDistance&&(0<=e&&e<=45||-45<=e&&e<0)?(a.direction="right",t="gesture:swipe",r=o):(r===n||r===s)&&2<a.stepDistance&&45<e&&e<135?(a.direction="down",t="gesture:swipe",r=s):(r===n||r===s)&&2<a.stepDistance&&-135<e&&e<-45&&(a.direction="up",t="gesture:swipe",r=s),2<a.stepDistance&&h.step(),t}g.init=function(){const t=g.options();t.html=!1,t.css=!1,c=!1!==t.passive&&c,u=t.startGap||u},g.create=function(){const t=c?zuix.$(window):g.view();t.on("dragstart",{handler:function(t){l||c||t.preventDefault()},passive:c}).on("mousedown",{handler:function(t){const e=zuix.$(t.target);!(l=-1===document.elementsFromPoint(t.x,t.y).indexOf(g.view().get()))&&1===t.which&&0===e.parent('[class*="no-gesture"]').length()&&t.x>u?(f=!0,l=!1,e.get().draggable=!1,x(t,t.x,t.y)):l=!0},passive:c}).on("mousemove",{handler:function(t){!l&&f&&e(t,t.x,t.y)},passive:c}).on("mouseup",function(t){1!==t.which||l||(f=!1,w(t))}).on("touchstart",{handler:function(t){const e=zuix.$(t.target);!(l=-1===document.elementsFromPoint(t.touches[0].clientX,t.touches[0].clientY).indexOf(g.view().get()))&&0===e.parent('[class*="no-gesture"]').length()&&t.touches[0].clientX>u?(l=!1,e.get().draggable=!1,x(t,t.touches[0].clientX,t.touches[0].clientY)):l=!0},passive:c}).on("touchmove",{handler:function(t){l||e(t,t.touches[0].clientX,t.touches[0].clientY)},passive:c}).on("touchend",function(t){l||w(t)})}},t.exports}()}]);