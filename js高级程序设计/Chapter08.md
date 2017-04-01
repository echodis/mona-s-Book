## 第八章：BOM

本章内容

- [ ] 理解windows对象——BOM的核心
- [ ] 控制窗口、框架和弹出窗口
- [ ] 利用location对象中的页面信息
- [ ] 使用navigator对了解浏览器

### 8.1 window对象

BOM的核心对象是window，它表示浏览器的一个实例。在浏览器中，window对象有双重角色，它既是通过JavaScript访问浏览器窗口的一个接口，又是ECMAScript规定的Global对象。

#### 全局作用域

所有在全局作用域中声明的变量、函数都会变成window对象的属性和方法。

全局变量和window对象的属性有区别：全局变量不能通过delete操作符删除，而直接在window对象上定义的属性可以。（全局变量的[[configurable]]特性设置为false）

尝试访问未声明的变量会抛出错误，但是通过查询window对象，可以知道某个未声明的变量是否存在。

#### 窗口关系及框架

如果页面中包含框架，则每个框架都拥有自己的window对象，并保存在frames集合中。

top对象始终指向最高（最外层）的框架，即浏览器窗口。

parent对象始终指向当前框架的直接上层框架。在没有框架的情况下，parent一定等于top。

self对象始终指向window，不格外包含其他值。

所有这些对象都是window对象的属性，可以通过window.parent.parent.frames[0]等形式访问。

#### 窗口位置

跨浏览器去的窗口左边和上边的位置(全屏时都为0)：

````js
var leftPos = (typeof window.screenLeft == "number") ? window.screenLeft : window.screenX;
var topPos = (typeof window.screenTop == "number") ? window.screenTop : window.screenY;
````

使用moveTo()和moveBy()方法可以将窗口精确地移动到一个新位置：

````js
// 将窗口移动到屏幕左上角
window.moveTo(0, 0);

// 将窗口向下移动100像素
window.moveBy(0, 100);
````

以上两个方法均不适用于框架，只能对最外层的window对象使用。

#### 窗口大小

4个与窗口大小有关的属性：innerWidth、innerHeight、outerWidth和outerHeight。

前二者表示该容器中页面视图区的大小（减去边框宽度），后二者返回浏览器窗口本身的尺寸（无论是最外层的window对象还是从某个框架访问）。

document.documentElement.clientWidth和document.documentElement.clientHeight中保存了页面视口的信息。

对于移动设备，window.innerWidth和window.innerHeight保存着可见视口，也就是屏幕上可见页面区域的大小。

resizeTo()和resizeBy()方法可以调整浏览器窗口的大小。resizeTo()接收浏览器窗口的新宽度,resizeBy()接收新窗口与原窗口的宽度和高度之差。

````js
// 调整到100*100
window.resizeTo(100, 100);

// 调整到200*150
window.resizeBy(100, 50);
````

#### 导航和打开窗口

window.open()可以导航到一个特定的URL，也可以打开一个新的浏览器窗口。这个方法接收4个参数：

要加载的URL、窗口目标、一个特性字符串以及一个表示新页面是否取代浏览器历史记录中当前加载页面的布尔值。

````js
// 等同于 <a href="http://www.wrox.com" target="topFrame"></a>
window.open("http://www.wrox.com", "topFrame");
````

调用这行代码，如果有一个名叫"topFrame"的窗口或者框架，就会在该窗口或框架加载这个url，否则，就会创建一个新窗口并将其命名为"topFrame"。第二个参数可以是任何一个特殊的窗口名称：_self、_parent、_top、_blank。

window.open()方法会返回一个指向新窗口的引用，可以对其进行更多控制。

````js
var wroxWin = window.open("http://www.wrox.com/","wroxWindow", "height=400,width=400,top=10,left=10,resizable=yes");

// 调整大小
wroxWin.resizeTo(500, 500);

// 移动位置
wroxWin.moveTo(100, 100);

// 关闭新打开的窗口(关闭窗口后窗口的引用仍然存在)
wroxWin.close();
````

新创建的window对象有一个opener属性，其中保存着打开它的原始窗口对象。

````js
alert(window.opener == window); // true
````

#### 间歇调用和超时调用

JavaScript是单线程语言，但是它允许通过设置超时时间和间隔时间值来调度代码在特定的时刻执行。

* setTimeout()超时调用

setTimeout()设置超过指定时间后执行代码，接收两个参数：要执行的代码和以毫秒表示的（等待）时间。

第一个参数也可以是包含JavaScript代码的字符串（就和在eval()函数中使用的字符串一样），但不建议使用。

第二个参数表示等待多长时间的毫秒数，但经过该时间后指定的代码不一定会执行。第二个参数会告诉JavaScript**再过多长时间把当前任务添加**到单线程程序解释器队列中。如果队列为空，那么添加的代码会立刻执行；如果队列不为空，那么就要等前面的代码执行完了以后再执行。

