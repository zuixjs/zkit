zuix.setComponentCache([{componentId:"/zkit/lib/1.1/components/media-browser",controller:(module={exports:function(){let n=0,t=!1,i,o,s,a,r,l,c=[],d=!1;null==zuix.ZxQuery.prototype.animateCss&&(zuix.ZxQuery.prototype.animateCss=function(){return this});const u=this;function h(t,e){n=e.in,o.get(n).attr("z-lazy",!1).children().eq(0).addClass("page-active"),-1!==e.out&&o.get(e.out).children().eq(0).removeClass("page-active"),x(),setTimeout(function(){zuix.componentize(u.field("media"),o.get(n))},200)}function p(t){return i.page(t)}function f(){return l.animateCss("rotateIn",{duration:"0.75s"}),a.hide(),r.hide(),u.field("media").removeClass("hidden"),u.view().animateCss("zoomIn",{duration:"0.5s"},function(){i.refresh(),o.refresh(),x(),setTimeout(function(){u.field("media").children().each(function(){this.css("visibility","visible")}),zuix.componentize(u.field("media"),o.get(n))},200),this.trigger("open")}).show(),u.context}function g(){return l.animateCss("rotateOut",{duration:"0.5s"}),u.view().animateCss("zoomOut",{duration:"0.5s",delay:"0.15s"},function(){this.hide()}).trigger("close"),u.context}function x(){null!=s&&(n<s.length()-1?"none"===a.display()&&a.animateCss("fadeInRight").show():"none"!==a.display()&&a.animateCss("fadeOutRight",function(){this.hide()}),0<n&&1<s.length()?"none"===r.display()&&r.animateCss("fadeInLeft").show():"none"!==r.display()&&r.animateCss("fadeOutLeft",function(){this.hide()}),"none"===l.display()&&l.animateCss("fadeInDown",{duration:"0.35s",delay:"0.5s"}).show())}function m(t,e){null!=e&&zuix.$(e.event.target).hasClass("capture-touch")||(("none"!==u.field("controls").display()?y:b)(),null!=e&&e.cancel())}function v(){t||(t=!0,u.field("controls").animateCss("fadeInUp").show(),null!=o&&null!=i&&o.page(i.page()),u.trigger("controls:show"))}function w(){t&&(t=!1,u.field("controls").animateCss("fadeOutDown",function(){this.hide()}))}function y(){w(),"none"!==r.display()&&r.animateCss("fadeOutLeft",function(){this.hide()}),"none"!==a.display()&&a.animateCss("fadeOutRight",function(){this.hide()}),"none"!==l.display()&&l.animateCss("fadeOutUp",{duration:"0.35s"},function(){this.hide()}),u.trigger("controls:hide")}function b(){v(),x()}u.create=function(){u.expose("open",f).expose("close",g).expose("youtubeApi",function(t){d?t():c.push(t)}).expose("current",p).expose("showControls",b).expose("hideControls",y).expose("toggleControls",m).expose("showList",v).expose("hideList",w),u.view().css({position:"fixed",left:0,right:0,top:0,bottom:0}).hide(),u.view().on("dragstart",{handler:function(t){"IMG"===t.target.nodeName.toUpperCase()&&t.preventDefault()},passive:!1}),zuix.using("component","@lib/extensions/animate-css",function(){b()}),window.onYouTubeIframeAPIReady=function(){zuix.$.each(c,function(){this()}),c=[],d=!0};const t=document.createElement("script"),e=(t.src="https://www.youtube.com/iframe_api",u.view().find("script").get());e.parentNode.insertBefore(t,e),zuix.context(u.field("media"),function(){i=this.on("gesture:tap",m).on("page:change",function(t,e){o.page(e.in),u.trigger("page:change",e)}),r=u.field("nav-prev").on("click",function(){i.prev()}),a=u.field("nav-next").on("click",function(){i.next()}),l=u.field("nav-close").on("click",g),s=u.field("media").children().each(function(t,e){const n=this.find('[z-field="preview"]');0<n.length()?(this.css({background:'url("'+n.find("img").attr("src")+'") scroll no-repeat center/contain'}),u.field("carousel").append(n.detach().get())):u.field("carousel").append(document.createElement("div"))}),u.field("media").children().each(function(t,e){let n=this.attr("data-type");null==n&&(n="image"),this.attr("z-load",u.context.componentId+"/"+n),"video"!==n&&this.attr("z-lazy",!0),this.attr("data-index",t),zuix.context(e,function(){this.host(u.view())})})}),zuix.context(u.field("carousel"),function(){(o=this).on("page:change",h).on("page:tap",function(t,e){i.page(e)})}),u.view().attr("tabindex",0).on("blur",function(){this.get().focus()}).get().focus(),document.onkeydown=function(t){switch(t.keyCode){case 27:g();break;case 32:m();break;case 37:i.prev();break;case 38:b();break;case 39:i.next();break;case 40:y()}}}}}).exports,css:':host {\n    -webkit-touch-callout: none; /* iOS Safari */\n    -webkit-user-select: none; /* Safari */\n    -khtml-user-select: none; /* Konqueror HTML */\n    -moz-user-select: none; /* Firefox */\n    -ms-user-select: none; /* Internet Explorer/Edge */\n    user-select: none; /* Non-prefixed version, currently\n                                  supported by Chrome and Opera */\n    overflow: hidden;\n    position: fixed;\n    left: 0;\n    right: 0;\n    top: 0;\n    bottom: 0;\n    z-index: 1000;\n}\n\n.container {\n    position: absolute;\n    left: 0;\n    right: 0;\n    top: 0;\n    bottom: 0;\n    z-index: 20;\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: -moz-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-flex-align: stretch;\n    -ms-flex-align: stretch;\n    -webkit-align-items: stretch;\n    align-items: stretch;\n    justify-content: center;\n    background: black;\n}\n\nsvg {\n    vertical-align: middle;\n}\n\n[z-field="media"] article {\n    width: 100vw;\n    height: 100vh;\n}\n\n[z-field="media"] article:not([z-loaded]) > * {\n    display: none;\n}\n\n[z-field="controls"] {\n    position: fixed;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    height: 140px;\n    z-index: 1001;\n    padding-left: 10px;\n    padding-right: 10px;\n    background-color: rgba(255,255,255,0.25);\n    /*background-color: rgba(0,0,0,0.5);*/\n}\n\n[z-field="nav-prev"] {\n    border: solid 2px white;\n    border-radius: 48px;\n    margin: 6px;\n    position: absolute;\n    left: 12px;\n    bottom: 45%;\n    z-index: 10;\n    background-color: rgba(1,1,1,0.5);\n    opacity: 0.5;\n}\n[z-field="nav-next"] {\n    border: solid 2px white;\n    border-radius: 48px;\n    margin: 6px;\n    position: absolute;\n    right: 12px;\n    bottom: 45%;\n    z-index: 10;\n    background-color: rgba(1,1,1,0.5);\n    opacity: 0.5;\n}\n[z-field="nav-close"] {\n    position: absolute;\n    right: 16px;\n    top: 16px;\n    z-index: 10;\n    opacity: 0.5;\n}\n\ni {\n    cursor: pointer;\n}\n\n.hidden {\n    display: none;\n}\n\n.media-list {\n    width: 100%;\n    height: 100%;\n}\n\n.above-controls {\n    margin-bottom: 80px;\n}\n\n.rounded-border {\n    border-radius: 5px;\n    -webkit-transform: scale(0.9);\n    -moz-transform: scale(0.9);\n    -ms-transform: scale(0.9);\n    -o-transform: scale(0.9);\n    transform: scale(0.9);\n}\n\n.page-active {\n    border: solid 1px rgba(255,255,255,0.9) !important;\n    -webkit-transform: scale(1.125);\n    -moz-transform: scale(1.125);\n    -ms-transform: scale(1.125);\n    -o-transform: scale(1.125);\n    transform: scale(1.125);\n}\n\n[z-field="carousel"] {\n    overflow: visible !important;\n    height: 100%;\n}\n\n[z-field="preview"] {\n    padding: 10px;\n    max-width: 100%;\n    max-height: 100%;\n}\n[z-field="preview"] img {\n    overflow: hidden;\n    height: 120px;\n    max-height: 120px;\n    border-radius: 8px;\n    border: solid 1px rgba(0,0,0, 0.5);\n    box-shadow: -4px 4px 16px 3px rgba(0,0,0,0.5);\n    transition: 0.1s ease-in;\n}\n\n\n@media only screen and (max-width: 820px) {\n    [z-field="controls"] {\n        height: 104px;\n    }\n    [z-field="preview"] img {\n        max-height: 80px;\n    }\n    [z-field="nav-prev"] {\n        left: 6px;\n    }\n    [z-field="nav-next"] {\n        right: 6px;\n    }\n    [z-field="nav-close"] {\n        right: 12px;\n        top: 12px;\n    }\n}\n',view:'<div #container="" class="container">\n\n    <div ctrl="" z-load="@lib/controllers/view-pager" z-lazy="false" data-o-paging="true" data-o-autohide="true" #media="" class="media-list hidden"></div>\n\n    <div #controls="">\n\n        <div ctrl="" z-load="@lib/controllers/view-pager" z-lazy="false" data-o-autohide="true" #carousel="" layout="row center-left"></div>\n\n    </div>\n\n    <div #nav-close="">\n        <svg fill="#FFFFFF" height="48" width="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>\n            <path d="M0 0h24v24H0z" fill="none"></path>\n        </svg>\n    </div>\n    <div #nav-prev="">\n        <svg fill="white" height="48" width="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>\n            <path d="M0 0h24v24H0z" fill="none"></path>\n        </svg>\n    </div>\n    <div #nav-next="">\n        <svg fill="white" height="48" width="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>\n            <path d="M0 0h24v24H0z" fill="none"></path>\n        </svg>\n    </div>\n\n</div>\n\x3c!-- do not remove the following line --\x3e\n<script><\/script>\n'},{componentId:"/zkit/lib/1.1/controllers/scroll-helper",controller:function(){function t(n,i){let o=void 0,s=void 0;return function(){const t=this,e=arguments;s?(clearTimeout(o),o=setTimeout(function(){Date.now()-s>=i&&(n.apply(t,e),s=Date.now())},i-(Date.now()-s))):(n.apply(t,e),s=Date.now())}}return(module={}).exports=function(){const s={timestamp:0,size:{width:0,height:0},viewport:{x:0,y:0,width:0,height:0}};let e,n,o,a=0,r;const l=this;function c(){null!=e&&clearTimeout(e);var t=(new Date).getTime();if(100<t-s.timestamp?d():e=setTimeout(function(){d()},99),!(t<a&&t-r<66)){r=t;const i="scroll-helper-visible";null!=n&&null!=o&&n.each(function(t,e){const n=this.position();if(!n.visible&&this.hasClass(i))this.removeClass(i),n.event="exit";else if(n.visible){if(!n.visible)return;this.hasClass(i)?n.event="scroll":(n.event="enter",this.addClass(i))}else n.event="off-scroll";o(this,n)})}}function d(){const t=l.view().get();var e=t.getBoundingClientRect();const n={top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.width,height:e.height,x:e.x,y:e.y};n.y=-l.view().get().scrollTop||n.y||0,n.height=l.view().get().scrollHeight||n.height||0,s.size.width=n.width,s.size.height=n.height,t===document.body?(s.size.width=document.body.offsetWidth,s.size.height=document.body.offsetHeight,s.viewport.width=document.documentElement.clientWidth||s.size.width,s.viewport.height=document.documentElement.clientHeight||s.size.height):(s.viewport.width=t.offsetWidth,s.viewport.height=t.offsetHeight),s.timestamp=(new Date).getTime(),s.shift={x:n.x-s.viewport.x,y:n.y-s.viewport.y},s.viewport.x=n.x,s.viewport.y=n.y,0==s.size.height+n.y-s.viewport.height||0===n.y?l.trigger("scroll:change",{event:0===n.y?"hit-top":"hit-bottom",info:s}):l.trigger("scroll:change",{event:"scroll",info:s})}function u(t,e){if((t instanceof Element||t instanceof zuix.$.ZxQuery)&&(t=zuix.$(t).position().y-s.viewport.y),-1===e)return h(t);var n=Date.now(),n=(e=(a=null!=e?n+e:a)-n,l.view().get());let i=0;i=n===document.body?void 0!==window.pageYOffset?window.pageYOffset:(document.documentElement||document.body.parentNode||document.body).scrollTop:n.scrollTop;n=t-i;if(e<=0||0==n)return h(t),void c();const o=i+n/e*33;requestAnimationFrame(function(){h(o),u(t)})}function h(t){const e=l.view().get();e===document.body?(document.documentElement.scrollTop=t,document.body.scrollTop=t):e.scrollTop=t}l.init=function(){l.options().html=!1,l.options().css=!1},l.create=function(){l.view().get()===document.body?0<l.options().throttle?window.onscroll=t(c,l.options().throttle):window.onscroll=c:0<l.options().throttle?l.view().on("scroll",t(c,l.options().throttle)):l.view().on("scroll",c);l.expose("watch",function(t,e){return t=t,e=e,o=null!=t?(n=l.view(t),e):n=null,l.context}),l.expose("scrollStart",function(t){return u(0,t=null==t?-1:t),l.context}).expose("scrollEnd",function(t){return null==t&&(t=-1),u(s.size.height,t),l.context}).expose("scrollTo",function(t,e){return u(t,e=null==e?-1:e),l.context}).expose("info",function(){return s}).expose("check",c)}},module.exports}()},{componentId:"/zkit/lib/1.1/controllers/mdl-button",controller:((module={}).exports=function(){this.create=()=>{const e=this.view(),t=this.options();var n=t.type||"raised";if(e.addClass("mdl-button mdl-js-button mdl-button--"+n+" mdl-js-ripple-effect"),t.class){const i=t.class.split(" ");i.forEach(t=>{e.addClass("mdl-button--"+t)})}n=e,zuix.activeRefresh(n,n,null,(t,e,n,i)=>{window.componentHandler?componentHandler.upgradeElements(t.get()):i(n,100,!0)}).start()}},module.exports)},{componentId:"/zkit/lib/1.1/controllers/view-pager",controller:((module={}).exports=function(){const s={duration:.3,easing:"ease"},W="cubic-bezier(0.0,0.1,0.35,1.1)",q="cubic-bezier(0.0,0.1,0.35,1.0)",d="horizontal",u="vertical",o=1,B=-1;let a=-1,r=0,n=null,i=3e3,l=o,t=null,c=!1,h=d,R=!1,p=!1,$=!1,Y=!0,j=0,A=!1,f=!1,G=!1,e=!1,g=!1,x={width:0,height:0},m=null,v=null,w=null;const y=new MutationObserver(function(t,e){w=b.view().children(),z()}),b=this;function z(){null!=t&&clearTimeout(t),t=setTimeout(k,250)}function k(t){if(t||!f&&null==m){w.each(function(t,e){this.css({position:"absolute",left:0,top:0})});const o=M(b.view().get());if(0===o.width||0===o.height){if(0===o.height&&b.view().position().visible){let n=0;w.each(function(t,e){e=M(e);e.height>n&&(n=e.height)}),o.height<n&&b.view().css("height",n+"px")}z()}else{x=o;let n=0,i=!1;w.each(function(t,e){e=M(e);if(h===d){let t=(o.height-e.height)/2;t<0&&(t=0),J(this,s),D(this,n,t),n+=e.width}else{let t=(o.width-e.width)/2;t<0&&(t=0),J(this,s),D(this,t,n),n+=e.height}("true"===this.attr("data-ui-lazyload,z-lazy")||0<this.find('[data-ui-lazyload="true"],[z-lazy="true"]').length())&&(i=!0)}),e=i,F(a),1<w.length()&&T()}}else z()}function C(){let t=!1,e=parseInt(a)+1;return e>=w.length()&&(e=w.length()-1,t=!0),F(e,s),!t}function I(){let t=!1,e=parseInt(a)-1;return e<0&&(e=0,t=!0),F(e,s),!t}function P(){F(0,s)}function Q(){F(w.length()-1,s)}function U(){F(parseInt(a)+l,s),T()}function T(t){var e;L(),!0===R&&(e=b.view().position().visible,n=e?(G||zuix.componentize(b.view()),setTimeout(U,i)):setTimeout(T,500),G=e)}function L(){null!=n&&clearTimeout(n)}function X(r,l){let c=0;return w.each(function(t,e){var n=N(this),t=(c=t,M(e));const i=n.position.x,o=n.position.y,s=t.width,a=t.height;if(h===d&&(i>r||i+s>r)||h===u&&(o>l||o+a>l))return!1}),c}function E(t,e){var n=b.view().position();F(X(t.x-n.x,t.y-n.y),null!=e?e:s)}function F(t,e){r=a,t<0?(l=o,t=0):t>=w.length()?(l=B,t=w.length()-1):t!==a&&(l=a<t?o:B),(a=t)!=r&&(w.eq(a).css("z-index",1),-1!==r&&w.eq(r).css("z-index",0),b.trigger("page:change",{in:a,out:r}));const n=w.eq(t);var t=N(n),i=M(n.get());Z({x:(x.width-i.width)/2-t.position.x,y:(x.height-i.height)/2-t.position.y},e),T()}function Z(e,n){var i=H(),o=N(w.eq(0));const s=w.eq(w.length()-1);var a=N(s);if(w.each(function(t,e){const n=N(this);var i=H();n.dragStart={x:i.marginLeft+n.position.x,y:i.marginTop+n.position.y}}),h===d){let t=e.x;0<o.position.x+e.x?t=-o.position.x:a.position.x+s.get().offsetWidth+e.x<x.width&&(t=2*-i.marginLeft+x.width-(a.position.x+s.get().offsetWidth)),e.x-t!=0&&null!=n&&(n={duration:n.duration*(t/e.x),easing:W},(!isFinite(n.duration)||n.duration<0)&&(n.duration=.2)),O(t,0,n)}else{let t=e.y;0<o.position.y+e.y?t=-o.position.y:a.position.y+s.get().offsetHeight+e.y<x.height&&(t=2*-i.marginTop+x.height-(a.position.y+s.get().offsetHeight)),e.y-t!=0&&null!=n&&(n={duration:n.duration*(t/e.y),easing:W},(!isFinite(n.duration)||n.duration<0)&&(n.duration=.2)),O(0,t,n)}g=!0}function M(t){var e=t.getBoundingClientRect();return{width:e.width||t.offsetWidth,height:t.offsetHeight||e.height}}function N(t){const e=t.get().data=t.get().data||{};return e.position=e.position||{x:0,y:0},e}function S(){e&&null==v&&clearInterval(m)}function H(){const n={w:0,h:0,marginLeft:0,marginTop:0};return w.each(function(t,e){e=M(e);n.w+=e.width,n.h+=e.height}),h===d&&n.w<x.width?n.marginLeft=(x.width-n.w)/2:h===u&&n.h<x.height&&(n.marginTop=(x.height-n.h)/2),n}function O(i,o,s){null!=s?(e&&(S(),null!=v&&clearTimeout(v),null!=m&&clearInterval(m),m=setInterval(function(){A&&w.each(function(t,e){const n=window.getComputedStyle(e,null),i=parseFloat(n.width.replace("px","")),o=parseFloat(n.height.replace("px",""));var s=parseFloat(n.left.replace("px","")),a=parseFloat(n.top.replace("px",""));if(0<i&&0<o){e=zuix.$(e);const r=-x.width/2,l=1.5*x.width,c=-x.height/2,d=1.5*x.height;s+i<r||a+o<c||s>l||a>d?"hidden"!==e.visibility()&&e.visibility("hidden"):"visible"!==e.visibility()&&e.visibility("visible")}}),zuix.componentize(b.view())},10)),v=setTimeout(function(){v=null,S()},1e3*s.duration),s=s.duration+"s "+s.easing):e&&zuix.componentize(b.view()),w.each(function(t,e){var n=N(this);J(this,s),D(this,n.dragStart.x+i,n.dragStart.y+o)})}function K(t,e){var n;e.scrollIntent()&&!e.done&&(!c&&("left"!==e.direction&&"right"!==e.direction||h!==d)&&("up"!==e.direction&&"down"!==e.direction||h!==u)||(c||null!=e.event.touches||b.view().get().addEventListener("click",function(t){c&&(c=!1,t.cancelBubble=!0,t.preventDefault()),b.view().get().removeEventListener("click",this,!0)},!0),c=!0,e.cancel()),n=H(),h===d&&"horizontal"===e.scrollIntent()?O(e.shiftX-n.marginLeft,0):h===u&&"vertical"===e.scrollIntent()&&O(0,e.shiftY-n.marginTop))}function V(t){return!p||1.25<Math.abs(t.velocity)}function _(t,e){if(!V(e))switch(e.direction){case"right":h===d&&I();break;case"left":h===d&&C();break;case"down":h===u&&I();break;case"up":h===u&&C()}}function D(t,e,n){const i=N(t);isNaN(e)||isNaN(n)||(i.position={x:e,y:n},t.css({left:i.position.x+"px",top:i.position.y+"px"})),i}function J(t,e){t.css({transition:e=null==e?"none":e})}b.init=function(){const t=b.options(),e=b.view();t.html=!1,t.css=!1,p=!0===t.enablePaging||"true"===e.attr("data-o-paging"),R=!0===t.autoSlide||"true"===e.attr("data-o-slide"),Y=!1!==t.passive&&"false"!==e.attr("data-o-passive"),$=!0===t.holdTouch||"true"===e.attr("data-o-hold"),j=t.startGap||e.attr("data-o-startgap"),!0!==t.verticalLayout&&e.attr("data-o-layout")!==u||(h=u),null!=t.slideInterval?i=t.slideInterval:null!=e.attr("data-o-slide-interval")&&(i=parseInt(e.attr("data-o-slide-interval"))),A=!0===t.autohide||"true"===e.attr("data-o-autohide")},b.create=function(){const t=b.view().css({position:"relative",overflow:"hidden"});w=t.children(),t.find("img").each(function(t,e){this.one("load",z)}),zuix.$(window).on("resize",function(){k(!0)}).on("orientationchange",function(){k(!0)}),y.observe(t.get(),{attributes:!1,childList:!0,subtree:!0,characterData:!1}),z(),F(0);let e=null;zuix.load("@lib/controllers/gesture-helper",{view:t,passive:Y,startGap:j,on:{"gesture:touch":function(t,e){c=!1,L(),f=!0,g=!1,w.each(function(t,e){const n=N(this);var i=H();const o=window.getComputedStyle(e,null);n.position.x=parseFloat(o.left.replace("px","")),n.position.y=parseFloat(o.top.replace("px","")),this.css("left",n.position.x+"px"),this.css("top",n.position.y+"px"),n.dragStart={x:i.marginLeft+n.position.x,y:i.marginTop+n.position.y}}),$&&e.cancel()},"gesture:release":function(t,e){if(null!=e&&(e.done=!0,!g&&(h===d&&"horizontal"===e.scrollIntent()||h===u&&"vertical"===e.scrollIntent()))){var n=null,i=Math.exp(Math.abs(e.velocity/(Math.abs(e.velocity)<=1.25?5:2))+1);let t=.99+i/1e3;.999<t&&(t=.999);const a=Math.log(.01/Math.abs(e.velocity))/Math.log(t),r={duration:a/1e3,easing:q},l=e.stepSpeed<1.25?0:i*e.velocity*(1-Math.pow(t,1+a))/(1-t),c={x:l,y:l};if(V(e)||null==n){var o=e;var s=c;p?(r.duration*=.5,h===d?E({x:o.x-s.x,y:o.y},r):E({x:o.x,y:o.y-s.y},r)):Z(s,r)}}S(),f=!1,T()},"gesture:tap":function(t,n){null!=e&&clearTimeout(e),e=setTimeout(function(){var t,e;t=n,e=b.view().position(),e=X(t.x-e.x,t.y-e.y),b.trigger("page:tap",e,t),p&&E(t)},50)},"gesture:pan":K,"gesture:swipe":_},ready:function(){k(!0)}}),b.expose("page",function(t){if(null==t)return parseInt(a);F(t,s)}).expose("get",function(t){return w.eq(t)}).expose("slide",function(t){(!0===t?T:L)()}).expose("layout",function(t){if(null==t)return h;h=t===u?u:d,z()}).expose("refresh",function(){k(!0)}).expose("next",C).expose("prev",I).expose("last",Q).expose("first",P)},b.destroy=function(){null!=y&&y.disconnect()}},module.exports)},{componentId:"/zkit/lib/1.1/controllers/drawer-layout",controller:((module={}).exports=function(){let i=!0,o=!1,e=!1,s=!1,a=!0,r=null,l=null,c=null,d=280,n=960,u=!1,h=0;const p=this;function f(){l.visibility("initial").css("left",0).get().focus(),e&&(l.find("a").one("click",function(){g()}),r.css("opacity","initial"),r.show()),i||(i=!0,p.trigger("drawer:open",{smallScreen:e}))}function g(){var t;e&&(t=function(){i||l.visibility("hidden")},l.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",function(){t()}),l.css("left",-d+"px"),r.hide(),i&&(i=!1,p.trigger("drawer:close",{smallScreen:e}))),i=!1,l.find("a").off("click")}function t(){return i}function x(){(window.innerWidth||document.body.clientWidth)<n||-1===n||u?(e&&!a||(e=!0,o=!1,m()),g()):(e||a)&&(e&&(r.hide(),i&&g()),e=!1,o=!0,m(),f())}function m(){var t;a||v(),c&&(t=parseFloat(getComputedStyle(c.get(),null).getPropertyValue("padding-left")),e?c.css({paddingLeft:t-d+"px"}):c.css({paddingLeft:d+t+"px"})),p.trigger("layout:change",{smallScreen:e,drawerLocked:o})}function v(){var t;s||(s=!0,t="ease .15s",l.css({"transition-property":"left",transition:t}),r.css({"transition-property":"opacity",transition:t}))}p.init=function(){const t=p.view();this.options().html=!1,this.options().css=!1,isNaN(this.options().drawerWidth)?(e=parseInt(t.attr("data-o-width")),isNaN(e)||(d=e)):d=parseInt(this.options().drawerWidth);{var e;isNaN(this.options().autoHideWidth)?(e=parseInt(t.attr("data-o-hide-width")),isNaN(e)||(n=e)):n=parseInt(this.options().autoHideWidth)}},p.create=function(){l=p.view(),c=p.options().mainContent,(r=zuix.$(document.createElement("div"))).css({position:"fixed",top:0,left:0,bottom:0,right:0,"z-index":100,"background-color":"rgba(0, 0, 0, 0.5)"}).on("click",function(){o||g()}).hide(),l.parent().append(r.get()),l.css({position:"fixed","overflow-y":"auto",left:0,width:d+"px",top:0,bottom:0,"z-index":101,"-webkit-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","-moz-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)"}).attr("tabindex",0);let n=!1;zuix.load("@lib/controllers/gesture-helper",{view:document.documentElement,on:{"gesture:touch":function(t,e){o||(v(),h=i&&e.startX<d?d-e.startX:0)},"gesture:release":function(t,e){o||n&&(n=!1,v(),(0<e.velocity?f:g)())},"gesture:pan":function(t,e){if(!o&&"horizontal"===e.scrollIntent()&&((n||i)&&e.x<d||!n&&e.x<50)){n=n||!0,v();{let t=e.x;0<t&&t<=d-h&&(t=-d+t+h,"hidden"===l.visibility()&&l.visibility("initial"),l.css("left",t+"px"),"none"===r.display()&&r.show(),r.css("opacity",(d+t)/d))}s&&(s=!1,l.css({transition:"none"}),r.css({transition:"none"}))}}}}),p.expose("toggle",function(){v(),(i?g:f)()}),p.expose("open",function(){v(),f()}),p.expose("close",function(){v(),g()}),p.expose("isOpen",t),p.expose("lock",function(t){if(null==t)return o;o=t}),p.expose("float",function(t){if(null==t)return u;u=t,x()}),l.on("keydown",function(t){27===(t=t||window.event).keyCode&&g()}),x(),a=!1,window.addEventListener("resize",function(){x()})}},module.exports)}]);