zuix.setComponentCache([{componentId:"/zkit/lib/1.1/controllers/header-auto-hide",controller:((module={}).exports=function(i){let o,e,a,s,r,l=0,c;function d(){null!=o&&o.hasClass("header-collapse")&&o.removeClass("header-collapse").addClass("header-expand"),null!=e&&e.hasClass("footer-collapse")&&e.removeClass("footer-collapse").addClass("footer-expand"),c&&c.check()}function u(){o.hasClass("header-collapse")||o.removeClass("header-expand").addClass("header-collapse"),null==e||e.hasClass("footer-collapse")||e.removeClass("footer-expand").addClass("footer-collapse")}i.init=function(){i.options().css=!1,i.options().html=!1},i.create=function(){if(a=i.options().showEnd||"true"===i.view().attr("data-o-show-end"),!(o=i.options().header||i.view().attr("data-o-header")))throw new Error("Header element not specified.");if(0===(o=zuix.field(o)).length())throw new Error('Header element not found: "'+o+'".');s=o.position().rect.height;var t=getComputedStyle(o.get()).position;"fixed"!==t&&"absolute"!==t&&(l=s);const n=i.view();zuix.$.appendCss("\n/* Header bar shrink/expand */\n@keyframes header-collapse-anim {\n  from { top: 0; }\n  to { top: -"+s+"px; }\n}\n@keyframes header-expand-anim {\n  from { top: -"+s+"px; }\n  to { top: 0; }\n}\n.header-collapse {\n  animation-fill-mode: forwards;\n  animation-name: header-collapse-anim;\n  animation-duration: 0.5s;\n  top: -"+s+"px;\n}\n.header-expand {\n  animation-fill-mode: forwards;\n  animation-name: header-expand-anim;\n  animation-duration: 0.5s;\n  top: 0px;\n}\n",null,"onscroll_header_hide_show");t=i.options().footer||i.view().attr("data-o-footer");null!=t&&((e=zuix.field(t)).css({position:"fixed",zIndex:1}),r=e.position().rect.height,zuix.$.appendCss("\n/* Footer bar shrink/expand */\n@keyframes footer-collapse-anim {\n  from { bottom: 0; }\n  to { bottom: -"+r+"px; }\n}\n@keyframes footer-expand-anim {\n  from { bottom: -"+r+"px; }\n  to { bottom: 0; }\n}\n.footer-collapse {\n  animation-fill-mode: forwards;\n  animation-name: footer-collapse-anim;\n  animation-duration: 0.5s;\n  bottom: -"+r+"px;\n}\n.footer-expand {\n  animation-fill-mode: forwards;\n  animation-name: footer-expand-anim;\n  animation-duration: 0.5s;\n  bottom: 0;\n}\n",null,"zkit_onscroll_hide_show")),zuix.load("@lib/controllers/scroll-helper",{view:n,on:{"scroll:change":function(t,e){"scroll"===e.event&&e.info.viewport.y<-l?e.info.shift.y<-4?(0<l&&"fixed"!==o.css("position")&&(n.css({paddingTop:s+"px"}),o.hide().css({position:"fixed",zIndex:1})),u()):4<e.info.shift.y&&(o.show(),d()):"hit-bottom"===e.event&&a?(o.show(),d()):0<l&&0===e.info.viewport.y&&(n.css({paddingTop:null}),o.show().css({position:null,zIndex:null})),i.trigger("page:scroll",e)}},ready:function(t){c=t,i.expose("scroll",{get:function(){return c}}),i.trigger("scroll:ready",c)}}),i.expose("show",d),i.expose("hide",u)}},module.exports)},{componentId:"/zkit/lib/1.1/controllers/view-pager",controller:((module={}).exports=function(){const a={duration:.3,easing:"ease"},_="cubic-bezier(0.0,0.1,0.35,1.1)",$="cubic-bezier(0.0,0.1,0.35,1.0)",d="horizontal",u="vertical",o=1,P=-1;let s=-1,r=0,n=null,i=3e3,l=o,t=null,c=!1,p=d,h=!1,f=!1,X=!1,B=!0,D=0,G=!1,g=!1,O=!1,e=!1,x=!1,m={width:0,height:0},v=null,w=null,y=null;const b=new MutationObserver(function(t,e){y=z.view().children(),I()}),z=this;function I(){null!=t&&clearTimeout(t),t=setTimeout(k,250)}function k(t){if(t||!g&&null==v){y.each(function(t,e){this.css({position:"absolute",left:0,top:0})});const o=M(z.view().get());if(0===o.width||0===o.height){if(0===o.height&&z.view().position().visible){let n=0;y.each(function(t,e){e=M(e);e.height>n&&(n=e.height)}),o.height<n&&z.view().css("height",n+"px")}I()}else{m=o;let n=0,i=!1;y.each(function(t,e){e=M(e);if(p===d){let t=(o.height-e.height)/2;t<0&&(t=0),Z(this,a),U(this,n,t),n+=e.width}else{let t=(o.width-e.width)/2;t<0&&(t=0),Z(this,a),U(this,t,n),n+=e.height}("true"===this.attr("data-ui-lazyload,z-lazy")||0<this.find('[data-ui-lazyload="true"],[z-lazy="true"]').length())&&(i=!0)}),e=i,F(s),1<y.length()&&L()}}else I()}function C(){let t=!1,e=parseInt(s)+1;return e>=y.length()&&(e=y.length()-1,t=!0),F(e,a),!t}function T(){let t=!1,e=parseInt(s)-1;return e<0&&(e=0,t=!0),F(e,a),!t}function R(){F(0,a)}function V(){F(y.length()-1,a)}function Y(){z.view().position().visible&&F(parseInt(s)+l,a),L()}function L(t){var e;t&&(i=t),S(),!0===h&&(t=z.view().position().visible,n=t?(O||zuix.componentize(z.view()),e=y.eq(s).attr("slide-interval")||i,setTimeout(Y,e)):setTimeout(L,500),O=t)}function S(){null!=n&&clearTimeout(n)}function j(r,l){let c=0;return y.each(function(t,e){var n=W(this),t=(c=t,M(e));const i=n.position.x,o=n.position.y,a=t.width,s=t.height;if(p===d&&(i>r||i+a>r)||p===u&&(o>l||o+s>l))return!1}),c}function N(t,e){var n=z.view().position();F(j(t.x-n.x,t.y-n.y),null!=e?e:a)}function F(t,e){r=s,t<0?(l=o,t=0):t>=y.length()?(l=P,t=y.length()-1):t!==s&&(l=s<t?o:P),(s=t)!=r&&(y.eq(s).css("z-index",1),-1!==r&&y.eq(r).css("z-index",0),z.trigger("page:change",{in:s,out:r}));const n=y.eq(t);var t=W(n),i=M(n.get());A({x:(m.width-i.width)/2-t.position.x,y:(m.height-i.height)/2-t.position.y},e),L()}function A(e,n){var i=H(),o=W(y.eq(0));const a=y.eq(y.length()-1);var s=W(a);if(y.each(function(t,e){const n=W(this);var i=H();n.dragStart={x:i.marginLeft+n.position.x,y:i.marginTop+n.position.y}}),p===d){let t=e.x;0<o.position.x+e.x?t=-o.position.x:s.position.x+a.get().offsetWidth+e.x<m.width&&(t=2*-i.marginLeft+m.width-(s.position.x+a.get().offsetWidth)),e.x-t!=0&&null!=n&&(n={duration:n.duration*(t/e.x),easing:_},(!isFinite(n.duration)||n.duration<0)&&(n.duration=.2)),q(t,0,n)}else{let t=e.y;0<o.position.y+e.y?t=-o.position.y:s.position.y+a.get().offsetHeight+e.y<m.height&&(t=2*-i.marginTop+m.height-(s.position.y+a.get().offsetHeight)),e.y-t!=0&&null!=n&&(n={duration:n.duration*(t/e.y),easing:_},(!isFinite(n.duration)||n.duration<0)&&(n.duration=.2)),q(0,t,n)}x=!0}function M(t){var e=t.getBoundingClientRect();return{width:e.width||t.offsetWidth,height:t.offsetHeight||e.height}}function W(t){const e=t.get().data=t.get().data||{};return e.position=e.position||{x:0,y:0},e}function E(){e&&null==w&&clearInterval(v)}function H(){const n={w:0,h:0,marginLeft:0,marginTop:0};return y.each(function(t,e){e=M(e);n.w+=e.width,n.h+=e.height}),p===d&&n.w<m.width?n.marginLeft=(m.width-n.w)/2:p===u&&n.h<m.height&&(n.marginTop=(m.height-n.h)/2),n}function q(i,o,a){null!=a?(e&&(E(),null!=w&&clearTimeout(w),null!=v&&clearInterval(v),v=setInterval(function(){G&&y.each(function(t,e){const n=window.getComputedStyle(e,null),i=parseFloat(n.width.replace("px","")),o=parseFloat(n.height.replace("px",""));var a=parseFloat(n.left.replace("px","")),s=parseFloat(n.top.replace("px",""));if(0<i&&0<o){e=zuix.$(e);const r=-m.width/2,l=1.5*m.width,c=-m.height/2,d=1.5*m.height;a+i<r||s+o<c||a>l||s>d?"hidden"!==e.visibility()&&e.visibility("hidden"):"visible"!==e.visibility()&&e.visibility("visible")}}),zuix.componentize(z.view())},10)),w=setTimeout(function(){w=null,E()},1e3*a.duration),a=a.duration+"s "+a.easing):e&&zuix.componentize(z.view()),y.each(function(t,e){var n=W(this);Z(this,a),U(this,n.dragStart.x+i,n.dragStart.y+o)})}function J(t,e){var n;g&&e.scrollIntent()&&!e.done&&(!c&&("left"!==e.direction&&"right"!==e.direction||p!==d)&&("up"!==e.direction&&"down"!==e.direction||p!==u)||(c||null!=e.event.touches||z.view().get().addEventListener("click",function(t){c&&(c=!1,t.cancelBubble=!0,t.preventDefault()),z.view().get().removeEventListener("click",this,!0)},!0),c=!0,e.cancel()),n=H(),p===d&&"horizontal"===e.scrollIntent()?q(e.shiftX-n.marginLeft,0):p===u&&"vertical"===e.scrollIntent()&&q(0,e.shiftY-n.marginTop))}function K(t){return!f||1.25<Math.abs(t.velocity)}function Q(t,e){if(tt(e)&&!K(e))switch(e.direction){case"right":p===d&&T();break;case"left":p===d&&C();break;case"down":p===u&&T();break;case"up":p===u&&C()}}function U(t,e,n){const i=W(t);isNaN(e)||isNaN(n)||(i.position={x:e,y:n},t.css({left:i.position.x+"px",top:i.position.y+"px"})),i}function Z(t,e){t.css({transition:e=null==e?"none":e})}function tt(t){let e=document.elementsFromPoint(t.x,t.y);return(!(0<e.length)||z.view().get().contains(e[0]))&&(0<(e=e.filter(t=>t.attributes["z-load"]&&t.attributes["z-load"].value===z.view().attr("z-load"))).length&&e[0]===z.view().get())}z.init=function(){const t=z.options(),e=z.view();t.html=!1,t.css=!1,f=!0===t.enablePaging||"true"===e.attr("data-o-paging"),h=!0===t.autoSlide||"true"===e.attr("data-o-slide"),B=!1!==t.passive&&"false"!==e.attr("data-o-passive"),X=!0===t.holdTouch||"true"===e.attr("data-o-hold"),D=t.startGap||e.attr("data-o-startgap"),!0!==t.verticalLayout&&e.attr("data-o-layout")!==u||(p=u),null!=t.slideInterval?i=t.slideInterval:null!=e.attr("data-o-slide-interval")&&(i=parseInt(e.attr("data-o-slide-interval"))),G=!0===t.autohide||"true"===e.attr("data-o-autohide")},z.create=function(){const t=z.view().css({position:"relative",overflow:"hidden"});y=t.children(),t.find("img").each(function(t,e){this.one("load",I)}),zuix.$(window).on("resize",function(){k(!0)}).on("orientationchange",function(){k(!0)}),b.observe(t.get(),{attributes:!1,childList:!0,subtree:!0,characterData:!1}),I();let e=null;zuix.load("@lib/controllers/gesture-helper",{view:t,passive:B,startGap:D,on:{"gesture:touch":function(t,e){tt(e)&&(c=!1,S(),g=!0,x=!1,y.each(function(t,e){const n=W(this);var i=H();const o=window.getComputedStyle(e,null);n.position.x=parseFloat(o.left.replace("px","")),n.position.y=parseFloat(o.top.replace("px","")),this.css("left",n.position.x+"px"),this.css("top",n.position.y+"px"),n.dragStart={x:i.marginLeft+n.position.x,y:i.marginTop+n.position.y}}),X&&e.cancel())},"gesture:release":function(t,e){if(null!=e&&(e.done=!0,!x&&(p===d&&"horizontal"===e.scrollIntent()||p===u&&"vertical"===e.scrollIntent()))){var n=null,i=Math.exp(Math.abs(e.velocity/(Math.abs(e.velocity)<=1.25?5:2))+1);let t=.99+i/1e3;.999<t&&(t=.999);const s=Math.log(.01/Math.abs(e.velocity))/Math.log(t),r={duration:s/1e3,easing:$},l=e.stepSpeed<1.25?0:i*e.velocity*(1-Math.pow(t,1+s))/(1-t),c={x:l,y:l};if(K(e)||null==n){var o=e;var a=c;f?(r.duration*=.5,p===d?N({x:o.x-a.x,y:o.y},r):N({x:o.x,y:o.y-a.y},r)):A(a,r)}}E(),g=!1,L()},"gesture:tap":function(t,n){tt(n)&&(null!=e&&clearTimeout(e),e=setTimeout(function(){var t,e;t=n,e=z.view().position(),e=j(t.x-e.x,t.y-e.y),z.trigger("page:tap",e,t),f&&N(t)},50))},"gesture:pan":J,"gesture:swipe":Q},ready:function(){k(!0),F(0)}}),z.expose("page",function(t){if(null==t)return parseInt(s);F(t,a)}).expose("get",function(t){return t<y.length()&&0<y.length()?y.eq(t):null}).expose("slide",function(t){!1!==t?L((h=!0)!==t?t:i):S()}).expose("layout",function(t){if(null==t)return p;p=t===u?u:d,I()}).expose("refresh",function(){k(!0)}).expose("next",C).expose("prev",T).expose("last",V).expose("first",R)},z.destroy=function(){null!=b&&b.disconnect()}},module.exports)},{componentId:"/zkit/lib/1.1/controllers/drawer-layout",controller:((module={}).exports=function(){let i=!0,o=!1,e=!1,a=!1,s=!0,r=null,l=null,c=null,d=280,n=960,u=!1,p=0;const h=this;function f(){l.visibility("initial").css("left",0).get().focus(),e&&(l.find("a").one("click",function(){g()}),r.css("opacity","initial"),r.show()),i||(i=!0,h.trigger("drawer:open",{smallScreen:e}))}function g(){var t;e&&(t=function(){i||l.visibility("hidden")},l.one("transitionend transitioncancel",function(){t()}),l.css("left",-d+"px"),r.hide(),i&&(i=!1,h.trigger("drawer:close",{smallScreen:e}))),i=!1,l.find("a").off("click")}function t(){return i}function x(){(window.innerWidth||document.body.clientWidth)<n||-1===n||u?(e&&!s||(e=!0,o=!1,m()),g()):(e||s)&&(e&&(r.hide(),i&&g()),e=!1,o=!0,m(),f())}function m(){var t;s||v(),c&&(t=parseFloat(getComputedStyle(c.get(),null).getPropertyValue("padding-left")),e?c.css({paddingLeft:t-d+"px"}):c.css({paddingLeft:d+t+"px"})),h.trigger("layout:change",{smallScreen:e,drawerLocked:o})}function v(){var t;a||(a=!0,t="ease .15s",l.css({"transition-property":"left",transition:t}),r.css({"transition-property":"opacity",transition:t}))}h.init=function(){const t=h.view();this.options().html=!1,this.options().css=!1,isNaN(this.options().drawerWidth)?(e=parseInt(t.attr("data-o-width")),isNaN(e)||(d=e)):d=parseInt(this.options().drawerWidth);{var e;isNaN(this.options().autoHideWidth)?(e=parseInt(t.attr("data-o-hide-width")),isNaN(e)||(n=e)):n=parseInt(this.options().autoHideWidth)}},h.create=function(){l=h.view(),c=h.options().mainContent,(r=zuix.$(document.createElement("div"))).css({position:"fixed",top:0,left:0,bottom:0,right:0,"z-index":100,"background-color":"rgba(0, 0, 0, 0.5)"}).on("click",function(){o||g()}).hide(),l.parent().append(r.get()),l.css({position:"fixed","overflow-y":"auto",left:0,width:d+"px",top:0,bottom:0,"z-index":101,"-webkit-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","-moz-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)"}).attr("tabindex",0);let n=!1;zuix.load("@lib/controllers/gesture-helper",{view:document.documentElement,on:{"gesture:touch":function(t,e){o||(v(),p=i&&e.startX<d?d-e.startX:0)},"gesture:release":function(t,e){o||n&&(n=!1,v(),(0<e.velocity?f:g)())},"gesture:pan":function(t,e){if(!o&&"horizontal"===e.scrollIntent()&&((n||i)&&e.x<d||!n&&e.x<50)){n=n||!0,v();{let t=e.x;0<t&&t<=d-p&&(t=-d+t+p,"hidden"===l.visibility()&&l.visibility("initial"),l.css("left",t+"px"),"none"===r.display()&&r.show(),r.css("opacity",(d+t)/d))}a&&(a=!1,l.css({transition:"none"}),r.css({transition:"none"}))}}}}),h.expose("toggle",function(){v(),(i?g:f)()}),h.expose("open",function(){v(),f()}),h.expose("close",function(){v(),g()}),h.expose("isOpen",t),h.expose("lock",function(t){if(null==t)return o;o=t}),h.expose("float",function(t){if(null==t)return u;u=t,x()}),l.on("keydown",function(t){27===(t=t||window.event).keyCode&&g()}),x(),s=!1,window.addEventListener("resize",function(){x()})}},module.exports)}]);