## 第十一章：DOM扩展

本章内容

- [ ] 理解Selectors API
- [ ] 使用HTML5 DOM扩展
- [ ] 了解专有的DOM扩展

对DOM的两个主要的扩展是Selectors API（选择符API）和HTML5。这两个扩展都源自开发者社区。还有一个Element Traversal（元素遍历）规范，为DOM添加了一些属性。虽然前述两个主要规范已经涵盖了大量的DOM扩展，但专有扩展依然存在。

### 11.1 选择符API

众多JavaScript库中最常用的一项功能，就是根据CSS选择符选择与狗哥模式匹配的DOM元素。实际上jQuery的核心就是通过CSS选择符查询DOM文档取得元素的引用。

Selectors API是由W3C发起制定的一个标准，致力于让浏览器原生支持CSS查询。这个功能变成原生API后，解析和树查询操作可以在浏览器内部通过编译后的代码来完成，极大地改善了性能。

Selectors API Level1的核心是两个方法：querySelector()和querySelectorAll()。在兼容的浏览器中，可以通过Document及Element类型的实例调用它们。

#### querySelector()方法

querySelector()方法接收一个CSS选择符，返回与该模式匹配的第一个元素，如果没有找到匹配的元素，则返回null。例子如下：

````js
// 取得body元素
var body = document.querySelector("body");

// 取得ID为"myDiv"的元素
var myDiv = document.querySelector("#myDiv");

// 取得类为"selected"的第一个元素
var selected = document.querySelector(".selected");

// 取得类为"button"的第一个图像元素
var img = document.body.querySelector("img.buttn");
````

通过Document类型调用querySelector()方法时，会在文档元素的范围内查找匹配的元素；而通过Element类型调用querySelector()方法时，只会在该元素后代元素的范围内查找匹配的元素。

作为参数传入的CSS选择符可以简单也可以复杂，如果传入了不被支持的选择符，querySelector()会抛出错误。

#### querySelectorAll()方法

querySelectorAll()方法接收的参数与querySelector()方法一样，都是一个CSS选择符，但返回的是所有匹配的元素而不仅仅是一个元素。

返回的是一个NodeList的实例，返回的值实际上是带有所有属性和方法的NodeList，**其底层实现类似于一组元素的快照，而非不断对文档进行搜索的动态查询**。

````js
// 取得div中所有em元素
var ems = document.getElementById("myDiv").querySelectorAll("em");

// 取得类为"selected"的所有元素
var selecteds = document.querySelectorAll(".selected");

// 取得所有p元素中的所有strong元素
var strongs = document.querySelectorAll("p strong");

// 要取得返回的NodeList中的每一个元素，可以使用item()方法，也可以使用方括号语句。如：
var i, len, strong;
for(i=0, len=strongs.length; i<len; i++) {
	strong = strongs[i]; // 或strongs.item(i)
	strong.className = "important";
}
````

同样，如果传入了浏览器不支持的选择符或者选择符中有语法错误，querySelectorAll() 会抛出错误。

#### matchesSelector()方法

Selectors API Level2规范为Element类型新增了这个方法。这个方法接收一个参数，即CSS选择符。如果调用元素与该选择符匹配，返回true；否则，返回false。看例子：

````js
if(document.body.matchesSelector("body.page1")) {
	// true
}
````

考虑兼容性的情况下，使用这个方法最好编写一个包装函数：

````js
function matchesSelector(element, selector) {
	if(element.matchesSelector) {
		return element.matchesSelector(selector);
	}else if(element.msMatchesSelector) {
		return element.msMatchesSelector(selector);
	}else if(element.mozMatchesSelector) {
		return element.mozMatchesSelector(selector);
	}else if(element.webkitMatchesSelector) {
		return element.webkitMatchesSelector(selector);
	}else {
		throw new Error("Not supported.");
	}
}

if(matchesSelector(document.body, "body.page1")) {
	// 执行操作
}
````

### 11.2 元素遍历

对于元素间的空格，IE9及之前的版本不会返回文本节点，而其他所有浏览器都会返回文本节点。这样就导致了在使用childNodes和firstChild等属性时行为的不一致。为了弥补这一差异，同时又保持DOM规范不变，Element Traversal API为DOM元素添加了以下5个属性：

- [ ] childElementCount: 返回子元素（不包括文本节点和注释）的个数；
- [ ] firstElementChild: 指向第一个子元素，firstChild的元素版；
- [ ] lastElementChild: 指向最后一个子元素，lastChild的元素版；
- [ ] previousElementSibling: 指向前一个同辈元素；previousSibling的元素版；
- [ ] nextElementSibling: 指向后一个同辈元素；nextSibling的元素版。

