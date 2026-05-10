// 生成大量随机代理 IP（A/B/C 类公网地址，跳过私有/回环地址）
globalThis.generateMillionIPs = function() {
    const ipPool = [];

    // A类地址段 (1.0.0.0 - 126.255.255.255)
    for (let a = 1; a <= 126; a++) {
        if (a === 10 || a === 127) continue; // 跳过私有地址和回环
        if (Math.random() < 0.15) {
            for (let b = 0; b <= 255; b++) {
                if (Math.random() < 0.02) {
                    for (let c = 0; c <= 255; c++) {
                        if (Math.random() < 0.01) {
                            const ip = `${a}.${b}.${c}.${Math.floor(Math.random() * 254) + 1}`;
                            const port = [80, 8080, 3128, 443, 8443, 8888, 9000][Math.floor(Math.random() * 7)];
                            ipPool.push(`http://${ip}:${port}`);
                        }
                    }
                }
            }
        }
    }
    
    // B类地址段 (128.0.0.0 - 191.255.255.255)
    for (let a = 128; a <= 191; a++) {
        for (let b = 0; b <= 255; b++) {
            if (a === 172 && b >= 16 && b <= 31) continue; // 跳过私有地址
            if (Math.random() < 0.08) {
                for (let c = 0; c <= 255; c++) {
                    if (Math.random() < 0.01) {
                        const ip = `${a}.${b}.${c}.${Math.floor(Math.random() * 254) + 1}`;
                        const port = [80, 8080, 3128, 443, 8443, 8888, 9000][Math.floor(Math.random() * 7)];
                        ipPool.push(`http://${ip}:${port}`);
                    }
                }
            }
        }
    }
    
    // C类地址段 (192.0.0.0 - 223.255.255.255)
    for (let a = 192; a <= 223; a++) {
        for (let b = 0; b <= 255; b++) {
            if (a === 192 && b === 168) continue; // 跳过私有地址
            if (a === 198 && b >= 18 && b <= 19) continue; // 跳过测试地址
            if (Math.random() < 0.05) {
                for (let c = 0; c <= 255; c++) {
                    if (Math.random() < 0.005) {
                        const ip = `${a}.${b}.${c}.${Math.floor(Math.random() * 254) + 1}`;
                        const port = [80, 8080, 3128, 443, 8443, 8888, 9000][Math.floor(Math.random() * 7)];
                        ipPool.push(`http://${ip}:${port}`);
                    }
                }
            }
        }
    }
    
    console.log(`生成了 ${ipPool.length} 个随机IP地址`);
    return ipPool;
};

// 动态 IP 池管理器（每小时自动刷新）
globalThis.dynamicIPPool = {
    ipPool: [],
    lastRefresh: 0,
    refreshInterval: 3600000, // 1小时
    
    getIPs: function() {
        const now = Date.now();
        if (this.ipPool.length === 0 || now - this.lastRefresh > this.refreshInterval) {
            console.log("刷新IP池...");
            this.ipPool = generateMillionIPs();
            this.lastRefresh = now;
        }
        return this.ipPool;
    },
    
    getRandomIP: function() {
        const pool = this.getIPs();
        return pool[Math.floor(Math.random() * pool.length)];
    },
    
    getBatchIPs: function(count) {
        const pool = this.getIPs();
        const selected = [];
        const usedIndices = new Set();
        
        for (let i = 0; i < count && i < pool.length; i++) {
            let index;
            do {
                index = Math.floor(Math.random() * pool.length);
            } while (usedIndices.has(index) && usedIndices.size < pool.length);
            
            usedIndices.add(index);
            selected.push(pool[index]);
        }
        return selected;
    }
};

// 静态备用代理池（可自行添加可用代理）
globalThis.proxyPool = [
    'http://120.46.190.255:8080',
    'http://112.74.105.128:8080', 
    'http://183.247.211.43:8080',
    'http://117.85.105.170:8080',
    'http://121.232.148.241:8080',
    'http://118.212.104.207:8080',
    'http://117.87.178.123:8080',
    'http://183.166.102.23:8080',
    'http://114.239.1.155:8080',
    'http://123.163.117.98:8080'
];

// 智能获取随机代理（80%动态IP，20%静态IP）
globalThis.getRandomProxy = function() {
    if (Math.random() < 0.8) {
        return dynamicIPPool.getRandomIP();
    } else {
        return proxyPool[Math.floor(Math.random() * proxyPool.length)];
    }
};