调用setTimeout()之后，该方法会返回一个数值ID，表示超时调用。这个超时调用ID是计划执行代码的唯一标识符，可以通过它来取消调用。通过clearTimeout(timeoutId)可以取消尚未执行的超时调用。

* setInterval()间隔调用

按照指定事件间隔重复执行代码，知道间歇调用被取消或者页面被卸载。接收两个参数，要执行的代码和每次执行之前需要等待的毫秒数。

调用setInterval()同样也会返回一个间歇调用ID，可以使用clearInterval()方法进行取消。

if语句+超时调用可以用来模拟间歇调用，一般认为超时调用来模拟间歇调用是一种最佳模式。（因为间歇调用可能在前一个间隙调用结束之前启动）。

#### 系统对话框

系统对话框由操作系统或浏览器设置决定，而不是由CSS决定。通过这几个方法打开的对话框都是同步和模态的，就是说显示这些对话框的时候代码会停止执行，而关掉这些对话框后代码又会恢复执行。

常用的对话框有：

* alert()对话框：显示用户无法控制的消息，例如错误消息。用户只能在看完消息后关闭对话框。
* confirm()对话框：确认对话框，用户可以决定是否执行给定操作。单击'OK'返回true，单击'Cancel'或关闭返回false。
* prompt()提示框：这是一个提示框，用于提示用户输入一些文本。接受两个参数，要先给用户的文本提示和文本输入域的默认值（可以是一个空字符串）。

还有两个异步显示的，可以通过JavaScript打开的对话框，即查找find()和打印print()。(不会受用户禁用后续对话框显示的影响。)

````js
// 显示"打印"对话框
window.print();

// 显示"查找"对话框
window.find();
````

### 8.2 location

location提供了与当前窗口中加载的文档有关的信息，还提供了一些导航功能。location即是window对象的属性，也是document对象的属性。（window.location和document.location引用的是同一个对象。）


