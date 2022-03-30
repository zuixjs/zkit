zuix.setComponentCache([{componentId:"/zkit/lib/1.1/components/media-browser",controller:((module={}).exports=function(o){let s=0,r=!1,n=!1,a=!0,l,c,d;function u(t,e){s=+e.in;const n=c.get(s),i=(n&&n.addClass("page-active"),c.get(+e.out));i&&i.removeClass("page-active")}function p(t){return l.page(t)}function h(){r||g(),o.view().show(),o.trigger("open")}function f(){x(),r||o.trigger("close")}function g(){a||(a=!0,o.view().addClass("fullscreen").css({height:null}),y(),o.trigger("fullscreen:open"))}function x(){var t,e;a&&(a=!1,r&&(o.view().removeClass("fullscreen"),e=getComputedStyle(o.view().get()),t=parseInt(e.width),0===parseInt(e.height)&&(e=t/16*9,o.view().css({height:e+"px"})),y()),o.trigger("fullscreen:close"))}function v(t,e){(n?w:m)()}function w(){n=!1,o.trigger("controls:hide")}function m(){n=!0,null!=c&&null!=l&&c.page(l.page()),o.trigger("controls:show")}function y(){setTimeout(function(){c&&c.refresh(),l&&l.refresh()},10)}o.create=function(){o.expose({open:h,close:f,current:p,showControls:m,hideControls:w,toggleControls:v,refresh:y,fullScreen:function(t){(t?g:x)()},next:function(){l.next()},prev:function(){l.prev()}}),o.expose("ui",{get:function(){return{currentPage:s,isFirstPage:function(){return 0===s},isLastPage:function(){return!d||s===d.length()-1},inlineMode:r,showingFullscreen:a}}});const i=o.field("carousel"),e=(zuix.context(i,function(){(c=this).on("page:change",u).on("page:tap",function(t,e){l.page(e)}),setTimeout(()=>{const t=c.get(0);t&&t.addClass("page-active")})}),o.field("media"));if(zuix.context(e,function(){(l=this).on({"page:tap":function(){v(),o.view().get().focus()},"page:change":function(t,e){c.page(e.in),o.trigger("page:change",e)}}),d=e.children().each(function(t,e){let n=this.find('[z-field="preview"]');n.get()&&"IMG"!==n.get().tagName&&(n.attr("z-field",null),n=n.find("IMG").attr("z-field","preview")),n.on("load error",function(){c&&c.refresh()}),0<n.length()?(this.css({background:'url("'+n.attr("src")+'") scroll no-repeat center/contain'}),i.append(n.detach().get())):i.append(document.createElement("div"))}),e.children().each(function(t,e){let n=this.attr("data-type");null==(n="video"===n&&-1===this.find("[\\#video]").get().textContent.indexOf("://")?"video-yt":n)&&(n="image"),this.attr("z-load",o.context.componentId+"/"+n),this.attr("z-lazy",!0),this.attr("data-index",t),zuix.context(e,function(){this.host(o.view())})});var t=o.view().attr("data-o-slide")||o.options().slide;l.slide(null!=t&&t),t={duration:"0.5s",timingFunction:"ease-in-out"},o.addTransition("fadeIn",{transform:"translateXY(0,0)",opacity:"1"},t),o.addTransition("fadeOutUp",{transform:"translateY(-200px)",opacity:"0"},t),o.addTransition("fadeOutDown",{transform:"translateY(200px)",opacity:"0"},t),o.addTransition("fadeOutLeft",{transform:"translateX(-100px)",opacity:0},t),o.addTransition("fadeOutRight",{transform:"translateX(100px)",opacity:0},t),o.addTransition("zoomIn",{transform:"scale(1)"},{duration:"250ms",timingFunction:"ease-in-out"}),o.addTransition("zoomOut",{transform:"scale(0)"},{duration:"250ms",timingFunction:"ease-in-out"}),o.view().on("dragstart",{handler:function(t){"IMG"===t.target.nodeName.toUpperCase()&&t.preventDefault()},passive:!1}),m(),r&&h()}),o.view().attr("tabindex",0),document.body.addEventListener("keydown",function(t){if(o.view().get()===document.activeElement)switch(t.code){case"Escape":f(),t.preventDefault();break;case"Space":v(),t.preventDefault();break;case"ArrowLeft":l.prev(),t.preventDefault();break;case"ArrowUp":m(),t.preventDefault();break;case"ArrowRight":l.next(),t.preventDefault();break;case"ArrowDown":w(),t.preventDefault()}}),r="true"===o.view().attr("data-o-inline")||o.options().inline)setTimeout(x,100);else{o.view().hide(),a=!1;var t=o.view().attr("data-o-button")||o.options().button;const n=zuix.field(t);n.on("click",h)}}},module.exports),css:':host {\n    -webkit-touch-callout: none; /* iOS Safari */\n    -webkit-user-select: none; /* Safari */\n    -khtml-user-select: none; /* Konqueror HTML */\n    -moz-user-select: none; /* Firefox */\n    -ms-user-select: none; /* Internet Explorer/Edge */\n    user-select: none; /* Non-prefixed version, currently\n                                  supported by Chrome and Opera */\n    overflow: hidden;\n    position: relative;\n    width: 100%;\n}\n:host.fullscreen {\n    position: fixed;\n    left: 0;\n    right: 0;\n    top: 0;\n    bottom: 0;\n    z-index: 10000;\n}\n\n.container {\n    position: absolute;\n    left: 0;\n    right: 0;\n    top: 0;\n    bottom: 0;\n    z-index: 20;\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: -moz-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-flex-align: stretch;\n    -ms-flex-align: stretch;\n    -webkit-align-items: stretch;\n    align-items: stretch;\n    justify-content: center;\n    background: black;\n}\n\n[z-field="media"] article {\n    width: 100%;\n    height: 100%;\n}\n\n[z-field="media"] article:not([z-loaded]) > * {\n    display: none;\n}\n\n[z-field="carousel"] {\n    overflow: visible !important;\n    height: 100%!important;\n}\n\n[z-field="preview"] {\n    padding: 0 4px;\n    border-top: solid 4px transparent;\n    border-bottom: solid 4px transparent;\n    position: relative;\n    width: auto;\n    height: 90%;\n    transition: all 0.2s ease-in;\n    opacity: 1.0;\n    transform: scale(1.0);\n}\n\n[z-field="controls"] {\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    height: 140px;\n    max-height: 20%;\n    z-index: 1001;\n    padding-left: 6px;\n    padding-right: 6px;\n    background-color: rgba(0,0,0,0.75);\n}\n\n[z-field*="nav-"] {\n    z-index: 10;\n    background-color: rgba(1,1,1,0.75);\n    border-radius: 12px;\n}\n\n[z-field="nav-prev"] {\n    position: absolute;\n    left: 12px;\n    bottom: calc(50% - 24px);\n    border: solid 1px white;\n    border-radius: 48px;\n}\n[z-field="nav-next"] {\n    position: absolute;\n    right: 12px;\n    bottom: calc(50% - 24px);\n    border: solid 1px white;\n    border-radius: 48px;\n}\n[z-field="nav-close"] {\n    position: absolute;\n    right: 12px;\n    top: 12px;\n}\n[z-field="nav-fullscreen"] {\n    position: absolute;\n    right: 12px;\n    top: 12px;\n}\n[z-field="nav-fullscreen-exit"] {\n    position: absolute;\n    right: 12px;\n    top: 12px;\n}\n\nsvg {\n    vertical-align: middle!important;\n    fill: white!important;\n    cursor: pointer!important;\n}\n\n.media-list {\n    width: 100%;\n    height: 100%;\n}\n\n.page-active {\n    /*box-shadow: 0 0 16px 4px rgb(0 0 255 / 100%);*/\n    border-radius: 4px;\n    border-top: solid 4px greenyellow!important;\n    border-bottom: solid 4px greenyellow!important;\n    transform: scale(1.0) !important;\n    opacity: 1.0;\n    padding: 0 4px;\n}\n\n@media only screen and (max-width: 820px) {\n    [z-field="controls"] {\n        height: 104px;\n    }\n    [z-field="preview"] img {\n        max-height: 80px;\n    }\n    [z-field="nav-prev"] {\n        left: 6px;\n    }\n    [z-field="nav-next"] {\n        right: 6px;\n    }\n    [z-field="nav-close"] {\n        right: 6px;\n        top: 6px;\n    }\n    [z-field="nav-fullscreen"] {\n        right: 6px;\n        top: 6px;\n    }\n    [z-field="nav-fullscreen-exit"] {\n        right: 6px;\n        top: 6px;\n    }\n}\n',view:'<div #container="" class="container">\n\n    <div ctrl="" z-load="@lib/controllers/view-pager" z-lazy="true" data-o-paging="true" data-o-autohide="true" #media="" class="media-list"></div>\n\n    <div #controls="" fx-show="fadeIn" fx-hide="fadeOutDown">\n\n        <div ctrl="" z-load="@lib/controllers/view-pager" z-lazy="false" data-o-autohide="true" #carousel=""></div>\n\n    </div>\n\n    <div #nav-fullscreen="" fx-show="fadeIn" fx-hide="fadeOutUp" @hide-if="!context.ui.inlineMode || context.ui.showingFullscreen" @on:click="context.fullScreen(true)">\n        <svg width="48px" height="48px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n            <path d="M0 0h24v24H0V0z" fill="none"></path>\n            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path>\n        </svg>\n    </div>\n    <div #nav-close="" fx-show="fadeIn" fx-hide="fadeOutUp" @hide-if="!context.ui.showingFullscreen" @on:click="context.close()">\n        <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>\n            <path d="M0 0h24v24H0z" fill="none"></path>\n        </svg>\n    </div>\n    <div #nav-prev="" fx-show="fadeIn" fx-hide="fadeOutLeft" @hide-if="context.ui.isFirstPage()" @on:click="context.prev()">\n        <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>\n            <path d="M0 0h24v24H0z" fill="none"></path>\n        </svg>\n    </div>\n    <div #nav-next="" fx-show="fadeIn" fx-hide="fadeOutRight" @hide-if="context.ui.isLastPage()" @on:click="context.next()">\n        <svg height="48" width="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>\n            <path d="M0 0h24v24H0z" fill="none"></path>\n        </svg>\n    </div>\n\n</div>\n\x3c!-- do not remove the following line --\x3e\n<script><\/script>\n\n\x3c!-- script to handle UI status changes --\x3e\n<script type="jscript">\n  let openButton = $.attr(\'data-o-button\');\n  const scrollParent = $.get().offsetParent || document.body;\n  context.on(\'controls:show\', () => {\n    fxShow([$controls, $navNext, $navPrev, $navClose, $navFullscreen]);\n  });\n  context.on(\'controls:hide\', () => {\n    fxHide([$controls, $navNext, $navPrev, $navClose, $navFullscreen]);\n  });\n  context.on(\'fullscreen:open\', () => {\n    if (!context.ui.inlineMode) {\n      zuix.componentize(false);\n      setTransitionOrigin();\n      $.playTransition({\n          classes: \'zoomOut zoomIn\',\n          holdState: true,\n          onEnd: function($el) {\n              this.get().focus();\n              zuix.componentize(true);\n              setTimeout(context.refresh, 200);\n          }\n      });\n    }\n    if (scrollParent) {\n      scrollParent.style.overflow = \'hidden\';\n    }\n  });\n  context.on(\'fullscreen:close\', () => {\n    if (!context.ui.inlineMode) {\n      zuix.componentize(false);\n      setTransitionOrigin();\n      $.playTransition({\n          classes: \'zoomIn zoomOut\',\n          holdState: true,\n          onEnd: function($el, queue) {\n              this.hide();\n              zuix.componentize(true);\n          }\n      });\n    }\n    if (scrollParent) {\n      scrollParent.style.overflow = null;\n    }\n  });\n  function fxShow(elements) {\n    elements.forEach($el => {\n      const fxHide = $el.attr(\'fx-hide\');\n      const fxShow = $el.attr(\'fx-show\');\n      $el.playTransition({classes: [fxHide, fxShow], holdState: true});\n    });\n  }\n  function fxHide(elements) {\n    elements.forEach($el => {\n      const fxHide = $el.attr(\'fx-hide\');\n      const fxShow = $el.attr(\'fx-show\');\n      $el.playTransition({classes: [fxShow, fxHide], holdState: true});\n    });\n  }\n  function setTransitionOrigin() {\n    if (openButton) {\n      const p = zuix.field(openButton).position();\n      $.css({\n        \'transform-origin\': p.x + (p.rect.width/2) + \'px \' + (p.y + (p.rect.height/2)) + \'px\'\n      });\n    }\n  }\n<\/script>\n'},{componentId:"/zkit/lib/1.1/controllers/scroll-helper",controller:function(){function t(n,i){let o=void 0,s=void 0;return function(){const t=this,e=arguments;s?(clearTimeout(o),o=setTimeout(function(){Date.now()-s>=i&&(n.apply(t,e),s=Date.now())},i-(Date.now()-s))):(n.apply(t,e),s=Date.now())}}return(module={}).exports=function(){const s={timestamp:0,size:{width:0,height:0},viewport:{x:0,y:0,width:0,height:0}};let e,n,o,r=0,a;const l=this;function c(){null!=e&&clearTimeout(e);var t=(new Date).getTime();if(100<t-s.timestamp?d():e=setTimeout(function(){d()},99),!(t<r&&t-a<66)){a=t;const i="scroll-helper-visible";null!=n&&null!=o&&n.each(function(t,e){const n=this.position();if(!n.visible&&this.hasClass(i))this.removeClass(i),n.event="exit";else if(n.visible){if(!n.visible)return;this.hasClass(i)?n.event="scroll":(n.event="enter",this.addClass(i))}else n.event="off-scroll";o(this,n)})}}function d(){const t=l.view().get();var e=t.getBoundingClientRect();const n={top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.width,height:e.height,x:e.x,y:e.y};n.y=-l.view().get().scrollTop||n.y||0,n.height=l.view().get().scrollHeight||n.height||0,s.size.width=n.width,s.size.height=n.height,t===document.body?(s.size.width=document.body.offsetWidth,s.size.height=document.body.offsetHeight,s.viewport.width=document.documentElement.clientWidth||s.size.width,s.viewport.height=document.documentElement.clientHeight||s.size.height):(s.viewport.width=t.offsetWidth,s.viewport.height=t.offsetHeight),s.timestamp=(new Date).getTime(),s.shift={x:n.x-s.viewport.x,y:n.y-s.viewport.y},s.viewport.x=n.x,s.viewport.y=n.y,0==s.size.height+n.y-s.viewport.height||0===n.y?l.trigger("scroll:change",{event:0===n.y?"hit-top":"hit-bottom",info:s}):l.trigger("scroll:change",{event:"scroll",info:s})}function u(t,e){if((t instanceof Element||t instanceof zuix.$.ZxQuery)&&(t=zuix.$(t).position().y-s.viewport.y),-1===e)return p(t);var n=Date.now(),n=(e=(r=null!=e?n+e:r)-n,l.view().get());let i=0;i=n===document.body?void 0!==window.pageYOffset?window.pageYOffset:(document.documentElement||document.body.parentNode||document.body).scrollTop:n.scrollTop;n=t-i;if(e<=0||0==n)return p(t),void c();const o=i+n/e*33;requestAnimationFrame(function(){p(o),u(t)})}function p(t){const e=l.view().get();e===document.body?(document.documentElement.scrollTop=t,document.body.scrollTop=t):e.scrollTop=t}l.init=function(){l.options().html=!1,l.options().css=!1},l.create=function(){l.view().get()===document.body?0<l.options().throttle?window.onscroll=t(c,l.options().throttle):window.onscroll=c:0<l.options().throttle?l.view().on("scroll",{handler:t(c,l.options().throttle),passive:!0}):l.view().on("scroll",{handler:c,passive:!0});l.expose("watch",function(t,e){return t=t,e=e,o=null!=t?(n=l.view(t),e):n=null,l.context}),l.expose("scrollStart",function(t){return u(0,t=null==t?-1:t),l.context}).expose("scrollEnd",function(t){return null==t&&(t=-1),u(s.size.height,t),l.context}).expose("scrollTo",function(t,e){return u(t,e=null==e?-1:e),l.context}).expose("info",function(){return s}).expose("check",c)}},module.exports}()},{componentId:"/zkit/lib/1.1/controllers/view-pager",controller:((module={}).exports=function(){const s={duration:.3,easing:"ease"},N="cubic-bezier(0.0,0.1,0.35,1.1)",P="cubic-bezier(0.0,0.1,0.35,1.0)",d="horizontal",u="vertical",o=1,W=-1;let r=-1,a=0,n=null,i=3e3,l=o,t=null,c=!1,p=d,h=!1,f=!1,q=!1,B=!0,R=0,U=!1,g=!1,X=!1,e=!1,x=!1,v={width:0,height:0},w=null,m=null,y=null;const b=new MutationObserver(function(t,e){y=z.view().children(),T()}),z=this;function T(){null!=t&&clearTimeout(t),t=setTimeout(k,250)}function k(t){if(t||!g&&null==w){y.each(function(t,e){this.css({position:"absolute",left:0,top:0})});const o=H(z.view().get());if(0===o.width||0===o.height){if(0===o.height&&z.view().position().visible){let n=0;y.each(function(t,e){e=H(e);e.height>n&&(n=e.height)}),o.height<n&&z.view().css("height",n+"px")}T()}else{v=o;let n=0,i=!1;y.each(function(t,e){e=H(e);if(p===d){let t=(o.height-e.height)/2;t<0&&(t=0),_(this,s),J(this,n,t),n+=e.width}else{let t=(o.width-e.width)/2;t<0&&(t=0),_(this,s),J(this,t,n),n+=e.height}("true"===this.attr("data-ui-lazyload,z-lazy")||0<this.find('[data-ui-lazyload="true"],[z-lazy="true"]').length())&&(i=!0)}),e=i,M(r),1<y.length()&&$()}}else T()}function I(){let t=!1,e=parseInt(r)+1;return e>=y.length()&&(e=y.length()-1,t=!0),M(e,s),!t}function S(){let t=!1,e=parseInt(r)-1;return e<0&&(e=0,t=!0),M(e,s),!t}function Y(){M(0,s)}function A(){M(y.length()-1,s)}function G(){z.view().position().visible&&M(parseInt(r)+l,s),$()}function $(t){var e;t&&(i=t),C(),!0===h&&(t=z.view().position().visible,n=t?(X||zuix.componentize(z.view()),e=y.eq(r).attr("slide-interval")||i,setTimeout(G,e)):setTimeout($,500),X=t)}function C(){null!=n&&clearTimeout(n)}function V(a,l){let c=0;return y.each(function(t,e){var n=E(this),t=(c=t,H(e));const i=n.position.x,o=n.position.y,s=t.width,r=t.height;if(p===d&&(i>a||i+s>a)||p===u&&(o>l||o+r>l))return!1}),c}function L(t,e){var n=z.view().position();M(V(t.x-n.x,t.y-n.y),null!=e?e:s)}function M(t,e){a=r,t<0?(l=o,t=0):t>=y.length()?(l=W,t=y.length()-1):t!==r&&(l=r<t?o:W),(r=t)!=a&&(y.eq(r).css("z-index",1),-1!==a&&y.eq(a).css("z-index",0),z.trigger("page:change",{in:r,out:a}));const n=y.eq(t);var t=E(n),i=H(n.get());j({x:(v.width-i.width)/2-t.position.x,y:(v.height-i.height)/2-t.position.y},e),$()}function j(e,n){var i=O(),o=E(y.eq(0));const s=y.eq(y.length()-1);var r=E(s);if(y.each(function(t,e){const n=E(this);var i=O();n.dragStart={x:i.marginLeft+n.position.x,y:i.marginTop+n.position.y}}),p===d){let t=e.x;0<o.position.x+e.x?t=-o.position.x:r.position.x+s.get().offsetWidth+e.x<v.width&&(t=2*-i.marginLeft+v.width-(r.position.x+s.get().offsetWidth)),e.x-t!=0&&null!=n&&(n={duration:n.duration*(t/e.x),easing:N},(!isFinite(n.duration)||n.duration<0)&&(n.duration=.2)),D(t,0,n)}else{let t=e.y;0<o.position.y+e.y?t=-o.position.y:r.position.y+s.get().offsetHeight+e.y<v.height&&(t=2*-i.marginTop+v.height-(r.position.y+s.get().offsetHeight)),e.y-t!=0&&null!=n&&(n={duration:n.duration*(t/e.y),easing:N},(!isFinite(n.duration)||n.duration<0)&&(n.duration=.2)),D(0,t,n)}x=!0}function H(t){var e=t.getBoundingClientRect();return{width:e.width||t.offsetWidth,height:t.offsetHeight||e.height}}function E(t){const e=t.get().data=t.get().data||{};return e.position=e.position||{x:0,y:0},e}function F(){e&&null==m&&clearInterval(w)}function O(){const n={w:0,h:0,marginLeft:0,marginTop:0};return y.each(function(t,e){e=H(e);n.w+=e.width,n.h+=e.height}),p===d&&n.w<v.width?n.marginLeft=(v.width-n.w)/2:p===u&&n.h<v.height&&(n.marginTop=(v.height-n.h)/2),n}function D(i,o,s){null!=s?(e&&(F(),null!=m&&clearTimeout(m),null!=w&&clearInterval(w),w=setInterval(function(){U&&y.each(function(t,e){const n=window.getComputedStyle(e,null),i=parseFloat(n.width.replace("px","")),o=parseFloat(n.height.replace("px",""));var s=parseFloat(n.left.replace("px","")),r=parseFloat(n.top.replace("px",""));if(0<i&&0<o){e=zuix.$(e);const a=-v.width/2,l=1.5*v.width,c=-v.height/2,d=1.5*v.height;s+i<a||r+o<c||s>l||r>d?"hidden"!==e.visibility()&&e.visibility("hidden"):"visible"!==e.visibility()&&e.visibility("visible")}}),zuix.componentize(z.view())},10)),m=setTimeout(function(){m=null,F()},1e3*s.duration),s=s.duration+"s "+s.easing):e&&zuix.componentize(z.view()),y.each(function(t,e){var n=E(this);_(this,s),J(this,n.dragStart.x+i,n.dragStart.y+o)})}function K(t,e){var n;g&&e.scrollIntent()&&!e.done&&(!c&&("left"!==e.direction&&"right"!==e.direction||p!==d)&&("up"!==e.direction&&"down"!==e.direction||p!==u)||(c||null!=e.event.touches||z.view().get().addEventListener("click",function(t){c&&(c=!1,t.cancelBubble=!0,t.preventDefault()),z.view().get().removeEventListener("click",this,!0)},!0),c=!0,e.cancel()),n=O(),p===d&&"horizontal"===e.scrollIntent()?D(e.shiftX-n.marginLeft,0):p===u&&"vertical"===e.scrollIntent()&&D(0,e.shiftY-n.marginTop))}function Q(t){return!f||1.25<Math.abs(t.velocity)}function Z(t,e){if(tt(e)&&!Q(e))switch(e.direction){case"right":p===d&&S();break;case"left":p===d&&I();break;case"down":p===u&&S();break;case"up":p===u&&I()}}function J(t,e,n){const i=E(t);isNaN(e)||isNaN(n)||(i.position={x:e,y:n},t.css({left:i.position.x+"px",top:i.position.y+"px"})),i}function _(t,e){t.css({transition:e=null==e?"none":e})}function tt(t){let e=document.elementsFromPoint(t.x,t.y);return(!(0<e.length)||z.view().get().contains(e[0]))&&(0<(e=e.filter(t=>t.attributes["z-load"]&&t.attributes["z-load"].value===z.view().attr("z-load"))).length&&e[0]===z.view().get())}z.init=function(){const t=z.options(),e=z.view();t.html=!1,t.css=!1,f=!0===t.enablePaging||"true"===e.attr("data-o-paging"),h=!0===t.autoSlide||"true"===e.attr("data-o-slide"),B=!1!==t.passive&&"false"!==e.attr("data-o-passive"),q=!0===t.holdTouch||"true"===e.attr("data-o-hold"),R=t.startGap||e.attr("data-o-startgap"),!0!==t.verticalLayout&&e.attr("data-o-layout")!==u||(p=u),null!=t.slideInterval?i=t.slideInterval:null!=e.attr("data-o-slide-interval")&&(i=parseInt(e.attr("data-o-slide-interval"))),U=!0===t.autohide||"true"===e.attr("data-o-autohide")},z.create=function(){const t=z.view().css({position:"relative",overflow:"hidden"});y=t.children(),t.find("img").each(function(t,e){this.one("load",T)}),zuix.$(window).on("resize",function(){k(!0)}).on("orientationchange",function(){k(!0)}),b.observe(t.get(),{attributes:!1,childList:!0,subtree:!0,characterData:!1}),T();let e=null;zuix.load("@lib/controllers/gesture-helper",{view:t,passive:B,startGap:R,on:{"gesture:touch":function(t,e){tt(e)&&(c=!1,C(),g=!0,x=!1,y.each(function(t,e){const n=E(this);var i=O();const o=window.getComputedStyle(e,null);n.position.x=parseFloat(o.left.replace("px","")),n.position.y=parseFloat(o.top.replace("px","")),this.css("left",n.position.x+"px"),this.css("top",n.position.y+"px"),n.dragStart={x:i.marginLeft+n.position.x,y:i.marginTop+n.position.y}}),q&&e.cancel())},"gesture:release":function(t,e){if(null!=e&&(e.done=!0,!x&&(p===d&&"horizontal"===e.scrollIntent()||p===u&&"vertical"===e.scrollIntent()))){var n=null,i=Math.exp(Math.abs(e.velocity/(Math.abs(e.velocity)<=1.25?5:2))+1);let t=.99+i/1e3;.999<t&&(t=.999);const r=Math.log(.01/Math.abs(e.velocity))/Math.log(t),a={duration:r/1e3,easing:P},l=e.stepSpeed<1.25?0:i*e.velocity*(1-Math.pow(t,1+r))/(1-t),c={x:l,y:l};if(Q(e)||null==n){var o=e;var s=c;f?(a.duration*=.5,p===d?L({x:o.x-s.x,y:o.y},a):L({x:o.x,y:o.y-s.y},a)):j(s,a)}}F(),g=!1,$()},"gesture:tap":function(t,n){tt(n)&&(null!=e&&clearTimeout(e),e=setTimeout(function(){var t,e;t=n,e=z.view().position(),e=V(t.x-e.x,t.y-e.y),z.trigger("page:tap",e,t),f&&L(t)},50))},"gesture:pan":K,"gesture:swipe":Z},ready:function(){k(!0),M(0)}}),z.expose("page",function(t){if(null==t)return parseInt(r);M(t,s)}).expose("get",function(t){return t<y.length()&&0<y.length()?y.eq(t):null}).expose("slide",function(t){!1!==t?$((h=!0)!==t?t:i):C()}).expose("layout",function(t){if(null==t)return p;p=t===u?u:d,T()}).expose("refresh",function(){k(!0)}).expose("next",I).expose("prev",S).expose("last",A).expose("first",Y)},z.destroy=function(){null!=b&&b.disconnect()}},module.exports)},{componentId:"/zkit/lib/1.1/controllers/mdl-button",controller:((module={}).exports=function(){this.create=()=>{const e=this.view(),t=this.options();var n=t.type||"raised";if(e.addClass("mdl-button mdl-js-button mdl-button--"+n+" mdl-js-ripple-effect"),t.class){const i=t.class.split(" ");i.forEach(t=>{e.addClass("mdl-button--"+t)})}n=e,zuix.activeRefresh(n,n,null,(t,e,n,i)=>{window.componentHandler?componentHandler.upgradeElements(t.get()):i(n,100,!0)}).start()}},module.exports)},{componentId:"/zkit/lib/1.1/controllers/drawer-layout",controller:((module={}).exports=function(){let i=!0,o=!1,e=!1,s=!1,r=!0,a=null,l=null,c=null,d=280,n=960,u=!1,p=0;const h=this;function f(){l.visibility("initial").css("left",0).get().focus(),e&&(l.find("a").one("click",function(){g()}),a.css("opacity","initial"),a.show()),i||(i=!0,h.trigger("drawer:open",{smallScreen:e}))}function g(){var t;e&&(t=function(){i||l.visibility("hidden")},l.one("transitionend transitioncancel",function(){t()}),l.css("left",-d+"px"),a.hide(),i&&(i=!1,h.trigger("drawer:close",{smallScreen:e}))),i=!1,l.find("a").off("click")}function t(){return i}function x(){(window.innerWidth||document.body.clientWidth)<n||-1===n||u?(e&&!r||(e=!0,o=!1,v()),g()):(e||r)&&(e&&(a.hide(),i&&g()),e=!1,o=!0,v(),f())}function v(){var t;r||w(),c&&(t=parseFloat(getComputedStyle(c.get(),null).getPropertyValue("padding-left")),e?c.css({paddingLeft:t-d+"px"}):c.css({paddingLeft:d+t+"px"})),h.trigger("layout:change",{smallScreen:e,drawerLocked:o})}function w(){var t;s||(s=!0,t="ease .15s",l.css({"transition-property":"left",transition:t}),a.css({"transition-property":"opacity",transition:t}))}h.init=function(){const t=h.view();this.options().html=!1,this.options().css=!1,isNaN(this.options().drawerWidth)?(e=parseInt(t.attr("data-o-width")),isNaN(e)||(d=e)):d=parseInt(this.options().drawerWidth);{var e;isNaN(this.options().autoHideWidth)?(e=parseInt(t.attr("data-o-hide-width")),isNaN(e)||(n=e)):n=parseInt(this.options().autoHideWidth)}},h.create=function(){l=h.view(),c=h.options().mainContent,(a=zuix.$(document.createElement("div"))).css({position:"fixed",top:0,left:0,bottom:0,right:0,"z-index":100,"background-color":"rgba(0, 0, 0, 0.5)"}).on("click",function(){o||g()}).hide(),l.parent().append(a.get()),l.css({position:"fixed","overflow-y":"auto",left:0,width:d+"px",top:0,bottom:0,"z-index":101,"-webkit-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","-moz-box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)","box-shadow":"8px 0 6px -6px rgba(0,0,0,0.25)"}).attr("tabindex",0);let n=!1;zuix.load("@lib/controllers/gesture-helper",{view:document.documentElement,on:{"gesture:touch":function(t,e){o||(w(),p=i&&e.startX<d?d-e.startX:0)},"gesture:release":function(t,e){o||n&&(n=!1,w(),(0<e.velocity?f:g)())},"gesture:pan":function(t,e){if(!o&&"horizontal"===e.scrollIntent()&&((n||i)&&e.x<d||!n&&e.x<50)){n=n||!0,w();{let t=e.x;0<t&&t<=d-p&&(t=-d+t+p,"hidden"===l.visibility()&&l.visibility("initial"),l.css("left",t+"px"),"none"===a.display()&&a.show(),a.css("opacity",(d+t)/d))}s&&(s=!1,l.css({transition:"none"}),a.css({transition:"none"}))}}}}),h.expose("toggle",function(){w(),(i?g:f)()}),h.expose("open",function(){w(),f()}),h.expose("close",function(){w(),g()}),h.expose("isOpen",t),h.expose("lock",function(t){if(null==t)return o;o=t}),h.expose("float",function(t){if(null==t)return u;u=t,x()}),l.on("keydown",function(t){27===(t=t||window.event).keyCode&&g()}),x(),r=!1,window.addEventListener("resize",function(){x()})}},module.exports)}]);