// 生成伪造的 IP 地址（用于 X-Forwarded-For 等头部）
globalThis.generateFakeIP = function() {
    let a, b, c, d;
    do {
        a = Math.floor(Math.random() * 223) + 1;
        b = Math.floor(Math.random() * 256);
        c = Math.floor(Math.random() * 256);
        d = Math.floor(Math.random() * 254) + 1;
    } while (
        a === 10 || 
        (a === 172 && b >= 16 && b <= 31) ||
        (a === 192 && b === 168) ||
        a === 127
    );
    return `${a}.${b}.${c}.${d}`;
};

// 增强的带代理请求函数（支持自动重试、伪造请求头）
globalThis.requestWithProxy = function(url, options, parseJson) {
    const maxRetries = 3;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            let proxyUrl = getRandomProxy();
            console.log(`第${attempt + 1}次尝试使用代理: ${proxyUrl}`);
            
            const userAgents = [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
                'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
                'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.210 Mobile Safari/537.36'
            ];
            const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
            const fakeIP = generateFakeIP();
            
            const requestOptions = {
                ...options,
                proxy: proxyUrl,
                timeout: 10000,
                headers: {
                    ...options?.headers,
                    'User-Agent': randomUserAgent,
                    'X-Forwarded-For': fakeIP,
                    'X-Real-IP': fakeIP,
                    'CF-Connecting-IP': fakeIP,
                    'Client-IP': fakeIP
                }
            };
            
            let result = request(url, requestOptions, parseJson);
            console.log(`第${attempt + 1}次代理请求成功`);
            return result;
        } catch (e) {
            console.log(`第${attempt + 1}次代理请求失败: ${e.message}`);
            if (attempt === maxRetries - 1) {
                console.log("所有代理尝试失败，使用直连");
                return request(url, options, parseJson);
            }
        }
    }
};
var rule = {
    title: '百忙无果[官]',
    host: 'https://pianku.api.%6d%67%74%76.com',
    homeUrl: '',
    // searchUrl: 'https://mobileso.bz.%6d%67%74%76.com/pc/search/v1?q=**&pn=fypage&pc=10',
    // 新版接口搜索变成v2并且加了验证，蛋疼
    // searchUrl: 'https://mobileso.bz.mgtv.com/pc/search/v2?allowedRC=1&src=mgtv&did=cf03b959-6945-4cb6-bcb3-88762459354d&timestamp=2024-06-21T15%3A52%3A55Z&signVersion=1&signNonce=8dae67a1fafc4bda984ec8deb47666ad&q=**&pn=fypage&pc=10&corr=1&_support=10000000&signature=4e27fddcd2a1a66d6c1764ed6b74bab7',
    // 用手机的吧，搞不定这个
    searchUrl: 'https://mobileso.bz.%6d%67%74%76.com/msite/search/v2?q=**&pn=fypage&pc=10',
    detailUrl: 'https://pcweb.api.mgtv.com/episode/list?page=1&size=50&video_id=fyid',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    multi: 1,
    // 分类链接fypage参数支持1个()表达式
    // https://www.mgtv.com/lib/3?lastp=list_index&kind=a1&year=all&chargeInfo=a1&sort=c2
    url: '/rider/list/pcweb/v3?platform=pcweb&channelId=fyclass&pn=fypage&pc=80&hudong=1&_support=10000000&kind=a1&area=a1',
    filter_url: 'year={{fl.year or "all"}}&sort={{fl.sort or "all"}}&chargeInfo={{fl.chargeInfo or "all"}}',
    headers: {
        'User-Agent': 'PC_UA'
    },
    timeout: 5000,
    class_name: '4K电影&4K电视剧&4K综艺&4K少儿&4K动漫&4K纪录片',
    class_url: '3&2&1&10&50&51',
    filter: {
        "1": [{
            "key": "chargeInfo",
            "name": "付费类型",
            "value": [{
                "n": "全部",
                "v": "all"
            }, {
                "n": "免费",
                "v": "b1"
            }, {
                "n": "vip",
                "v": "b2"
            }, {
                "n": "VIP用券",
                "v": "b3"
            }, {
                "n": "付费点播",
                "v": "b4"
            }]
        }, {
            "key": "sort",
            "name": "排序",
            "value": [{
                "n": "最新",
                "v": "c1"
            }, {
                "n": "最热",
                "v": "c2"
            }, {
                "n": "知乎高分",
                "v": "c4"
            }]
        }, {
            "key": "year",
            "name": "年代",
            "value": [{
                "n": "全部",
                "v": "all"
            }, {
                "n": "2026",
                "v": "2026"
            }, {                
                "n": "2025",
                "v": "2025"
            }, {
                "n": "2024",
                "v": "2024"
            }, {
                "n": "2023",
                "v": "2023"
            }, {
                "n": "2022",
                "v": "2022"
            }, {
                "n": "2021",
                "v": "2021"
            }, {
                "n": "2020",
                "v": "2020"
            }, {
                "n": "2019",
                "v": "2019"
            }, {
                "n": "2018",
                "v": "2018"
            }, {
                "n": "2017",
                "v": "2017"
            }, {
                "n": "2016",
                "v": "2016"
            }, {
                "n": "2015",
                "v": "2015"
            }, {
                "n": "2014",
                "v": "2014"
            }, {
                "n": "2013",
                "v": "2013"
            }, {
                "n": "2012",
                "v": "2012"
            }, {
                "n": "2011",
                "v": "2011"
            }, {
                "n": "2010",
                "v": "2010"
            }, {
                "n": "2009",
                "v": "2009"
            }, {
                "n": "2008",
                "v": "2008"
            }, {
                "n": "2007",
                "v": "2007"
            }, {
                "n": "2006",
                "v": "2006"
            }, {
                "n": "2005",
                "v": "2005"
            }, {
                "n": "2004",
                "v": "2004"
            }]
        }],
        "2": [{
            "key": "chargeInfo",
            "name": "付费类型",
            "value": [{
                "n": "全部",
                "v": "all"
            }, {
                "n": "免费",
                "v": "b1"
            }, {
                "n": "vip",
                "v": "b2"
            }, {
                "n": "VIP用券",
                "v": "b3"
            }, {
                "n": "付费点播",
                "v": "b4"
            }]
        }, {
            "key": "sort",
            "name": "排序",
            "value": [{
                "n": "最新",
                "v": "c1"
            }, {
                "n": "最热",
                "v": "c2"
            }, {
                "n": "知乎高分",
                "v": "c4"
            }]
        }, {
            "key": "year",
            "name": "年代",
            "value": [{
                "n": "全部",
                "v": "all"
            }, {
                "n": "2026",
                "v": "2026"
            }, {                 
                "n": "2025",
                "v": "2025"
            }, {
                "n": "2024",
                "v": "2024"
            }, {
                "n": "2023",
                "v": "2023"
            }, {
                "n": "2022",
                "v": "2022"
            }, {
                "n": "2021",
                "v": "2021"
            }, {
                "n": "2020",
                "v": "2020"
            }, {
                "n": "2019",
                "v": "2019"
            }, {
                "n": "2018",
                "v": "2018"
            }, {
                "n": "2017",
                "v": "2017"
            }, {
                "n": "2016",
                "v": "2016"
            }, {
                "n": "2015",
                "v": "2015"
            }, {
                "n": "2014",
                "v": "2014"
            }, {
                "n": "2013",
                "v": "2013"
            }, {
                "n": "2012",
                "v": "2012"
            }, {
                "n": "2011",
                "v": "2011"
            }, {
                "n": "2010",
                "v": "2010"
            }, {
                "n": "2009",
                "v": "2009"
            }, {
                "n": "2008",
                "v": "2008"
            }, {
                "n": "2007",
                "v": "2007"
            }, {
                "n": "2006",
                "v": "2006"
            }, {
                "n": "2005",
                "v": "2005"
            }, {
                "n": "2004",
                "v": "2004"
            }]
        }],
        "3": [{
            "key": "chargeInfo",
            "name": "付费类型",
            "value": [{
                "n": "全部",
                "v": "all"
            }, {
                "n": "免费",
                "v": "b1"
            }, {
                "n": "vip",
                "v": "b2"
            }, {
                "n": "VIP用券",
                "v": "b3"
            }, {
                "n": "付费点播",
                "v": "b4"
            }]
        }, {
            "key": "sort",
            "name": "排序",
            "value": [{
                "n": "最新",
                "v": "c1"
            }, {
                "n": "最热",
                "v": "c2"
            }, {
                "n": "知乎高分",
                "v": "c4"
            }]
        }, {
            "key": "year",
            "name": "年代",
            "value": [{
                "n": "全部",
                "v": "all"
            }, {
                "n": "2026",
                "v": "2026"
            }, {                 
                "n": "2025",
                "v": "2025"
            }, {
                "n": "2024",
                "v": "2024"
            }, {
                "n": "2023",
                "v": "2023"
            }, {
                "n": "2022",
                "v": "2022"
            }, {
                "n": "2021",
                "v": "2021"
            }, {
                "n": "2020",
                "v": "2020"
            }, {
                "n": "2019",
                "v": "2019"
            }, {
                "n": "2018",
                "v": "2018"
            }, {
                "n": "2017",
                "v": "2017"
            }, {
                "n": "2016",
                "v": "2016"
            }, {
                "n": "2015",
                "v": "2015"
            }, {
                "n": "2014",
                "v": "2014"
            }, {
                "n": "2013",
                "v": "2013"
            }, {
                "n": "2012",
                "v": "2012"
            }, {
                "n": "2011",
                "v": "2011"
            }, {
                "n": "2010",
                "v": "2010"
            }, {
                "n": "2009",
                "v": "2009"
            }, {
                "n": "2008",
                "v": "2008"
            }, {
                "n": "2007",
                "v": "2007"
            }, {
                "n": "2006",
                "v": "2006"
            }, {
                "n": "2005",
                "v": "2005"
            }, {
                "n": "2004",
                "v": "2004"
            }]
        }],
        "50": [{
            "key": "chargeInfo",
            "name": "付费类型",
            "value": [{
                "n": "全部",
                "v": "all"
            }, {
                "n": "免费",
                "v": "b1"
            }, {
                "n": "vip",
                "v": "b2"
            }, {
                "n": "VIP用券",
                "v": "b3"
            }, {
                "n": "付费点播",
                "v": "b4"
            }]
        }, {
            "key": "sort",
            "name": "排序",
            "value": [{
                "n": "最新",
                "v": "c1"
            }, {
                "n": "最热",
                "v": "c2"
            }, {
                "n": "知乎高分",
                "v": "c4"
            }]
        }, {
            "key": "year",
            "name": "年代",
            "value": [{
                "n": "全部",
                "v": "all"
            }, {
                "n": "2026",
                "v": "2026"
            }, {                 
                "n": "2025",
                "v": "2025"
            }, {
                "n": "2024",
                "v": "2024"
            }, {
                "n": "2023",
                "v": "2023"
            }, {
                "n": "2022",
                "v": "2022"
            }, {
                "n": "2021",
                "v": "2021"
            }, {
                "n": "2020",
                "v": "2020"
            }, {
                "n": "2019",
                "v": "2019"
            }, {
                "n": "2018",
                "v": "2018"
            }, {
                "n": "2017",
                "v": "2017"
            }, {
                "n": "2016",
                "v": "2016"
            }, {
                "n": "2015",
                "v": "2015"
            }, {
                "n": "2014",
                "v": "2014"
            }, {
                "n": "2013",
                "v": "2013"
            }, {
                "n": "2012",
                "v": "2012"
            }, {
                "n": "2011",
                "v": "2011"
            }, {
                "n": "2010",
                "v": "2010"
            }, {
                "n": "2009",
                "v": "2009"
            }, {
                "n": "2008",
                "v": "2008"
            }, {
                "n": "2007",
                "v": "2007"
            }, {
                "n": "2006",
                "v": "2006"
            }, {
                "n": "2005",
                "v": "2005"
            }, {
                "n": "2004",
                "v": "2004"
            }]
        }],
        "51": [{
            "key": "chargeInfo",
            "name": "付费类型",
            "value": [{
                "n": "全部",
                "v": "all"
            }, {
                "n": "免费",
                "v": "b1"
            }, {
                "n": "vip",
                "v": "b2"
            }, {
                "n": "VIP用券",
                "v": "b3"
            }, {
                "n": "付费点播",
                "v": "b4"
            }]
        }, {
            "key": "sort",
            "name": "排序",
            "value": [{
                "n": "最新",
                "v": "c1"
            }, {
                "n": "最热",
                "v": "c2"
            }, {
                "n": "知乎高分",
                "v": "c4"
            }]
        }, {
            "key": "year",
            "name": "年代",
            "value": [{
                "n": "全部",
                "v": "all"
            }, {
                "n": "2026",
                "v": "2026"
            }, {                 
                "n": "2025",
                "v": "2025"
            }, {
                "n": "2024",
                "v": "2024"
            }, {
                "n": "2023",
                "v": "2023"
            }, {
                "n": "2022",
                "v": "2022"
            }, {
                "n": "2021",
                "v": "2021"
            }, {
                "n": "2020",
                "v": "2020"
            }, {
                "n": "2019",
                "v": "2019"
            }, {
                "n": "2018",
                "v": "2018"
            }, {
                "n": "2017",
                "v": "2017"
            }, {
                "n": "2016",
                "v": "2016"
            }, {
                "n": "2015",
                "v": "2015"
            }, {
                "n": "2014",
                "v": "2014"
            }, {
                "n": "2013",
                "v": "2013"
            }, {
                "n": "2012",
                "v": "2012"
            }, {
                "n": "2011",
                "v": "2011"
            }, {
                "n": "2010",
                "v": "2010"
            }, {
                "n": "2009",
                "v": "2009"
            }, {
                "n": "2008",
                "v": "2008"
            }, {
                "n": "2007",
                "v": "2007"
            }, {
                "n": "2006",
                "v": "2006"
            }, {
                "n": "2005",
                "v": "2005"
            }, {
                "n": "2004",
                "v": "2004"
            }]
        }],
        "115": [{
            "key": "chargeInfo",
            "name": "付费类型",
            "value": [{
                "n": "全部",
                "v": "all"
            }, {
                "n": "免费",
                "v": "b1"
            }, {
                "n": "vip",
                "v": "b2"
            }, {
                "n": "VIP用券",
                "v": "b3"
            }, {
                "n": "付费点播",
                "v": "b4"
            }]
        }, {
            "key": "sort",
            "name": "排序",
            "value": [{
                "n": "最新",
                "v": "c1"
            }, {
                "n": "最热",
                "v": "c2"
            }, {
                "n": "知乎高分",
                "v": "c4"
            }]
        }, {
            "key": "year",
            "name": "年代",
            "value": [{
                "n": "全部",
                "v": "all"
            }, {
                "n": "2026",
                "v": "2026"
            }, {                 
                "n": "2025",
                "v": "2025"
            }, {
                "n": "2024",
                "v": "2024"
            }, {
                "n": "2023",
                "v": "2023"
            }, {
                "n": "2022",
                "v": "2022"
            }, {
                "n": "2021",
                "v": "2021"
            }, {
                "n": "2020",
                "v": "2020"
            }, {
                "n": "2019",
                "v": "2019"
            }, {
                "n": "2018",
                "v": "2018"
            }, {
                "n": "2017",
                "v": "2017"
            }, {
                "n": "2016",
                "v": "2016"
            }, {
                "n": "2015",
                "v": "2015"
            }, {
                "n": "2014",
                "v": "2014"
            }, {
                "n": "2013",
                "v": "2013"
            }, {
                "n": "2012",
                "v": "2012"
            }, {
                "n": "2011",
                "v": "2011"
            }, {
                "n": "2010",
                "v": "2010"
            }, {
                "n": "2009",
                "v": "2009"
            }, {
                "n": "2008",
                "v": "2008"
            }, {
                "n": "2007",
                "v": "2007"
            }, {
                "n": "2006",
                "v": "2006"
            }, {
                "n": "2005",
                "v": "2005"
            }, {
                "n": "2004",
                "v": "2004"
            }]
        }]
    },
    limit: 20,
    play_parse: true,
    
    lazy: $js.toString(() => {
        input = {
            header: {
                'User-Agent': ""
            },
            parse: 0,
            url: input.split("?")[0],
            jx: 1,
            danmaku: 'http://127.0.0.1:9978/proxy?do=danmu&url=' + input.split("?")[0]
        };
    }),

    一级: 'json:data.hitDocs;title;img;updateInfo||rightCorner.text;playPartId',

    二级: $js.toString(() => {
        fetch_params.headers.Referer = "https://www.mgtv.com";
        fetch_params.headers["User-Agent"] = MOBILE_UA;
        pdfh = jsp.pdfh;
        pdfa = jsp.pdfa;
        pd = jsp.pd;
        VOD = {};
        let d = [];
        let html = request(input);
        let json = JSON.parse(html);
        let host = "https://www.mgtv.com";
        let ourl = json.data.list.length > 0 ? json.data.list[0].url : json.data.series[0].url;
        if (!/^http/.test(ourl)) {
            ourl = host + ourl
        }
        fetch_params.headers["User-Agent"] = MOBILE_UA;
        html = request(ourl);
        if (html.includes("window.location =")) {
            print("开始获取ourl");
            ourl = pdfh(html, "meta[http-equiv=refresh]&&content").split("url=")[1];
            print("获取到ourl:" + ourl);
            html = request(ourl)
        }
        try {
            let details = pdfh(html, ".m-details&&Html").replace(/h1>/, "h6>").replace(/div/g, "br");
            print(details);
            let actor = "",
                director = "",
                time = "";
            if (/播出时间/.test(details)) {
                actor = pdfh(html, "p:eq(5)&&Text").substr(0, 25);
                director = pdfh(html, "p:eq(4)&&Text");
                time = pdfh(html, "p:eq(3)&&Text")
            } else {
                actor = pdfh(html, "p:eq(4)&&Text").substr(0, 25);
                director = pdfh(html, "p:eq(3)&&Text");
                time = "已完结"
            }
            let _img = pd(html, ".video-img&&img&&src");
            let JJ = pdfh(html, ".desc&&Text").split("简介：")[1];
            let _desc = time;
            VOD.vod_name = pdfh(html, ".vt-txt&&Text");
            VOD.type_name = pdfh(html, "p:eq(0)&&Text").substr(0, 6);
            VOD.vod_area = pdfh(html, "p:eq(1)&&Text");
            VOD.vod_actor = actor;
            VOD.vod_director = director;
            VOD.vod_remarks = _desc;
            VOD.vod_pic = _img;
            VOD.vod_content = JJ;
            if (!VOD.vod_name) {
                VOD.vod_name = VOD.type_name;
            }
        } catch (e) {
            log("获取影片信息发生错误:" + e.message)
        }

        function getRjpg(imgUrl, xs) {
            xs = xs || 3;
            let picSize = /jpg_/.test(imgUrl) ? imgUrl.split("jpg_")[1].split(".")[0] : false;
            let rjpg = false;
            if (picSize) {
                let a = parseInt(picSize.split("x")[0]) * xs;
                let b = parseInt(picSize.split("x")[1]) * xs;
                rjpg = a + "x" + b + ".jpg"
            }
            let img = /jpg_/.test(imgUrl) && rjpg ? imgUrl.replace(imgUrl.split("jpg_")[1], rjpg) : imgUrl;
            return img
        }

        if (json.data.total === 1 && json.data.list.length === 1) {
            let data = json.data.list[0];
            let url = "https://www.mgtv.com" + data.url;
            d.push({
                title: data.t4,
                desc: data.t2,
                pic_url: getRjpg(data.img),
                url: url
            })
        } else if (json.data.list.length > 1) {
            for (let i = 1; i <= json.data.total_page; i++) {
                if (i > 1) {
                    json = JSON.parse(fetch(input.replace("page=1", "page=" + i), {}))
                }
                json.data.list.forEach(function(data) {
                    let url = "https://www.mgtv.com" + data.url;
                    if (data.isIntact == "1") {
                        d.push({
                            title: data.t4,
                            desc: data.t2,
                            pic_url: getRjpg(data.img),
                            url: url
                        })
                    }
                })
            }
        } else {
            print(input + "暂无片源")
        }
        VOD.vod_play_from = "mgtv";
        VOD.vod_play_url = d.map(function(it) {
            return it.title + "$" + it.url
        }).join("#");
        setResult(d);
    }),

    搜索: $js.toString(() => {
        fetch_params.headers.Referer = "https://www.mgtv.com";
        fetch_params.headers["User-Agent"] = MOBILE_UA;
        let d = [];
        let html = request(input);
        let json = JSON.parse(html);
        json.data.contents.forEach(function(data) {
            if (data.type && data.type == 'media') {
                let item = data.data[0];
                let desc = item.desc.join(',');
                let fyclass = '';
                if (item.source === "imgo") {
                    let img = item.img ? item.img : '';
                    try {
                        fyclass = item.rpt.match(/idx=(.*?)&/)[1] + '$';
                    } catch (e) {
                        log(e.message);
                        fyclass = '';
                    }
                    log(fyclass);
                    d.push({
                        title: item.title.replace(/<B>|<\/B>/g, ''),
                        img: img,
                        content: '',
                        desc: desc,
                        url: fyclass + item.url.match(/.*\/(.*?)\.html/)[1]
                    })
                }
            }
        });
        setResult(d);
    }),
}
