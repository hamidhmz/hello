;
if (CloudflareApps.matchPage(CloudflareApps.installs['VIKQFpsEZkDx'].URLPatterns)) {
    (function () {
        'use strict'
        if (!window.addEventListener || !document.documentElement.classList) return
        var times = {'0sec': 0, '12hours': 42480000, '24hours': 84960000, '1week': 594720000,}
        var app
        var title
        var message
        var action
        var visibilityTimeout
        var store = window.localStorage || {}
        var options = window.CloudflareApps.installs['VIKQFpsEZkDx'].options

        function getMaxZIndex() {
            var max = 0
            var elements = document.getElementsByTagName('*')
            Array.prototype.slice.call(elements).forEach(function (element) {
                var zIndex = parseInt(document.defaultView.getComputedStyle(element).zIndex, 10)
                max = zIndex ? Math.max(max, zIndex) : max
            })
            return max
        }

        function getMessageKey(string) {
            var hash = 5381
            var i = string.length
            while (i) {
                hash = (hash * 33) ^ string.charCodeAt(--i)
            }
            return hash >>> 0
        }

        function closeApp() {
            app.setAttribute('data-visibility', 'hidden')
            var contentID = getMessageKey(options.title + options.text)
            store['cf-flashcard'] = JSON.stringify({contentID: contentID, closedAt: Date.now()})
            if ("VIKQFpsEZkDx" === 'preview') updateVisibility()
        }

        function updateVisibility() {
            clearTimeout(visibilityTimeout)
            var visible = true
            var stored = false
            try {
                stored = JSON.parse(store['cf-flashcard'])
            } catch (e) {
            }
            if ("VIKQFpsEZkDx" === 'preview' || !stored) {
                visible = true
            } else {
                var timeframe = times[options.renew]
                visible = timeframe === 0 || (Date.now() - stored.closedAt) >= timeframe
            }
            if (visible && !options.paused) {
                visibilityTimeout = setTimeout(function () {
                    app.setAttribute('data-visibility', 'visible')
                }, (options.delay || 0) * 1000)
            }
        }

        function updateContent() {
            app.setAttribute('data-position', options.position)
            title.textContent = options.title || 'Announcement'
            message.innerHTML = options.text.html
            action.style.color = options.action.color
            action.style.display = options.action.show ? '' : 'none'
            action.textContent = (options.action.label || 'Take me there').trim()
            action.href = options.action.url || ''
            action.target = options.action.newtab ? '_blank' : ''
        }

        function initialize() {
            app = CloudflareApps.createElement({selector: 'body', method: 'append'}, app)
            app.setAttribute('app', 'flashcard')
            app.style.zIndex = getMaxZIndex() + 1
            var header = document.createElement('flashcard-header')
            app.appendChild(header)
            title = document.createElement('flashcard-title')
            header.appendChild(title)
            var close = document.createElement('flashcard-close')
            close.setAttribute('role', 'button')
            close.textContent = '✕'
            header.appendChild(close)
            var content = document.createElement('flashcard-content')
            app.appendChild(content)
            message = document.createElement('flashcard-message')
            content.appendChild(message)
            var footer = document.createElement('flashcard-footer')
            action = document.createElement('a')
            action.className = 'flashcard-action'
            footer.appendChild(action)
            app.appendChild(footer)
            close.addEventListener('click', closeApp)
            action.addEventListener('click', closeApp)
            updateContent()
            updateVisibility()
        }

        if (document.readyState === 'loading') {
            window.addEventListener('DOMContentLoaded', initialize)
        } else {
            initialize()
        }
        window.CloudflareApps.installs['VIKQFpsEZkDx'].scope = {
            updateOptions: function updateOptions(nextOptions) {
                clearTimeout(visibilityTimeout)
                options = nextOptions
                updateContent()
                app.setAttribute('data-visibility', 'visible')
            }, updateDelay: function updateDelay(nextOptions) {
                options = nextOptions
                closeApp()
            }, updatePause: function updatePause(nextOptions) {
                app.setAttribute('data-visibility', nextOptions.paused ? 'hidden' : 'visible')
            }
        }
    }())
}
