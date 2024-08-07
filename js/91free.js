var rule = {
	title:'91free',
	模板:'mxone5',
	host:'https://91free.vip',
	// url:'/index.php/vod/show/id/fyclass/page/fypage.html',
	url:'/index.php/vod/show/id/fyfilter.html',
	filterable:1,//是否启用分类筛选,
	filter_url:'{{fl.cateId}}{{fl.area}}{{fl.by}}{{fl.lang}}/page/fypage{{fl.year}}',
	filter: {
		"20":[{"key":"cateId","name":"类型","value":[{"n":"全部","v":"20"},{"n":"动作片","v":"24"},{"n":"爱情片","v":"25"},{"n":"科幻片","v":"26"},{"n":"恐怖片","v":"27"},{"n":"剧情片","v":"28"},{"n":"战争片","v":"29"},{"n":"喜剧片","v":"30"},{"n":"犯罪片","v":"31"},{"n":"奇幻片","v":"43"},{"n":"灾难片","v":"44"},{"n":"悬疑","v":"45"}]},{"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"中国大陆","v":"/area/中国大陆"},{"n":"中国香港","v":"/area/中国香港"},{"n":"中国台湾","v":"/area/中国台湾"},{"n":"美国","v":"/area/美国"},{"n":"法国","v":"/area/+法国"},{"n":"英国","v":"/area/+英国"},{"n":"日本","v":"/area/+日本"},{"n":"韩国","v":"/area/+韩国"},{"n":"德国","v":"/area/+德国"},{"n":"泰国","v":"/area/+泰国+"},{"n":"印度","v":"/area/印度"},{"n":"意大利","v":"/area/+意大利"},{"n":"西班牙","v":"/area/+西班牙"},{"n":"加拿大","v":"/area/+加拿大"},{"n":"其他","v":"/area/+其他"}]},{"key":"lang","name":"语言","value":[{"n":"全部","v":""},{"n":"国语","v":"/lang/国语"},{"n":"英语","v":"/lang/+英语"},{"n":"粤语","v":"/lang/+粤语"},{"n":"闽南语","v":"/lang/+闽南语"},{"n":"韩语","v":"/lang/+韩语"},{"n":"日语","v":"/lang/+日语"},{"n":"法语","v":"/lang/+法语"},{"n":"德语","v":"/lang/+德语"},{"n":"其它","v":"/lang/+其它"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2023","v":"/year/2023"},{"n":"2022","v":"/year/2022"},{"n":"2021","v":"/year/+2021"},{"n":"2020","v":"/year/+2020"},{"n":"2019","v":"/year/+2019"},{"n":"2018","v":"/year/+2018"},{"n":"2017","v":"/year/+2017"},{"n":"2016","v":"/year/+2016"},{"n":"2015","v":"/year/+2015"},{"n":"2014","v":"/year/+2014"},{"n":"2013","v":"/year/+2013"},{"n":"2012","v":"/year/+2012"},{"n":"2011","v":"/year/+2011"},{"n":"2010","v":"/year/+2010"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"/by/time"},{"n":"人气","v":"/by/hits"},{"n":"评分","v":"/by/score"}]}],
		"21":[{"key":"cateId","name":"类型","value":[{"n":"全部","v":"21"},{"n":"国产剧","v":"32"},{"n":"韩国剧","v":"33"},{"n":"台湾","v":"34"},{"n":"泰国","v":"35"},{"n":"日本","v":"36"},{"n":"欧美","v":"37"},{"n":"香港","v":"42"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"/by/time"},{"n":"人气","v":"/by/hits"},{"n":"评分","v":"/by/score"}]}],
		"22":[{"key":"cateId","name":"类型","value":[{"n":"全部","v":"22"},{"n":"大陆综艺","v":"38"},{"n":"港台综艺","v":"39"},{"n":"日韩综艺","v":"40"},{"n":"欧美综艺","v":"41"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"/by/time"},{"n":"人气","v":"/by/hits"},{"n":"评分","v":"/by/score"}]}],
		"23":[{"key":"cateId","name":"类型","value":[{"n":"全部","v":"23"},{"n":"国产动漫","v":"46"},{"n":"日本动漫","v":"47"},{"n":"欧美动漫","v":"48"},{"n":"海外动漫","v":"49"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"/by/time"},{"n":"人气","v":"/by/hits"},{"n":"评分","v":"/by/score"}]}],
		"52":[{"key":"cateId","name":"类型","value":[{"n":"全部","v":"52"},{"n":"篮球","v":"54"},{"n":"足球","v":"53"},{"n":"网球","v":"55"},{"n":"斯诺克","v":"56"}]},{"key":"by","name":"排序","value":[{"n":"时间","v":"/by/time"},{"n":"人气","v":"/by/hits"},{"n":"评分","v":"/by/score"}]}]
	
	},
	filter_def:{
		20:{cateId:'20'},
		21:{cateId:'21'},
		22:{cateId:'22'},
		23:{cateId:'23'},
		52:{cateId:'52'}
		
	},
	searchUrl:'/index.php/vod/search/page/fypage/wd/**.html',
	class_parse: '.navbar-items&&li:gt(1):lt(7);a&&title;a&&href;.*/(.*?).html',
	推荐: '*',
	double: false, // 推荐内容是否双层定位
	一级: '.module-items .module-item;.lazyload&&alt;.lazyload&&data-original;.module-item-note&&Text;a&&href',
	二级: {
		"title": "h1&&Text;.module-info-tag&&Text",
		"img": ".lazyload&&data-original",
		"desc": ".module-info-item:eq(4)&&Text;;;.module-info-item-content:eq(1)&&Text;.module-info-item-content:eq(0)&&Text",
		"content": ".module-info-introduction-content&&Text",
		"tabs": "#y-playList&&.tab-item",
		"lists": ".module-play-list-content:eq(#id)&&a"
	},
	搜索: '.module-items .module-card-item;*;*;*;*',
}
