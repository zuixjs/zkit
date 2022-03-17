zuix.setComponentCache([{componentId:"/zkit/lib/1.1/components/context-menu",controller:(module={exports:function(){let t,e,n,o;const i=this;function s(){o.show(),clearTimeout(t),t=setTimeout(function(){n.css("opacity",1),e.css("bottom",0).get().focus(),i.trigger("open")},10)}function r(){e.one("transitionend",function(){n.one("transitionend",function(){o.hide(),i.trigger("close")})}),n.css("opacity",0),e.css("bottom",-e.position().rect.height+"px")}i.create=function(){(e=i.field("menu")).css("bottom",-e.position().rect.height+"px"),o=i.view(),n=o.hide().find(".container").css("opacity",0).on("click",function(){r()}).on("keydown",function(t){27===(t=t||window.event).keyCode&&r()}),zuix.load("@lib/controllers/gesture-helper",{view:o,on:{"gesture:pan":function(t,n){e.hasClass("no-transition")||e.addClass("no-transition"),0<n.shiftY&&e.css("bottom",-n.shiftY+"px")},"gesture:release":function(t,n){e.removeClass("no-transition"),n.velocity<=0&&"up"===n.direction?e.css("bottom",0):"down"===n.direction&&r()}}}),i.expose("show",s),i.expose("hide",r)}}}).exports,css:".container {\n    position: fixed;\n    bottom:0;\n    left:0;\n    right: 0;\n    top: 0;\n    -ms-touch-action: none;\n    touch-action: none;\n    background: rgba(0,0,0,0.5);\n    z-index: 200;\n    transition: opacity 0.2s ease-in;\n}\n.menu {\n    outline: none !important;\n    margin-left: auto;\n    margin-right: auto;\n    left: 50%;\n    transform: translateX(-50%);\n    position: absolute;\n    width: 100%;\n    max-width: 420px;\n    background: white;\n    border: solid 1px rgba(0,0,0,0.1);\n    border-radius: 16px 16px 0 0;\n    box-shadow: 0 -5px 5px -5px #333;\n    transition: bottom 0.3s ease-in-out;\n}\nbutton {\n    width: 100%;\n    height:48px;\n    padding: 16px;\n    background: none!important;\n    border: none;\n}\nbutton span {\n    font-family: sans-serif, Helvetica;\n    font-size: 120%;\n    margin-left: 24px;\n}\nbutton i {\n    /*color: gray;*/\n    font-size: 140%;\n    margin-left: 8px;\n}\nbutton:hover {\n    background: rgba(0,0,0,0.1);\n}\n.no-transition {\n    transition: none;\n}\n",view:'<div class="container">\n    <div #menu="" class="menu" tabindex="0"></div>\n</div>\n'},{componentId:"/zkit/lib/1.1/controllers/scroll-helper",controller:function(){function t(e,o){let i=void 0,s=void 0;return function(){const t=this,n=arguments;s?(clearTimeout(i),i=setTimeout(function(){Date.now()-s>=o&&(e.apply(t,n),s=Date.now())},o-(Date.now()-s))):(e.apply(t,n),s=Date.now())}}return(module={}).exports=function(){const s={timestamp:0,size:{width:0,height:0},viewport:{x:0,y:0,width:0,height:0}};let n,e,i,r=0,c;const l=this;function a(){null!=n&&clearTimeout(n);var t=(new Date).getTime();if(100<t-s.timestamp?d():n=setTimeout(function(){d()},99),!(t<r&&t-c<66)){c=t;const o="scroll-helper-visible";null!=e&&null!=i&&e.each(function(t,n){const e=this.position();if(!e.visible&&this.hasClass(o))this.removeClass(o),e.event="exit";else if(e.visible){if(!e.visible)return;this.hasClass(o)?e.event="scroll":(e.event="enter",this.addClass(o))}else e.event="off-scroll";i(this,e)})}}function d(){const t=l.view().get();var n=t.getBoundingClientRect();const e={top:n.top,right:n.right,bottom:n.bottom,left:n.left,width:n.width,height:n.height,x:n.x,y:n.y};e.y=-l.view().get().scrollTop||e.y||0,e.height=l.view().get().scrollHeight||e.height||0,s.size.width=e.width,s.size.height=e.height,t===document.body?(s.size.width=document.body.offsetWidth,s.size.height=document.body.offsetHeight,s.viewport.width=document.documentElement.clientWidth||s.size.width,s.viewport.height=document.documentElement.clientHeight||s.size.height):(s.viewport.width=t.offsetWidth,s.viewport.height=t.offsetHeight),s.timestamp=(new Date).getTime(),s.shift={x:e.x-s.viewport.x,y:e.y-s.viewport.y},s.viewport.x=e.x,s.viewport.y=e.y,0==s.size.height+e.y-s.viewport.height||0===e.y?l.trigger("scroll:change",{event:0===e.y?"hit-top":"hit-bottom",info:s}):l.trigger("scroll:change",{event:"scroll",info:s})}function u(t,n){if((t instanceof Element||t instanceof zuix.$.ZxQuery)&&(t=zuix.$(t).position().y-s.viewport.y),-1===n)return p(t);var e=Date.now(),e=(n=(r=null!=n?e+n:r)-e,l.view().get());let o=0;o=e===document.body?void 0!==window.pageYOffset?window.pageYOffset:(document.documentElement||document.body.parentNode||document.body).scrollTop:e.scrollTop;e=t-o;if(n<=0||0==e)return p(t),void a();const i=o+e/n*33;requestAnimationFrame(function(){p(i),u(t)})}function p(t){const n=l.view().get();n===document.body?(document.documentElement.scrollTop=t,document.body.scrollTop=t):n.scrollTop=t}l.init=function(){l.options().html=!1,l.options().css=!1},l.create=function(){l.view().get()===document.body?0<l.options().throttle?window.onscroll=t(a,l.options().throttle):window.onscroll=a:0<l.options().throttle?l.view().on("scroll",t(a,l.options().throttle)):l.view().on("scroll",a);l.expose("watch",function(t,n){return t=t,n=n,i=null!=t?(e=l.view(t),n):e=null,l.context}),l.expose("scrollStart",function(t){return u(0,t=null==t?-1:t),l.context}).expose("scrollEnd",function(t){return null==t&&(t=-1),u(s.size.height,t),l.context}).expose("scrollTo",function(t,n){return u(t,n=null==n?-1:n),l.context}).expose("info",function(){return s}).expose("check",a)}},module.exports}()},{componentId:"/zkit/lib/1.1/controllers/mdl-button",controller:((module={}).exports=function(){this.create=()=>{const n=this.view(),t=this.options();var e=t.type||"raised";if(n.addClass("mdl-button mdl-js-button mdl-button--"+e+" mdl-js-ripple-effect"),t.class){const o=t.class.split(" ");o.forEach(t=>{n.addClass("mdl-button--"+t)})}e=n,zuix.activeRefresh(e,e,null,(t,n,e,o)=>{window.componentHandler?componentHandler.upgradeElements(t.get()):o(e,100,!0)}).start()}},module.exports)},{componentId:"/zkit/lib/1.1/controllers/drawer-layout",controller:((module={}).exports=function(){let o=!0,i=!1,n=!1,s=!1,r=!0,c=null,l=null,a=null,d=280,e=960,u=!1,p=0;const h=this;function f(){l.visibility("initial").css("left",0).get().focus(),n&&(l.find("a").one("click",function(){m()}),c.css("opacity","initial"),c.show()),o||(o=!0,h.trigger("drawer:open",{smallScreen:n}))}function m(){var t;n&&(t=function(){o||l.visibility("hidden")},l.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",function(){t()}),l.css("left",-d+"px"),c.hide(),o&&(o=!1,h.trigger("drawer:close",{smallScreen:n}))),o=!1,l.find("a").off("click")}function t(){return o}function g(){(window.innerWidth||document.body.clientWidth)<e||-1===e||u?(n&&!r||(n=!0,i=!1,w()),m()):(n||r)&&(n&&(c.hide(),o&&m()),n=!1,i=!0,w(),f())}function w(){var t;r||x(),a&&(t=parseFloat(getComputedStyle(a.get(),null).getPropertyValue("padding-left")),n?a.css({paddingLeft:t-d+"px"}):a.css({paddingLeft:d+t+"px"})),h.trigger("layout:change",{smallScreen:n,drawerLocked:i})}function x(){var t;s||(s=!0,t="ease .15s",l.css({"transition-property":"left",transition:t}),c.css({"transition-property":"opacity",transition:t}))}h.init=function(){const t=h.view();this.options().html=!1,this.options().css=!1,isNaN(this.options().drawerWidth)?(n=parseInt(t.attr("data-o-width")),isNaN(n)||(d=n)):d=parseInt(this.options().drawerWidth);{var n;isNaN(this.options().autoHideWidth)?(n=parseInt(t.attr("data-o-hide-width")),isNaN(n)||(e=n)):e=parseInt(this.options().autoHideWidth)}},h.create=function(){l=h.view(),a=h.options().mainContent,(c=zuix.$(document.createElement("div"))).css({position:"fixed",top:0,left:0,bottom:0,right:0,"z-index":100,"background-color":"rgba(0, 0, 0, 0.5)"}).on("click",function(){i||m()}).hide(),l.parent().append(c.get()),l.css({position:"fixed","overflow-y":"auto",left:0,width:d+"px",top:0,bottom:0,"z-index":101,"-webkit-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","-moz-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)"}).attr("tabindex",0);let e=!1;zuix.load("@lib/controllers/gesture-helper",{view:document.documentElement,on:{"gesture:touch":function(t,n){i||(x(),p=o&&n.startX<d?d-n.startX:0)},"gesture:release":function(t,n){i||e&&(e=!1,x(),(0<n.velocity?f:m)())},"gesture:pan":function(t,n){if(!i&&"horizontal"===n.scrollIntent()&&((e||o)&&n.x<d||!e&&n.x<50)){e=e||!0,x();{let t=n.x;0<t&&t<=d-p&&(t=-d+t+p,"hidden"===l.visibility()&&l.visibility("initial"),l.css("left",t+"px"),"none"===c.display()&&c.show(),c.css("opacity",(d+t)/d))}s&&(s=!1,l.css({transition:"none"}),c.css({transition:"none"}))}}}}),h.expose("toggle",function(){x(),(o?m:f)()}),h.expose("open",function(){x(),f()}),h.expose("close",function(){x(),m()}),h.expose("isOpen",t),h.expose("lock",function(t){if(null==t)return i;i=t}),h.expose("float",function(t){if(null==t)return u;u=t,g()}),l.on("keydown",function(t){27===(t=t||window.event).keyCode&&m()}),g(),r=!1,window.addEventListener("resize",function(){g()})}},module.exports)}]);