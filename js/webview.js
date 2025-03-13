function main(item) {
    let url = item.url;
    let id = ku9.getQuery(url, "id");
    const jsonUrl = `改网站${id}/`;
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; HMA-AL00 Build/HUAWEIHMA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.93 Mobile Safari/537.36'
    };

    // 注入全屏播放的JS代码
    const jscode = `
        (function() {
            const startTime = Date.now();
            
            function getVideoParentShadowRoots() {
                const allElements = document.querySelectorAll('*');
                for (const element of allElements) {
                    const shadowRoot = element.shadowRoot;
                    if (shadowRoot) {
                        const video = shadowRoot.querySelector('video');
                        if (video) return video;
                    }
                }
                return null;
            }

            function removeControls() {
                ['#control_bar', '.controls', '.vjs-control-bar', 'xg-controls'].forEach(selector => {
                    document.querySelectorAll(selector).forEach(e => e.remove());
                });
            }

            function setupVideo(video) {
                video.style.position = 'fixed';
                video.style.top = '0';
                video.style.left = '0';
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.objectFit = 'fill';
                video.muted = false;
                video.volume = 1;
                video.autoplay = true;
                
                document.body.style.margin = '0';
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
            }

            function checkVideo() {
                if (Date.now() - startTime > 15000) {
                    clearInterval(interval);
                    return;
                }

                let video = document.querySelector('video') || getVideoParentShadowRoots();
                if (video && video.readyState > 0) {
                    clearInterval(interval);
                    removeControls();
                    setupVideo(video);
                    
                    // 尝试触发全屏
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                    } else if (video.webkitRequestFullscreen) {
                        video.webkitRequestFullscreen();
                    }
                }
            }

            const interval = setInterval(checkVideo, 100);
        })();
    `;

    return {
        webview: jsonUrl,
        headers: headers,
        jscode: jscode
    };
}