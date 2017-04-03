## 第九章：客户端检测

本章内容

- [ ] 使用能力检测
- [ ] 用户代理检测的历史
- [ ] 选择检测方式

由于现实中，浏览器之间的差异以及不同浏览器的怪癖（quirk）多得不胜枚举，因此，客户端检测除了是一种不就措施之外，更是一种行之有效的开发策略。

检测客户端的手段有很多，但是不到万不得已，就不要使用客户端检测。只要能找到更通用的方法，就应该优先采用更通用的方法。

### 9.1 能力检测

最常用也最为人们广泛接受的客户端检测形式是**能力检测**（又称特性检测）。

能力检测的目标不是识别特定的浏览器，而是识别浏览器的能力。采用这种方式不必顾及特定的浏览器如何，只要确定浏览器支持特定的能力，就可以给出解决方案。能力检测的基本模式：

````js
if(object.propertyInQuestion) {
	// 使用 object.propertyInQuestion
}
````

理解能力检测有两个重要概念：

1.先检测达成目的的最常用的特性，这样可以保证代码最优化。
2.必须测试实际要用到的特性。一个特性不存在，不一定意味着另一个特性也存在。

#### 更可靠的能力检测

在可能的情况下，要尽量使用typeof进行能力检测，特别是宿主对象没有义务让typeof返回合理的值。

#### 能力检测不是浏览器检测

检测某个或某几个特性并不能够确定浏览器。更好的方式是：知道自己的应用程序需要使用某些特定的浏览器特性，那么最好是一次性检测所有相关特性，而不是分别检测。

````js
// 确定浏览器是否支持Netscape风格的插件
var hasNSPlugins = !!(navigator.plugins && navigator.plugins.length);

// 确定浏览器是否具有DOM1级规定的能力
var hasDOM1 = !!(document.getElementById && document.createElement && document.getElementsByTagName);

// 得到的布尔值可以在以后后续使用，从而节省重新检测能力的时间。
````

### 9.2 怪癖检测

怪癖检测（quirks detection）的目标是识别浏览器的特殊行为，其目的是想知道浏览器存在什么缺陷。

建议是仅仅检测那些对你有直接影响的"怪癖"，而且最好在脚本一开始就执行此类检测，以便尽早解决问题。

### 9.3 用户代理检测

通过检测用户代理字符串来确定实际使用的浏览器，这是一个争议最大的一种客户端检测技术。

在每一次HTTP请求过程中，用户代理字符串是作为响应首部发送的，该字符串可以通过JavaScript的navigator.userAgent属性访问。

争议产生的原因是电子欺骗，即浏览器通过在自己的用户代理字符串加入一些错误或误导性信息，来达到欺骗服务器的目的。

这里需要了解一下Web问世初期用户字符串的发展历史。

#### 用户代理字符串的历史

HTTP规范明确规定，浏览器应该发送简短的用户代理字符串，指明浏览器的名称和版本号。字符串一般格式为：标识符/产品版本号。

在浏览器实现过程中，用户代理字符串发生了很多变化。增加了诸如：语言，平台，加密类型，操作系统，兼容性等标识符，最终造成不同内核为基础的浏览器的用户代理字符串不同。

WebKit版本和Safari版本看似会保持一致，尽管没有十分把握。

#### 用户代理字符串检测技术

考虑到现代浏览器中用户代理字符串的使用方式，通过用户代理字符串来检测特定的浏览器并不是一件简单的事。

基本思路是先识别呈现引擎，通常知道呈现引擎就足以编写出适当的代码了；再识别浏览器；然后识别平台，因为不同的浏览器在不同的平台会有不同的问题、随后识别Windows操作系统，可以进一步取得操作系统的具体信息。

识别呈现引擎时，主要有5大呈现引擎：IE、Gecko、WebKit、KHTML和Opera。

具体识别过程，在使用的使用参考具体代码就可以啦。

* 识别移动设备

四大主要浏览器都推出了手机版和在其他设备中运行的版本，其用户代理检测的第一步是为要检测的所有移动设备添加属性。

````js
var client = function() {
	var engine = {
		// 呈现引擎
		ie: 0,
		gecko: 0,
		webkit: 0,
		khtml: 0,
		opera: 0,
		
		// 具体的版本号
		ver: null
	};
	
	var brower = {
		// 浏览器
		ie: 0,
		firefox: 0,
		safari: 0,
		konq: 0,
		opera: 0,
		chrome: 0
		
		// 具体版本号
		ver: null
	};
	
	var system = {
		win: false,
		mac: false,
		x11: false,
		
		// 移动设备
		iphone: false,
		ipod: false,
		ipad: false,
		ios: false,
		android: false,
		nokiaN: false,
		winMobile: false
	};
	// 在此检测呈现引擎、平台和设备
	return {
		engine: engine,
		browser: browser,
		system: system
	};
}();
````

* IOS设备

对于ios设备，通常检测字符串"iphone"、"iPod"、"iPad"就可以分别设置相应属性的值了。比如：

````js
systme.iphone = ua.indexOf("iPhone") > -1;
````

除了知道ios设备，最好还能知道ios的版本号：

````js
// 检测ios版本
if(system.mac && ua.indexOf("Mobile") > -1) {
	if(/CPU (?:iphone )?OS (\d+_\d+)/.test(ua)) {
		system.ios = parseFloat(RegExp.$1.replace("_", "."));
	}else {
		system.ios = 2; //不能真正检测，则猜测一个较靠前版本。
	}
}

// test()方法基于用户代理字符串运行正则表达式，如果返回true，就将捕获的版本号统一处理后存储在system.ios中
````

* Android设备

Android操作系统也很简单，也就是搜索字符串"Android"并取得紧随其后的版本号。

````js
// 检测Andorid版本
if(/Android (\d+\.\d+)/.test(ua)) {
	system.android = parseFloat(RegExp.$1);
}
````

* 诺基亚N系列手机(基于WebKit引擎)

````js
system.nokiaN = ua.indexOf("nokiaN") > -1;
````

基于以上对设备信息的了解，可以通过下列代码确定用户使用的是什么设备中的WebKit来访问页面：

if(client.engine.webkit) {
	if(client.system.ios) {
		// ios手机内容
	} else if(client.system.android) {
		// Android手机的内容
	} else if(client.system.nokiaN) {
		// 诺基亚手机的内容
	}
}

最后一中主要的移动设备平台是Windows Mobile，用于Pocket PC和Smartphone。关于这个平台的检测不作详细介绍。

* 识别游戏系统

任天堂Wii和Playstation3或者内置Web浏览器，或者提供了浏览器下载。这两个浏览器中的用户代理字符串如下：

````js
Opera/9.10 (Nintendo Wii;U; ; 1621; en)
Mozilla/5.0 (PLAYSTATION 3; 2.00)
````

在client.system中添加wii和ps这两个属性即可。

#### 完整的检测代码

以下是完整的用户代理字符串检测脚本、包括检测呈现引擎、平台、Windows操作系统、移动设备和游戏系统。



























































