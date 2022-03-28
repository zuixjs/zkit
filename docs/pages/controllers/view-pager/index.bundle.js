zuix.setComponentCache([{componentId:"/zkit/lib/1.1/controllers/scroll-helper",controller:function(){function t(i,n){let o=void 0,s=void 0;return function(){const t=this,e=arguments;s?(clearTimeout(o),o=setTimeout(function(){Date.now()-s>=n&&(i.apply(t,e),s=Date.now())},n-(Date.now()-s))):(i.apply(t,e),s=Date.now())}}return(module={}).exports=function(){const s={timestamp:0,size:{width:0,height:0},viewport:{x:0,y:0,width:0,height:0}};let e,i,o,l=0,r;const a=this;function c(){null!=e&&clearTimeout(e);var t=(new Date).getTime();if(100<t-s.timestamp?u():e=setTimeout(function(){u()},99),!(t<l&&t-r<66)){r=t;const n="scroll-helper-visible";null!=i&&null!=o&&i.each(function(t,e){const i=this.position();if(!i.visible&&this.hasClass(n))this.removeClass(n),i.event="exit";else if(i.visible){if(!i.visible)return;this.hasClass(n)?i.event="scroll":(i.event="enter",this.addClass(n))}else i.event="off-scroll";o(this,i)})}}function u(){const t=a.view().get();var e=t.getBoundingClientRect();const i={top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.width,height:e.height,x:e.x,y:e.y};i.y=-a.view().get().scrollTop||i.y||0,i.height=a.view().get().scrollHeight||i.height||0,s.size.width=i.width,s.size.height=i.height,t===document.body?(s.size.width=document.body.offsetWidth,s.size.height=document.body.offsetHeight,s.viewport.width=document.documentElement.clientWidth||s.size.width,s.viewport.height=document.documentElement.clientHeight||s.size.height):(s.viewport.width=t.offsetWidth,s.viewport.height=t.offsetHeight),s.timestamp=(new Date).getTime(),s.shift={x:i.x-s.viewport.x,y:i.y-s.viewport.y},s.viewport.x=i.x,s.viewport.y=i.y,0==s.size.height+i.y-s.viewport.height||0===i.y?a.trigger("scroll:change",{event:0===i.y?"hit-top":"hit-bottom",info:s}):a.trigger("scroll:change",{event:"scroll",info:s})}function h(t,e){if((t instanceof Element||t instanceof zuix.$.ZxQuery)&&(t=zuix.$(t).position().y-s.viewport.y),-1===e)return d(t);var i=Date.now(),i=(e=(l=null!=e?i+e:l)-i,a.view().get());let n=0;n=i===document.body?void 0!==window.pageYOffset?window.pageYOffset:(document.documentElement||document.body.parentNode||document.body).scrollTop:i.scrollTop;i=t-n;if(e<=0||0==i)return d(t),void c();const o=n+i/e*33;requestAnimationFrame(function(){d(o),h(t)})}function d(t){const e=a.view().get();e===document.body?(document.documentElement.scrollTop=t,document.body.scrollTop=t):e.scrollTop=t}a.init=function(){a.options().html=!1,a.options().css=!1},a.create=function(){a.view().get()===document.body?0<a.options().throttle?window.onscroll=t(c,a.options().throttle):window.onscroll=c:0<a.options().throttle?a.view().on("scroll",{handler:t(c,a.options().throttle),passive:!0}):a.view().on("scroll",{handler:c,passive:!0});a.expose("watch",function(t,e){return t=t,e=e,o=null!=t?(i=a.view(t),e):i=null,a.context}),a.expose("scrollStart",function(t){return h(0,t=null==t?-1:t),a.context}).expose("scrollEnd",function(t){return null==t&&(t=-1),h(s.size.height,t),a.context}).expose("scrollTo",function(t,e){return h(t,e=null==e?-1:e),a.context}).expose("info",function(){return s}).expose("check",c)}},module.exports}()},{componentId:"/zkit/lib/1.1/controllers/view-pager",controller:((module={}).exports=function(){const s={duration:.3,easing:"ease"},q="cubic-bezier(0.0,0.1,0.35,1.1)",$="cubic-bezier(0.0,0.1,0.35,1.0)",u="horizontal",h="vertical",o=1,O=-1;let l=-1,r=0,i=null,n=3e3,a=o,t=null,c=!1,d=u,p=!1,f=!1,B=!1,P=!0,X=0,Y=!1,g=!1,G=!1,e=!1,v=!1,w={width:0,height:0},x=null,y=null,m=null;const b=new MutationObserver(function(t,e){m=z.view().children(),T()}),z=this;function T(){null!=t&&clearTimeout(t),t=setTimeout(I,250)}function I(t){if(t||!g&&null==x){m.each(function(t,e){this.css({position:"absolute",left:0,top:0})});const o=E(z.view().get());if(0===o.width||0===o.height){if(0===o.height&&z.view().position().visible){let i=0;m.each(function(t,e){e=E(e);e.height>i&&(i=e.height)}),o.height<i&&z.view().css("height",i+"px")}T()}else{w=o;let i=0,n=!1;m.each(function(t,e){e=E(e);if(d===u){let t=(o.height-e.height)/2;t<0&&(t=0),_(this,s),U(this,i,t),i+=e.width}else{let t=(o.width-e.width)/2;t<0&&(t=0),_(this,s),U(this,t,i),i+=e.height}("true"===this.attr("data-ui-lazyload,z-lazy")||0<this.find('[data-ui-lazyload="true"],[z-lazy="true"]').length())&&(n=!0)}),e=n,W(l),1<m.length()&&C()}}else T()}function k(){let t=!1,e=parseInt(l)+1;return e>=m.length()&&(e=m.length()-1,t=!0),W(e,s),!t}function L(){let t=!1,e=parseInt(l)-1;return e<0&&(e=0,t=!0),W(e,s),!t}function R(){W(0,s)}function A(){W(m.length()-1,s)}function Q(){W(parseInt(l)+a,s),C()}function C(t){var e;t&&(n=t),N(),!0===p&&(t=z.view().position().visible,i=t?(G||zuix.componentize(z.view()),e=m.eq(l).attr("slide-interval")||n,setTimeout(Q,e)):setTimeout(C,500),G=t)}function N(){null!=i&&clearTimeout(i)}function V(r,a){let c=0;return m.each(function(t,e){var i=F(this),t=(c=t,E(e));const n=i.position.x,o=i.position.y,s=t.width,l=t.height;if(d===u&&(n>r||n+s>r)||d===h&&(o>a||o+l>a))return!1}),c}function S(t,e){var i=z.view().position();W(V(t.x-i.x,t.y-i.y),null!=e?e:s)}function W(t,e){r=l,t<0?(a=o,t=0):t>=m.length()?(a=O,t=m.length()-1):t!==l&&(a=l<t?o:O),(l=t)!=r&&(m.eq(l).css("z-index",1),-1!==r&&m.eq(r).css("z-index",0),z.trigger("page:change",{in:l,out:r}));const i=m.eq(t);var t=F(i),n=E(i.get());Z({x:(w.width-n.width)/2-t.position.x,y:(w.height-n.height)/2-t.position.y},e),C()}function Z(e,i){var n=H(),o=F(m.eq(0));const s=m.eq(m.length()-1);var l=F(s);if(m.each(function(t,e){const i=F(this);var n=H();i.dragStart={x:n.marginLeft+i.position.x,y:n.marginTop+i.position.y}}),d===u){let t=e.x;0<o.position.x+e.x?t=-o.position.x:l.position.x+s.get().offsetWidth+e.x<w.width&&(t=2*-n.marginLeft+w.width-(l.position.x+s.get().offsetWidth)),e.x-t!=0&&null!=i&&(i={duration:i.duration*(t/e.x),easing:q},(!isFinite(i.duration)||i.duration<0)&&(i.duration=.2)),M(t,0,i)}else{let t=e.y;0<o.position.y+e.y?t=-o.position.y:l.position.y+s.get().offsetHeight+e.y<w.height&&(t=2*-n.marginTop+w.height-(l.position.y+s.get().offsetHeight)),e.y-t!=0&&null!=i&&(i={duration:i.duration*(t/e.y),easing:q},(!isFinite(i.duration)||i.duration<0)&&(i.duration=.2)),M(0,t,i)}v=!0}function E(t){var e=t.getBoundingClientRect();return{width:e.width||t.offsetWidth,height:t.offsetHeight||e.height}}function F(t){const e=t.get().data=t.get().data||{};return e.position=e.position||{x:0,y:0},e}function D(){e&&null==y&&clearInterval(x)}function H(){const i={w:0,h:0,marginLeft:0,marginTop:0};return m.each(function(t,e){e=E(e);i.w+=e.width,i.h+=e.height}),d===u&&i.w<w.width?i.marginLeft=(w.width-i.w)/2:d===h&&i.h<w.height&&(i.marginTop=(w.height-i.h)/2),i}function M(n,o,s){null!=s?(e&&(D(),null!=y&&clearTimeout(y),null!=x&&clearInterval(x),x=setInterval(function(){Y&&m.each(function(t,e){const i=window.getComputedStyle(e,null),n=parseFloat(i.width.replace("px","")),o=parseFloat(i.height.replace("px",""));var s=parseFloat(i.left.replace("px","")),l=parseFloat(i.top.replace("px",""));if(0<n&&0<o){e=zuix.$(e);const r=-w.width/2,a=1.5*w.width,c=-w.height/2,u=1.5*w.height;s+n<r||l+o<c||s>a||l>u?"hidden"!==e.visibility()&&e.visibility("hidden"):"visible"!==e.visibility()&&e.visibility("visible")}}),zuix.componentize(z.view())},10)),y=setTimeout(function(){y=null,D()},1e3*s.duration),s=s.duration+"s "+s.easing):e&&zuix.componentize(z.view()),m.each(function(t,e){var i=F(this);_(this,s),U(this,i.dragStart.x+n,i.dragStart.y+o)})}function j(t,e){var i;g&&e.scrollIntent()&&!e.done&&(!c&&("left"!==e.direction&&"right"!==e.direction||d!==u)&&("up"!==e.direction&&"down"!==e.direction||d!==h)||(c||null!=e.event.touches||z.view().get().addEventListener("click",function(t){c&&(c=!1,t.cancelBubble=!0,t.preventDefault()),z.view().get().removeEventListener("click",this,!0)},!0),c=!0,e.cancel()),i=H(),d===u&&"horizontal"===e.scrollIntent()?M(e.shiftX-i.marginLeft,0):d===h&&"vertical"===e.scrollIntent()&&M(0,e.shiftY-i.marginTop))}function J(t){return!f||1.25<Math.abs(t.velocity)}function K(t,e){if(tt(e)&&!J(e))switch(e.direction){case"right":d===u&&L();break;case"left":d===u&&k();break;case"down":d===h&&L();break;case"up":d===h&&k()}}function U(t,e,i){const n=F(t);isNaN(e)||isNaN(i)||(n.position={x:e,y:i},t.css({left:n.position.x+"px",top:n.position.y+"px"})),n}function _(t,e){t.css({transition:e=null==e?"none":e})}function tt(t){let e=document.elementsFromPoint(t.x,t.y);return(!(0<e.length)||z.view().get().contains(e[0]))&&(0<(e=e.filter(t=>t.attributes["z-load"]&&t.attributes["z-load"].value===z.view().attr("z-load"))).length&&e[0]===z.view().get())}z.init=function(){const t=z.options(),e=z.view();t.html=!1,t.css=!1,f=!0===t.enablePaging||"true"===e.attr("data-o-paging"),p=!0===t.autoSlide||"true"===e.attr("data-o-slide"),P=!1!==t.passive&&"false"!==e.attr("data-o-passive"),B=!0===t.holdTouch||"true"===e.attr("data-o-hold"),X=t.startGap||e.attr("data-o-startgap"),!0!==t.verticalLayout&&e.attr("data-o-layout")!==h||(d=h),null!=t.slideInterval?n=t.slideInterval:null!=e.attr("data-o-slide-interval")&&(n=parseInt(e.attr("data-o-slide-interval"))),Y=!0===t.autohide||"true"===e.attr("data-o-autohide")},z.create=function(){const t=z.view().css({position:"relative",overflow:"hidden"});m=t.children(),t.find("img").each(function(t,e){this.one("load",T)}),zuix.$(window).on("resize",function(){I(!0)}).on("orientationchange",function(){I(!0)}),b.observe(t.get(),{attributes:!1,childList:!0,subtree:!0,characterData:!1}),T();let e=null;zuix.load("@lib/controllers/gesture-helper",{view:t,passive:P,startGap:X,on:{"gesture:touch":function(t,e){tt(e)&&(c=!1,N(),g=!0,v=!1,m.each(function(t,e){const i=F(this);var n=H();const o=window.getComputedStyle(e,null);i.position.x=parseFloat(o.left.replace("px","")),i.position.y=parseFloat(o.top.replace("px","")),this.css("left",i.position.x+"px"),this.css("top",i.position.y+"px"),i.dragStart={x:n.marginLeft+i.position.x,y:n.marginTop+i.position.y}}),B&&e.cancel())},"gesture:release":function(t,e){if(null!=e&&(e.done=!0,!v&&(d===u&&"horizontal"===e.scrollIntent()||d===h&&"vertical"===e.scrollIntent()))){var i=null,n=Math.exp(Math.abs(e.velocity/(Math.abs(e.velocity)<=1.25?5:2))+1);let t=.99+n/1e3;.999<t&&(t=.999);const l=Math.log(.01/Math.abs(e.velocity))/Math.log(t),r={duration:l/1e3,easing:$},a=e.stepSpeed<1.25?0:n*e.velocity*(1-Math.pow(t,1+l))/(1-t),c={x:a,y:a};if(J(e)||null==i){var o=e;var s=c;f?(r.duration*=.5,d===u?S({x:o.x-s.x,y:o.y},r):S({x:o.x,y:o.y-s.y},r)):Z(s,r)}}D(),g=!1,C()},"gesture:tap":function(t,i){tt(i)&&(null!=e&&clearTimeout(e),e=setTimeout(function(){var t,e;t=i,e=z.view().position(),e=V(t.x-e.x,t.y-e.y),z.trigger("page:tap",e,t),f&&S(t)},50))},"gesture:pan":j,"gesture:swipe":K},ready:function(){I(!0),W(0)}}),z.expose("page",function(t){if(null==t)return parseInt(l);W(t,s)}).expose("get",function(t){return t<m.length()&&0<m.length()?m.eq(t):null}).expose("slide",function(t){!1!==t?C((p=!0)!==t?t:n):N()}).expose("layout",function(t){if(null==t)return d;d=t===h?h:u,T()}).expose("refresh",function(){I(!0)}).expose("next",k).expose("prev",L).expose("last",A).expose("first",R)},z.destroy=function(){null!=b&&b.disconnect()}},module.exports)},{componentId:"/zkit/lib/1.1/controllers/drawer-layout",controller:((module={}).exports=function(){let n=!0,o=!1,e=!1,s=!1,l=!0,r=null,a=null,c=null,u=280,i=960,h=!1,d=0;const p=this;function f(){a.visibility("initial").css("left",0).get().focus(),e&&(a.find("a").one("click",function(){g()}),r.css("opacity","initial"),r.show()),n||(n=!0,p.trigger("drawer:open",{smallScreen:e}))}function g(){var t;e&&(t=function(){n||a.visibility("hidden")},a.one("transitionend transitioncancel",function(){t()}),a.css("left",-u+"px"),r.hide(),n&&(n=!1,p.trigger("drawer:close",{smallScreen:e}))),n=!1,a.find("a").off("click")}function t(){return n}function v(){(window.innerWidth||document.body.clientWidth)<i||-1===i||h?(e&&!l||(e=!0,o=!1,w()),g()):(e||l)&&(e&&(r.hide(),n&&g()),e=!1,o=!0,w(),f())}function w(){var t;l||x(),c&&(t=parseFloat(getComputedStyle(c.get(),null).getPropertyValue("padding-left")),e?c.css({paddingLeft:t-u+"px"}):c.css({paddingLeft:u+t+"px"})),p.trigger("layout:change",{smallScreen:e,drawerLocked:o})}function x(){var t;s||(s=!0,t="ease .15s",a.css({"transition-property":"left",transition:t}),r.css({"transition-property":"opacity",transition:t}))}p.init=function(){const t=p.view();this.options().html=!1,this.options().css=!1,isNaN(this.options().drawerWidth)?(e=parseInt(t.attr("data-o-width")),isNaN(e)||(u=e)):u=parseInt(this.options().drawerWidth);{var e;isNaN(this.options().autoHideWidth)?(e=parseInt(t.attr("data-o-hide-width")),isNaN(e)||(i=e)):i=parseInt(this.options().autoHideWidth)}},p.create=function(){a=p.view(),c=p.options().mainContent,(r=zuix.$(document.createElement("div"))).css({position:"fixed",top:0,left:0,bottom:0,right:0,"z-index":100,"background-color":"rgba(0, 0, 0, 0.5)"}).on("click",function(){o||g()}).hide(),a.parent().append(r.get()),a.css({position:"fixed","overflow-y":"auto",left:0,width:u+"px",top:0,bottom:0,"z-index":101,"-webkit-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","-moz-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)"}).attr("tabindex",0);let i=!1;zuix.load("@lib/controllers/gesture-helper",{view:document.documentElement,on:{"gesture:touch":function(t,e){o||(x(),d=n&&e.startX<u?u-e.startX:0)},"gesture:release":function(t,e){o||i&&(i=!1,x(),(0<e.velocity?f:g)())},"gesture:pan":function(t,e){if(!o&&"horizontal"===e.scrollIntent()&&((i||n)&&e.x<u||!i&&e.x<50)){i=i||!0,x();{let t=e.x;0<t&&t<=u-d&&(t=-u+t+d,"hidden"===a.visibility()&&a.visibility("initial"),a.css("left",t+"px"),"none"===r.display()&&r.show(),r.css("opacity",(u+t)/u))}s&&(s=!1,a.css({transition:"none"}),r.css({transition:"none"}))}}}}),p.expose("toggle",function(){x(),(n?g:f)()}),p.expose("open",function(){x(),f()}),p.expose("close",function(){x(),g()}),p.expose("isOpen",t),p.expose("lock",function(t){if(null==t)return o;o=t}),p.expose("float",function(t){if(null==t)return h;h=t,v()}),a.on("keydown",function(t){27===(t=t||window.event).keyCode&&g()}),v(),l=!1,window.addEventListener("resize",function(){v()})}},module.exports)}]);