var rule = {
    title: 'HDmoli影视',
    模板: 'mxone5',
    host: 'https://www.hdmoli.pro',
    url: '/mlist/index/fyclass/page/fypage.html',
    filterable: 0, // 该站无复杂筛选功能
    searchUrl: '/search.php?searchkey=**',
    class_parse: '.nav-menu&&li:gt(0):lt(4);a&&Text;a&&href;.*/(.*?).html',
    推荐: {
        type: '.myui-vodlist__box',
        list: {
            title: '.title&&text',
            img: '.lazyload&&data-original',
            desc: '.pic-text&&text',
            url: 'a&&href'
        }
    },
    一级: {
        title: '.title&&text',
        img: '.lazyload&&data-original',
        desc: '.pic-text&&text',
        url: 'a&&href'
    },
    二级: {
        title: 'h1&&text',
        img: '.lazyload&&data-original',
        desc: ';;;.text-muted&&text', // 综合类型/年份/地区信息
        content: '详情：</span>&&<', // 需根据实际结构调整
        tabs: '.myui-player__item', // 播放源切换
        lists: '.myui-content__list&&a', // 剧集列表
        tab_text: 'Text', // 线路名称获取方式
        list_text: 'Text', // 集数名称
        list_url: 'href' // 播放地址
    },
    搜索: {
        list: '.myui-vodlist li',
        title: '.title&&text',
        img: '.lazyload&&data-original',
        desc: '.pic-text&&text',
        url: 'a&&href'
    },
    lazy: `js:
        let html = request(input);
        let url = input.split('/').slice(0,3).join('/');
        let id = html.match(/var siteUrl='(.*?)'/)[1];
        let realUrl = url + '/static/js/hdmoli-cms.js';
        let js = request(realUrl);
        let src = js.match(/src:"(.*?)"/)[1];
        JSON.parse(src);
    `, // 解密播放地址专用
    预处理: `js:
        let html = request(input);
        html = html.replace(/data-original/gi,'src'); // 处理懒加载
        html;
    `
};
