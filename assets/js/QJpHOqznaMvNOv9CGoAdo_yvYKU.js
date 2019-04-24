;window.CloudflareApps=window.Eager=window.CloudflareApps||window.Eager||{};window.CloudflareApps=window.CloudflareApps||{};CloudflareApps.siteId="00dcfd3ad16284d35a03e37e9f345fd9";CloudflareApps.installs=CloudflareApps.installs||{};;(function(){'use strict'
    CloudflareApps.internal=CloudflareApps.internal||{}
    var errors=[]
    CloudflareApps.internal.placementErrors=errors
    var errorHashes={}
    function noteError(options){var hash=options.selector+'::'+options.type+'::'+(options.installId||'')
        if(errorHashes[hash]){return}
        errorHashes[hash]=true
        errors.push(options)}
    var initializedSelectors={}
    var currentInit=false
    CloudflareApps.internal.markSelectors=function markSelectors(){if(!currentInit){check()
        currentInit=true
        setTimeout(function(){currentInit=false})}}
    function check(){var installs=window.CloudflareApps.installs
        for(var installId in installs){if(!installs.hasOwnProperty(installId)){continue}
            var selectors=installs[installId].selectors
            if(!selectors){continue}
            for(var key in selectors){if(!selectors.hasOwnProperty(key)){continue}
                var hash=installId+'::'+key
                if(initializedSelectors[hash]){continue}
                var els=document.querySelectorAll(selectors[key])
                if(els&&els.length>1){noteError({type:'init:too-many',option:key,selector:selectors[key],installId:installId})
                    initializedSelectors[hash]=true
                    continue}else if(!els||!els.length){continue}
                initializedSelectors[hash]=true
                els[0].setAttribute('cfapps-selector',selectors[key])}}}
    CloudflareApps.querySelector=function querySelector(selector){if(selector==='body'||selector==='head'){return document[selector]}
        CloudflareApps.internal.markSelectors()
        var els=document.querySelectorAll('[cfapps-selector="'+selector+'"]')
        if(!els||!els.length){noteError({type:'select:not-found:by-attribute',selector:selector})
            els=document.querySelectorAll(selector)
            if(!els||!els.length){noteError({type:'select:not-found:by-query',selector:selector})
                return null}else if(els.length>1){noteError({type:'select:too-many:by-query',selector:selector})}
            return els[0]}
        if(els.length>1){noteError({type:'select:too-many:by-attribute',selector:selector})}
        return els[0]}}());(function(){'use strict'
    var prevEls={}
    CloudflareApps.createElement=function createElement(options,prevEl){options=options||{}
        CloudflareApps.internal.markSelectors()
        try{if(prevEl&&prevEl.parentNode){var replacedEl
            if(prevEl.cfAppsElementId){replacedEl=prevEls[prevEl.cfAppsElementId]}
            if(replacedEl){prevEl.parentNode.replaceChild(replacedEl,prevEl)
                delete prevEls[prevEl.cfAppsElementId]}else{prevEl.parentNode.removeChild(prevEl)}}
            var element=document.createElement('cloudflare-app')
            var container
            if(options.pages&&options.pages.URLPatterns&&!CloudflareApps.matchPage(options.pages.URLPatterns)){return element}
            try{container=CloudflareApps.querySelector(options.selector)}catch(e){}
            if(!container){return element}
            if(!container.parentNode&&(options.method==='after'||options.method==='before'||options.method==='replace')){return element}
            if(container===document.body){if(options.method==='after'){options.method='append'}else if(options.method==='before'){options.method='prepend'}}
            switch(options.method){case'prepend':if(container.firstChild){container.insertBefore(element,container.firstChild)
                break}
                case'append':container.appendChild(element)
                    break
                case'after':if(container.nextSibling){container.parentNode.insertBefore(element,container.nextSibling)}else{container.parentNode.appendChild(element)}
                    break
                case'before':container.parentNode.insertBefore(element,container)
                    break
                case'replace':try{var id=element.cfAppsElementId=Math.random().toString(36)
                    prevEls[id]=container}catch(e){}
                    container.parentNode.replaceChild(element,container)}
            return element}catch(e){if(typeof console!=='undefined'&&typeof console.error!=='undefined'){console.error('Error creating Cloudflare Apps element',e)}}}}());(function(){'use strict'
    CloudflareApps.matchPage=function matchPage(patterns){if(!patterns||!patterns.length){return true}
        var loc=document.location.host+document.location.pathname
        if(window.CloudflareApps&&CloudflareApps.proxy&&CloudflareApps.proxy.originalURL){var url=CloudflareApps.proxy.originalURL.parsed
            loc=url.host+url.path}
        for(var i=0;i<patterns.length;i++){var re=new RegExp(patterns[i],'i')
            if(re.test(loc)){return true}}
        return false}}());CloudflareApps.installs["VIKQFpsEZkDx"]={appId:"-gXRR7q4QzkP",scope:{}};;CloudflareApps.installs["VIKQFpsEZkDx"].options={"action":{"color":"#6d5cae","label":"Show Preview","newtab":true,"show":true,"url":"http://pages.revox.io/dashboard"},"delay":1,"paused":false,"position":"right","renew":"1week","text":{"html":"\u003cp\u003eNow supports native Angular 5+ and Bootstrap v4.1\u003c/p\u003e","markdown":"Now supports native Angular 5+ and Bootstrap v4.1"},"title":"Pages 4.0 is now released 🎉"};;CloudflareApps.installs["VIKQFpsEZkDx"].URLPatterns=["^pages.revox.io/dashboard/3.0.0/?.*$"];;CloudflareApps.installs["lXpDjxsLMpey"]={appId:"lMxPPXVOqmoE",scope:{}};;CloudflareApps.installs["lXpDjxsLMpey"].options={"id":"UA-56895490-1"};;if(CloudflareApps.matchPage(CloudflareApps.installs['lXpDjxsLMpey'].URLPatterns)){(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');};if(CloudflareApps.matchPage(CloudflareApps.installs['lXpDjxsLMpey'].URLPatterns)){(function(){var options=CloudflareApps.installs['lXpDjxsLMpey'].options
    if(!options.id)return
    window.ga('create',options.id,'auto')
    window.ga('send','pageview')
    if(options.social){(function(b){(function(a){"__CF"in b&&"DJS"in b.__CF?b.__CF.DJS.push(a):"addEventListener"in b?b.addEventListener("load",a,!1):b.attachEvent("onload",a)})(function(){"FB"in b&&"Event"in FB&&"subscribe"in FB.Event&&(FB.Event.subscribe("edge.create",function(a){_gaq.push(["_trackSocial","facebook","like",a])}),FB.Event.subscribe("edge.remove",function(a){_gaq.push(["_trackSocial","facebook","unlike",a])}),FB.Event.subscribe("message.send",function(a){_gaq.push(["_trackSocial","facebook","send",a])}));"twttr"in b&&"events"in twttr&&"bind"in twttr.events&&twttr.events.bind("tweet",function(a){if(a){var b;if(a.target&&a.target.nodeName=="IFRAME")a:{if(a=a.target.src){a=a.split("#")[0].match(/[^?=&]+=([^&]*)?/g);b=0;for(var c;c=a[b];++b)if(c.indexOf("url")===0){b=unescape(c.split("=")[1]);break a}}b=void 0}_gaq.push(["_trackSocial","twitter","tweet",b])}})})})(window);}}())};(function(){try{var link=document.createElement('link');link.rel='stylesheet';link.href='data:text/css;charset=utf-8;base64,QGltcG9ydCB1cmwoaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3M/ZmFtaWx5PU1vbnRzZXJyYXQ6NDAwLDcwMCk7CmNsb3VkZmxhcmUtYXBwW2FwcD0iZmxhc2hjYXJkIl0gewogIC13ZWJraXQtZm9udC1zbW9vdGhpbmc6IGFudGlhbGlhc2VkOwogIGJhY2tncm91bmQtY29sb3I6ICNmZmY7CiAgY29sb3I6ICM0NDQ7CiAgZGlzcGxheTogZmxleDsKICBmbGV4LWZsb3c6IGNvbHVtbjsKICBmb250LWZhbWlseTogTW9udHNlcnJhdCwgc2Fucy1zZXJpZjsKICBmb250LXNpemU6IDE0cHg7CiAgZm9udC13ZWlnaHQ6IDQwMDsKICBtYXgtd2lkdGg6IDEwMCU7CiAgbWluLWhlaWdodDogNzBweDsKICBwYWRkaW5nOiAyMHB4IDE1cHg7CiAgcG9zaXRpb246IGZpeGVkOwogIHRleHQtcmVuZGVyaW5nOiBvcHRpbWl6ZUxlZ2liaWxpdHk7CiAgdHJhbnNpdGlvbjogYm90dG9tIC40cyBlYXNlLWluLW91dDsKICB2aXNpYmlsaXR5OiBoaWRkZW47Cn0KCmNsb3VkZmxhcmUtYXBwW2FwcD0iZmxhc2hjYXJkIl1bZGF0YS12aXNpYmlsaXR5PSJ2aXNpYmxlIl0gewogIHZpc2liaWxpdHk6IHZpc2libGU7Cn0KCkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkgewogIGNsb3VkZmxhcmUtYXBwW2FwcD0iZmxhc2hjYXJkIl0gewogICAgYm90dG9tOiAyMHB4OwogICAgYm9yZGVyOiAxcHggc29saWQgI2NjYzsKICAgIGJvcmRlci1yYWRpdXM6IDNweDsKICAgIGJveC1zaGFkb3c6IDAgM3B4IDdweCByZ2JhKDAsIDAsIDAsIDAuMTIpOwogICAgd2lkdGg6IDMzMHB4OwogIH0KICBjbG91ZGZsYXJlLWFwcFthcHA9ImZsYXNoY2FyZCJdW2RhdGEtcG9zaXRpb249ImxlZnQiXSB7CiAgICBsZWZ0OiAyMHB4OwogIH0KICBjbG91ZGZsYXJlLWFwcFthcHA9ImZsYXNoY2FyZCJdW2RhdGEtcG9zaXRpb249InJpZ2h0Il0gewogICAgcmlnaHQ6IDIwcHg7CiAgfQogIGNsb3VkZmxhcmUtYXBwW2FwcD0iZmxhc2hjYXJkIl0gZmxhc2hjYXJkLWNvbnRlbnQgewogICAgbGluZS1oZWlnaHQ6IDEuNTsKICB9Cn0KCkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkgewogIGNsb3VkZmxhcmUtYXBwW2FwcD0iZmxhc2hjYXJkIl0gewogICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNjY2M7CiAgICBib3R0b206IDA7CiAgICBsZWZ0OiAwOwogICAgcmlnaHQ6IDA7CiAgfQogIGNsb3VkZmxhcmUtYXBwW2FwcD0iZmxhc2hjYXJkIl0gZmxhc2hjYXJkLWNvbnRlbnQgewogICAgbGluZS1oZWlnaHQ6IDEuNzg1OwogIH0KfQoKY2xvdWRmbGFyZS1hcHBbYXBwPSJmbGFzaGNhcmQiXSBmbGFzaGNhcmQtaGVhZGVyIHsKICBhbGlnbi1pdGVtczogY2VudGVyOwogIGRpc3BsYXk6IGZsZXg7CiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuOwogIGZsZXg6IDEgMSBhdXRvOwp9CgpjbG91ZGZsYXJlLWFwcFthcHA9ImZsYXNoY2FyZCJdIGZsYXNoY2FyZC10aXRsZSB7CiAgZm9udC1zaXplOiAxNnB4OwogIGZvbnQtd2VpZ2h0OiA3MDA7CiAgb3ZlcmZsb3c6IGhpZGRlbjsKICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpczsKICB3aGl0ZS1zcGFjZTogbm93cmFwOwogIGZsZXg6IDEgMSBhdXRvOwp9CgpjbG91ZGZsYXJlLWFwcFthcHA9ImZsYXNoY2FyZCJdIGZsYXNoY2FyZC1jbG9zZSB7CiAgbWFyZ2luLWxlZnQ6IDFlbTsKICBjb2xvcjogaW5oZXJpdDsKICBjdXJzb3I6IHBvaW50ZXI7CiAgZGlzcGxheTogaW5saW5lLWJsb2NrOwogIGZvbnQtc2l6ZTogMWVtOwogIGZsZXg6IDAgMCBhdXRvOwp9CgpjbG91ZGZsYXJlLWFwcFthcHA9ImZsYXNoY2FyZCJdIGZsYXNoY2FyZC1jb250ZW50IHsKICBkaXNwbGF5OiBmbGV4OwogIGZsZXgtZmxvdzogY29sdW1uOwogIGZsZXg6IDEgMSBhdXRvOwp9CgpjbG91ZGZsYXJlLWFwcFthcHA9ImZsYXNoY2FyZCJdIGZsYXNoY2FyZC1mb290ZXIgewogIG1hcmdpbi10b3A6IDAuNWVtOwogIGRpc3BsYXk6IGZsZXg7CiAgZmxleC1mbG93OiBjb2x1bW47CiAgZmxleDogMCAwIGF1dG87CiAgdGV4dC1hbGlnbjogY2VudGVyOwp9CgpjbG91ZGZsYXJlLWFwcFthcHA9ImZsYXNoY2FyZCJdIGZsYXNoY2FyZC1mb290ZXIgLmZsYXNoY2FyZC1hY3Rpb24gewogIGJhY2tncm91bmQtY29sb3I6ICNmZmYgIWltcG9ydGFudDsKICBib3JkZXItcmFkaXVzOiAzcHggIWltcG9ydGFudDsKICBib3JkZXI6IDFweCBzb2xpZCAhaW1wb3J0YW50OwogIGJveC1zaGFkb3c6IGluaGVyaXQgIWltcG9ydGFudDsKICBjdXJzb3I6IHBvaW50ZXIgIWltcG9ydGFudDsKICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7CiAgZm9udC1zaXplOiAxZW0gIWltcG9ydGFudDsKICBtYXJnaW4tdG9wOiAxMHB4ICFpbXBvcnRhbnQ7CiAgcGFkZGluZzogNXB4IDAgIWltcG9ydGFudDsKICB0ZXh0LWRlY29yYXRpb246IG5vbmUgIWltcG9ydGFudDsKICB0ZXh0LXNoYWRvdzogaW5oZXJpdCAhaW1wb3J0YW50Owp9CgpjbG91ZGZsYXJlLWFwcFthcHA9ImZsYXNoY2FyZCJdIC5mbGFzaGNhcmQtYWN0aW9uW2hyZWY9IiJdIHsKICBwb2ludGVyLWV2ZW50czogbm9uZSAhaW1wb3J0YW50Owp9CgpjbG91ZGZsYXJlLWFwcFthcHA9ImZsYXNoY2FyZCJdIGZsYXNoY2FyZC1tZXNzYWdlIHsKICBkaXNwbGF5OiBibG9jazsKICBsaW5lLWhlaWdodDogMS40OwogIG1hcmdpbi10b3A6IDEwcHg7CiAgb3ZlcmZsb3c6IGhpZGRlbjsKICBwYWRkaW5nLXJpZ2h0OiAxMHB4OwogIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzOwp9CgpjbG91ZGZsYXJlLWFwcFthcHA9ImZsYXNoY2FyZCJdIGZsYXNoY2FyZC1tZXNzYWdlIHA6Zmlyc3QtY2hpbGQgewogIG1hcmdpbi10b3A6IDA7Cn0KCmNsb3VkZmxhcmUtYXBwW2FwcD0iZmxhc2hjYXJkIl0gZmxhc2hjYXJkLW1lc3NhZ2UgcDpsYXN0LWNoaWxkIHsKICBtYXJnaW4tYm90dG9tOiAwOwp9';document.getElementsByTagName('head')[0].appendChild(link);}catch(e){}})();(function(){var script = document.createElement('script');script.src = 'assets/js/fmCNL3Jg5WJkvte7PeZ_5mKvapc.js';document.head.appendChild(script);})();
