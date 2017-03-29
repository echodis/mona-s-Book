## 第八章：BOM

本章内容

- [ ] 理解windows对象——BOM的核心
- [ ] 控制窗口、框架和弹出窗口
- [ ] 利用location对象中的页面信息
- [ ] 使用navigator对了解浏览器

### 7.1 window对象

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



















