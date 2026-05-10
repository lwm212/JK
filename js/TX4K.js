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
globalThis.vod1 = function(ids) {
    let html1 = request('https://pbaccess.video.qq.com/trpc.videosearch.mobile_search.MultiTerminalSearch/MbSearch?vplatform=2', {
        body: {
            "version": "25042201",
            "clientType": 1,
            "filterValue": "",
            "uuid": "B1E50847-D25F-4C4B-BBA0-36F0093487F6",
            "retry": 0,
            "query": ids,
            "pagenum": 0,
            "isPrefetch": true,
            "pagesize": 30,
            "queryFrom": 0,
            "searchDatakey": "",
            "transInfo": "",
            "isneedQc": true,
            "preQid": "",
            "adClientInfo": "",
            "extraInfo": {
                "isNewMarkLabel": "1",
                "multi_terminal_pc": "1",
                "themeType": "1",
                "sugRelatedIds": "{}",
                "appVersion": ""
            }
        },
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.139 Safari/537.36',
            'Content-Type': 'application/json',
            'origin': 'https://v.qq.com',
            'referer': 'https://v.qq.com/'
        },
        'method': 'POST'
    }, true);
    return html1;
}
var rule = {
    title: '腾云驾雾[官]',
    host: 'https://v.%71%71.com',
    // homeUrl: '/x/bu/pagesheet/list?_all=1&append=1&channel=choice&listpage=1&offset=0&pagesize=21&iarea=-1&sort=18',
    homeUrl: '/x/bu/pagesheet/list?_all=1&append=1&channel=cartoon&listpage=1&offset=0&pagesize=21&iarea=-1&sort=18',
    detailUrl: 'https://node.video.%71%71.com/x/api/float_vinfo2?cid=fyid',
    searchUrl: '/x/search/?q=**&stag=fypage',
    searchUrl: 'https://pbaccess.video.%71%71.com/trpc.videosearch.smartboxServer.HttpRountRecall/Smartbox?query=**&appID=3172&appKey=lGhFIPeD3HsO9xEp&pageNum=(fypage-1)&pageSize=10',
    searchUrl: '**',
    searchable: 2,
    filterable: 1,
    multi: 1,
    // url:'/channel/fyclass?listpage=fypage&channel=fyclass&sort=18&_all=1',
    url: '/x/bu/pagesheet/list?_all=1&append=1&channel=fyclass&listpage=1&offset=((fypage-1)*21)&pagesize=21&iarea=-1',
    // filter_url: 'sort={{fl.sort or 18}}&year={{fl.year}}&pay={{fl.pay}}',
    // filter_url: 'sort={{fl.sort or 75}}&year={{fl.year}}&pay={{fl.pay}}',
    filter_url: 'sort={{fl.sort or 75}}&iyear={{fl.iyear}}&year={{fl.year}}&itype={{fl.type}}&ifeature={{fl.feature}}&iarea={{fl.area}}&itrailer={{fl.itrailer}}&gender={{fl.sex}}',
    // filter: 'H4sIAAAAAAAAA+2UzUrDQBCA32XOEZLUJrGvIj0saaDBNisxBkIJCG3Fi4oepIg3EQoieqiH+vM23Zq+hRuaZLZ4ce9z2/lmd2d2+NgR+H0e+gF0DkdwFGTQgRMeJ2BAxIaSwvrqVnxcyzhlg9PttqjED2c/45cSy8DyIDcavr57q/lBw8XTd/E6qbnT8M3zTFyc72RtC/Jumd+2c8wy7KZ4nxSL5Z9uxHS+Gc+r83sWVp1eVttl4Dluk1h93YubWZVwduplAYuxoFguVp+P/y5om/Z+/YxyqfAW8pbKbeS2yi3kO/ebyE2Fy1nXXBm7DDzknspd5K7KHeSOytvI2+XAugYkKWlD2mhrM+RpSB8OmaNvTsriMEgycofc0XbHZ3HCeUTukDv67vTDQY/MIXO0zelxn5M4JI6mOPkvgswSEpgPAAA=',
    filter: {
        "choice": [{
            "key": "sort",
            "name": "排序",
            "value": [{
                "n": "最热",
                "v": "75"
            }, {
                "n": "最新",
                "v": "83"
            }, {
                "n": "好评",
                "v": "81"
            }]
        }, {
            "key": "iyear",
            "name": "年代",
            "value": [{
                "n": "全部",
                "v": "-1"
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
            }]
        }],
        "tv": [{
            "key": "sort",
            "name": "排序",
            "value": [{
                "n": "最热",
                "v": "75"
            }, {
                "n": "最新",
                "v": "79"
            }, {
                "n": "好评",
                "v": "16"
            }]
        }, {
            "key": "feature",
            "name": "类型",
            "value": [{
                "n": "全部",
                "v": "-1"
            }, {
                "n": "爱情",
                "v": "1"
            }, {
                "n": "古装",
                "v": "2"
            }, {
                "n": "悬疑",
                "v": "3"
            }, {
                "n": "都市",
                "v": "4"
            }, {
                "n": "家庭",
                "v": "5"
            }, {
                "n": "喜剧",
                "v": "6"
            }, {
                "n": "传奇",
                "v": "7"
            }, {
                "n": "武侠",
                "v": "8"
            }, {
                "n": "军旅",
                "v": "9"
            }, {
                "n": "权谋",
                "v": "10"
            }, {
                "n": "革命",
                "v": "11"
            }, {
                "n": "现实",
                "v": "13"
            }, {
                "n": "青春",
                "v": "14"
            }, {
                "n": "猎奇",
                "v": "15"
            }, {
                "n": "科幻",
                "v": "16"
            }, {
                "n": "竞技",
                "v": "17"
            }, {
                "n": "玄幻",
                "v": "18"
            }]
        }, {
            "key": "iyear",
            "name": "年代",
            "value": [{
                "n": "全部",
                "v": "-1"
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
            }]
        }],
        "movie": [{
            "key": "sort",
            "name": "排序",
            "value": [{
                "n": "最热",
                "v": "75"
            }, {
                "n": "最新",
                "v": "83"
            }, {
                "n": "好评",
                "v": "81"
            }]
        }, {
            "key": "type",
            "name": "类型",
            "value": [{
                "n": "全部",
                "v": "-1"
            }, {
                "n": "犯罪",
                "v": "4"
            }, {
                "n": "励志",
                "v": "2"
            }, {
                "n": "喜剧",
                "v": "100004"
            }, {
                "n": "热血",
                "v": "100061"
            }, {
                "n": "悬疑",
                "v": "100009"
            }, {
                "n": "爱情",
                "v": "100005"
            }, {
                "n": "科幻",
                "v": "100012"
            }, {
                "n": "恐怖",
                "v": "100010"
            }, {
                "n": "动画",
                "v": "100015"
            }, {
                "n": "战争",
                "v": "100006"
            }, {
                "n": "家庭",
                "v": "100017"
            }, {
                "n": "剧情",
                "v": "100022"
            }, {
                "n": "奇幻",
                "v": "100016"
            }, {
                "n": "武侠",
                "v": "100011"
            }, {
                "n": "历史",
                "v": "100021"
            }, {
                "n": "老片",
                "v": "100013"
            }, {
                "n": "西部",
                "v": "3"
            }, {
                "n": "记录片",
                "v": "100020"
            }]
        }, {
            "key": "year",
            "name": "年代",
            "value": [{
                "n": "全部",
                "v": "-1"
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
            }]
        }],
        "variety": [{
            "key": "sort",
            "name": "排序",
            "value": [{
                "n": "最热",
                "v": "75"
            }, {
                "n": "最新",
                "v": "23"
            }]
        }, {
            "key": "iyear",
            "name": "年代",
            "value": [{
                "n": "全部",
                "v": "-1"
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
            }]
        }],
        "cartoon": [{
            "key": "sort",
            "name": "排序",
            "value": [{
                "n": "最热",
                "v": "75"
            }, {
                "n": "最新",
                "v": "83"
            }, {
                "n": "好评",
                "v": "81"
            }]
        }, {
            "key": "area",
            "name": "地区",
            "value": [{
                "n": "全部",
                "v": "-1"
            }, {
                "n": "内地",
                "v": "1"
            }, {
                "n": "日本",
                "v": "2"
            }, {
                "n": "欧美",
                "v": "3"
            }, {
                "n": "其他",
                "v": "4"
            }]
        }, {
            "key": "type",
            "name": "类型",
            "value": [{
                "n": "全部",
                "v": "-1"
            }, {
                "n": "玄幻",
                "v": "9"
            }, {
                "n": "科幻",
                "v": "4"
            }, {
                "n": "武侠",
                "v": "13"
            }, {
                "n": "冒险",
                "v": "3"
            }, {
                "n": "战斗",
                "v": "5"
            }, {
                "n": "搞笑",
                "v": "1"
            }, {
                "n": "恋爱",
                "v": "7"
            }, {
                "n": "魔幻",
                "v": "6"
            }, {
                "n": "竞技",
                "v": "20"
            }, {
                "n": "悬疑",
                "v": "17"
            }, {
                "n": "日常",
                "v": "15"
            }, {
                "n": "校园",
                "v": "16"
            }, {
                "n": "真人",
                "v": "18"
            }, {
                "n": "推理",
                "v": "14"
            }, {
                "n": "历史",
                "v": "19"
            }, {
                "n": "经典",
                "v": "3"
            }, {
                "n": "其他",
                "v": "12"
            }]
        }, {
            "key": "iyear",
            "name": "年代",
            "value": [{
                "n": "全部",
                "v": "-1"
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
            }]
        }],
        "child": [{
            "key": "sort",
            "name": "排序",
            "value": [{
                "n": "最热",
                "v": "75"
            }, {
                "n": "最新",
                "v": "76"
            }, {
                "n": "好评",
                "v": "20"
            }]
        }, {
            "key": "sex",
            "name": "性别",
            "value": [{
                "n": "全部",
                "v": "-1"
            }, {
                "n": "女孩",
                "v": "1"
            }, {
                "n": "男孩",
                "v": "2"
            }]
        }, {
            "key": "area",
            "name": "地区",
            "value": [{
                "n": "全部",
                "v": "-1"
            }, {
                "n": "内地",
                "v": "3"
            }, {
                "n": "日本",
                "v": "2"
            }, {
                "n": "其他",
                "v": "1"
            }]
        }, {
            "key": "iyear",
            "name": "年龄段",
            "value": [{
                "n": "全部",
                "v": "-1"
            }, {
                "n": "0-3岁",
                "v": "1"
            }, {
                "n": "4-6岁",
                "v": "2"
            }, {
                "n": "7-9岁",
                "v": "3"
            }, {
                "n": "10岁以上",
                "v": "4"
            }, {
                "n": "全年龄段",
                "v": "7"
            }]
        }],
        "doco": [{
            "key": "sort",
            "name": "排序",
            "value": [{
                "n": "最热",
                "v": "75"
            }, {
                "n": "最新",
                "v": "74"
            }]
        }, {
            "key": "itrailer",
            "name": "出品方",
            "value": [{
                "n": "全部",
                "v": "-1"
            }, {
                "n": "BBC",
                "v": "1"
            }, {
                "n": "国家地理",
                "v": "4"
            }, {
                "n": "HBO",
                "v": "3175"
            }, {
                "n": "NHK",
                "v": "2"
            }, {
                "n": "历史频道",
                "v": "7"
            }, {
                "n": "ITV",
                "v": "3530"
            }, {
                "n": "探索频道",
                "v": "3174"
            }, {
                "n": "ZDF",
                "v": "3176"
            }, {
                "n": "腾讯自制",
                "v": "15"
            }, {
                "n": "合作机构",
                "v": "6"
            }, {
                "n": "其他",
                "v": "5"
            }]
        }, {
            "key": "type",
            "name": "类型",
            "value": [{
                "n": "全部",
                "v": "-1"
            }, {
                "n": "自然",
                "v": "4"
            }, {
                "n": "美食",
                "v": "10"
            }, {
                "n": "社会",
                "v": "3"
            }, {
                "n": "人文",
                "v": "6"
            }, {
                "n": "历史",
                "v": "1"
            }, {
                "n": "军事",
                "v": "2"
            }, {
                "n": "科技",
                "v": "8"
            }, {
                "n": "财经",
                "v": "14"
            }, {
                "n": "探险",
                "v": "15"
            }, {
                "n": "罪案",
                "v": "7"
            }, {
                "n": "竞技",
                "v": "12"
            }, {
                "n": "旅游",
                "v": "11"
            }]
        }]
    },
    headers: {
        'User-Agent': 'PC_UA'
    },
    timeout: 5000,
    // class_parse:'.site_channel a;a&&Text;a&&href;channel/(.*)',
    cate_exclude: '会员|游戏|全部',
    // class_name: '电视剧&电影&综艺&动漫&少儿&纪录片',
    // class_url: 'tv&movie&variety&cartoon&child&doco',
    class_name: '4K电影&4K电视剧&4K综艺&4K动漫&4K少儿&4K纪录片',
    class_url: 'movie&tv&variety&cartoon&child&doco',
    limit: 20,
    // play_parse:true,
    // 手动调用解析请求json的url,此lazy不方便
    play_parse: true,
    lazy: $js.toString(() => {
        try {
            let api = "https://jx.ariesc.cn/api/?key=175d84e43f503032ce31057395dc6534&url=" + input.split("?")[0];
            console.log(api);
            let response = fetch(api, {
                method: 'get',
                headers: {
                    'User-Agent': 'okhttp/3.14.9',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            let bata = JSON.parse(response);
            log(bata)
            if (bata.url.includes("http")) {
                input = {
                    header: {
                        'User-Agent': ""
                    },
                    parse: 0,
                    url: bata.url,
                    jx: 0,
                    danmaku: 'https://jx.ariesc.cn/api/?key=8af25b37f95ea8a4c1eca1ca9cd77f41&url=' + input.split("?")[0]
                };
            } else {

                input = {
                    header: {
                        'User-Agent': ""
                    },
                    parse: 0,
                    url: input.split("?")[0],
                    jx: 1,
                    danmaku: 'http://127.0.0.1:9978/proxy?do=danmu&site=js&url=http://dm.qxq6.com/zy/api.php?url=' + input.split("?")[0]
                };
            }
        } catch {
            input = {
                header: {
                    'User-Agent': ""
                },
                parse: 0,
                url: input.split("?")[0],
                jx: 1,
                danmaku: 'http://127.0.0.1:9978/proxy?do=danmu&site=js&url=http://dm.qxq6.com/zy/api.php?url=' + input.split("?")[0]
            };
        }
    }),
    推荐: '.list_item;img&&alt;img&&src;a&&Text;a&&data-float',
    一级: '.list_item;img&&alt;img&&src;a&&Text;a&&data-float',
    二级: $js.toString(() => {
        VOD = {};
        let d = [];
        let video_list = [];
        let video_lists = [];
        let list = [];
        let QZOutputJson;
        let html = fetch(input, fetch_params);
        let sourceId = /get_playsource/.test(input) ? input.match(/id=(\d*?)&/)[1] : input.split("cid=")[1];
        let cid = sourceId;
        let detailUrl = "https://v.%71%71.com/detail/m/" + cid + ".html";
        log("详情页:" + detailUrl);
        pdfh = jsp.pdfh;
        pd = jsp.pd;
        try {
            let json = JSON.parse(html);
            VOD = {
                vod_url: input,
                vod_name: json.c.title,
                type_name: json.typ.join(","),
                vod_actor: json.nam.join(","),
                vod_year: json.c.year,
                vod_content: json.c.description,
                vod_remarks: json.rec,
                vod_pic: urljoin2(input, json.c.pic)
            }
        } catch (e) {
            log("解析片名海报等基础信息发生错误:" + e.message)
        }
        if (/get_playsource/.test(input)) {
            eval(html);
            let indexList = QZOutputJson.PlaylistItem.indexList;
            indexList.forEach(function(it) {
                let dataUrl = "https://s.video.qq.com/get_playsource?id=" + sourceId + "&plat=2&type=4&data_type=3&range=" + it + "&video_type=10&plname=qq&otype=json";
                eval(fetch(dataUrl, fetch_params));
                let vdata = QZOutputJson.PlaylistItem.videoPlayList;
                vdata.forEach(function(item) {
                    d.push({
                        title: item.title,
                        pic_url: item.pic,
                        desc: item.episode_number + "\t\t\t播放量：" + item.thirdLine,
                        url: item.playUrl
                    })
                });
                video_lists = video_lists.concat(vdata)
            })
        } else {
            let json = JSON.parse(html);
            video_lists = json.c.video_ids;
            let url = "https://v.qq.com/x/cover/" + sourceId + ".html";
            if (video_lists.length === 1) {
                let vid = video_lists[0];
                url = "https://v.qq.com/x/cover/" + cid + "/" + vid + ".html";
                d.push({
                    title: "在线播放",
                    url: url
                })
            } else if (video_lists.length > 1) {
                for (let i = 0; i < video_lists.length; i += 30) {
                    video_list.push(video_lists.slice(i, i + 30))
                }
                video_list.forEach(function(it, idex) {
                    let o_url = "https://union.video.qq.com/fcgi-bin/data?otype=json&tid=1804&appid=20001238&appkey=6c03bbe9658448a4&union_platform=1&idlist=" + it.join(",");
                    let o_html = fetch(o_url, fetch_params);
                    eval(o_html);
                    QZOutputJson.results.forEach(function(it1) {
                        it1 = it1.fields;
                        let url = "https://v.qq.com/x/cover/" + cid + "/" + it1.vid + ".html";
                        d.push({
                            title: it1.title,
                            pic_url: it1.pic160x90.replace("/160", ""),
                            desc: it1.video_checkup_time,
                            url: url,
                            type: it1.category_map && it1.category_map.length > 1 ? it1.category_map[1] : ""
                        })
                    })
                })
            }
        }
        let yg = d.filter(function(it) {
            return it.type && it.type !== "正片"
        });
        let zp = d.filter(function(it) {
            return !(it.type && it.type !== "正片")
        });
        VOD.vod_play_from = yg.length < 1 ? "qq" : "腾讯4K";
        VOD.vod_play_url = yg.length < 1 ? d.map(function(it) {
            return it.title + "$" + it.url
        }).join("#") : [zp, yg].map(function(it) {
            return it.map(function(its) {
                return its.title + "$" + its.url
            }).join("#")
        }).join("$$$");
    }),
    搜索: $js.toString(() => {
        let d = [];
        pdfa = jsp.pdfa;
        pdfh = jsp.pdfh;
        pd = jsp.pd;
        let html = request(input);
        let baseList = pdfa(html, "body&&.result_item_v");
        log(baseList.length);
        baseList.forEach(function(it) {
            let longText = pdfh(it, ".result_title&&a&&Text");
            let shortText = pdfh(it, ".type&&Text");
            let fromTag = pdfh(it, ".result_source&&Text");
            let score = pdfh(it, ".figure_info&&Text");
            let content = pdfh(it, ".desc_text&&Text");
            // let url = pdfh(it, ".result_title&&a&&href");
            let url = pdfh(it, "div&&r-data");
            // log(longText);
            // log(shortText);
            // log('url:'+url);
            let img = pd(it, ".figure_pic&&src");
            url = "https://node.video.qq.com/x/api/float_vinfo2?cid=" + url.match(/.*\/(.*?)\.html/)[1];
            log(shortText + "|" + url);
            if (fromTag.match(/腾讯/)) {
                d.push({
                    title: longText.split(shortText)[0],
                    img: img,
                    url: url,
                    content: content,
                    desc: shortText + " " + score
                })
            }
        });
        setResult(d);
    }),
    搜索: $js.toString(() => {
        let d = [];
        let html = request(input);
        let json = JSON.parse(html);
        if (json.data.smartboxItemList.length > 0) {
            let cid = json.data.smartboxItemList[0].basicDoc.id;
            let url = 'https://node.video.qq.com/x/api/float_vinfo2?cid=' + cid;
            let html1 = request(url);
            let data = JSON.parse(html1);

            d.push({
                title: data.c.title,
                img: data.c.pic,
                url: url,
                content: data.c.description,
                desc: data.rec
            });
        }
        setResult(d);
    }),
    搜索: $js.toString(() => {
        let d = [];
        let mame = (input.split("/")[3]);
        let html = vod1(input.split("/")[3]);
        let json = JSON.parse(html);

        let list = json.data.normalList.itemList;
        console.log(json);
        log(list[0].videoInfo.title);
        list.forEach(function(it) {
            try {
                if (it.doc.id.length > 11) {
                    d.push({
                        title: it.videoInfo.title,
                        img: it.videoInfo.imgUrl,
                        url: it.doc.id,
                        // content: "",
                        //desc: "data.rec"
                    });
                }
            } catch {

            }

        });
        let list2 = json.data.areaBoxList[0].itemList;
        list2.forEach(function(it) {
            try {
                if (it.doc.id.length > 11 && it.videoInfo.title.match(mame)) {
                    d.push({
                        title: it.videoInfo.title,
                        img: it.videoInfo.imgUrl,
                        url: it.doc.id,
                        // content: "",
                        //desc: "data.rec"
                    });
                }
            } catch {

            }

        });
        setResult(d);
    })
}
