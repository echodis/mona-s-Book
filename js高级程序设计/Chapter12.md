## 第十二章：DOM2和DOM3

本章内容

- [ ] DOM2和DOM3的变化
- [ ] 操作样式的DOM API
- [ ] DOM的遍历与范围

DOM1级主要定义的是HTML和XML文档的底层结构。DOM2和DOM3级则在这个结构的基础上引入了更多的交互能力，也支持了更高级的XML特性。为此，DOM2和DOM3级分为许多模块（模块之间互相关联），分别描述了DOM的某个非常具体的子集。

- [ ] DOM2级核心（DOM Level2 Core）：在1级核心基础上构建，为节点添加了更多方法和属性。
- [ ] DOM2级视图（DOM Level2 Views）：为文档定义了基于样式信息的不同视图。
- [ ] DOM2级事件（DOM Level2 Events）：说明了如何使用事件与DOM文档交互。
- [ ] DOM2级样式（DOM Level2 Style）：定义了如何以编程方式来访问和改变CSS样式信息。
- [ ] DOM2级遍历和范围（DOM Level2 Traversal and Range）：引入了遍历DOM文档和选择其特定部分的新接口。
- [ ] DOM2级HTML（DOM Level2 HTML）：在1级HTML基础上构建，添加了更多属性、方法和新接口。

本章探讨除"DOM2级事件"之外的所有模块，"DOM2级事件"模块将在第13章全面讲解。

### 12.1 DOM变化

判断浏览器是否支持这些子模块：

````js
var supportsDOM2Core = document.implementtation.hasFeature("Core", "2.0");
var supportsDOM3Core = document.implementtation.hasFeature("Core", "3.0");
var supportsDOM2HTML = document.implementtation.hasFeature("HTML", "2.0");
var supportsDOM2Views = document.implementtation.hasFeature("Views", "2.0");
var supportsDOM2XML = document.implementtation.hasFeature("XML", "2.0");
````

#### 针对XML命名空间的变化

有了XML命名空间，不同XML文档的元素就可以混合在一起，共同构成格式良好的文档，而不必担心发生命名冲突。

技术上说，HTML不支持XML命名空间，但XHTML支持XML命名空间。

命名空间要用xmlns特性来指定。

节点类型（Node）、Document类型、Element类型和NamedNodeMap类型都新增了与命名空间有关的属性或方法，如取得命名空间、移除命名空间等。

#### 其他方面的变化

DOM的其他部分在"DOM2级核心"中也发生了一些变化。这些变化与XML命名空间无法，而是更倾向于确保API的可靠性及完整性。

* 1 DocumentType类型的变化：增加了表明文档类型的字段。
* 2 Document类型的变化：importNode() 方法从文档从取得一个节点然后导入到另一个文档中，使其成为第二个文档的一部分。这里还增加了新增文档类型的方法，不作介绍。
* 3 Node类型的变化：添加了isSupported()方法，用于确定当前节点具有什么能力。
* 4 框架的变化：框架和内嵌框架有一个叫做contentDocument的属性，这个属性包含一个指向表示框架内容的文档对象。

这一小节内容很多，并且常用内容很少，所以在使用之后再做了解吧。

### 12.2 样式

在HTML中定义样式有3种方法：外部包含样式表文件、使用嵌入式样式和使用style特性定义针对特定元素的样式。"DOM2级样式"围绕这3种应用样式的机制提供了一套API。要确定浏览器是否支持DOM2级定义的CSS能力，可以使用下列代码：

````js
var supportsDOM2CSS = document.implementation.hasFeature("CSS", "2.0");
var supportsDOM2CSS2 = document.implementation.hasFeature("CSS2", "2.0");
````

#### 访问元素的样式

任何支持style特性的HTML元素在JavaScript中都有一个对应的style属性。这个style对象是CSSStyleDeclaration的实例，包含着通过HTML的style特性指定的所有样式信息，但不包含与外部样式表或嵌入样式表经层叠而来的样式。

在style特性中指定的任何CSS属性都将表现为这个style对象的相应属性。对于使用短划线的CSS属性，必须将其转换成驼峰大小写形式，才能通过JavaScript来访问。多数情况下都可以通过简单地转换属性名的格式来实现转换。

访问和指定样式信息都可以通过`style.转换后的属性名`实现。

* 1 DOM样式属性和方法

"DOM2级样式"规范还为style对象定义了一些属性和方法。这些属性和方法在提供元素style特性值的同时，也可以修改样式。列出属性和方法如下：