利用这则属性就不必担心空白文本节点，从而可以更方便地查找DOM元素了。

````js
// 看个例子,html
<div id="abc">
	<span>a</span>
	<span>b</span>
	c
</div>

// js：
var abc = document.querySelector("#abc");
console.log(abc.lastChildElement); // <spna>b</span>
console.log(abc.childElementCount); // 2
````

### 11.3 HTML5

之前版本的HTML的篇幅都主要用于定义标记，与js相关的内容一概交由DOM规范定义。而HTML5规范则围绕如何使用新增标记定义了大量JavaScript API。其中一些与DOM重叠，定义了浏览器应该支持的DOM扩展。

这里讨论HTML与DOM节点相关的内容。

#### 与类相关的扩充

为了让开发人员适应并增加对class属性的新认识，HTML5新增了很多API，致力于简化CSS类的用法。

* 1 getElementsByClassName()方法

接受一个参数，即一个包含一或多个类名的字符串，返回带有指定类的所有元素的NodeList。传入过个类名时，类名的先后顺序不重要。

````js
// 取得所有类中包含"username"和"current"的元素，类名的先后顺序无所谓。
var allCurrentUsernames = document.getElementsByClassName("username current");
````

返回的对象是NodeList，所以这个方法与其他返回NodeList方法具有同样的性能问题。

* 2 classList属性

在操作类名时，需要通过className属性添加、删除和替换类名。因为className中是一个字符串，所以即使只修改字符串的一部分，也必须每次都设置整个字符串的值。

````js
<div class="bd user disabled">...</div>
````

以上div有三个类名，要修改或删除一个，需要将这三个类名拆开，删除不想要的那个再把其他类名拼成一个新字符串。

HTML5新增了一种操作类名的方式，可以让操作更简单也更安全，那就是为所有元素添加classList属性。这个classList属性是新集合类型DOMTokenList的实例。

这个类型有一个表示自己包含多少元素的length属性，要取得每个元素可以使用item()方法，也可以使用方括号语法。此外，这个新类型还定义如下方法：

- [ ] add(value)：将给定的字符串值添加到列表中。如果值已经存在，就不添加；
- [ ] contains(value)：表示列表中是否存在给定的值，如果存在则返回true，否则返回false；
- [ ] remove(value)：从列表中删除给定的字符串；
- [ ] toggle(value)：如果列表中已经存在给定的值，删除它；如果列表中没有给定的值，则添加它。

以上代码能确保其它类名不受对某个类名修改的影响，也能简化其他基本操作的复杂度：

````js
// 删除user类
div.classList.remove("user");
// 添加current类
div.classList.add("current");
// 切换user类
div.classList.toggle("user");
````

#### 焦点管理

HTML5也添加了辅助管理DOM焦点的功能。首先是document.activeElement属性，这个属性始终会引用DOM中当前获得了焦点的元素。元素获得焦点有页面加载、用户输入（通常是通过按Tab键）和代码中调用focus()方法。

````js
var button = document.getElementById("myButton");
button.focus();
alert(document.activeElement == button);
````

默认情况下，文档加载时，document.activeElement值为null；文档刚加载完时，document.activeElement中保存的是对document.body元素的引用。

hasFocus()方法用于确定文档是否获得了焦点，获得即返回true，否则返回false。

通过检测文档是否获得了焦点，可以知道用户是不是正在与页面交互。

查询哪个元素获得焦点，以及确定文档是否获得了焦点，这两个功能最重要的用途是提高Web应用的无障碍性。（不用像过去那样靠猜测了）

#### HTMLDocument的变化

HTML5扩展了HTMLDocument，增加了新功能。尽管被写入标准的时间不长，但是很多浏览器早已经支持这些功能了。

新功能如下：

* 1 readyState属性

readyState属性有两个可能值：

- [ ] laoding，正在加载文档，
- [ ] complete，已经加载完文档

使用document.readyState用来指示文档是否已经加载完成。

````js
if(document.readyState == "complete") {
	// 执行操作
}
````

* 2 兼容模式

起源于IE给document添加了名为compatMode的属性，告诉开发人员浏览器采用哪种渲染模式。

标准模式下document.compatMode等于"CSS1Compat"，混杂模式下，document.compatMode等于"BackCompat"。

