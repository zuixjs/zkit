zuix.setComponentCache([{componentId:"/zkit/lib/1.1/templates/mdl-card-image",controller:(module={}).exports,css:':host {\n    font-family: "Roboto","Helvetica","Arial",sans-serif !important;\n    transition: box-shadow 0.2s ease-in-out;\n}\n\n.mdl-card {\n    width: 256px;\n    height: 256px;                 /* 259 306 317 342 392 292 */\n    background: url(\'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\');\n    background-repeat: no-repeat!important;\n    background-position: center!important;\n}\n.mdl-card__actions {\n    height: 52px;\n    padding: 16px;\n    border-top: solid 1px rgba(255,255,255, 0.4);\n    background: rgba(0, 0, 0, 0.5);\n}\n.title {\n    color: #fff;\n    font-size: 110%;\n    font-weight: 500;\n}\n.mdl-ripple {\n    background: #fff;\n}\n.mdl-card__title {\n    align-items: start;\n}\n.mdl-card__title span {\n    width: 100%;\n    font-size: 95%;\n    padding-left: 3px;\n    padding-right: 3px;\n    background: rgba(255,255,255,0.65);\n    border-radius: 3px;\n}\n',view:'<a #link.url="" href="#" class="mdl-card mdl-shadow--2dp mdl-js-ripple-effect animate__animated animate__fadeIn">\n    <div class="mdl-card__title mdl-card--expand animate__animated animate__fadeIn animate__slow">\n        <span #text=""></span>\n    </div>\n    <div class="mdl-card__actions animate__animated animate__fadeInUp animate__slow">\n        <span #title="" class="title"></span>\n    </div>\n    <span class="mdl-button__ripple-container">\n        <span class="mdl-ripple"></span>\n    </span>\n</a>\n<script type="jscript" using="componentHandler">\n  $.on(\'mouseover touchstart\', () => $.addClass(\'mdl-shadow--4dp\'));\n  $.on(\'mouseout touchend\', () => $.removeClass(\'mdl-shadow--4dp\'));\n  $.css({\n    backgroundImage: \'url(\' + model.image.src + \'?random=\' + Math.random() + \')\',\n    backgroundPosition: \'center\',\n    backgroundRepeat: \'no-repeat\'\n  });\n  // this is required for the MDL ripple effect\n  componentHandler.upgradeElements($.get().firstElementChild);\n<\/script>\n'},{componentId:"/zkit/lib/1.1/controllers/scroll-helper",controller:function(){function t(n,o){let i=void 0,s=void 0;return function(){const t=this,e=arguments;s?(clearTimeout(i),i=setTimeout(function(){Date.now()-s>=o&&(n.apply(t,e),s=Date.now())},o-(Date.now()-s))):(n.apply(t,e),s=Date.now())}}return(module={}).exports=function(){const s={timestamp:0,size:{width:0,height:0},viewport:{x:0,y:0,width:0,height:0}};let e,n,i,r=0,l;const a=this;function c(){null!=e&&clearTimeout(e);var t=(new Date).getTime();if(100<t-s.timestamp?d():e=setTimeout(function(){d()},99),!(t<r&&t-l<66)){l=t;const o="scroll-helper-visible";null!=n&&null!=i&&n.each(function(t,e){const n=this.position();if(!n.visible&&this.hasClass(o))this.removeClass(o),n.event="exit";else if(n.visible){if(!n.visible)return;this.hasClass(o)?n.event="scroll":(n.event="enter",this.addClass(o))}else n.event="off-scroll";i(this,n)})}}function d(){const t=a.view().get();var e=t.getBoundingClientRect();const n={top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.width,height:e.height,x:e.x,y:e.y};n.y=-a.view().get().scrollTop||n.y||0,n.height=a.view().get().scrollHeight||n.height||0,s.size.width=n.width,s.size.height=n.height,t===document.body?(s.size.width=document.body.offsetWidth,s.size.height=document.body.offsetHeight,s.viewport.width=document.documentElement.clientWidth||s.size.width,s.viewport.height=document.documentElement.clientHeight||s.size.height):(s.viewport.width=t.offsetWidth,s.viewport.height=t.offsetHeight),s.timestamp=(new Date).getTime(),s.shift={x:n.x-s.viewport.x,y:n.y-s.viewport.y},s.viewport.x=n.x,s.viewport.y=n.y,0==s.size.height+n.y-s.viewport.height||0===n.y?a.trigger("scroll:change",{event:0===n.y?"hit-top":"hit-bottom",info:s}):a.trigger("scroll:change",{event:"scroll",info:s})}function p(t,e){if((t instanceof Element||t instanceof zuix.$.ZxQuery)&&(t=zuix.$(t).position().y-s.viewport.y),-1===e)return u(t);var n=Date.now(),n=(e=(r=null!=e?n+e:r)-n,a.view().get());let o=0;o=n===document.body?void 0!==window.pageYOffset?window.pageYOffset:(document.documentElement||document.body.parentNode||document.body).scrollTop:n.scrollTop;n=t-o;if(e<=0||0==n)return u(t),void c();const i=o+n/e*33;requestAnimationFrame(function(){u(i),p(t)})}function u(t){const e=a.view().get();e===document.body?(document.documentElement.scrollTop=t,document.body.scrollTop=t):e.scrollTop=t}a.init=function(){a.options().html=!1,a.options().css=!1},a.create=function(){a.view().get()===document.body?0<a.options().throttle?window.onscroll=t(c,a.options().throttle):window.onscroll=c:0<a.options().throttle?a.view().on("scroll",{handler:t(c,a.options().throttle),passive:!0}):a.view().on("scroll",{handler:c,passive:!0});a.expose("watch",function(t,e){return t=t,e=e,i=null!=t?(n=a.view(t),e):n=null,a.context}),a.expose("scrollStart",function(t){return p(0,t=null==t?-1:t),a.context}).expose("scrollEnd",function(t){return null==t&&(t=-1),p(s.size.height,t),a.context}).expose("scrollTo",function(t,e){return p(t,e=null==e?-1:e),a.context}).expose("info",function(){return s}).expose("check",c)}},module.exports}()},{componentId:"/zkit/lib/1.1/controllers/drawer-layout",controller:((module={}).exports=function(){let o=!0,i=!1,e=!1,s=!1,r=!0,l=null,a=null,c=null,d=280,n=960,p=!1,u=0;const h=this;function f(){a.visibility("initial").css("left",0).get().focus(),e&&(a.find("a").one("click",function(){m()}),l.css("opacity","initial"),l.show()),o||(o=!0,h.trigger("drawer:open",{smallScreen:e}))}function m(){var t;e&&(t=function(){o||a.visibility("hidden")},a.one("transitionend transitioncancel",function(){t()}),a.css("left",-d+"px"),l.hide(),o&&(o=!1,h.trigger("drawer:close",{smallScreen:e}))),o=!1,a.find("a").off("click")}function t(){return o}function g(){(window.innerWidth||document.body.clientWidth)<n||-1===n||p?(e&&!r||(e=!0,i=!1,w()),m()):(e||r)&&(e&&(l.hide(),o&&m()),e=!1,i=!0,w(),f())}function w(){var t;r||x(),c&&(t=parseFloat(getComputedStyle(c.get(),null).getPropertyValue("padding-left")),e?c.css({paddingLeft:t-d+"px"}):c.css({paddingLeft:d+t+"px"})),h.trigger("layout:change",{smallScreen:e,drawerLocked:i})}function x(){var t;s||(s=!0,t="ease .15s",a.css({"transition-property":"left",transition:t}),l.css({"transition-property":"opacity",transition:t}))}h.init=function(){const t=h.view();this.options().html=!1,this.options().css=!1,isNaN(this.options().drawerWidth)?(e=parseInt(t.attr("data-o-width")),isNaN(e)||(d=e)):d=parseInt(this.options().drawerWidth);{var e;isNaN(this.options().autoHideWidth)?(e=parseInt(t.attr("data-o-hide-width")),isNaN(e)||(n=e)):n=parseInt(this.options().autoHideWidth)}},h.create=function(){a=h.view(),c=h.options().mainContent,(l=zuix.$(document.createElement("div"))).css({position:"fixed",top:0,left:0,bottom:0,right:0,"z-index":100,"background-color":"rgba(0, 0, 0, 0.5)"}).on("click",function(){i||m()}).hide(),a.parent().append(l.get()),a.css({position:"fixed","overflow-y":"auto",left:0,width:d+"px",top:0,bottom:0,"z-index":101,"-webkit-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","-moz-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)"}).attr("tabindex",0);let n=!1;zuix.load("@lib/controllers/gesture-helper",{view:document.documentElement,on:{"gesture:touch":function(t,e){i||(x(),u=o&&e.startX<d?d-e.startX:0)},"gesture:release":function(t,e){i||n&&(n=!1,x(),(0<e.velocity?f:m)())},"gesture:pan":function(t,e){if(!i&&"horizontal"===e.scrollIntent()&&((n||o)&&e.x<d||!n&&e.x<50)){n=n||!0,x();{let t=e.x;0<t&&t<=d-u&&(t=-d+t+u,"hidden"===a.visibility()&&a.visibility("initial"),a.css("left",t+"px"),"none"===l.display()&&l.show(),l.css("opacity",(d+t)/d))}s&&(s=!1,a.css({transition:"none"}),l.css({transition:"none"}))}}}}),h.expose("toggle",function(){x(),(o?m:f)()}),h.expose("open",function(){x(),f()}),h.expose("close",function(){x(),m()}),h.expose("isOpen",t),h.expose("lock",function(t){if(null==t)return i;i=t}),h.expose("float",function(t){if(null==t)return p;p=t,g()}),a.on("keydown",function(t){27===(t=t||window.event).keyCode&&m()}),g(),r=!1,window.addEventListener("resize",function(){g()})}},module.exports)}]);