属性名 | 例子 | 说明 |
------- | ------- | ------- |
hash | "#contents" | 返回URL中的hash(#号后跟零或多个字符)，如果URL中不包含散列，则返回空字符串 |
host | "www.wrox.com:80" | 返回服务器名称和端口号（如果有） |
hostname | "www.wrox.com" | 返回不带端口号的服务器名称 |
href | "http://www.wrox.com" | 返回当前加载页面的完整URL。|
pathname | "/WileyCDA/" | 返回URL中的目录和（或）文件名 |
port | "8080" | 返回URL中指定的端口号。如果URL中不包含端口号，则这个属性返回空字符串 |
protocol | "http:" | 返回页面使用的协议。通常是http:或https: |
search | "?q=javascript" | 返回URL的查询字符串。这个字符串以问号开头 |

#### 查询字符串参数

可以通过正则表达式查询特定的参数，也可以创建一个函数返回包含所有参数的对象。

这里介绍第二种的实现方式：

function getQueryStringArgs() {
	// 取得查询字符串并去掉开头的问号
	var qs =  (location.search.length > 0 ? location.search.substring(1) : ""),
	// 保存数据的对象
	args = {},
	// 取得每一项
	items = qs.length ? qs.split("&") : [],
	item = null,
	name = null,
	value = null,
	// 在for循环中使用
	i = 0,
	len = items.length;
	
	// 逐个将每一项添加到args对象中
	for(i = 0; i < len; i++) {
		item = item[i].split("=");
		name = decodeURIComponent(item[0]); // 查询字符串应该是被编码过的
		value = decodeURIComponent(item[1]); // 查询字符串应该是被编码过的
		
		if(name.length) {
			args[name] = value;
		}
	}
	
	return args;
}

#### 位置操作

使用location对象可以通过很多方式改变浏览器的位置。下面介绍几个方法：

* 使用assign()方法并为其传递一个URL：

````js
location.assign("http://www.wrox.com");

// location.href和window.location设置为一个URL值，也会以该值调用assign()方法
window.location = "http://www.wrox.com";
location.href = "http://www.wrox.com";
````

这样可以立即打开新URL并在浏览器中生成一条记录。

修改location对象的其他属性也可以改变当前加载的页面：

````js
// 假设初始URL为http://www.wrox.com/WileyCDA

// 将URL修改为"http://www.wrox.com/WileyCDA/#section1"
location.hash = "#section1";

// 将URL修改为"http://www.wrox.com/WileyCDA/?q=javascript"
location.search = "?q=javascript";

// 将URL修改为"http://www.yahoo.com/WileyCDA/"
location.hostname = "www.yahoo.com";

// 将URL修改为"http://www.yahoo.com/mydir/"
location.pathname = "mydir";

// 将URL修改为"http://www.yahoo.com:8080/WileyCDA/"
location.port = 8080;
````

每次修改location的属性（hash除外），页面都会以新URL重新加载。

通过上述任何一种方式修改URL之后，浏览器的历史记录中就会生成一条新记录，用户单击"后退"按钮就会导航到前一个页面。要禁用这种行为，可以使用replace()方法。

**replace()方法**：

replace()方法只接收一个参数，即要导航到的URL；这会导致浏览器位置改变，但不会在历史记录中生成新记录。在调用replace()方法之后，用户不能回到前一个页面。

**reload()方法**

作用是重新加载当前显示的页面。如果调用reload()时不传递任何参数，页面就会以最有效的方式重新加载：如果页面自上次请求以来并没有改变，页面就会从浏览器缓存中重新加载。如果要强制从服务器重新加载，则需要像下面这样为该方法传递参数true：

````js
location.reload(); // 重新加载（有可能从缓存中加载）
location.reload(); // 重新加载（从服务器重新加载）
````

### navigator对象

navigator已经成为识别客户端浏览器的事实标准，是所有支持JavaScript的浏览器所共有的，如`navigator.userAgent`、`navigator.language`等。但是，每个浏览器中的navigator对象也都有一套自己的属性。

第9章会详细介绍常用的属性。下面先介绍一些常用的检测例程：

#### 检测插件

检测浏览器中是否安装了特定插件。对于非IE浏览器，可以使用plugins数组来达到这个目的，该数组中每一项都包含下列属性：

- [ ] name: 插件的名字。
- [ ] description: 插件的描述。
- [ ] filename: 插件的文件名。
- [ ] length: 插件所处理的MIME类型数量。

像下面这样循环迭代每个插件并将插件的name和给定的名字比较：

````js
// 检测插件（在IE中无效）
function hasPlugin(name) {
	name = name.toLowerCase();
	for(var i = 0; i < navigator.plugins.length; i++) {
		if(navigator.plugins[i].name.toLowerCase().indexOf(name) > -1) {
			return true;
		}
	}
}

// 检测Flash
alert(hasPlugin("Flash"));

// 检测QuickTime
alert(hasPlugin("QuickTime"));
````

在IE中检测插件的唯一方式是使用专有的ActiveXObject类型，并尝试创建一个特定的插件的实例。

````js
function hasIEPlugin(name) {
	try {
		new ActiveXObject(name);
		return true;
	} catch (ex) {
		return false;
	}
}
````

鉴于这两种检测方法差别太大，因此典型做法是针对每个插件分别创建检测函数：

````js
// 检测所有浏览器中的Flash
function hasFlash() {
	var result = hasFlash("Flash");
	if(!result) {
		result = hasIEPlugin("ShockwaveFlash.ShockwaveFlash");
	}
	
	return result;
}

// 检测所有浏览器中的QuickTime
function hasQuickTime() {
	var result = hasPlugin("QuickTime");
	if(!reuslt) {
		result = hasIEPlugin("QuickTime.QuickTime");
	}
	return result;
}
````

#### 注册处理程序

registerContentHandler()和registerProtocolHandler()方法，可以让一个站点指明它可以处理特定类型的信息。

registerContentHandler()方法接收三个参数：要处理的MIME类型、可以处理该MIME类型的页面的URL以及应用程序的名称。

registerProtocolHandler()方法接收三个参数：要处理的协议（如mailto或ftp）、处理该协议的页面的URL和应用程序名称。

### screen对象

screen对象基本上只用来表明客户端的能力，其中包括浏览器窗口外部的显示器的信息，如像素宽度和高度等。

screenLeft：当前屏幕距左边的像素距离
screenTop：当前屏幕距上边的像素距离
screen.width：屏幕的像素宽度

### history对象

history对象保存着用户上网的历史记录，从窗口被打开的那一刻算起。

出于安全方面考虑，开发人员无法得知用户浏览过的URL，不过借由用户访问过的页面列表，可以在不知道实际URL的情况下实现后退和前进。

使用go()方法可以在用户的历史记录中任意跳转，可以向后也可以向前。这个方法接受一个参数，负数表示向后跳转，正数表示向前跳转，传递一个字符串参数就会跳转到历史记录中包含该字符串的第一个位置——可能后退，也可能前进（具体要看哪个位置最近），如果历史记录中不包含该字符串，那么这个方法什么也不做。

````js
// 表示后退一页
history.go(-1);
<!--可以简写为-->
back();

// 表示前进一页
history.go(1);
<!--可以简写为-->
forward();

// 前进两页
history.go(2);

// 跳转到最近的wrox.com
history.go("wrox.com");
````

history对象还有一个length属性，保存着历史记录的数量。数量包括历史记录，即所有向后和向前的记录。当用户第一次打开某个页面而言，history.length等于0。












































