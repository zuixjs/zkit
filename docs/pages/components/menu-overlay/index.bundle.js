zuix.setComponentCache([{componentId:"/zkit/lib/1.1/components/menu-overlay",controller:((module={}).exports=function(r){let l=!1,d=!1,c,u,p,i,f,o=null,s=0,h="right";function a(){(d?g:m)()}function g(){c.isPlaying()||(d=!1,c.playTransition({classes:"fadeIn fadeOutDown",onEnd:function(){this.hide(),r.trigger("hide")}}))}function m(){c.isPlaying()||(d=!0,c.playTransition("fadeOutDown fadeIn"),c.show(),r.trigger("show"))}function w(){if(!p.isPlaying()){const a="fadeIn";let o="fadeOutDown",s=("right"===h?o="fadeOutRight":"left"===h&&(o="fadeOutLeft"),200/f.length());if(l){if(l){l=!1,r.trigger("close"),d?(u.playTransition({classes:"rotateIn rotateOutLeft",onEnd:u.hide}),c.playTransition("rotateOutRight rotateIn")):u.playTransition({classes:"fadeIn fadeOutDown",onEnd:u.hide}),p.playTransition({classes:"fadeIn fadeOut",holdState:!0,onEnd:function(){this.visibility("hidden")}});let i=s*f.length();"left"!==h&&"right"!==h||(i=0,s*=-1),f.each(function(t,n,e){i-=s,e.playTransition({classes:[a,o],options:{duration:"200ms",delay:i+"ms"},onEnd:e.hide}).show()}),c.show()}}else{l=!0,r.trigger("open"),c.playTransition({classes:"rotateIn rotateOutRight",onEnd:c.hide}),u.playTransition("rotateOutLeft rotateIn").show();let e=0;"left"!==h&&"right"!==h||(e=s*f.length(),s*=-1),p.playTransition("fadeOut fadeIn").visibility(""),f.each(function(t,n){e+=s,this.playTransition({classes:[o,a],options:{duration:"200ms",delay:e+"ms"}}).show()})}}}r.create=function(){h=r.options().position||r.view().attr("data-o-position")||h,c=r.field("menu_button").addClass(h).hide().on("click",w),u=r.field("menu_button_close").addClass(h).hide().on("click",w),p=r.field("menu_overlay").addClass(h).visibility("hidden").on("click",w),i=r.field("items_wrapper").addClass(h);const t=zuix.$(r.model().items).children(),n=(t.each(function(t,n){const e=zuix.$(document.createElement("div")).addClass("menu-item").append(n.observableTarget||n);i.append(e.get())}),f=i.find('div[class*="menu-item"]'),r.view());null!=n.attr("data-o-button-color")&&n.css("background",n.attr("data-o-button-color")),null!=n.attr("data-o-icon-color")&&n.css("fill",n.attr("data-o-icon-color"));var e=n.attr("data-o-scroller");null!=(o=null!=e?zuix.field(e):zuix.$(window))&&o.on("scroll",function(t){var n=o.get()===window?document.documentElement.scrollTop||document.body.scrollTop:o.get().scrollTop;d?s-n<-2&&g():d||2<s-n&&m(),s=n,l&&w()}),r.expose("show",function(){n.show()}),r.expose("hide",function(){n.hide()}),document.body.addEventListener("keyup",function(t){t.defaultPrevented||"Escape"===t.key&&(t.cancelBubble=!0,t.preventDefault(),setTimeout(function(){l?(g(),w()):(d?g:m)()},100))}),r.expose("toggleButton",a),r.expose("showButton",m),r.expose("hideButton",g),r.expose("showing",function(){return d}),e={duration:"0.25s",timingFunction:"ease-in-out"},r.addTransition("fadeIn",{transform:"translateXY(0,0)",opacity:"1"},e),r.addTransition("fadeOut",{transform:"translateXY(0,0)",opacity:"0"},e),r.addTransition("fadeOutUp",{transform:"translateY(-200px)",opacity:"0"},e),r.addTransition("fadeOutDown",{transform:"translateY(200px)",opacity:"0"},e),r.addTransition("fadeOutLeft",{transform:"translateX(-200px)",opacity:0},e),r.addTransition("fadeOutRight",{transform:"translateX(200px)",opacity:0},e),r.addTransition("rotateIn",{transform:"rotate(0)",opacity:1},e),r.addTransition("rotateOutRight",{transform:"rotate(+135deg)",opacity:0},e),r.addTransition("rotateOutLeft",{transform:"rotate(-135deg)",opacity:0},e),setTimeout(function(){d||m()},1e3)}},module.exports),css:'button {\n    background: transparent;\n    outline: transparent;\n    border: none;\n    font-weight: bold;\n    display: inline-flex;\n    align-items: center;\n    gap: 12px;\n    justify-content: center;\n    padding-right: 12px;\n    padding-left: 12px;\n    margin-right: 0;\n}\n.menu-button {\n    z-index: 100; /* topmost */\n    position: fixed;\n    right: calc(50% - 28px);\n    left: calc(50% - 28px);\n    bottom: 24px;\n}\n.menu-button.left {\n    left: 24px;\n    right: unset!important;\n}\n.menu-button.right {\n    right: 24px;\n    left: unset!important;\n}\ndiv[z-field="menu_overlay"] {\n    z-index: 100; /* topmost */\n    position: fixed;\n    left: 0;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    padding-top: 80px;\n    padding-bottom: 80px;\n    background: radial-gradient(circle at bottom, white, #ffffffee, #ffffff88, transparent);\n    display: flex;\n    justify-content: space-between;\n    flex-direction: column-reverse;\n}\ndiv[z-field="menu_overlay"].left {\n    background: linear-gradient(230deg, transparent, #ffffff88, #ffffffee, white);\n}\ndiv[z-field="menu_overlay"].right {\n    background: linear-gradient(130deg, transparent, #ffffff88, #ffffffee, white);\n}\ndiv[z-field="items_wrapper"] {\n    text-align: center;\n    margin-top: auto;\n    margin-bottom: 24px;\n}\ndiv[z-field="items_wrapper"].left {\n    padding-left: 24px;\n    text-align: left;\n}\ndiv[z-field="items_wrapper"].right {\n    padding-right: 24px;\n    text-align: right;\n}\n.menu-item {\n    padding-top: 8px;\n    padding-bottom: 8px;\n}\n\n.circle-button {\n    cursor: pointer;\n    border-radius: 50%;\n    width: 56px;\n    height: 56px;\n    background: deeppink;\n    fill: white;\n    color: white;\n    box-shadow: 0 0 10px rgb(0 0 0 / 25%), 0 0 4px rgb(0 0 0 / 25%);\n    font-size: 0;\n    transition: all 0.1s cubic-bezier(.25,.8,.25,1);\n    padding: 0;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    -webkit-tap-highlight-color: transparent;\n}\n.circle-button:active {\n    transform: scale(97%);\n    transition: 0s;\n}\n\n@media screen and (max-width: 960px), screen and (max-height: 480px) {\n    .menu-button {\n        bottom: 24px;\n    }\n    div[z-field="menu_overlay"] {\n        padding-bottom: 72px;\n    }\n}\n',view:'<div #menu_overlay="">\n    <div #items_wrapper=""></div>\n</div>\n\n\x3c!-- Colored FAB menu button --\x3e\n<div #menu_button="" class="menu-button">\n    <div class="circle-button">\n        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">\n            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>\n            <path d="M0 0h24v24H0z" fill="none"></path>\n        </svg>\n    </div>\n</div>\n<div #menu_button_close="" class="menu-button">\n    <div class="circle-button">\n        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">\n            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>\n            <path d="M0 0h24v24H0z" fill="none"></path>\n        </svg>\n    </div>\n</div>\n'},{componentId:"/zkit/lib/1.1/controllers/scroll-helper",controller:function(){function t(e,i){let o=void 0,s=void 0;return function(){const t=this,n=arguments;s?(clearTimeout(o),o=setTimeout(function(){Date.now()-s>=i&&(e.apply(t,n),s=Date.now())},i-(Date.now()-s))):(e.apply(t,n),s=Date.now())}}return(module={}).exports=function(){const s={timestamp:0,size:{width:0,height:0},viewport:{x:0,y:0,width:0,height:0}};let n,e,o,a=0,r;const l=this;function d(){null!=n&&clearTimeout(n);var t=(new Date).getTime();if(100<t-s.timestamp?c():n=setTimeout(function(){c()},99),!(t<a&&t-r<66)){r=t;const i="scroll-helper-visible";null!=e&&null!=o&&e.each(function(t,n){const e=this.position();if(!e.visible&&this.hasClass(i))this.removeClass(i),e.event="exit";else if(e.visible){if(!e.visible)return;this.hasClass(i)?e.event="scroll":(e.event="enter",this.addClass(i))}else e.event="off-scroll";o(this,e)})}}function c(){const t=l.view().get();var n=t.getBoundingClientRect();const e={top:n.top,right:n.right,bottom:n.bottom,left:n.left,width:n.width,height:n.height,x:n.x,y:n.y};e.y=-l.view().get().scrollTop||e.y||0,e.height=l.view().get().scrollHeight||e.height||0,s.size.width=e.width,s.size.height=e.height,t===document.body?(s.size.width=document.body.offsetWidth,s.size.height=document.body.offsetHeight,s.viewport.width=document.documentElement.clientWidth||s.size.width,s.viewport.height=document.documentElement.clientHeight||s.size.height):(s.viewport.width=t.offsetWidth,s.viewport.height=t.offsetHeight),s.timestamp=(new Date).getTime(),s.shift={x:e.x-s.viewport.x,y:e.y-s.viewport.y},s.viewport.x=e.x,s.viewport.y=e.y,0==s.size.height+e.y-s.viewport.height||0===e.y?l.trigger("scroll:change",{event:0===e.y?"hit-top":"hit-bottom",info:s}):l.trigger("scroll:change",{event:"scroll",info:s})}function u(t,n){if((t instanceof Element||t instanceof zuix.$.ZxQuery)&&(t=zuix.$(t).position().y-s.viewport.y),-1===n)return p(t);var e=Date.now(),e=(n=(a=null!=n?e+n:a)-e,l.view().get());let i=0;i=e===document.body?void 0!==window.pageYOffset?window.pageYOffset:(document.documentElement||document.body.parentNode||document.body).scrollTop:e.scrollTop;e=t-i;if(n<=0||0==e)return p(t),void d();const o=i+e/n*33;requestAnimationFrame(function(){p(o),u(t)})}function p(t){const n=l.view().get();n===document.body?(document.documentElement.scrollTop=t,document.body.scrollTop=t):n.scrollTop=t}l.init=function(){l.options().html=!1,l.options().css=!1},l.create=function(){l.view().get()===document.body?0<l.options().throttle?window.onscroll=t(d,l.options().throttle):window.onscroll=d:0<l.options().throttle?l.view().on("scroll",{handler:t(d,l.options().throttle),passive:!0}):l.view().on("scroll",{handler:d,passive:!0});l.expose("watch",function(t,n){return t=t,n=n,o=null!=t?(e=l.view(t),n):e=null,l.context}),l.expose("scrollStart",function(t){return u(0,t=null==t?-1:t),l.context}).expose("scrollEnd",function(t){return null==t&&(t=-1),u(s.size.height,t),l.context}).expose("scrollTo",function(t,n){return u(t,n=null==n?-1:n),l.context}).expose("info",function(){return s}).expose("check",d)}},module.exports}()},{componentId:"/zkit/lib/1.1/controllers/mdl-button",controller:((module={}).exports=function(){this.create=()=>{const n=this.view(),t=this.options();var e=t.type||"raised";if(n.addClass("mdl-button mdl-js-button mdl-button--"+e+" mdl-js-ripple-effect"),t.class){const i=t.class.split(" ");i.forEach(t=>{n.addClass("mdl-button--"+t)})}e=n,zuix.activeRefresh(e,e,null,(t,n,e,i)=>{window.componentHandler?componentHandler.upgradeElements(t.get()):i(e,100,!0)}).start()}},module.exports)},{componentId:"/zkit/lib/1.1/controllers/drawer-layout",controller:((module={}).exports=function(){let i=!0,o=!1,n=!1,s=!1,a=!0,r=null,l=null,d=null,c=280,e=960,u=!1,p=0;const f=this;function h(){l.visibility("initial").css("left",0).get().focus(),n&&(l.find("a").one("click",function(){g()}),r.css("opacity","initial"),r.show()),i||(i=!0,f.trigger("drawer:open",{smallScreen:n}))}function g(){var t;n&&(t=function(){i||l.visibility("hidden")},l.one("transitionend transitioncancel",function(){t()}),l.css("left",-c+"px"),r.hide(),i&&(i=!1,f.trigger("drawer:close",{smallScreen:n}))),i=!1,l.find("a").off("click")}function t(){return i}function m(){(window.innerWidth||document.body.clientWidth)<e||-1===e||u?(n&&!a||(n=!0,o=!1,w()),g()):(n||a)&&(n&&(r.hide(),i&&g()),n=!1,o=!0,w(),h())}function w(){var t;a||x(),d&&(t=parseFloat(getComputedStyle(d.get(),null).getPropertyValue("padding-left")),n?d.css({paddingLeft:t-c+"px"}):d.css({paddingLeft:c+t+"px"})),f.trigger("layout:change",{smallScreen:n,drawerLocked:o})}function x(){var t;s||(s=!0,t="ease .15s",l.css({"transition-property":"left",transition:t}),r.css({"transition-property":"opacity",transition:t}))}f.init=function(){const t=f.view();this.options().html=!1,this.options().css=!1,isNaN(this.options().drawerWidth)?(n=parseInt(t.attr("data-o-width")),isNaN(n)||(c=n)):c=parseInt(this.options().drawerWidth);{var n;isNaN(this.options().autoHideWidth)?(n=parseInt(t.attr("data-o-hide-width")),isNaN(n)||(e=n)):e=parseInt(this.options().autoHideWidth)}},f.create=function(){l=f.view(),d=f.options().mainContent,(r=zuix.$(document.createElement("div"))).css({position:"fixed",top:0,left:0,bottom:0,right:0,"z-index":100,"background-color":"rgba(0, 0, 0, 0.5)"}).on("click",function(){o||g()}).hide(),l.parent().append(r.get()),l.css({position:"fixed","overflow-y":"auto",left:0,width:c+"px",top:0,bottom:0,"z-index":101,"-webkit-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","-moz-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)"}).attr("tabindex",0);let e=!1;zuix.load("@lib/controllers/gesture-helper",{view:document.documentElement,on:{"gesture:touch":function(t,n){o||(x(),p=i&&n.startX<c?c-n.startX:0)},"gesture:release":function(t,n){o||e&&(e=!1,x(),(0<n.velocity?h:g)())},"gesture:pan":function(t,n){if(!o&&"horizontal"===n.scrollIntent()&&((e||i)&&n.x<c||!e&&n.x<50)){e=e||!0,x();{let t=n.x;0<t&&t<=c-p&&(t=-c+t+p,"hidden"===l.visibility()&&l.visibility("initial"),l.css("left",t+"px"),"none"===r.display()&&r.show(),r.css("opacity",(c+t)/c))}s&&(s=!1,l.css({transition:"none"}),r.css({transition:"none"}))}}}}),f.expose("toggle",function(){x(),(i?g:h)()}),f.expose("open",function(){x(),h()}),f.expose("close",function(){x(),g()}),f.expose("isOpen",t),f.expose("lock",function(t){if(null==t)return o;o=t}),f.expose("float",function(t){if(null==t)return u;u=t,m()}),l.on("keydown",function(t){27===(t=t||window.event).keyCode&&g()}),m(),a=!1,window.addEventListener("resize",function(){m()})}},module.exports)}]);