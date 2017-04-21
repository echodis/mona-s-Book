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













	







































