HTML最终将其纳入标准，并对实现做了明确规定。

````js
if(document.compatMode == "CSS1Compat") {
	alert("Standards mode");
}else {
	alert("Quirks mode");
}
````

* 3 head属性

document.head引用&lt;head&gt;元素。像这样使用：

````js
var head = document.head || document.getElementsByTagName("head")[0];
````

#### 字符集属性

charset属性表示文档中实际使用的字符集，也可以指定新字符集。

defaultCharset表示根据默认浏览器及操作系统设置，当前文档默认字符集应该是什么样子。它的值可能和charset不一样。

#### 自定义数据属性

HTML5规定可以为元素添加非标准属性，但要添加前缀data-，目的是为元素提供与渲染无关的信息，或者提供语义信息。

添加了属性后，可以通过元素的dataset属性来访问自定义属性的值。dataset属性的值是DOMStringMap的一个实例，也就是一个名值对儿的映射。每个data-name形式的属性都会以一个没有前缀（data-）的属性存储（如data-myname中映射对应的属性是myname）。

````js
var div = document.getElementById("myDiv");

// 取得自定义属性的值
var appId = div.dataset.appid;
var myName = div.dataset.myname;

//设置值
div.dataset.appId = 23456;
div.dataset.myname = "Michael";

// 判断某个属性是否存在
if(div.dataset.myname) {
	alert("Hello, " + div.dataset.myname);
}
````

#### 插入标记

* 1 innerHTML

在读模式，innerHTML属性返回与调用元素的所有子节点（元素、注释和文本节点）对应的HTML标记（不同浏览器在返回格式上可能有差异）。在写模式，innerHTML会根据指定的值创建新的DOM树，然后用这个DOM树完全替换调用元素原先的所有子节点。

使用innerHTML插入&lt;script&gt;元素时有一些限制，一是插入&lt;script&gt;元素时必须指定defer属性，二&lt;script&gt;元素必须位于"有作用域的元素"之后。

使用innerHTML插入&lt;style&gt;元素支持直接插入。

无论什么时候，只要使用innerHTML从外部插入HTML，都应该首先以可靠的方式处理HTML。

* 2 outerHTML属性

读模式下，outerHTML返回**调用它的元素**及所有子节点的HTML标签。在写模式下，outerHTML会根据指定的HTML字符串创建新的DOM子数，然后用这个DOM子树完全替换调用元素。不同浏览器同样可能在返回格式上产生差异。

在写模式：

````js
div.outerHTML = "<p>This is a paragragh.</p>";

// 和下列DOM脚本代码一样：
var p = document.createElement("p");
p.appendChild(document.createTextNode("This is a paragraph."));
div.parentNode.replaceChild(p, div);
````

即新创建的&lt;p&gt;元素会取代DOM树中的&lt;div&gt;元素。

* 3 insertAdjacentHTML()方法

这个方法接收两个参数：插入位置和要插入的HTML文本。第一个参数必须为下列值之一(都是小写)：

- [ ] "beforebegin"：在当前元素之前插入一个紧邻的同辈元素；
- [ ] "afterbegin"：在当前元素之下插入一个新的子元素或在第一个子元素之前再插入新的子元素；
- [ ] "beforeend"：在当前元素之下插图一个新的子元素或在最后一个子元素之后再插入新的子元素；
- [ ] "afterend"：在当前元素之后插入一个紧邻的同辈元素。

第二个参数是一个HTML字符串，如果浏览器无法解析该字符串，就会抛出错误。

基本用法示例如下：

````js
// 作为前一个同辈元素插入
element.insertAdjacentHTML("beforebegin", "<p>Hello world!</p>");

// 作为第一个子元素插入
element.insertAdjacentHTML("afterbegin", "<p>Hello world!</p>");

// 作为最后一个子元素插入
element.insertAdjacentHTML("baforeend", "<p>Hello world!</p>");

// 作为后一个同辈元素插入
element.insertAdjacentHTML("afterend", "<p>Hello world!</p>");
````

* 4 内存与性能问题

在使用innerHTML、outerHTML和insertAdjacentHTML()时，最好先手工删除要被替换的元素的所有事件处理程序和JavaScript对象属性。

当要插入多个HTML标记时，推荐使用innerHTML，注意将使用次数控制在合理范围内。

比如，先将字符串单独构建，然后一次性地将结果赋值给innerHTML。

#### scrollTntoView()方法