- [ ] cssText：访问到style特性中的CSS代码。
- [ ] length：应用给元素的CSS属性的数量。
- [ ] parentRule：表示CSS信息的CSSRule对象。
- [ ] getPropertyCSSValue(propertyName)：返回包含给定属性值的CSSValue对象。
- [ ] getPropertyPriority(propertyName)：如果给定的属性使用了!important设置，则返回"important"；否则返回空字符串。
- [ ] getPropertyValue(propertyName)：返回给定属性的字符串值。
- [ ] item(index)：返回给定位置的CSS属性的名称。
- [ ] removeProperty(propertyName)：从样式中删除给定属性。
- [ ] setProperty(propertyName, value, priority)：将给定属性设置为相应值，并加上优先权表示。

* 2 计算的样式

"DOM2级样式"增加了document.defaultView，提供了getComputedStyle()方法。这个方法接受两个参数：要取得计算样式的元素和一个伪元素字符串（例如":after"）。不需要伪元素时第二个参数可以是null。此方法返回一个CSSStyleDeclaration对象，其中包含当前元素的所有计算的样式。

具体使用方法：

````js
<style>
	#myDiv {
		background-color: blue;
     	width: 100px;
  		height: 200px;
} 
</style>

<div id="myDiv" style="background-color: red; border: 1px solid black"></div>

var myDiv = document.getElementById("myDiv");
var computedStyle = document.defaultView.getComputedStyle(myDiv, null);

console.log(computedStyle.backgroundColor);  // "red"
console.log(computedStyle.width); // "100px"
console.log(computedStyle.height); // "200px"
console.log(computedStyle.border); // "1px solid black"，边框因浏览器而有所不同
````

IE不支持该方法，有一个currentStyle属性可以实现类似功能。

#### 操作样式表

CSSStyleSheet类型表示样式表。

判断浏览器是否支持DOM2级样式表：

````js
var supportsDOM2StyleSheets = document.implementation.hasFeature("StyleSheets", "2.0");
````

CSSStyleSheet具有如下属性：

- [ ] disabled：表示样式表是否被禁用，布尔值。
- [ ] href：如果是通过link包含的，则是样式表的url；否则是null。
- [ ] media：当前样式表支持的所有媒体类型的集合，有length属性和item()方法。
- [ ] ownerNode：指向拥有当前样式表的节点的指针。如果是通过@import引入的，那么这个属性值为null。
- [ ] parentStyleSheet：如果样式表是通过@import导入的，那么这个属性是一个指向导入它的样式表的指针。
- [ ] title：ownerNode中title属性的值。
- [ ] type：表示样式表类型的字符串。对于css样式表，这个字符串是"type/css"
- [ ] cssRules：样式表中包含的样式规则的集合。IE不支持这个属性。
- [ ] deleteRule：删除cssRule集合中指定位置的规则。
- [ ] insertRule：向cssRules集合中指定的位置插入rule字符串。

应用于文档的所有样式表是通过document.styleSheets集合来表示的。通过这个集合的length属性可以获知文档中样式表的数量，通过方括号语法或item()方法可以访问每一个样式表。

后面介绍了一些获取规则，增加规则和删除规则的方法。

#### 元素大小

本节介绍的属性和方法并不属于"DOM2级样式"规范，但却与HTML元素的样式息息相关。DOM中没有规定如何确定页面中元素的大小，IE率先引入了一些属性，目前所有主流浏览器都已经支持这些属性。

* 1 偏移量

偏移量（offset dimension）包括元素在屏幕上占用的所有可见空间。元素的可见大小由其高度、宽度决定，包括所有内边距、滚动条和边框大小（注意：不包括外边距）。通过下列4个属性可以取得元素的偏移量：

- [ ] offsetHeight：元素在垂直方向上占用的空间大小，以像素计。包括元素的高度、（可见的）**水平滚动条的高度**、上边框高度和下边框高度。
- [ ] offsetWidth：元素在水平方向上占用的空间大小，以像素计。包括元素的宽度、（可见的）**垂直滚动条的宽度**、左边框高度和右边框高度。
- [ ] offsetLeft：元素的左外边框至包含元素的左内边框之间的像素距离。
- [ ] offsetTop：元素的上外边框至包含元素的上内边框之间的像素距离。

对包含元素的引用保存在offsetParent属性中。offsetParent属性不一定与parentNode相等，offsetParent表示其父元素中最近的一个具有大小的元素。例如&lt;td&gt;的offsetParent是&lt;table&gt;元素。

利用offsetParent属性在DOM层次中逐级向上回溯，将每个层次中的偏移量属性相加，就能得到该元素的left和top偏移量。

以left举例：

````js
function getElementLeft(element) {
	var actualLeft = element.offsetLeft;
	var current = element.offsetParent;
	
	while(current !== null) {
		actualLeft += current.offsetLeft;
		current = current.offsetParent;
	}
	return actualLeft;
}
````

* 2 客户区大小

