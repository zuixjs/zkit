zuix.setComponentCache([{componentId:"/zkit/lib/1.1/controllers/header-auto-hide",controller:((module={}).exports=function(t){let i,n,s,a,r=0,l;function d(){null!=i&&i.hasClass("header-collapse")&&i.removeClass("header-collapse").addClass("header-expand"),null!=n&&n.hasClass("footer-collapse")&&n.removeClass("footer-collapse").addClass("footer-expand"),l&&l.check()}function c(){i.hasClass("header-collapse")||i.removeClass("header-expand").addClass("header-collapse"),null==n||n.hasClass("footer-collapse")||n.removeClass("footer-expand").addClass("footer-collapse")}t.init=function(){t.options().css=!1,t.options().html=!1},t.create=function(){if(!(i=t.options().header||t.view().attr("data-o-header")))throw new Error("Header element not specified.");if(0===(i=zuix.field(i)).length())throw new Error('Header element not found: "'+i+'".');s=i.position().rect.height;var e=getComputedStyle(i.get()).position;"fixed"!==e&&"absolute"!==e&&(r=s);const o=t.view();zuix.$.appendCss("\n/* Header bar shrink/expand */\n@keyframes header-collapse-anim {\n  from { top: 0; }\n  to { top: -"+s+"px; }\n}\n@keyframes header-expand-anim {\n  from { top: -"+s+"px; }\n  to { top: 0; }\n}\n.header-collapse {\n  animation-fill-mode: forwards;\n  animation-name: header-collapse-anim;\n  animation-duration: 0.5s;\n  top: -"+s+"px;\n}\n.header-expand {\n  animation-fill-mode: forwards;\n  animation-name: header-expand-anim;\n  animation-duration: 0.5s;\n  top: 0px;\n}\n",null,"onscroll_header_hide_show");e=t.options().footer||t.view().attr("data-o-footer");null!=e&&((n=zuix.field(e)).css({position:"fixed",zIndex:1}),a=n.position().rect.height,zuix.$.appendCss("\n/* Footer bar shrink/expand */\n@keyframes footer-collapse-anim {\n  from { bottom: 0; }\n  to { bottom: -"+a+"px; }\n}\n@keyframes footer-expand-anim {\n  from { bottom: -"+a+"px; }\n  to { bottom: 0; }\n}\n.footer-collapse {\n  animation-fill-mode: forwards;\n  animation-name: footer-collapse-anim;\n  animation-duration: 0.5s;\n  bottom: -"+a+"px;\n}\n.footer-expand {\n  animation-fill-mode: forwards;\n  animation-name: footer-expand-anim;\n  animation-duration: 0.5s;\n  bottom: 0;\n}\n",null,"zkit_onscroll_hide_show")),zuix.load("@lib/controllers/scroll-helper",{view:o,on:{"scroll:change":function(e,n){"scroll"===n.event&&n.info.viewport.y<-r?n.info.shift.y<-4?(0<r&&"fixed"!==i.css("position")&&(o.css({paddingTop:s+"px"}),i.hide().css({position:"fixed",zIndex:1})),c()):4<n.info.shift.y&&(i.show(),d()):"hit-bottom"===n.event?(i.show(),d()):0<r&&0===n.info.viewport.y&&(o.css({paddingTop:null}),i.show().css({position:null,zIndex:null})),t.trigger("page:scroll",n)}},ready:function(e){l=e,t.expose("scroll",{get:function(){return l}}),t.trigger("scroll:ready",l)}}),t.expose("show",d),t.expose("hide",c)}},module.exports)},{componentId:"/zkit/lib/1.1/controllers/list-view",controller:(module={},zuix.controller(function(a){const r="full",l="paged",d="incremental";let c=r,p=30;const u={page:{current:0,count:0},items:{loaded:0,count:0}},f=[];function e(e){if(!isNaN(e)&&0<=e&&e<h()){if(c==l){var n=u.page.current,o=a.model().itemList;if(null!=o){var t=n*p;for(let e=t;e<f.length&&e<t+p;e++){var i=a.model().getItem(e,o[e]).itemId;void 0!==f[i]&&(f[i].style.display="none")}}}u.page.current=parseInt(e),a.update()}return u.page.current}function m(){a.trigger("status",u)}function h(){return Math.ceil(a.model().itemList.length/p)}function n(e){null!=e.itemsPerPage&&(p=e.itemsPerPage),null!=e.listMode&&(c=e.listMode)}function o(){for(let e=0;e<f.length;e++)zuix.unload(f[e]);f.length=0,u.page.current=0,u.page.count=0,u.items.loaded=0,u.items.count=0,a.view().html("")}a.init=function(){a.options().html=!1,a.options().css=!1},a.create=function(){a.expose("config",n),a.expose("page",e),a.expose("status",m),a.expose("more",function(){u.page.current++,a.update()}),a.expose("clear",o),o()},a.destroy=function(){o()},a.update=function(){const t=a.model().itemList;if(null!=t){u.page.count=h(),u.items.count=t.length;var n=u.page.current*p;let e=0;for(c===l&&0<n&&(e=n);e<t.length;e++){var o=a.model().getItem(e,t[e]),i=o.itemId;if(c===r||c===l&&e>=n&&e<n+p||c===d&&e<n+p)if(void 0===f[i]){const s=zuix.createComponent(o.componentId,o.options).container();null!=o.options.className?s.classList.add(o.options.className):s.style["min-height"]=o.options.height||"48px";(function(e,n){function o(){n.removeEventListener("component:ready",o),u.items.loaded++,m(),e===t.length-1&&a.trigger("complete")}s.addEventListener("component:ready",o)})(e,s);f[i]=s,a.view().insert(e-n,f[i])}else o.options.static||zuix.context(f[i]).model(o.options.model);if(void 0!==f[i]&&(c===l&&e<u.page.current*p||c!==r&&e>(u.page.current+1)*p-1?f[i].style.display="none":f[i].style.display=""),(c===l||c===d)&&e>n+p)break}m(),zuix.componentize(a.view())}}}),module.exports)},{componentId:"/zkit/lib/1.1/controllers/drawer-layout",controller:((module={}).exports=function(){let t=!0,i=!1,n=!1,s=!1,a=!0,r=null,l=null,d=null,c=280,o=960,p=!1,u=0;const f=this;function m(){l.visibility("initial").css("left",0).get().focus(),n&&(l.find("a").one("click",function(){h()}),r.css("opacity","initial"),r.show()),t||(t=!0,f.trigger("drawer:open",{smallScreen:n}))}function h(){var e;n&&(e=function(){t||l.visibility("hidden")},l.one("transitionend transitioncancel",function(){e()}),l.css("left",-c+"px"),r.hide(),t&&(t=!1,f.trigger("drawer:close",{smallScreen:n}))),t=!1,l.find("a").off("click")}function e(){return t}function x(){(window.innerWidth||document.body.clientWidth)<o||-1===o||p?(n&&!a||(n=!0,i=!1,g()),h()):(n||a)&&(n&&(r.hide(),t&&h()),n=!1,i=!0,g(),m())}function g(){var e;a||w(),d&&(e=parseFloat(getComputedStyle(d.get(),null).getPropertyValue("padding-left")),n?d.css({paddingLeft:e-c+"px"}):d.css({paddingLeft:c+e+"px"})),f.trigger("layout:change",{smallScreen:n,drawerLocked:i})}function w(){var e;s||(s=!0,e="ease .15s",l.css({"transition-property":"left",transition:e}),r.css({"transition-property":"opacity",transition:e}))}f.init=function(){const e=f.view();this.options().html=!1,this.options().css=!1,isNaN(this.options().drawerWidth)?(n=parseInt(e.attr("data-o-width")),isNaN(n)||(c=n)):c=parseInt(this.options().drawerWidth);{var n;isNaN(this.options().autoHideWidth)?(n=parseInt(e.attr("data-o-hide-width")),isNaN(n)||(o=n)):o=parseInt(this.options().autoHideWidth)}},f.create=function(){l=f.view(),d=f.options().mainContent,(r=zuix.$(document.createElement("div"))).css({position:"fixed",top:0,left:0,bottom:0,right:0,"z-index":100,"background-color":"rgba(0, 0, 0, 0.5)"}).on("click",function(){i||h()}).hide(),l.parent().append(r.get()),l.css({position:"fixed","overflow-y":"auto",left:0,width:c+"px",top:0,bottom:0,"z-index":101,"-webkit-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","-moz-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)"}).attr("tabindex",0);let o=!1;zuix.load("@lib/controllers/gesture-helper",{view:document.documentElement,on:{"gesture:touch":function(e,n){i||(w(),u=t&&n.startX<c?c-n.startX:0)},"gesture:release":function(e,n){i||o&&(o=!1,w(),(0<n.velocity?m:h)())},"gesture:pan":function(e,n){if(!i&&"horizontal"===n.scrollIntent()&&((o||t)&&n.x<c||!o&&n.x<50)){o=o||!0,w();{let e=n.x;0<e&&e<=c-u&&(e=-c+e+u,"hidden"===l.visibility()&&l.visibility("initial"),l.css("left",e+"px"),"none"===r.display()&&r.show(),r.css("opacity",(c+e)/c))}s&&(s=!1,l.css({transition:"none"}),r.css({transition:"none"}))}}}}),f.expose("toggle",function(){w(),(t?h:m)()}),f.expose("open",function(){w(),m()}),f.expose("close",function(){w(),h()}),f.expose("isOpen",e),f.expose("lock",function(e){if(null==e)return i;i=e}),f.expose("float",function(e){if(null==e)return p;p=e,x()}),l.on("keydown",function(e){27===(e=e||window.event).keyCode&&h()}),x(),a=!1,window.addEventListener("resize",function(){x()})}},module.exports)}]);