scrollTntoView()可以在所有HTML元素上调用，通过滚动浏览器窗口或某个容器元素，调用元素就可以出现的视口中。如果给这个方法传入true参数或不传任何参数，那么窗口滚动之后会让调用元素的顶部与视口顶部尽可能平齐。如果传入false作为参数，调用元素会尽可能全部出现在视口中（可能的话，底部会与视口顶部平齐），不过顶部不一定平齐。

### 11.4 专有扩展

有大量的专有扩展还未成为标准，它们只得到了少数浏览器的支持，但在将来可能被写进标准。

#### 文档模式

IE8引入了文档模式（document mode）这个概念。页面的文档模式决定了可以使用什么功能。到了IE9，共有4种文档模式：

- [ ] IE5：以混杂模式渲染页面。在IE8及更高版本中新功能无法使用；
- [ ] IE7：以IE7模式渲染页面。IE8及更高版本中新功能都无法使用；
- [ ] IE8：以IE8模式渲染页面。IE8中新功能如Selectors API、CSS2级选择符和某些CSS3功能可以使用。IE9中的新功能无法使用；
- [ ] IE9：以IE9模式渲染页面。IE9中新功能，如ECMAScript5、完整的CSS3以及更多HTML5功能。这个文档模式是最高级的模式。

要强制浏览器以某种模式渲染页面，可以使用HTTP头部信息X-UA-Compatible，或通过等价的&lt;meta&gt;标签设置：

````js
<meta http-equiv="X-UA-Compatible" content="IE=IEVersion">
````

IEVersion有不同取值，并且这些值不一定与上述4中文档模式对应。取值如Edge、EmulateIE9、9等。

默认情况下，浏览器会通过文档类型声明来确定是使用最佳的可用文档模式，还是使用混杂模式。

通过`document.documentMode`属性可以知道给定页面使用的是什么文档模式。这个属性是IE8中新增的。

#### children属性

由于IE9之前的版本与其他浏览器在处理文本节点中的空白符时有差异，因此出现了children属性。这个属性是HTMLCollection的实例，只包含元素中同样还是元素的子节点。除此之外，这个属性和childNodes没有什么区别。

#### contains()方法

IE率先引入contains()方法，以便获知某个节点是不是另一个节点的后代。调用这个方法的是祖先节点，接受的一个参数是要检测的后代节点。如果被检测的节点是后代节点，则该方法返回true，否则返回false。

````js
// 检测body元素是不是html元素的后代
alert(document.documentElement.contains(document.body););
````

利用DOM Level3 compareDocumentPosition()也能够确定节点间的关系。这个方法返回一个表示该关系的位掩码，不同的值代表不同的位置关系（如1：无关；2：居前；4：居后；8：包含；16：被包含）。

#### 插入文本

IE中innerText和outerText两个插入文本的专有属性还未被纳入规范。

* 1 innerText属性

可以操作元素中包含的所有文本内容，包括子文档树中的文本。在读取值时，它会按照由浅入深的顺序，将子文档树中的所有文本拼接起来；在写入值时，结果会删除元素的所有子节点，插入包含相应文本值的文本节点。

设置innerText永远只会生成当前一个子文本节点（会对设置文本进行HTML编码）。

像这样可以过滤掉HTML标签：

````js
div.innerText = div.innerText;
````

执行折行代码后，就用原来的所有文本内容替换了容器中的所有内容。

firefox不支持innerText，但支持有类似功能的textContent属性。

* 2 outerText属性

和innerText相比，作用范围扩大到包含调用它的节点之外，其余基本没有什么区别。

即：新的文本节点会完全取代调用outerText的元素。此后，该元素就从文档中被删除，无法访问。

#### 滚动

除了被HTML5纳入规范的scrollIntoView()，还有几个专用方法可以在不同浏览器中使用。下面列出的几个方法都是对HTMLElement类型的扩展，因此在所有元素中都可以调用。

- [ ] scrollIntoViewIfNeeded(alignCenter)：只在当前元素在视口中不可见的情况下，蔡滚动浏览器窗口或容器元素，最终让它可见。如果参数为true，则表示尽量将元素显示在视口中部（垂直方向）。
- [ ] scrollByLines(lineCount)：将元素的内容滚动指定行高，lineCount取值可正可负。
- [ ] scrollByPages(pageCount)：将元素的内容滚动指定页面高度，具体高度由元素的高度决定。

scrollIntoView()和scrollIntoViewIfNeeded()的作用对象是元素的容器，而scrollByLines()和scrollByPages()影响的则是元素自身。


















	



































