元素的客户区大小（client dimension）指的是元素内容及其内边距所占据的空间大小。有关客户区大小的属性有两个：clientWidth和clientHeight。其中，clientWidth属性是元素内容区宽度加上左右内边距宽度；clientHeight属性是元素区高度加上上下**内边距**高度。

客户区就是元素内部空间的大小，因此滚动条占用的空间不计算在内。在讨论浏览器视口大小时可以使用document.documentElement或document.body的clientWidth和clientHeight。

````js
function getViewport() {
	if(document.compatMode == "BackCompat") { // 判断浏览器是否运行在混杂模式
		return {
			width: document.body.clientWidth,
			height: document.boyd.clientHeight
		};
	}else {
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		}
	}
}
````

* 3 滚动大小

滚动大小（scroll dimension）指的是包含滚动内容的元素的大小。有些元素（如&lt;html&gt;元素）即使没有执行任何代码也能自动添加滚动条；但另一些元素需要CSS的overflow属性设置才能滚动。以下是4个与滚动大小相关的属性。

- [ ] scrollHeight：在没有滚动条的情况下，元素内容的总高度；
- [ ] scrollWidth：在没有滚动条的情况下，元素内容的总宽度；
- [ ] scrollLeft：被隐藏在内容区域左侧的像素数。通过设置这个属性可以改变元素的滚动位置；
- [ ] scrollTop：被隐藏在内容区域上方的像素数。通过设置这个属性可以改变元素的滚动位置。

通常认为&lt;html&gt;元素是在wbe浏览器的视口中滚动的元素，因此带有垂直滚动条页面总高度就是`document.documentElement.srcollHeight`。

对于不包含滚动条的页面，基于document.documentElement查看这些属性：如scrollWidth和clientWidth，会在不同浏览器之间发生一些不一致的情况（视口大小和文档大小）。

在确定文档的总高度时（包括基于视口的最小高度时），必须取得scrollWidth/clientWidth和scrollHeight/clientHeight中的最大值，才能保证在跨浏览器的环境下得到精确的结果。

````js
var docHeight = Math.max(document.documentElement.scrollHeight,
									document.documentElement.clientHeight);
var docWidth = Math.max(document.documentElement.scrollWidth,
									document.documentElement.clientWidth);
````

* 4 确定元素大小

getBoundingClientRect()方法会返回一个矩形对象，包含4个属性：left、top、right和bottom。这些属性给出了元素在页面中相对于视口的位置。

由于不同浏览器对起始坐标的实现不同，因此需要对返回内容进行处理。像下面这样：

````js
function getBoundingClientRect(element) {
	if(typeof arguments.callee.offset != "number") {
		var scrollTop = document.documentElement.scrollTop;
		var temp = document.createElement("div");
		temp.style.cssText = "position:absolute;left:0;top:0;";
		document.body.appendChild(temp);
		arguments.callee.offset = -temp.getBoundingClientRect().top - scrollTop;
		document.body.removeChild(temp);
		temp = null;
	}
	
	var rect = element.getBoundingClientRect();
	var offset = arguments.callee.offset;
	
	return {
		left: rect.left + offset,
		right: rect.right +offset,
		top: rect.top + offset,
		bottom: rect.bottom + offset
	};
}
````

### 遍历

"DOM2级遍历和范围"模块定义了两个辅助完成顺序遍历DOM结构的类型：NodeIterator和TreeWalker。这两个类型都够基于给定的起点对DOM结构执行深度优先（depth-first）的遍历操作。

检测浏览器对DOM2级遍历能力的支持情况：

````js
var supportsTraversals = document.implementation.hasFeature("Traversal", "2.0");
var supportNodeIterator = (typeof document.createNodeIterator == "function");
var supportTreeWalker = (typeof document.createTreeWalker == "function");
````

DOM遍历是深度优先的DOM结构遍历，意味着移动的方向至少有两个（取决与使用的遍历类型）。遍历以给定节点为根，不可能向上超出DOM树的根节点。

#### NodeIterator

可以使用document.createNodeIterator()方法创建它的新实例，这个方法接受4个参数。

- [ ] root：想要作为搜索起点的树中的节点。
- [ ] whatToShow：表示要访问哪些节点的数字代码。
- [ ] filter：是一个NodeFilter对象，或者一个表示应该接受还是拒绝某种特定节点的函数。
- [ ] entityReferenceExpansion：布尔值，表示是否要扩展实体引用。在HTML中无。

whatToShow参数是一个位掩码，通过应用一或多个过滤器来确定要访问哪些节点。其值常以常量形式在NodeFilter类型中定义，部分举例如下：

- [ ] NodeFilter.SHOW_ALL：显示所有类型的节点。
- [ ] NodeFilter.SHOW_TEXT：显示文本节点。
- [ ] ...

