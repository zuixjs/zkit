zuix.setComponentCache([{componentId:"/zkit/lib/1.1/controllers/header-auto-hide",controller:function(){"use strict";let t={};return t.exports=function(o){let s,e,r,a,l,c=0,d;function h(){null!=s&&s.hasClass("header-collapse")&&s.removeClass("header-collapse").addClass("header-expand"),null!=e&&e.hasClass("footer-collapse")&&e.removeClass("footer-collapse").addClass("footer-expand"),d&&d.check()}function p(){s.hasClass("header-collapse")||s.removeClass("header-expand").addClass("header-collapse"),null==e||e.hasClass("footer-collapse")||e.removeClass("footer-expand").addClass("footer-collapse")}o.init=function(){o.options().css=!1,o.options().html=!1},o.create=function(){r=o.options().showEnd||"true"===o.view().attr("data-o-show-end"),s=o.options().header||o.view().attr("data-o-header");const n=o.options().zIndex||10;if(!s)throw new Error("Header element not specified.");if(0===(s=zuix.field(s)).length())throw new Error('Header element not found: "'+s+'".');a=s.position().rect.height;var t=getComputedStyle(s.get()).position;"fixed"!==t&&"absolute"!==t&&(c=a);const i=o.view();zuix.$.appendCss("\n/* Header bar shrink/expand */\n@keyframes header-collapse-anim {\n  from { top: 0; }\n  to { top: -"+a+"px; }\n}\n@keyframes header-expand-anim {\n  from { top: -"+a+"px; }\n  to { top: 0; }\n}\n.header-collapse {\n  animation-fill-mode: forwards;\n  animation-name: header-collapse-anim;\n  animation-duration: 0.5s;\n  top: -"+a+"px;\n}\n.header-expand {\n  animation-fill-mode: forwards;\n  animation-name: header-expand-anim;\n  animation-duration: 0.5s;\n  top: 0px;\n}\n",null,"onscroll_header_hide_show");t=o.options().footer||o.view().attr("data-o-footer");null!=t&&((e=zuix.field(t)).css({position:"fixed",zIndex:n}),l=e.position().rect.height,zuix.$.appendCss("\n/* Footer bar shrink/expand */\n@keyframes footer-collapse-anim {\n  from { bottom: 0; }\n  to { bottom: -"+l+"px; }\n}\n@keyframes footer-expand-anim {\n  from { bottom: -"+l+"px; }\n  to { bottom: 0; }\n}\n.footer-collapse {\n  animation-fill-mode: forwards;\n  animation-name: footer-collapse-anim;\n  animation-duration: 0.5s;\n  bottom: -"+l+"px;\n}\n.footer-expand {\n  animation-fill-mode: forwards;\n  animation-name: footer-expand-anim;\n  animation-duration: 0.5s;\n  bottom: 0;\n}\n",null,"zkit_onscroll_hide_show")),zuix.load("@lib/controllers/scroll-helper",{view:i,on:{"scroll:change":function(t,e){"scroll"===e.event&&e.info.viewport.y<-c?e.info.shift.y<-4?(0<c&&"fixed"!==s.css("position")&&(i.css({paddingTop:a+"px"}),s.hide().css({position:"fixed",zIndex:n})),p()):4<e.info.shift.y&&(s.show(),h()):"hit-bottom"===e.event&&r?(s.show(),h()):0<c&&0===e.info.viewport.y&&(i.css({paddingTop:null}),s.show().css({position:null,zIndex:null})),o.trigger("page:scroll",e)}},ready:function(t){d=t,o.expose("scroll",{get:function(){return d}}),o.trigger("scroll:ready",d)}}),o.expose("show",h),o.expose("hide",p)}},t.exports}()},{componentId:"/zkit/lib/1.1/controllers/scroll-helper",controller:function(){"use strict";let t={};function i(n,i){let o=void 0,s=void 0;return function(){const t=this,e=arguments;s?(clearTimeout(o),o=setTimeout(function(){Date.now()-s>=i&&(n.apply(t,e),s=Date.now())},i-(Date.now()-s))):(n.apply(t,e),s=Date.now())}}return t.exports=function(){const s={timestamp:0,size:{width:0,height:0},viewport:{x:0,y:0,width:0,height:0}};let e,n,o,r=0,a;const l=this;function c(){null!=e&&clearTimeout(e);var t=(new Date).getTime();if(100<t-s.timestamp?d():e=setTimeout(function(){d()},99),!(t<r&&t-a<66)){a=t;const i="scroll-helper-visible";null!=n&&null!=o&&n.each(function(t,e){const n=this.position();if(!n.visible&&this.hasClass(i))this.removeClass(i),n.event="exit";else if(n.visible){if(!n.visible)return;this.hasClass(i)?n.event="scroll":(n.event="enter",this.addClass(i))}else n.event="off-scroll";o(this,n)})}}function d(){const t=l.view().get();var e=t.getBoundingClientRect();const n={top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.width,height:e.height,x:e.x,y:e.y};n.y=-l.view().get().scrollTop||n.y||0,n.height=l.view().get().scrollHeight||n.height||0,s.size.width=n.width,s.size.height=n.height,t===document.body?(s.size.width=document.body.offsetWidth,s.size.height=document.body.offsetHeight,s.viewport.width=document.documentElement.clientWidth||s.size.width,s.viewport.height=document.documentElement.clientHeight||s.size.height):(s.viewport.width=t.offsetWidth,s.viewport.height=t.offsetHeight),s.timestamp=(new Date).getTime(),s.shift={x:n.x-s.viewport.x,y:n.y-s.viewport.y},s.viewport.x=n.x,s.viewport.y=n.y,0==s.size.height+n.y-s.viewport.height||0===n.y?l.trigger("scroll:change",{event:0===n.y?"hit-top":"hit-bottom",info:s}):l.trigger("scroll:change",{event:"scroll",info:s})}function h(t,e){if((t instanceof Element||t instanceof zuix.$.ZxQuery)&&(t=zuix.$(t).position().y-s.viewport.y),-1===e)return p(t);var n=Date.now(),n=(e=(r=null!=e?n+e:r)-n,l.view().get());let i=0;i=n===document.body?void 0!==window.pageYOffset?window.pageYOffset:(document.documentElement||document.body.parentNode||document.body).scrollTop:n.scrollTop;n=t-i;if(e<=0||0==n)return p(t),void c();const o=i+n/e*33;requestAnimationFrame(function(){p(o),h(t)})}function p(t){const e=l.view().get();e===document.body?(document.documentElement.scrollTop=t,document.body.scrollTop=t):e.scrollTop=t}l.init=function(){l.options().html=!1,l.options().css=!1},l.create=function(){l.view().get()===document.body?0<l.options().throttle?window.onscroll=i(c,l.options().throttle):window.onscroll=c:0<l.options().throttle?l.view().on("scroll",{handler:i(c,l.options().throttle),passive:!0}):l.view().on("scroll",{handler:c,passive:!0});l.expose("watch",function(t,e){return t=t,e=e,o=null!=t?(n=l.view(t),e):n=null,l.context}),l.expose("scrollStart",function(t){return h(0,t=null==t?-1:t),l.context}).expose("scrollEnd",function(t){return null==t&&(t=-1),h(s.size.height,t),l.context}).expose("scrollTo",function(t,e){return h(t,e=null==e?-1:e),l.context}).expose("info",function(){return s}).expose("check",c)}},t.exports}()},{componentId:"/zkit/lib/1.1/controllers/transpose-fx",controller:function(){"use strict";let t={};class e extends ControllerInstance{isOpen=!1;element;targetView;oldPosition;newPosition;placeHolder;elementSize;onCreate(){this.placeHolder=zuix.$(document.createElement("div")).css({background:"rgba(0,0,0,5%)"}),this.targetView=this.view(".transpose-fx-container"),this.expose({begin:t=>this.#begin(t),end:()=>this.#end(),toggle:t=>this.#toggle(t),active:()=>this.isOpen}),this.#setupTransitions();var t=zuix.$(document.createElement("div")).css({position:"absolute",width:"100%",height:"100%",zIndex:-1});this.#copyBackground(t),this.view().insert(0,t).display("none").find(":not(.transpose-fx-container)").each((t,e,n)=>{n.addClass("transpose-fx")});let e=this.targetView.parent();for(;0<e.length()&&e.get()!==this.view().get();)e.removeClass("transpose-fx"),e=e.parent()}#begin(t){if(!this.isOpen){this.isOpen=!0,this.element=t,this.oldPosition=t.position();const n=t.parent();var e=this.elementStyle=t.get().currentStyle||window.getComputedStyle(t.get());this.elementSize={width:t.css("width"),height:t.css("height")},this.placeHolder.css({marginLeft:e.marginLeft,marginTop:e.marginTop,marginRight:e.marginRight,marginBottom:e.marginBottom,width:this.oldPosition.rect.width+"px",height:this.oldPosition.rect.height+"px"}).detach(),t.detach().css({zIndex:1e4}),n.insert(t.get().__zuix_oldIndex,this.placeHolder.get()),this.targetView.insert(0,t.get()),this.view().display("block"),this.view(".transpose-fx").playTransition("fadeOut fadeIn"),this.newPosition=t.position(),this.#resetTransition(t),t.css({width:e.width+"px",height:e.height+"px",transform:"translate("+(this.oldPosition.rect.x-this.newPosition.rect.x)+"px,"+(this.oldPosition.rect.y-this.newPosition.rect.y)+"px)"}),"IMG"===t.get().tagName&&t.attr({width:e.width,height:e.height}),setTimeout(()=>{this.#addTransition(),t.css({width:"100%",height:"100%",transform:"translate(0,0)"})}),this.view().trigger("transpose:active")}}#end(){this.isOpen&&(this.oldPosition=this.placeHolder.position(),this.#resetTransition(),this.#addTransition(),this.element.css({width:this.elementSize.width,height:this.elementSize.height,transform:"translate("+(this.oldPosition.rect.x-this.newPosition.rect.x)+"px,"+(this.oldPosition.rect.y-this.newPosition.rect.y)+"px)"}),this.element.playTransition({onEnd:()=>{this.targetView.insert(0,this.placeHolder.get()),this.element.attach().css({transform:"translate(0,0)",zIndex:null}),this.placeHolder.detach()}}),this.view(".transpose-fx").playTransition({classes:"fadeIn fadeOut",onEnd:()=>{this.isOpen=!1,this.view().hide(),this.view().trigger("transpose:end")}}))}#toggle(t){return t.hasClass("--z-playing")||(this.isOpen?this.#end():this.#begin(t)),this.isOpen}#addTransition(){this.element.css({transition:"all .35s"})}#resetTransition(){this.element.css({transition:"none"})}#setupTransitions(){var t={duration:"0.35s",delay:"0.1",timingFunction:"ease-in-out"};this.addTransition("fadeIn",{opacity:"1"},t),this.addTransition("fadeOut",{opacity:"0"},t),this.context.$.css({zIndex:1e3})}#copyBackground(e){const n=this.view(),i=n.get().currentStyle||window.getComputedStyle(n.get());["background","box-shadow","border-radius","border","backdrop-filter"].map(t=>{e.css(t,i[t]),n.css(t,"unset")})}}return t.exports=e,t.exports}()},{componentId:"/zkit/lib/1.1/controllers/mdl-button",controller:function(){"use strict";let t={};return t.exports=function(){this.create=()=>{const e=this.view(),t=this.options();var n=t.type||"raised";if(e.addClass("mdl-button mdl-js-button mdl-button--"+n+" mdl-js-ripple-effect"),t.class){const i=t.class.split(" ");i.forEach(t=>{e.addClass("mdl-button--"+t)})}n=e,zuix.activeRefresh(n,n,null,(t,e,n,i)=>{window.componentHandler?componentHandler.upgradeElements(t.get()):i(n,100,!0)}).start()}},t.exports}()},{componentId:"/zkit/lib/1.1/controllers/drawer-layout",controller:function(){"use strict";let t={};return t.exports=function(){let i=!0,o=!1,e=!1,s=!1,r=!0,a=null,l=null,c=null,d=280,n=960,h=!1,p=0;const u=this;function f(){l.visibility("initial").css("left",0).get().focus(),e&&(l.find("a").one("click",function(){m()}),a.css("opacity","initial"),a.show()),i||(i=!0,u.trigger("drawer:open",{smallScreen:e}))}function m(){var t;e&&(t=function(){i||l.visibility("hidden")},l.one("transitionend transitioncancel",function(){t()}),l.css("left",-d+"px"),a.hide(),i&&(i=!1,u.trigger("drawer:close",{smallScreen:e}))),i=!1,l.find("a").off("click")}function t(){return i}function g(){(window.innerWidth||document.body.clientWidth)<n||-1===n||h?(e&&!r||(e=!0,o=!1,x()),m()):(e||r)&&(e&&(a.hide(),i&&m()),e=!1,o=!0,x(),f())}function x(){var t;r||w(),c&&(t=parseFloat(getComputedStyle(c.get(),null).getPropertyValue("padding-left")),e?c.css({paddingLeft:t-d+"px"}):c.css({paddingLeft:d+t+"px"})),u.trigger("layout:change",{smallScreen:e,drawerLocked:o})}function w(){var t;s||(s=!0,t="ease .15s",l.css({"transition-property":"left",transition:t}),a.css({"transition-property":"opacity",transition:t}))}u.init=function(){const t=u.view();this.options().html=!1,this.options().css=!1,isNaN(this.options().drawerWidth)?(e=parseInt(t.attr("data-o-width")),isNaN(e)||(d=e)):d=parseInt(this.options().drawerWidth);{var e;isNaN(this.options().autoHideWidth)?(e=parseInt(t.attr("data-o-hide-width")),isNaN(e)||(n=e)):n=parseInt(this.options().autoHideWidth)}},u.create=function(){l=u.view(),c=u.options().mainContent,(a=zuix.$(document.createElement("div"))).css({position:"fixed",top:0,left:0,bottom:0,right:0,"z-index":100,"background-color":"rgba(0, 0, 0, 0.5)"}).on("click",function(){o||m()}).hide(),l.parent().append(a.get()),l.css({position:"fixed","overflow-y":"auto",left:0,width:d+"px",top:0,bottom:0,"z-index":101,"-webkit-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","-moz-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)"}).attr("tabindex",0);let n=!1;zuix.load("@lib/controllers/gesture-helper",{view:document.documentElement,on:{"gesture:touch":function(t,e){o||(w(),p=i&&e.startX<d?d-e.startX:0)},"gesture:release":function(t,e){o||n&&(n=!1,w(),(0<e.velocity?f:m)())},"gesture:pan":function(t,e){if(!o&&"horizontal"===e.scrollIntent()&&((n||i)&&e.x<d||!n&&e.x<50)){n=n||!0,w();{let t=e.x;0<t&&t<=d-p&&(t=-d+t+p,"hidden"===l.visibility()&&l.visibility("initial"),l.css("left",t+"px"),"none"===a.display()&&a.show(),a.css("opacity",(d+t)/d))}s&&(s=!1,l.css({transition:"none"}),a.css({transition:"none"}))}}}}),u.expose("toggle",function(){w(),(i?m:f)()}),u.expose("open",function(){w(),f()}),u.expose("close",function(){w(),m()}),u.expose("isOpen",t),u.expose("lock",function(t){if(null==t)return o;o=t}),u.expose("float",function(t){if(null==t)return h;h=t,g()}),l.on("keydown",function(t){27===(t=t||window.event).keyCode&&m()}),g(),r=!1,window.addEventListener("resize",function(){g()})}},t.exports}()},{componentId:"/zkit/lib/1.1/controllers/gesture-helper",controller:function(){"use strict";let t={};return t.exports=function(){const n=0,o=1,s=2,i=750;let r=n,a,l=!1,c=!0,d=-1,h,p,u,f=!1,m=(new Date).getTime();Math.sign=Math.sign||function(t){return(0<t)-(t<0)||+t};const g=this;function x(t,e,n){var i=(new Date).getTime();a={event:t,cancel:function(){a.event.cancelBubble=!0,c||a.event.preventDefault()},startX:e,startY:n,startTime:i,shiftX:0,shiftY:0,endTime:0,stepX:0,stepY:0,stepTime:i,velocity:0,x:e,y:n,scrollIntent:function(){switch(r){case o:return"horizontal";case s:return"vertical"}return!1}},u=function(i){let o;function t(){i.stepTime=i.endTime,i.stepX=i.shiftX,i.stepY=i.shiftY,i.stepSpeed=0,i.stepDistance=0}function s(){o=i.direction,r.time=(new Date).getTime(),r.x=i.x,r.y=i.y,i.velocity=0,i.distance=0,t()}const r={time:0,x:0,y:0},a={time:0,x:0,y:0};return s(),{update:function(){var t,e,n;a.time=(new Date).getTime(),a.x=i.x,a.y=i.y,null!=o&&o!==i.direction?s():(null==o&&i.direction!==o&&(o=i.direction),t=a.time-r.time,e={x:a.x-r.x,y:a.y-r.y},n=Math.sqrt(e.x*e.x+e.y*e.y),n=(i.distance=n)/t,i.velocity="left"===i.direction||"up"===i.direction?-n:n,i.stepTime=i.endTime-i.stepTime,e={x:i.shiftX-i.stepX,y:i.shiftY-i.stepY},i.stepDistance=Math.sqrt(e.x*e.x+e.y*e.y),i.stepSpeed=i.stepDistance/i.stepTime)},step:t}}(a),g.trigger("gesture:touch",a)}function e(t,e,n){null!=a&&(a.event=t,a.x=e,a.y=n,a.shiftX=e-a.startX,a.shiftY=n-a.startY,a.endTime=(new Date).getTime(),null!=(t=v())&&!1!==h&&(p=null!=p&&p!==a.direction?(h=!1,"cancel"):(h=t,a.direction)),g.trigger("gesture:pan",a))}function w(t){null!=a&&(u.update(),a.event=t,null!=(h=null==h?v():h)&&!1!==h&&g.trigger(h,a)),g.trigger("gesture:release",a),r=n,p=null,h=null,a=null}function v(){let t=null;u.update();var e=180*Math.atan2(a.shiftY-a.stepY,a.shiftX-a.stepX)/Math.PI;return 0===a.shiftX&&0===a.shiftY&&a.startTime>m+100&&a.stepTime<i?(m=(new Date).getTime(),t="gesture:tap"):(r===n||r===o)&&2<a.stepDistance&&(135<=e&&e<=180||-180<=e&&e<=-135)?(a.direction="left",t="gesture:swipe",r=o):(r===n||r===o)&&2<a.stepDistance&&(0<=e&&e<=45||-45<=e&&e<0)?(a.direction="right",t="gesture:swipe",r=o):(r===n||r===s)&&2<a.stepDistance&&45<e&&e<135?(a.direction="down",t="gesture:swipe",r=s):(r===n||r===s)&&2<a.stepDistance&&-135<e&&e<-45&&(a.direction="up",t="gesture:swipe",r=s),2<a.stepDistance&&u.step(),t}g.init=function(){const t=g.view(),e=g.options();e.html=!1,e.css=!1,c=!1!==e.passive&&"false"!==t.attr("data-o-passive"),d=e.startGap||t.attr("data-o-startgap")},g.create=function(){const t=c?zuix.$(window):g.view();t.on("dragstart",{handler:function(t){l||c||t.preventDefault()},passive:c}).on("mousedown",{handler:function(t){const e=zuix.$(t.target);1===t.which&&0===e.parent('[class*="no-gesture"]').length()&&t.x>d?(f=!0,l=!1,e.get().draggable=!1,x(t,t.x,t.y)):l=!0},passive:c}).on("mousemove",{handler:function(t){!l&&f&&e(t,t.x,t.y)},passive:c}).on("mouseup",function(t){1!==t.which||l||(f=!1,w(t))}).on("touchstart",{handler:function(t){const e=zuix.$(t.target);0===e.parent('[class*="no-gesture"]').length()&&t.touches[0].clientX>d?(l=!1,e.get().draggable=!1,x(t,t.touches[0].clientX,t.touches[0].clientY)):l=!0},passive:c}).on("touchmove",{handler:function(t){l||e(t,t.touches[0].clientX,t.touches[0].clientY)},passive:c}).on("touchend",function(t){l||w(t)})}},t.exports}()}]);