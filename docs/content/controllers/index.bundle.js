zuix.setComponentCache([{componentId:"/zkit/lib/1.1/templates/mdl-card-image",controller:(module={}).exports,css:':host {\n    font-family: "Roboto","Helvetica","Arial",sans-serif !important;\n    transition: box-shadow 0.2s ease-in-out;\n}\n\n.mdl-card {\n    width: 256px;\n    height: 256px;                 /* 259 306 317 342 392 292 */\n    background: url(\'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\');\n    background-repeat: no-repeat!important;\n    background-position: center!important;\n}\n.mdl-card__actions {\n    height: 52px;\n    padding: 16px;\n    border-top: solid 1px rgba(255,255,255, 0.4);\n    background: rgba(0, 0, 0, 0.5);\n}\n.title {\n    color: #fff;\n    font-size: 110%;\n    font-weight: 500;\n}\n.mdl-ripple {\n    background: #fff;\n}\n.mdl-card__title {\n    align-items: start;\n}\n.mdl-card__title span {\n    width: 100%;\n    font-size: 95%;\n    padding-left: 3px;\n    padding-right: 3px;\n    background: rgba(255,255,255,0.65);\n    border-radius: 3px;\n}\n',view:'<a #link.url="" href="#" class="mdl-card mdl-shadow--2dp mdl-js-ripple-effect animate__animated animate__fadeIn">\n    <div class="mdl-card__title mdl-card--expand animate__animated animate__fadeIn animate__slow">\n        <span #text=""></span>\n    </div>\n    <div class="mdl-card__actions animate__animated animate__fadeInUp animate__slow">\n        <span #title="" class="title"></span>\n    </div>\n    <span class="mdl-button__ripple-container">\n        <span class="mdl-ripple"></span>\n    </span>\n</a>\n<script type="jscript" using="componentHandler">\n  $.on(\'mouseover touchstart\', () => $.addClass(\'mdl-shadow--4dp\'));\n  $.on(\'mouseout touchend\', () => $.removeClass(\'mdl-shadow--4dp\'));\n  $.css({\n    backgroundImage: \'url(\' + model.image.src + \'?random=\' + Math.random() + \')\',\n    backgroundPosition: \'center\',\n    backgroundRepeat: \'no-repeat\'\n  });\n  // this is required for the MDL ripple effect\n  componentHandler.upgradeElements($.get().firstElementChild);\n<\/script>\n'},{componentId:"/zkit/lib/1.1/controllers/header-auto-hide",controller:((module={}).exports=function(t){let i,e,a,s,r,l=0,d;function p(){null!=i&&i.hasClass("header-collapse")&&i.removeClass("header-collapse").addClass("header-expand"),null!=e&&e.hasClass("footer-collapse")&&e.removeClass("footer-collapse").addClass("footer-expand"),d&&d.check()}function c(){i.hasClass("header-collapse")||i.removeClass("header-expand").addClass("header-collapse"),null==e||e.hasClass("footer-collapse")||e.removeClass("footer-expand").addClass("footer-collapse")}t.init=function(){t.options().css=!1,t.options().html=!1},t.create=function(){if(a=t.options().showEnd||"true"===t.view().attr("data-o-show-end"),!(i=t.options().header||t.view().attr("data-o-header")))throw new Error("Header element not specified.");if(0===(i=zuix.field(i)).length())throw new Error('Header element not found: "'+i+'".');s=i.position().rect.height;var n=getComputedStyle(i.get()).position;"fixed"!==n&&"absolute"!==n&&(l=s);const o=t.view();zuix.$.appendCss("\n/* Header bar shrink/expand */\n@keyframes header-collapse-anim {\n  from { top: 0; }\n  to { top: -"+s+"px; }\n}\n@keyframes header-expand-anim {\n  from { top: -"+s+"px; }\n  to { top: 0; }\n}\n.header-collapse {\n  animation-fill-mode: forwards;\n  animation-name: header-collapse-anim;\n  animation-duration: 0.5s;\n  top: -"+s+"px;\n}\n.header-expand {\n  animation-fill-mode: forwards;\n  animation-name: header-expand-anim;\n  animation-duration: 0.5s;\n  top: 0px;\n}\n",null,"onscroll_header_hide_show");n=t.options().footer||t.view().attr("data-o-footer");null!=n&&((e=zuix.field(n)).css({position:"fixed",zIndex:1}),r=e.position().rect.height,zuix.$.appendCss("\n/* Footer bar shrink/expand */\n@keyframes footer-collapse-anim {\n  from { bottom: 0; }\n  to { bottom: -"+r+"px; }\n}\n@keyframes footer-expand-anim {\n  from { bottom: -"+r+"px; }\n  to { bottom: 0; }\n}\n.footer-collapse {\n  animation-fill-mode: forwards;\n  animation-name: footer-collapse-anim;\n  animation-duration: 0.5s;\n  bottom: -"+r+"px;\n}\n.footer-expand {\n  animation-fill-mode: forwards;\n  animation-name: footer-expand-anim;\n  animation-duration: 0.5s;\n  bottom: 0;\n}\n",null,"zkit_onscroll_hide_show")),zuix.load("@lib/controllers/scroll-helper",{view:o,on:{"scroll:change":function(n,e){"scroll"===e.event&&e.info.viewport.y<-l?e.info.shift.y<-4?(0<l&&"fixed"!==i.css("position")&&(o.css({paddingTop:s+"px"}),i.hide().css({position:"fixed",zIndex:1})),c()):4<e.info.shift.y&&(i.show(),p()):"hit-bottom"===e.event&&a?(i.show(),p()):0<l&&0===e.info.viewport.y&&(o.css({paddingTop:null}),i.show().css({position:null,zIndex:null})),t.trigger("page:scroll",e)}},ready:function(n){d=n,t.expose("scroll",{get:function(){return d}}),t.trigger("scroll:ready",d)}}),t.expose("show",p),t.expose("hide",c)}},module.exports)},{componentId:"/zkit/lib/1.1/controllers/drawer-layout",controller:((module={}).exports=function(){let t=!0,i=!1,e=!1,a=!1,s=!0,r=null,l=null,d=null,p=280,o=960,c=!1,f=0;const m=this;function u(){l.visibility("initial").css("left",0).get().focus(),e&&(l.find("a").one("click",function(){h()}),r.css("opacity","initial"),r.show()),t||(t=!0,m.trigger("drawer:open",{smallScreen:e}))}function h(){var n;e&&(n=function(){t||l.visibility("hidden")},l.one("transitionend transitioncancel",function(){n()}),l.css("left",-p+"px"),r.hide(),t&&(t=!1,m.trigger("drawer:close",{smallScreen:e}))),t=!1,l.find("a").off("click")}function n(){return t}function x(){(window.innerWidth||document.body.clientWidth)<o||-1===o||c?(e&&!s||(e=!0,i=!1,g()),h()):(e||s)&&(e&&(r.hide(),t&&h()),e=!1,i=!0,g(),u())}function g(){var n;s||w(),d&&(n=parseFloat(getComputedStyle(d.get(),null).getPropertyValue("padding-left")),e?d.css({paddingLeft:n-p+"px"}):d.css({paddingLeft:p+n+"px"})),m.trigger("layout:change",{smallScreen:e,drawerLocked:i})}function w(){var n;a||(a=!0,n="ease .15s",l.css({"transition-property":"left",transition:n}),r.css({"transition-property":"opacity",transition:n}))}m.init=function(){const n=m.view();this.options().html=!1,this.options().css=!1,isNaN(this.options().drawerWidth)?(e=parseInt(n.attr("data-o-width")),isNaN(e)||(p=e)):p=parseInt(this.options().drawerWidth);{var e;isNaN(this.options().autoHideWidth)?(e=parseInt(n.attr("data-o-hide-width")),isNaN(e)||(o=e)):o=parseInt(this.options().autoHideWidth)}},m.create=function(){l=m.view(),d=m.options().mainContent,(r=zuix.$(document.createElement("div"))).css({position:"fixed",top:0,left:0,bottom:0,right:0,"z-index":100,"background-color":"rgba(0, 0, 0, 0.5)"}).on("click",function(){i||h()}).hide(),l.parent().append(r.get()),l.css({position:"fixed","overflow-y":"auto",left:0,width:p+"px",top:0,bottom:0,"z-index":101,"-webkit-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","-moz-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)"}).attr("tabindex",0);let o=!1;zuix.load("@lib/controllers/gesture-helper",{view:document.documentElement,on:{"gesture:touch":function(n,e){i||(w(),f=t&&e.startX<p?p-e.startX:0)},"gesture:release":function(n,e){i||o&&(o=!1,w(),(0<e.velocity?u:h)())},"gesture:pan":function(n,e){if(!i&&"horizontal"===e.scrollIntent()&&((o||t)&&e.x<p||!o&&e.x<50)){o=o||!0,w();{let n=e.x;0<n&&n<=p-f&&(n=-p+n+f,"hidden"===l.visibility()&&l.visibility("initial"),l.css("left",n+"px"),"none"===r.display()&&r.show(),r.css("opacity",(p+n)/p))}a&&(a=!1,l.css({transition:"none"}),r.css({transition:"none"}))}}}}),m.expose("toggle",function(){w(),(t?h:u)()}),m.expose("open",function(){w(),u()}),m.expose("close",function(){w(),h()}),m.expose("isOpen",n),m.expose("lock",function(n){if(null==n)return i;i=n}),m.expose("float",function(n){if(null==n)return c;c=n,x()}),l.on("keydown",function(n){27===(n=n||window.event).keyCode&&h()}),x(),s=!1,window.addEventListener("resize",function(){x()})}},module.exports)}]);