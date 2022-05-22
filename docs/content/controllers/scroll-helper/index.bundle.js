zuix.setComponentCache([{componentId:"/zkit/lib/1.1/controllers/header-auto-hide",controller:function(){"use strict";let t={};return t.exports=function(i){let s,e,r,a,l,c=0,p;function d(){null!=s&&s.hasClass("header-collapse")&&s.removeClass("header-collapse").addClass("header-expand"),null!=e&&e.hasClass("footer-collapse")&&e.removeClass("footer-collapse").addClass("footer-expand"),p&&p.check()}function u(){s.hasClass("header-collapse")||s.removeClass("header-expand").addClass("header-collapse"),null==e||e.hasClass("footer-collapse")||e.removeClass("footer-expand").addClass("footer-collapse")}i.init=function(){i.options().css=!1,i.options().html=!1},i.create=function(){r=i.options().showEnd||"true"===i.view().attr("data-o-show-end"),s=i.options().header||i.view().attr("data-o-header");const n=i.options().zIndex||10;if(!s)throw new Error("Header element not specified.");if(0===(s=zuix.field(s)).length())throw new Error('Header element not found: "'+s+'".');a=s.position().rect.height;var t=getComputedStyle(s.get()).position;"fixed"!==t&&"absolute"!==t&&(c=a);const o=i.view();zuix.$.appendCss("\n/* Header bar shrink/expand */\n@keyframes header-collapse-anim {\n  from { top: 0; }\n  to { top: -"+a+"px; }\n}\n@keyframes header-expand-anim {\n  from { top: -"+a+"px; }\n  to { top: 0; }\n}\n.header-collapse {\n  animation-fill-mode: forwards;\n  animation-name: header-collapse-anim;\n  animation-duration: 0.5s;\n  top: -"+a+"px;\n}\n.header-expand {\n  animation-fill-mode: forwards;\n  animation-name: header-expand-anim;\n  animation-duration: 0.5s;\n  top: 0px;\n}\n",null,"onscroll_header_hide_show");t=i.options().footer||i.view().attr("data-o-footer");null!=t&&((e=zuix.field(t)).css({position:"fixed",zIndex:n}),l=e.position().rect.height,zuix.$.appendCss("\n/* Footer bar shrink/expand */\n@keyframes footer-collapse-anim {\n  from { bottom: 0; }\n  to { bottom: -"+l+"px; }\n}\n@keyframes footer-expand-anim {\n  from { bottom: -"+l+"px; }\n  to { bottom: 0; }\n}\n.footer-collapse {\n  animation-fill-mode: forwards;\n  animation-name: footer-collapse-anim;\n  animation-duration: 0.5s;\n  bottom: -"+l+"px;\n}\n.footer-expand {\n  animation-fill-mode: forwards;\n  animation-name: footer-expand-anim;\n  animation-duration: 0.5s;\n  bottom: 0;\n}\n",null,"zkit_onscroll_hide_show")),zuix.load("@lib/controllers/scroll-helper",{view:o,on:{"scroll:change":function(t,e){"scroll"===e.event&&e.info.viewport.y<-c?e.info.shift.y<-4?(0<c&&"fixed"!==s.css("position")&&(o.css({paddingTop:a+"px"}),s.hide().css({position:"fixed",zIndex:n})),u()):4<e.info.shift.y&&(s.show(),d()):"hit-bottom"===e.event&&r?(s.show(),d()):0<c&&0===e.info.viewport.y&&(o.css({paddingTop:null}),s.show().css({position:null,zIndex:null})),i.trigger("page:scroll",e)}},ready:function(t){p=t,i.expose("scroll",{get:function(){return p}}),i.trigger("scroll:ready",p)}}),i.expose("show",d),i.expose("hide",u)}},t.exports}()},{componentId:"/zkit/lib/1.1/controllers/scroll-helper",controller:function(){"use strict";let t={};function o(n,o){let i=void 0,s=void 0;return function(){const t=this,e=arguments;s?(clearTimeout(i),i=setTimeout(function(){Date.now()-s>=o&&(n.apply(t,e),s=Date.now())},o-(Date.now()-s))):(n.apply(t,e),s=Date.now())}}return t.exports=function(){const s={timestamp:0,size:{width:0,height:0},viewport:{x:0,y:0,width:0,height:0}};let e,n,i,r=0,a;const l=this;function c(){null!=e&&clearTimeout(e);var t=(new Date).getTime();if(100<t-s.timestamp?p():e=setTimeout(function(){p()},99),!(t<r&&t-a<66)){a=t;const o="scroll-helper-visible";null!=n&&null!=i&&n.each(function(t,e){const n=this.position();if(!n.visible&&this.hasClass(o))this.removeClass(o),n.event="exit";else if(n.visible){if(!n.visible)return;this.hasClass(o)?n.event="scroll":(n.event="enter",this.addClass(o))}else n.event="off-scroll";i(this,n)})}}function p(){const t=l.view().get();var e=t.getBoundingClientRect();const n={top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.width,height:e.height,x:e.x,y:e.y};n.y=-l.view().get().scrollTop||n.y||0,n.height=l.view().get().scrollHeight||n.height||0,s.size.width=n.width,s.size.height=n.height,t===document.body?(s.size.width=document.body.offsetWidth,s.size.height=document.body.offsetHeight,s.viewport.width=document.documentElement.clientWidth||s.size.width,s.viewport.height=document.documentElement.clientHeight||s.size.height):(s.viewport.width=t.offsetWidth,s.viewport.height=t.offsetHeight),s.timestamp=(new Date).getTime(),s.shift={x:n.x-s.viewport.x,y:n.y-s.viewport.y},s.viewport.x=n.x,s.viewport.y=n.y,0==s.size.height+n.y-s.viewport.height||0===n.y?l.trigger("scroll:change",{event:0===n.y?"hit-top":"hit-bottom",info:s}):l.trigger("scroll:change",{event:"scroll",info:s})}function d(t,e){if((t instanceof Element||t instanceof zuix.$.ZxQuery)&&(t=zuix.$(t).position().y-s.viewport.y),-1===e)return u(t);var n=Date.now(),n=(e=(r=null!=e?n+e:r)-n,l.view().get());let o=0;o=n===document.body?void 0!==window.pageYOffset?window.pageYOffset:(document.documentElement||document.body.parentNode||document.body).scrollTop:n.scrollTop;n=t-o;if(e<=0||0==n)return u(t),void c();const i=o+n/e*33;requestAnimationFrame(function(){u(i),d(t)})}function u(t){const e=l.view().get();e===document.body?(document.documentElement.scrollTop=t,document.body.scrollTop=t):e.scrollTop=t}l.init=function(){l.options().html=!1,l.options().css=!1},l.create=function(){l.view().get()===document.body?0<l.options().throttle?window.onscroll=o(c,l.options().throttle):window.onscroll=c:0<l.options().throttle?l.view().on("scroll",{handler:o(c,l.options().throttle),passive:!0}):l.view().on("scroll",{handler:c,passive:!0});l.expose("watch",function(t,e){return t=t,e=e,i=null!=t?(n=l.view(t),e):n=null,l.context}),l.expose("scrollStart",function(t){return d(0,t=null==t?-1:t),l.context}).expose("scrollEnd",function(t){return null==t&&(t=-1),d(s.size.height,t),l.context}).expose("scrollTo",function(t,e){return d(t,e=null==e?-1:e),l.context}).expose("info",function(){return s}).expose("check",c)}},t.exports}()},{componentId:"/zkit/lib/1.1/controllers/drawer-layout",controller:function(){"use strict";let t={};return t.exports=function(){let o=!0,i=!1,e=!1,s=!1,r=!0,a=null,l=null,c=null,p=280,n=960,d=!1,u=0;const h=this;function f(){l.visibility("initial").css("left",0).get().focus(),e&&(l.find("a").one("click",function(){m()}),a.css("opacity","initial"),a.show()),o||(o=!0,h.trigger("drawer:open",{smallScreen:e}))}function m(){var t;e&&(t=function(){o||l.visibility("hidden")},l.one("transitionend transitioncancel",function(){t()}),l.css("left",-p+"px"),a.hide(),o&&(o=!1,h.trigger("drawer:close",{smallScreen:e}))),o=!1,l.find("a").off("click")}function t(){return o}function x(){(window.innerWidth||document.body.clientWidth)<n||-1===n||d?(e&&!r||(e=!0,i=!1,g()),m()):(e||r)&&(e&&(a.hide(),o&&m()),e=!1,i=!0,g(),f())}function g(){var t;r||w(),c&&(t=parseFloat(getComputedStyle(c.get(),null).getPropertyValue("padding-left")),e?c.css({paddingLeft:t-p+"px"}):c.css({paddingLeft:p+t+"px"})),h.trigger("layout:change",{smallScreen:e,drawerLocked:i})}function w(){var t;s||(s=!0,t="ease .15s",l.css({"transition-property":"left",transition:t}),a.css({"transition-property":"opacity",transition:t}))}h.init=function(){const t=h.view();this.options().html=!1,this.options().css=!1,isNaN(this.options().drawerWidth)?(e=parseInt(t.attr("data-o-width")),isNaN(e)||(p=e)):p=parseInt(this.options().drawerWidth);{var e;isNaN(this.options().autoHideWidth)?(e=parseInt(t.attr("data-o-hide-width")),isNaN(e)||(n=e)):n=parseInt(this.options().autoHideWidth)}},h.create=function(){l=h.view(),c=h.options().mainContent,(a=zuix.$(document.createElement("div"))).css({position:"fixed",top:0,left:0,bottom:0,right:0,"z-index":100,"background-color":"rgba(0, 0, 0, 0.5)"}).on("click",function(){i||m()}).hide(),l.parent().append(a.get()),l.css({position:"fixed","overflow-y":"auto",left:0,width:p+"px",top:0,bottom:0,"z-index":101,"-webkit-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","-moz-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)"}).attr("tabindex",0);let n=!1;zuix.load("@lib/controllers/gesture-helper",{view:document.documentElement,on:{"gesture:touch":function(t,e){i||(w(),u=o&&e.startX<p?p-e.startX:0)},"gesture:release":function(t,e){i||n&&(n=!1,w(),(0<e.velocity?f:m)())},"gesture:pan":function(t,e){if(!i&&"horizontal"===e.scrollIntent()&&((n||o)&&e.x<p||!n&&e.x<50)){n=n||!0,w();{let t=e.x;0<t&&t<=p-u&&(t=-p+t+u,"hidden"===l.visibility()&&l.visibility("initial"),l.css("left",t+"px"),"none"===a.display()&&a.show(),a.css("opacity",(p+t)/p))}s&&(s=!1,l.css({transition:"none"}),a.css({transition:"none"}))}}}}),h.expose("toggle",function(){w(),(o?m:f)()}),h.expose("open",function(){w(),f()}),h.expose("close",function(){w(),m()}),h.expose("isOpen",t),h.expose("lock",function(t){if(null==t)return i;i=t}),h.expose("float",function(t){if(null==t)return d;d=t,x()}),l.on("keydown",function(t){27===(t=t||window.event).keyCode&&m()}),x(),r=!1,window.addEventListener("resize",function(){x()})}},t.exports}()},{componentId:"/zkit/lib/1.1/controllers/gesture-helper",controller:function(){"use strict";let t={};return t.exports=function(){const n=0,i=1,s=2,o=750;let r=n,a,l=!1,c=!0,p=-1,d,u,h,f=!1,m=(new Date).getTime();Math.sign=Math.sign||function(t){return(0<t)-(t<0)||+t};const x=this;function g(t,e,n){var o=(new Date).getTime();a={event:t,cancel:function(){a.event.cancelBubble=!0,c||a.event.preventDefault()},startX:e,startY:n,startTime:o,shiftX:0,shiftY:0,endTime:0,stepX:0,stepY:0,stepTime:o,velocity:0,x:e,y:n,scrollIntent:function(){switch(r){case i:return"horizontal";case s:return"vertical"}return!1}},h=function(o){let i;function t(){o.stepTime=o.endTime,o.stepX=o.shiftX,o.stepY=o.shiftY,o.stepSpeed=0,o.stepDistance=0}function s(){i=o.direction,r.time=(new Date).getTime(),r.x=o.x,r.y=o.y,o.velocity=0,o.distance=0,t()}const r={time:0,x:0,y:0},a={time:0,x:0,y:0};return s(),{update:function(){var t,e,n;a.time=(new Date).getTime(),a.x=o.x,a.y=o.y,null!=i&&i!==o.direction?s():(null==i&&o.direction!==i&&(i=o.direction),t=a.time-r.time,e={x:a.x-r.x,y:a.y-r.y},n=Math.sqrt(e.x*e.x+e.y*e.y),n=(o.distance=n)/t,o.velocity="left"===o.direction||"up"===o.direction?-n:n,o.stepTime=o.endTime-o.stepTime,e={x:o.shiftX-o.stepX,y:o.shiftY-o.stepY},o.stepDistance=Math.sqrt(e.x*e.x+e.y*e.y),o.stepSpeed=o.stepDistance/o.stepTime)},step:t}}(a),x.trigger("gesture:touch",a)}function e(t,e,n){null!=a&&(a.event=t,a.x=e,a.y=n,a.shiftX=e-a.startX,a.shiftY=n-a.startY,a.endTime=(new Date).getTime(),null!=(t=v())&&!1!==d&&(u=null!=u&&u!==a.direction?(d=!1,"cancel"):(d=t,a.direction)),x.trigger("gesture:pan",a))}function w(t){null!=a&&(h.update(),a.event=t,null!=(d=null==d?v():d)&&!1!==d&&x.trigger(d,a)),x.trigger("gesture:release",a),r=n,u=null,d=null,a=null}function v(){let t=null;h.update();var e=180*Math.atan2(a.shiftY-a.stepY,a.shiftX-a.stepX)/Math.PI;return 0===a.shiftX&&0===a.shiftY&&a.startTime>m+100&&a.stepTime<o?(m=(new Date).getTime(),t="gesture:tap"):(r===n||r===i)&&2<a.stepDistance&&(135<=e&&e<=180||-180<=e&&e<=-135)?(a.direction="left",t="gesture:swipe",r=i):(r===n||r===i)&&2<a.stepDistance&&(0<=e&&e<=45||-45<=e&&e<0)?(a.direction="right",t="gesture:swipe",r=i):(r===n||r===s)&&2<a.stepDistance&&45<e&&e<135?(a.direction="down",t="gesture:swipe",r=s):(r===n||r===s)&&2<a.stepDistance&&-135<e&&e<-45&&(a.direction="up",t="gesture:swipe",r=s),2<a.stepDistance&&h.step(),t}x.init=function(){const t=x.view(),e=x.options();e.html=!1,e.css=!1,c=!1!==e.passive&&"false"!==t.attr("data-o-passive"),p=e.startGap||t.attr("data-o-startgap")},x.create=function(){const t=c?zuix.$(window):x.view();t.on("dragstart",{handler:function(t){l||c||t.preventDefault()},passive:c}).on("mousedown",{handler:function(t){const e=zuix.$(t.target);1===t.which&&0===e.parent('[class*="no-gesture"]').length()&&t.x>p?(f=!0,l=!1,e.get().draggable=!1,g(t,t.x,t.y)):l=!0},passive:c}).on("mousemove",{handler:function(t){!l&&f&&e(t,t.x,t.y)},passive:c}).on("mouseup",function(t){1!==t.which||l||(f=!1,w(t))}).on("touchstart",{handler:function(t){const e=zuix.$(t.target);0===e.parent('[class*="no-gesture"]').length()&&t.touches[0].clientX>p?(l=!1,e.get().draggable=!1,g(t,t.touches[0].clientX,t.touches[0].clientY)):l=!0},passive:c}).on("touchmove",{handler:function(t){l||e(t,t.touches[0].clientX,t.touches[0].clientY)},passive:c}).on("touchend",function(t){l||w(t)})}},t.exports}()}]);