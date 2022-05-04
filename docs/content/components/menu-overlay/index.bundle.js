zuix.setComponentCache([{componentId:"/zkit/lib/1.1/components/menu-overlay",controller:((module={}).exports=function(r){let l=!1,d=!1,p,c,f,o,u,i=null,a=0,h="right";function s(){(d?m:g)()}function m(){p.isPlaying()||(d=!1,p.playTransition({classes:"fadeIn fadeOutDown",onEnd:function(){this.hide(),r.trigger("hide")}}))}function g(){p.isPlaying()||(d=!0,p.playTransition("fadeOutDown fadeIn"),p.show(),r.trigger("show"))}function x(){if(!f.isPlaying()){const s="fadeIn";let i="fadeOutDown",a=("right"===h?i="fadeOutRight":"left"===h&&(i="fadeOutLeft"),200/u.length());if(l){if(l){l=!1,r.trigger("close"),d?(c.playTransition({classes:"rotateIn rotateOutLeft",onEnd:c.hide}),p.playTransition("rotateOutRight rotateIn")):c.playTransition({classes:"fadeIn fadeOutDown",onEnd:c.hide}),f.playTransition({classes:"fadeIn fadeOut",holdState:!0,onEnd:function(){this.visibility("hidden")}});let o=a*u.length();"left"!==h&&"right"!==h||(o=0,a*=-1),u.each(function(n,t,e){o-=a,e.playTransition({classes:[s,i],options:{duration:"200ms",delay:o+"ms"},onEnd:e.hide}).show()}),p.show()}}else{l=!0,r.trigger("open"),p.playTransition({classes:"rotateIn rotateOutRight",onEnd:p.hide}),c.playTransition("rotateOutLeft rotateIn").show();let e=0;"left"!==h&&"right"!==h||(e=a*u.length(),a*=-1),f.playTransition("fadeOut fadeIn").visibility(""),u.each(function(n,t){e+=a,this.playTransition({classes:[i,s],options:{duration:"200ms",delay:e+"ms"}}).show()})}}}r.create=function(){h=r.options().position||r.view().attr("data-o-position")||h,p=r.field("menu_button").addClass(h).hide().on("click",x),c=r.field("menu_button_close").addClass(h).hide().on("click",x),f=r.field("menu_overlay").addClass(h).visibility("hidden").on("click",x),o=r.field("items_wrapper").addClass(h);const n=zuix.$(r.model().items).children(),t=(n.each(function(n,t){const e=zuix.$(document.createElement("div")).addClass("menu-item").append(t.observableTarget||t);o.append(e.get())}),u=o.find('div[class*="menu-item"]'),r.view());var e=r.options().buttonColor||t.attr("data-o-button-color"),e=(null!=e&&t.find(".circle-button").css({background:e}),r.options().iconColor||t.attr("data-o-icon-color")),e=(null!=e&&t.find(".circle-button i").css({fill:e,color:e}),t.attr("data-o-scroller"));if(null!=(i=null!=e?zuix.field(e):zuix.$(window))){let e=r.options().before||t.attr("data-o-before"),o=(e=e&&zuix.field(e).get(),r.options().after||t.attr("data-o-after"));o=o&&zuix.field(o).get(),i.on("scroll",function(n){var t=i.get()===window?document.documentElement.scrollTop||document.body.scrollTop:i.get().scrollTop;d?a-t<-2&&(null==o||t>o.offsetTop+o.offsetHeight-56)&&setTimeout(m,100):d||2<a-t&&(null==e||t+window.innerHeight<e.offsetTop+56)&&g(),a=t,l&&x()})}r.expose({show:t.show.bind(t),hide:t.hide.bind(t),toggleButton:s,showButton:g,hideButton:m,showing:function(){return d}}),e={duration:"0.25s",timingFunction:"ease-in-out"},r.addTransition("fadeIn",{transform:"translateXY(0,0)",opacity:"1"},e),r.addTransition("fadeOut",{transform:"translateXY(0,0)",opacity:"0"},e),r.addTransition("fadeOutUp",{transform:"translateY(-200px)",opacity:"0"},e),r.addTransition("fadeOutDown",{transform:"translateY(200px)",opacity:"0"},e),r.addTransition("fadeOutLeft",{transform:"translateX(-200px)",opacity:0},e),r.addTransition("fadeOutRight",{transform:"translateX(200px)",opacity:0},e),r.addTransition("rotateIn",{transform:"rotate(0)",opacity:1},e),r.addTransition("rotateOutRight",{transform:"rotate(+135deg)",opacity:0},e),r.addTransition("rotateOutLeft",{transform:"rotate(-135deg)",opacity:0},e),setTimeout(function(){d||g()},1e3)}},module.exports),css:'button, .button {\n    background: transparent;\n    outline: transparent;\n    border: none;\n    color: inherit;\n    font-weight: bold;\n    display: inline-flex;\n    align-items: center;\n    gap: 12px;\n    justify-content: center;\n    padding-right: 12px;\n    padding-left: 12px;\n    margin-right: 0;\n    margin-left: 0;\n    height: 42px;\n}\n.item-title {\n    font-size: 150%;\n    padding: 16px;\n    opacity: 0.7;\n}\n.menu-button {\n    z-index: 100; /* topmost */\n    position: fixed;\n    right: calc(50% - 28px);\n    left: calc(50% - 28px);\n    bottom: 24px;\n}\n.menu-button.left {\n    left: 24px;\n    right: unset!important;\n}\n.menu-button.right {\n    right: 24px;\n    left: unset!important;\n}\ndiv[z-field="menu_overlay"] {\n    z-index: 100; /* topmost */\n    position: fixed;\n    left: 0;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    padding-top: 80px;\n    padding-bottom: 80px;\n    background: radial-gradient(circle at bottom, white, #ffffffee, #ffffff88, transparent);\n    display: flex;\n    justify-content: space-between;\n    flex-direction: column-reverse;\n}\ndiv[z-field="menu_overlay"].left {\n    background: linear-gradient(230deg, transparent, #ffffff88, #ffffffee, white);\n}\ndiv[z-field="menu_overlay"].right {\n    background: linear-gradient(130deg, transparent, #ffffff88, #ffffffee, white);\n}\ndiv[z-field="items_wrapper"] {\n    text-align: center;\n    margin-top: auto;\n    margin-bottom: 24px;\n}\ndiv[z-field="items_wrapper"].left {\n    padding-left: 24px;\n    text-align: left;\n}\ndiv[z-field="items_wrapper"].right {\n    padding-right: 24px;\n    text-align: right;\n}\n\n.circle-button {\n    cursor: pointer;\n    border-radius: 50%;\n    width: 56px;\n    height: 56px;\n    background: deeppink;\n    fill: white;\n    color: white;\n    box-shadow: 0 0 10px rgb(0 0 0 / 25%), 0 0 4px rgb(0 0 0 / 25%);\n    font-size: 0;\n    transition: all 0.1s cubic-bezier(.25,.8,.25,1);\n    padding: 0;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    -webkit-tap-highlight-color: transparent;\n}\n.circle-button:active {\n    transform: scale(97%);\n    transition: 0s;\n}\n\n@media screen and (max-width: 960px), screen and (max-height: 480px) {\n    .menu-button {\n        bottom: 24px;\n    }\n    div[z-field="menu_overlay"] {\n        padding-bottom: 72px;\n    }\n}\n',view:'<div #menu_overlay="">\n    <div #items_wrapper=""></div>\n</div>\n\n\x3c!-- Colored FAB menu button --\x3e\n<div #menu_button="" class="menu-button">\n    <div class="circle-button">\n        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">\n            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>\n            <path d="M0 0h24v24H0z" fill="none"></path>\n        </svg>\n    </div>\n</div>\n<div #menu_button_close="" class="menu-button">\n    <div class="circle-button">\n        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">\n            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>\n            <path d="M0 0h24v24H0z" fill="none"></path>\n        </svg>\n    </div>\n</div>\n'},{componentId:"/zkit/lib/1.1/controllers/header-auto-hide",controller:((module={}).exports=function(o){let i,t,a,s,r,l=0,d;function p(){null!=i&&i.hasClass("header-collapse")&&i.removeClass("header-collapse").addClass("header-expand"),null!=t&&t.hasClass("footer-collapse")&&t.removeClass("footer-collapse").addClass("footer-expand"),d&&d.check()}function c(){i.hasClass("header-collapse")||i.removeClass("header-expand").addClass("header-collapse"),null==t||t.hasClass("footer-collapse")||t.removeClass("footer-expand").addClass("footer-collapse")}o.init=function(){o.options().css=!1,o.options().html=!1},o.create=function(){if(a=o.options().showEnd||"true"===o.view().attr("data-o-show-end"),!(i=o.options().header||o.view().attr("data-o-header")))throw new Error("Header element not specified.");if(0===(i=zuix.field(i)).length())throw new Error('Header element not found: "'+i+'".');s=i.position().rect.height;var n=getComputedStyle(i.get()).position;"fixed"!==n&&"absolute"!==n&&(l=s);const e=o.view();zuix.$.appendCss("\n/* Header bar shrink/expand */\n@keyframes header-collapse-anim {\n  from { top: 0; }\n  to { top: -"+s+"px; }\n}\n@keyframes header-expand-anim {\n  from { top: -"+s+"px; }\n  to { top: 0; }\n}\n.header-collapse {\n  animation-fill-mode: forwards;\n  animation-name: header-collapse-anim;\n  animation-duration: 0.5s;\n  top: -"+s+"px;\n}\n.header-expand {\n  animation-fill-mode: forwards;\n  animation-name: header-expand-anim;\n  animation-duration: 0.5s;\n  top: 0px;\n}\n",null,"onscroll_header_hide_show");n=o.options().footer||o.view().attr("data-o-footer");null!=n&&((t=zuix.field(n)).css({position:"fixed",zIndex:1}),r=t.position().rect.height,zuix.$.appendCss("\n/* Footer bar shrink/expand */\n@keyframes footer-collapse-anim {\n  from { bottom: 0; }\n  to { bottom: -"+r+"px; }\n}\n@keyframes footer-expand-anim {\n  from { bottom: -"+r+"px; }\n  to { bottom: 0; }\n}\n.footer-collapse {\n  animation-fill-mode: forwards;\n  animation-name: footer-collapse-anim;\n  animation-duration: 0.5s;\n  bottom: -"+r+"px;\n}\n.footer-expand {\n  animation-fill-mode: forwards;\n  animation-name: footer-expand-anim;\n  animation-duration: 0.5s;\n  bottom: 0;\n}\n",null,"zkit_onscroll_hide_show")),zuix.load("@lib/controllers/scroll-helper",{view:e,on:{"scroll:change":function(n,t){"scroll"===t.event&&t.info.viewport.y<-l?t.info.shift.y<-4?(0<l&&"fixed"!==i.css("position")&&(e.css({paddingTop:s+"px"}),i.hide().css({position:"fixed",zIndex:1})),c()):4<t.info.shift.y&&(i.show(),p()):"hit-bottom"===t.event&&a?(i.show(),p()):0<l&&0===t.info.viewport.y&&(e.css({paddingTop:null}),i.show().css({position:null,zIndex:null})),o.trigger("page:scroll",t)}},ready:function(n){d=n,o.expose("scroll",{get:function(){return d}}),o.trigger("scroll:ready",d)}}),o.expose("show",p),o.expose("hide",c)}},module.exports)},{componentId:"/zkit/lib/1.1/controllers/mdl-button",controller:((module={}).exports=function(){this.create=()=>{const t=this.view(),n=this.options();var e=n.type||"raised";if(t.addClass("mdl-button mdl-js-button mdl-button--"+e+" mdl-js-ripple-effect"),n.class){const o=n.class.split(" ");o.forEach(n=>{t.addClass("mdl-button--"+n)})}e=t,zuix.activeRefresh(e,e,null,(n,t,e,o)=>{window.componentHandler?componentHandler.upgradeElements(n.get()):o(e,100,!0)}).start()}},module.exports)},{componentId:"/zkit/lib/1.1/controllers/drawer-layout",controller:((module={}).exports=function(){let o=!0,i=!1,t=!1,a=!1,s=!0,r=null,l=null,d=null,p=280,e=960,c=!1,f=0;const u=this;function h(){l.visibility("initial").css("left",0).get().focus(),t&&(l.find("a").one("click",function(){m()}),r.css("opacity","initial"),r.show()),o||(o=!0,u.trigger("drawer:open",{smallScreen:t}))}function m(){var n;t&&(n=function(){o||l.visibility("hidden")},l.one("transitionend transitioncancel",function(){n()}),l.css("left",-p+"px"),r.hide(),o&&(o=!1,u.trigger("drawer:close",{smallScreen:t}))),o=!1,l.find("a").off("click")}function n(){return o}function g(){(window.innerWidth||document.body.clientWidth)<e||-1===e||c?(t&&!s||(t=!0,i=!1,x()),m()):(t||s)&&(t&&(r.hide(),o&&m()),t=!1,i=!0,x(),h())}function x(){var n;s||w(),d&&(n=parseFloat(getComputedStyle(d.get(),null).getPropertyValue("padding-left")),t?d.css({paddingLeft:n-p+"px"}):d.css({paddingLeft:p+n+"px"})),u.trigger("layout:change",{smallScreen:t,drawerLocked:i})}function w(){var n;a||(a=!0,n="ease .15s",l.css({"transition-property":"left",transition:n}),r.css({"transition-property":"opacity",transition:n}))}u.init=function(){const n=u.view();this.options().html=!1,this.options().css=!1,isNaN(this.options().drawerWidth)?(t=parseInt(n.attr("data-o-width")),isNaN(t)||(p=t)):p=parseInt(this.options().drawerWidth);{var t;isNaN(this.options().autoHideWidth)?(t=parseInt(n.attr("data-o-hide-width")),isNaN(t)||(e=t)):e=parseInt(this.options().autoHideWidth)}},u.create=function(){l=u.view(),d=u.options().mainContent,(r=zuix.$(document.createElement("div"))).css({position:"fixed",top:0,left:0,bottom:0,right:0,"z-index":100,"background-color":"rgba(0, 0, 0, 0.5)"}).on("click",function(){i||m()}).hide(),l.parent().append(r.get()),l.css({position:"fixed","overflow-y":"auto",left:0,width:p+"px",top:0,bottom:0,"z-index":101,"-webkit-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","-moz-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)"}).attr("tabindex",0);let e=!1;zuix.load("@lib/controllers/gesture-helper",{view:document.documentElement,on:{"gesture:touch":function(n,t){i||(w(),f=o&&t.startX<p?p-t.startX:0)},"gesture:release":function(n,t){i||e&&(e=!1,w(),(0<t.velocity?h:m)())},"gesture:pan":function(n,t){if(!i&&"horizontal"===t.scrollIntent()&&((e||o)&&t.x<p||!e&&t.x<50)){e=e||!0,w();{let n=t.x;0<n&&n<=p-f&&(n=-p+n+f,"hidden"===l.visibility()&&l.visibility("initial"),l.css("left",n+"px"),"none"===r.display()&&r.show(),r.css("opacity",(p+n)/p))}a&&(a=!1,l.css({transition:"none"}),r.css({transition:"none"}))}}}}),u.expose("toggle",function(){w(),(o?m:h)()}),u.expose("open",function(){w(),h()}),u.expose("close",function(){w(),m()}),u.expose("isOpen",n),u.expose("lock",function(n){if(null==n)return i;i=n}),u.expose("float",function(n){if(null==n)return c;c=n,g()}),l.on("keydown",function(n){27===(n=n||window.event).keyCode&&m()}),g(),s=!1,window.addEventListener("resize",function(){g()})}},module.exports)}]);