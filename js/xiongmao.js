globalThis.h_ost = ' http://154.221.17.127:8188/';
var key = CryptoJS.enc.Base64.parse("YWU3MTU4ODgyN2EzODAzNg==");
var iv = CryptoJS.enc.Base64.parse("YWU3MTU4ODgyN2EzODAzNg==");
globalThis.AES_Decrypt = function (word) {
  try {
    var decrypt = CryptoJS.AES.decrypt(word, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedText = decrypt.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) {
      throw new Error("解密后的内容为空");
    }
    return decryptedText;
  } catch (e) {
    console.error("解密失败:", e);
    return null;
  }
};
globalThis.AES_Encrypt = function (word) {
  var encrypted = CryptoJS.AES.encrypt(word, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
};

globalThis.vod1 = function (t,pg){
 let html1 = request( h_ost + 'api.php/getappapi.index/typeFilterVodList', {
    body: {
       area: '全部',
       year: '全部',
       type_id: t,
       page: pg,
       sort: '最新',
       lang: '全部',
       class: '全部'
     },
    headers: { 'User-Agent': 'okhttp/3.14.9',
    'Content-Type': 'application/x-www-form-urlencoded'},
    'method': 'POST'
 }, true);
let html = JSON.parse(html1);
return(AES_Decrypt(html.data));
}
globalThis.vodids = function (ids) {
    let html1 = fetch(h_ost + 'api.php/getappapi.index/vodDetail', {
        method: 'POST',
        headers: {
            'User-Agent': 'okhttp/3.14.9',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
            vod_id: ids,
        }
    });
    let html = JSON.parse(html1);
    const rdata = JSON.parse(AES_Decrypt(html.data));
    const data = {
        vod_id: ids,
        vod_name: rdata.vod.vod_name,
        vod_remarks: '小米：'+ rdata.vod.vod_remarks,
        vod_actor: rdata.vod.vod_actor,
        vod_director: rdata.vod.vod_director,
        vod_content: '小米提醒您：请勿相信任何广告谢谢'+ rdata.vod.vod_content,
        vod_play_from: '',
        vod_play_url: ''
    };

    rdata.vod_play_list.forEach((value) => {
        data.vod_play_from += value.player_info.show + '|小米|广告勿信$$$';
        value.urls.forEach((v) => {
            data.vod_play_url += v.name + '$' + (value.player_info.parse || '') + v.url + '#';
        });
        data.vod_play_url += '$$$';
    });
    return data;
}
//搜索
globalThis.ssvod = function (wd) {
    var html1 = fetch(h_ost + 'api.php/getappapi.index/searchList', {
        method: 'POST',
        headers: {
            'User-Agent': 'okhttp/3.14.9',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
            keywords: wd,
            typepage_id: 1,
        }
    });
    let html = JSON.parse(html1);
    return AES_Decrypt(html.data);
}
//解析
globalThis.jxx = function (id, url) {
    /* if(""!=='104847347'){
      return 'https://mp4.ziyuan.wang/view.php/3c120366111dde9c318be64962b5684f.mp4';
     }*/
    if (id.startsWith('http')) {
        let purl = JSON.parse(request(id+url)).url;
        return  { parse: 0, url: purl , jx: 0,danmaku:'http://dm.sds11.top/tdm.php?url='+url};
    }
     if (id == 0) {
        return  { parse: 0, url: id+url , jx: 1,
        danmaku:'http://dm.sds11.top/tdm.php?url='+url};
    }   

    let html1 = request(h_ost + 'api.php/getappapi.index/vodParse', {
        method: 'POST',
        headers: {
            'User-Agent': 'okhttp/3.14.9',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
            parse_api: id,
            url: AES_Encrypt(url),
        }
    });
    let html = AES_Decrypt(JSON.parse(html1).data);
    console.log(html);
    let decry = html.replace(/\n/g, '').replace(/\\/g, '');
    let matches = decry.match(/"url":"([^"]+)"/);
    if (!matches || matches[1] === null) {
       matches = decry.match(/"url": "([^"]+)"/);
    }
    return { parse: 0, url: matches[1] , jx: 0,danmaku:'http://dm.sds11.top/tdm.php?url='+url};
}

var rule = {
  title: '小米|熊猫',
  host: '',
  detailUrl: 'fyid',
  searchUrl: '**',
  url: 'fyclass',
  searchable: 2,
  quickSearch: 1,
  filterable: 0,
  class_name: '电影&电视剧&动漫&综艺',
  class_url: '1&2&3&4&综艺',
  play_parse: true,
  lazy: $js.toString(() => {
        const parts = input.split('|');
        input  = jxx(parts[0],parts[1]);
    }),
  推荐: $js.toString(() => {
     let data =vod1(0,0);
     let bata = JSON.parse(data).recommend_list;
     bata.forEach(it => {
     d.push({
          url: it.vod_id,
          title: it.vod_name,
          img: it.vod_pic,
          desc: it.vod_remarks
      });
    });   
    setResult(d);
      }), 
  一级: $js.toString(() => {
     let data =vod1(input,MY_PAGE);
     let bata = JSON.parse(data).recommend_list;
     bata.forEach(it => {
     d.push({
          url: it.vod_id,
          title: it.vod_name,
          img: it.vod_pic,
          desc: it.vod_remarks
      });
    });   
    setResult(d);
  }), 
  二级: $js.toString(() => {
    console.log("调试信息2"+ input);
       let data =vodids(input);
        //console.log(data);
       VOD = data;
    }),
  搜索: $js.toString(() => {
        let data =ssvod(input);  
        let bata = JSON.parse(data).search_list;       
     bata.forEach(it => {
      d.push({
                url: it.vod_id,
                title: it.vod_name,
                img: it.vod_pic,
                desc: it.vod_remarks
      });
    }); 
    //  console.log(data);
    setResult(d);
  }),
}
