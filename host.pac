/**
 * hosts.pac
 * @authors Jack.Chan
 * @date    2015-09-23 14:58:50
 * @update  2015-09-24 13:50:26
 */

// config (1: enabled | 0: disabled)
var config = {
	hosts: 1,
	blackList: 1,
	digitalDomain: 0 // block digitalDomain
};


// hosts
var hostsList = [
	{domain:'localhost', ip:'127.0.0.1:80'},
	{domain:'localhost.dev'}
];

// blackList (url(keyword) or domain)
var blackList = [
	{url:'http://58.215.179.159/'},
	{url:'http://bbs.hbqc.com/ad/'},
	{url:'http://www.dygang.com/d/'},
	{url:'http://alimama.com/'},
	{url:'http://alimama.cn/'}，
	{url:'http://www.alimama.com/'},
	{url:'https://www.alimama.com/'},
	{domain:'http://bbs.hbqc.com/ad/'},
	{domain:'http://www.dygang.com/d/'},
	{domain:'http://alimama.com/'},
	{domain:'http://alimama.cn/'}，
	{domain:'http://www.alimama.com/'},
	{domain:'https://www.alimama.com/'}
];

// whiteList (root domain) for block digital domain
var whiteList = [
	'6.cn',
	'12306.cn',
	'189.cn',
	'10086.cn',
	'10010.cn',
	'10010.com',
	'126.com',
	'163.fm',
	'163.com',
	'360.cn',
	'360.com'
];


function FindProxyForURL(url, host){
	var direct = 'DIRECT;';

	var proxy = '127.0.0.1:80';
	var block = '0.0.0.0:80';
	
	if(shExpMatch(host, '10.[0-9]+.[0-9]+.[0-9]+')) return direct;
	if(shExpMatch(host, '172.[0-9]+.[0-9]+.[0-9]+')) return direct;
	if(shExpMatch(host, '192.168.[0-9]+.[0-9]+')) return direct;
	if(shExpMatch(host, '127.0.0.1')) return direct;
	if(shExpMatch(host, 'localhost')) return direct;
	if(shExpMatch(host, 'dl.google.com')) return direct;

	if(config.blackList){
		// block by blackList
		for(i in blackList){
			if(blackList[i].url){
				// block by url(keyword)
				if(url.indexOf(blackList[i].url) > -1){
					return 'PROXY '+ block +';';
				};
			};
			if(blackList[i].domain){
				// block by domain
				if(shExpMatch(host, blackList[i].domain)){
					return 'PROXY '+ block +';';
				};
			};
		};
	};

	if(config.digitalDomain){
		// block by digital domain && bypass whiteList
		var reg = /^([^.]+\.)*(\d+)(\.[^.]+)$/gi;
		if(reg.exec(host) && whiteList.indexOf(RegExp.$2 + RegExp.$3) < 0){
			return 'PROXY '+ block +';';
		};
	};

	if(config.hosts){
		// proxy by hostsList
		for(i in hostsList){
			if(dnsDomainIs(host, hostsList[i].domain)){
				return 'PROXY '+ (hostsList[i].ip ? hostsList[i].ip : proxy) +';';
			};
		};
	};

	return direct;
}
