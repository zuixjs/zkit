zuix.setComponentCache([{componentId:"/zkit/lib/1.1/components/context-menu",controller:(module={exports:function(t){let e,n,o,i=!0;function s(){i&&!e.isPlaying()&&(i=!1,o.show(),e.playTransition({onEnd:function(n,o){t.trigger("open")}}),e.css("bottom",0).get().focus(),n.css("opacity",1))}function a(){i||e.isPlaying()||(i=!0,e.playTransition({onEnd:function(){o.hide(),t.trigger("close")}}),n.css("opacity",0),e.css("bottom",-e.position().rect.height+"px"))}t.create=function(){(e=t.field("menu")).css("bottom",-e.position().rect.height+"px"),o=t.view(),n=o.hide().find(".container").on({click:a,keydown:function(n){27===(n=n||window.event).keyCode&&a()}}),zuix.load("@lib/controllers/gesture-helper",{view:o,on:{"gesture:pan":function(n,o){e.hasClass("no-transition")||e.addClass("no-transition"),0<o.shiftY&&e.css("bottom",-o.shiftY+"px")},"gesture:release":function(n,o){e.removeClass("no-transition"),o.velocity<=0&&"up"===o.direction?e.css("bottom",0):"down"===o.direction&&a()}}}),t.expose("show",s),t.expose("hide",a)}}}).exports,css:".container {\n    position: fixed;\n    bottom:0;\n    left:0;\n    right: 0;\n    top: 0;\n    opacity: 0;\n    -ms-touch-action: none;\n    touch-action: none;\n    background: rgba(0,0,0,0.5);\n    z-index: 200;\n    transition: opacity 0.2s ease-in;\n}\n.menu {\n    outline: none !important;\n    margin-left: auto;\n    margin-right: auto;\n    left: 50%;\n    transform: translateX(-50%);\n    position: absolute;\n    width: 100%;\n    max-width: 420px;\n    background: white;\n    border: solid 1px rgba(0,0,0,0.1);\n    border-radius: 16px 16px 0 0;\n    box-shadow: 0 -5px 5px -5px #333;\n    transition: bottom 0.3s ease-in-out;\n}\nbutton {\n    width: 100%;\n    height:48px;\n    padding: 16px;\n    background: none;\n    border: none;\n}\nbutton span {\n    font-family: sans-serif, Helvetica;\n    font-size: 120%;\n    margin-left: 24px;\n}\nbutton i {\n    color: dimgray;\n    font-size: 24px;\n    margin-left: 8px;\n}\nbutton:hover {\n    background: rgba(0,0,0,0.1);\n}\n.no-transition {\n    transition: none;\n}\n",view:'<div class="container">\n    <div #menu="" class="menu" tabindex="0"></div>\n</div>\n'},{componentId:"/zkit/lib/1.1/controllers/header-auto-hide",controller:((module={}).exports=function(e){let i,o,s,a,r,l=0,d;function c(){null!=i&&i.hasClass("header-collapse")&&i.removeClass("header-collapse").addClass("header-expand"),null!=o&&o.hasClass("footer-collapse")&&o.removeClass("footer-collapse").addClass("footer-expand"),d&&d.check()}function p(){i.hasClass("header-collapse")||i.removeClass("header-expand").addClass("header-collapse"),null==o||o.hasClass("footer-collapse")||o.removeClass("footer-expand").addClass("footer-collapse")}e.init=function(){e.options().css=!1,e.options().html=!1},e.create=function(){if(s=e.options().showEnd||"true"===e.view().attr("data-o-show-end"),!(i=e.options().header||e.view().attr("data-o-header")))throw new Error("Header element not specified.");if(0===(i=zuix.field(i)).length())throw new Error('Header element not found: "'+i+'".');a=i.position().rect.height;var n=getComputedStyle(i.get()).position;"fixed"!==n&&"absolute"!==n&&(l=a);const t=e.view();zuix.$.appendCss("\n/* Header bar shrink/expand */\n@keyframes header-collapse-anim {\n  from { top: 0; }\n  to { top: -"+a+"px; }\n}\n@keyframes header-expand-anim {\n  from { top: -"+a+"px; }\n  to { top: 0; }\n}\n.header-collapse {\n  animation-fill-mode: forwards;\n  animation-name: header-collapse-anim;\n  animation-duration: 0.5s;\n  top: -"+a+"px;\n}\n.header-expand {\n  animation-fill-mode: forwards;\n  animation-name: header-expand-anim;\n  animation-duration: 0.5s;\n  top: 0px;\n}\n",null,"onscroll_header_hide_show");n=e.options().footer||e.view().attr("data-o-footer");null!=n&&((o=zuix.field(n)).css({position:"fixed",zIndex:1}),r=o.position().rect.height,zuix.$.appendCss("\n/* Footer bar shrink/expand */\n@keyframes footer-collapse-anim {\n  from { bottom: 0; }\n  to { bottom: -"+r+"px; }\n}\n@keyframes footer-expand-anim {\n  from { bottom: -"+r+"px; }\n  to { bottom: 0; }\n}\n.footer-collapse {\n  animation-fill-mode: forwards;\n  animation-name: footer-collapse-anim;\n  animation-duration: 0.5s;\n  bottom: -"+r+"px;\n}\n.footer-expand {\n  animation-fill-mode: forwards;\n  animation-name: footer-expand-anim;\n  animation-duration: 0.5s;\n  bottom: 0;\n}\n",null,"zkit_onscroll_hide_show")),zuix.load("@lib/controllers/scroll-helper",{view:t,on:{"scroll:change":function(n,o){"scroll"===o.event&&o.info.viewport.y<-l?o.info.shift.y<-4?(0<l&&"fixed"!==i.css("position")&&(t.css({paddingTop:a+"px"}),i.hide().css({position:"fixed",zIndex:1})),p()):4<o.info.shift.y&&(i.show(),c()):"hit-bottom"===o.event&&s?(i.show(),c()):0<l&&0===o.info.viewport.y&&(t.css({paddingTop:null}),i.show().css({position:null,zIndex:null})),e.trigger("page:scroll",o)}},ready:function(n){d=n,e.expose("scroll",{get:function(){return d}}),e.trigger("scroll:ready",d)}}),e.expose("show",c),e.expose("hide",p)}},module.exports)},{componentId:"/zkit/lib/1.1/controllers/mdl-button",controller:((module={}).exports=function(){this.create=()=>{const o=this.view(),n=this.options();var t=n.type||"raised";if(o.addClass("mdl-button mdl-js-button mdl-button--"+t+" mdl-js-ripple-effect"),n.class){const e=n.class.split(" ");e.forEach(n=>{o.addClass("mdl-button--"+n)})}t=o,zuix.activeRefresh(t,t,null,(n,o,t,e)=>{window.componentHandler?componentHandler.upgradeElements(n.get()):e(t,100,!0)}).start()}},module.exports)},{componentId:"/zkit/lib/1.1/controllers/drawer-layout",controller:((module={}).exports=function(){let e=!0,i=!1,o=!1,s=!1,a=!0,r=null,l=null,d=null,c=280,t=960,p=!1,u=0;const f=this;function h(){l.visibility("initial").css("left",0).get().focus(),o&&(l.find("a").one("click",function(){m()}),r.css("opacity","initial"),r.show()),e||(e=!0,f.trigger("drawer:open",{smallScreen:o}))}function m(){var n;o&&(n=function(){e||l.visibility("hidden")},l.one("transitionend transitioncancel",function(){n()}),l.css("left",-c+"px"),r.hide(),e&&(e=!1,f.trigger("drawer:close",{smallScreen:o}))),e=!1,l.find("a").off("click")}function n(){return e}function x(){(window.innerWidth||document.body.clientWidth)<t||-1===t||p?(o&&!a||(o=!0,i=!1,g()),m()):(o||a)&&(o&&(r.hide(),e&&m()),o=!1,i=!0,g(),h())}function g(){var n;a||w(),d&&(n=parseFloat(getComputedStyle(d.get(),null).getPropertyValue("padding-left")),o?d.css({paddingLeft:n-c+"px"}):d.css({paddingLeft:c+n+"px"})),f.trigger("layout:change",{smallScreen:o,drawerLocked:i})}function w(){var n;s||(s=!0,n="ease .15s",l.css({"transition-property":"left",transition:n}),r.css({"transition-property":"opacity",transition:n}))}f.init=function(){const n=f.view();this.options().html=!1,this.options().css=!1,isNaN(this.options().drawerWidth)?(o=parseInt(n.attr("data-o-width")),isNaN(o)||(c=o)):c=parseInt(this.options().drawerWidth);{var o;isNaN(this.options().autoHideWidth)?(o=parseInt(n.attr("data-o-hide-width")),isNaN(o)||(t=o)):t=parseInt(this.options().autoHideWidth)}},f.create=function(){l=f.view(),d=f.options().mainContent,(r=zuix.$(document.createElement("div"))).css({position:"fixed",top:0,left:0,bottom:0,right:0,"z-index":100,"background-color":"rgba(0, 0, 0, 0.5)"}).on("click",function(){i||m()}).hide(),l.parent().append(r.get()),l.css({position:"fixed","overflow-y":"auto",left:0,width:c+"px",top:0,bottom:0,"z-index":101,"-webkit-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","-moz-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)"}).attr("tabindex",0);let t=!1;zuix.load("@lib/controllers/gesture-helper",{view:document.documentElement,on:{"gesture:touch":function(n,o){i||(w(),u=e&&o.startX<c?c-o.startX:0)},"gesture:release":function(n,o){i||t&&(t=!1,w(),(0<o.velocity?h:m)())},"gesture:pan":function(n,o){if(!i&&"horizontal"===o.scrollIntent()&&((t||e)&&o.x<c||!t&&o.x<50)){t=t||!0,w();{let n=o.x;0<n&&n<=c-u&&(n=-c+n+u,"hidden"===l.visibility()&&l.visibility("initial"),l.css("left",n+"px"),"none"===r.display()&&r.show(),r.css("opacity",(c+n)/c))}s&&(s=!1,l.css({transition:"none"}),r.css({transition:"none"}))}}}}),f.expose("toggle",function(){w(),(e?m:h)()}),f.expose("open",function(){w(),h()}),f.expose("close",function(){w(),m()}),f.expose("isOpen",n),f.expose("lock",function(n){if(null==n)return i;i=n}),f.expose("float",function(n){if(null==n)return p;p=n,x()}),l.on("keydown",function(n){27===(n=n||window.event).keyCode&&m()}),x(),a=!1,window.addEventListener("resize",function(){x()})}},module.exports)}]);