## 第十三章：事件

本章内容

- [ ] 理解事件流
- [ ] 使用事件处理程序
- [ ] 不同的事件类型

JavaScript与HTML之间的交互是通过**事件**实现的。事件，就是文档或浏览器窗口中发生的一些特定的交互瞬间。可以使用侦听器（或处理程序）来预订事件，以便事件发生时执行相应的代码。这种传统上被称为观察员模式，支持页面行为（js）与页面外观（HTML和CSS）之间的松散耦合。

### 事件流

事件流描述的是从页面中接收事件的顺序，IE和Netscape开发团队提出了差不多是完全相反的事件流概念。IE事件流是事件冒泡流，而Netscape Communicator的事件流是事件捕获。

#### 13.1.1 事件冒泡

IE的事件流叫做事件冒泡（event bubbling），即事件开始时由最具体的元素（嵌套层次最深的）接收，然后逐级向上传播到较为不具体的节点（文档）。

所有现代浏览器都支持事件冒泡，但具体实现上有差别。

#### 13.1.2 事件捕获

Netscape Communicator团队剔除事件捕获流（event capturing）。事件捕获的思想是不大具体的节点更早接收到事件，具体节点最后接收。这样可以在事件到达预定目标之前捕获它。

常用浏览器也都支持这种事件流模型，尽管"DOM2级事件"规范要求事件从document对象开始传播，但这些浏览器都是从window对象开始捕获事件的。

由于老版本浏览器不支持，因此很少有人使用事件捕获，建议使用事件冒泡。

#### 13.1.3 DOM事件流

"DOM2级事件"规定的事件流包括3个阶段：事件捕获阶段、处于目标阶段和事件冒泡阶段。捕获阶段为截获事件提供了机会，然后实际的目标接收到事件，最后一个阶段是冒泡阶段，可以在这个阶段对事件做出响应。

尽管"DOM2级事件"规范明确要求捕获阶段不会涉及事件目标，但IE9、Safari、Chrome、Firefox和Opera9.5及更高版本都会在捕获阶段触发事件对象上的事件。结果就是有两个机会在目标对象上面操作事件。

### 事件处理程序

事件是用户或浏览器自身执行的某种动作，响应某个事件的函数就叫做**事件处理程序**（或**事件侦听器**）。事件处理程序的名字以"on"开头。为事件指定处理程序的方式有好几种。

#### 13.2.1 HTML事件处理程序

某个元素支持的每种事件，都可以使用一个与相应事件处理程序同名的HTML特性来指定。这个特性的值应该是能够执行的JavaScript代码。像这样：

````js
<input type="button" value="Click Me" onclick="alert('Clicked')" />
````

也可以调用在页面其他地方定义的脚本：

````js
<script type="text/javascript">
	function showMessage() {
		alert("Hello world!");
	}
</script>
<input type="button" value="Click Me" onclick="showMessage()" />
````

事件处理程序中的代码在执行时，有权访问全局作用域中的任何代码。这样指定事件处理程序会创建一个封装着元素属性值的函数。这个函数中有一个局部变量event，也就是事件对象。

通过**event变量可以直接访问事件对象**。在这个函数内部，**this值等于事件的目标元素**。

有意思的一点是，这个动态创建的函数的扩展作用域：在这个函数内部，可以像访问局部变量一样访问document及该元素本身的成员。这个函数使用with扩展作用域：

````js
function() {
	with(document) {
		with(this){
			// 元素属性值
		}
	}
}
````

那么，事件处理程序访问该元素的属性可以直接访问：

````js
<input type="button" value="Click Me" onclick="alert(value)" />
````

如果当前元素是一个表单输入元素，则作用域中还会包含访问表单元素（父元素）的入口，扩展作用域函数如下：

````js
function() {
	with(document) {
		with(this.form) {
			with(this) {
				// 元素属性值
			}
		}
	}
}
````

这样扩展作用域，以表单为例，就是想让事件处理程序无需引用表单元素就能访问其他表单字段。例如：

````js
<form method="post">
	<input type="text" name="username" value="" />
	<input type="button" value="Echo Username" onclick="alert(username.value)" />
</form>
````

在HTML中指定事件处理程序有两个缺点：一是文件或代码加载时差的问题；二是这样扩展事件处理程序的作用域链在不同浏览器中会导致不同结果，不同JavaScript引擎遵循的标识符解析规则略有差异，很可能会在访问非限定对象成员时出错。

