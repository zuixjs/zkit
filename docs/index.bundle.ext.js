!function(){zuix.store("config",{title:"<code>zKit</code> components v1.1",subtitle:"web enhancing bits",googleSiteId:"UA-116384214-1",siteMapUrl:"https://zuixjs.github.io/zkit",baseUrl:"/zkit/",resourcePath:"/zkit/app/",libraryPath:{"@lib":"/zkit/lib/1.1/","@hgui":"https://genielabs.github.io/homegenie-web-ui/app/","@cdnjs":"https://cdnjs.cloudflare.com/ajax/libs/"},"zuixjs.github.io":{resourcePath:"/zkit/app/",libraryPath:{"@lib":"/zkit/lib/1.1/","@hgui":"https://genielabs.github.io/homegenie-web-ui/app/","@cdnjs":"https://cdnjs.cloudflare.com/ajax/libs/"}}}),"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/zkit/service-worker.js")})}.call(self||window),function(){function i(){zuix.$.classExists(".animate__animated .animate__bounce")||zuix.using("style","https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"),zuix.$.ZxQuery.prototype.animateCss||(zuix.$.ZxQuery.prototype.animateCss=function(n,i,t){const s=this;let e,a;"function"==typeof t?(a=i,e=t):"function"==typeof i&&(e=i),"string"!=typeof n?("function"==typeof n?e=n:a=n,n=""):a=i;const o=["-webkit","-moz","-o","-ms"];for(const r in a)if(a.hasOwnProperty(r))for(let i=0;i<o.length;i++)this.css(o[i]+"-animation-"+r,a[r]);return this.hasClass("animate__animated")&&(this.css("transition","initial"),this.attr("class")&&(t=this.attr("class").split(" ").filter(function(i){return i.startsWith("animate__")}).join(" "),this.removeClass(t)),this.trigger("animationend")),this.addClass("animate__animated animate__"+n),this.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",function(){var i=this.attr("class").split(" ").filter(function(i){return i.startsWith("animate__")}).join(" ");this.removeClass(i);for(const t in a)if(a.hasOwnProperty(t))for(let i=0;i<o.length;i++)s.css(o[i]+"-animation-"+t,"");"function"==typeof e&&e.call(s,n)}),this})}i()}.call(self||window);