通过按位或操作符来组合多个选项，如下所示：

````js
var whatToShow = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT;
````

NodeIterator类型的两个主要方法是nextNode()和previousNode()。在指向根节点或子树的最后一个节点时，调用previousNode()和nextNode()分别会返回null。

#### TreeWalker

TreeWalker是NodeIterator的一个更高级版本。除了包括nextNode()和previousNode()在内的相同的功能之外，还提供了在不同方向上遍历DOM结构的方法。如：

- [ ] parentNode()：遍历到当前节点的父节点；
- [ ] firstChild()：遍历到当前节点的第一个子节点；
- [ ] lastChild()：遍历到当前节点的最后一个子节点；
- [ ] nextSibling()：遍历到当前节点的下一个同辈节点；
- [ ] previousSibling()：遍历到当前节点的上一个同辈节点。

document.createTreeWalker()方法接受4个参数与document.createNodeIterator()方法相同：作为遍历的起点、要显示的节点类型、过滤器和一个表示是否扩展实体引用的布尔值。





### 范围

为了让开发人员更方便地控制页面，"DOM2级遍历和范围"模块定义了"范围"接口。通过范围可以选择文档中的一个区域，而不必考虑节点的界限。

#### DOM中的范围

DOM2级在Document类型中定义了createRange()方法。在兼容DOM的浏览器中，属于document对象。同样可以使用hasFeature()或者直接检测该方法，都可以确定浏览器是否支持范围。

var supportsRange = document.implementation.hasFeature("Range", "2.0");
var alsoSupportsRange = (typeof document.createRange == "function");

如果浏览器支持范围，就可以使用createRange()来创建DOM范围：

````js
var range = document.createRange();
````

每个范围由一个Range类型的实例表示，这个实例有用很多属性和方法，如起点节点，范围在起点节点中的偏移量，终点节点等。当把范围放到文档特定位置时，这些属性会被赋值。

* 1 用DOM范围实现简单选择

selectNode()和selectNodeContents()方法都接受一个参数，即一个DOM节点，然后使用该节点中的信息来填充范围。selectNode()选择整个节点，包括其子节点；selectNodeContents()则只选择节点的子节点。

还有一些更精细地控制将哪些节点包含在范围中的方法。

* 2 用DOM范围实现复杂选择

创建复杂范围需要使用setStart()和setEnd()方法。这两个方法都接受两个参数：一个参照节点和一个偏移量，分别对应其startContainer/endContainer和startOffset/endOffset。

* 3 操作DOM范围中的内容

deletContents()能从文档中删除范围所包含的内容。extractContents()也会移除范围选区，但是会返回范围的文档片段（可以利用返回值将范围内容插入到文档其他地方）。

范围被删除后，最终DOM格式依旧是格式良好的。

cloneContents()创建范围对象的一个副本，然后在文档其他地方插入该副本。

* 4 插入DOM范围中的内容

利用insertNode()方法可以向范围选区的开始处插入一个节点。

surroundContents()方法接受一个参数，即环绕范围内容的节点（可以用于突出显示网页中的某些词句）。

* 5 折叠DOM范围

折叠范围，是指范围中未选择文档的任何部分。使用collapse()方法来折叠范围，这个方法接受一个参数，一个布尔值，表示要折叠到范围的哪一端。true表示起点，false表示终点。使用collapsed属性可以检查范围是否折叠完。

检测某个范围是否处于折叠状态，可以帮我们确定范围中两个节点是否紧密相邻。

* 6 比较DOM范围

在有多个范围的情况下，可以使用compareBoundaryPoints()方法来确定这些范围是否有公共的边界（起点或终点）。接受两个参数：表示比较方式的常量值和要比较的范围。可能返回的值有-1、0、1。

* 7 复制DOM范围

使用cloneRange()方法复制范围，新创建的范围与原来的范围包含相同的属性，修改它的端点不会影响原来的范围。

* 8 清理DOM范围

使用完范围后，最好调用detah()方法，以便从创建范围的文档中分离出该范围。

````js
range.detach();
range = null;
````

#### IE8及更早版本中的范围

IE8及之前版本不支持DOM范围，但是支持一种类似的叫做：文本范围（text range）的概念
	
findText()会找到第一次出现的给定文本，并将范围移过来环绕文本，找到则返回true，否则返回false。

IE中还支持以特定的增量向四周移动范围。

text属性或pasteHTML()方法可以操作范围中的内容。

折叠方法collapse()与相应DOM方法用法一样，但是没有对应的collapsed属性让我们知道范围是否已经折叠完毕。

compareEndPoints()比较DOM范围。

duplicate()方法可以复制文本范围，新创建范围会带有与原范围完全相同的属性。








































