#### 13.2.2 DOM0级事件处理程序

通过JavaScript指定事件处理程序的传统方式，就是将一个函数赋值给一个事件处理程序属性。这种事件处理程序赋值的方法是在第四代Web浏览器中出现的，而今仍然为所有现代浏览器所支持。原因一是简单，二是具有跨浏览器的优势。要使用JavaScript指定事件处理程序，首先必须取得一个要操作的对象的引用。

需要注意的是，在处理程序运行前不会指定事件处理程序，会存在文件加载时差问题。

DOM0级方法指定的事件处理程序被认为是元素的方法，因此事件处理程序是在元素作用域中运行的，即程序中的this引用当前元素。

````js
var btn = document.getElementById("myBtn");
btn.onclick = function() {
	alert(this.id); // "myBtn"
};
````

也可以删除通过DOM0级方法指定的事件处理程序：

````js
btn.onclick = null; // 删除事件处理程序
````

#### 13.2.3 DOM2级事件处理程序

"DOM2级事件"定义了两个方法，用于处理指定和删除事件处理程序的操作：addEventListener()和removeEventListener()。

所有DOM节点都包含这两个方法，并且都接受3个参数：要处理的事件名、作为事件处理程序的函数和一个布尔值。最后布尔值的参数如果是true，表示在捕获阶段调用事件处理程序；如果是false，表示在冒泡阶段调用事件处理程序。

使用DOM2级事件处理程序的主要好处是可以添加多个事件处理程序：

````js
var btn = document.getElementById("myBtn");
btn.addEventListener("click", function() {
	alert(this.id);
}, false);
btn.addEventListener("click", function() {
	alert("Hello world!");
}, false);
````

通过removeEventListener()移除事件，移除时传入的参数与添加处理程序时使用的参数相同。这也意味着通过addEventListener()添加的匿名函数将无法移除。

下面是可以添加和移除的例子：

````js
var btn = document.gtElementById("myBtn");
var handler = function() {
	alert(this.id);
};
btn.addEventListener("click", handler, false);
btn.removeEventListener("click", handler, false); // 有效
````

大多数情况下，都是将事件处理程序添加到事件流的冒泡阶段，这样可以最大限度地兼容各种浏览器。最好是在需要事件到达目标之前截获它的时候将事件处理程序添加到捕获阶段。


#### IE事件处理程序

IE实现了与DOM中类似的两个方法：attachEvent()和detachEvent()。这两个方法接受相同的两个参数：事件处理程序名称与事件处理程序函数。由于IE8及更早版本只支持事件冒泡，所以通过attachEvent()添加的事件处理程序都会被添加到冒泡阶段。

````js
var btn = document.getElementById("myBtn");
btn.attachEvent("onclick", function() {
	alert("Clicked");
});
````

在IE中使用attachEvent()与使用DOM0级方法的主要区别在于**事件处理程序的作用域**。在使用DOM0级方法的情况下，事件处理程序会在其所属元素的作用域内运行；在使用attachEvent()方法的情况下，事件处理程序会在全局作用域中运行，此时this等于window。

使用attachEvent()添加多个事件处理程序时，这些事件处理程序是以添加的相反顺序被触发的。

使用detachEvent()可以移除attachEvent()添加的事件处理程序，条件是必须提供相同的参数。

#### 13.2.5 跨浏览器的事件处理程序

跨浏览器处理事件只需恰当地使用能力检测即可。先检测是否存在DOM2级方法，然后检测是否存在IE的方法，最后就是使用DOM0级方法。

var EventUtil = {
	addHandler: function(element, type, handler) {
		if(element.addEventListener) {
			element.addEventListener(type, handler, false);
		}else if(element.attachEvent) {
			element.attachEvent("on" + type, handler);
		}else {
			element["on" + type] = handler;
		}
	},
	removeHandler: function(element, type, handler) {
		if(element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		}else if(element.detachEvent) {
			element.detachEvent("on" + type, handler);
		}else {
			element["on" + type] = null;
		}
	}};

### 事件对象

在触发DOM上的某个事件时，会产生一个事件对象event，这个对象中包含着所有与事件有关的信息。包括导致事件的元素、事件的类型以及其他与特定事件相关的信息。

#### 13.3.1 DOM中的事件对象





























































