## 第十章：DOM

本章内容

- [ ] 理解包含不同层次节点的DOM
- [ ] 使用不同的节点类型
- [ ] 克服浏览器兼容性问题及各种陷阱

DOM（文档对象模型）是针对HTML和XML文档的一个API（应用程序接口）。DOM描绘了一个层次化的节点树，允许开发人员添加、移除和修改页面的某一部分。

本章主要讨论与浏览器中的HTML页面相关的DOM1级的特性和应用，以及JavaScript对DOM1级的实现。

> IE中所有的DOM对象都是以COM对象的形式实现的，这意味着IE中的DOM对象与原生JavaScript对象的行为或活动特点并不一致。

### 10.1 节点层次

DOM可以将任何HTML和XML文档描绘成一个由多层节点构成的结构。节点分为几种不同类型，每种类型分别表示文档中不同的信息及标记。每个节点都拥有各自的特点、数据和方法，也与其他节点存在某种关系。节点之间的关系构成了层次，而所有页面标记则表现为一个以特定节点为根节点的树形结构。

以下面的HTML为例：

````js
<html>
	<head>
		<title>Sample Page</title>
	</head>
	<body>
		<p>Hello World!</p>
	</body>
</html>
````

层次结构如下图：

<img src="./images/10_1_dom.jpg" width=400 />

* **文档节点**（Document）是每个文档的根节点。
* 文档节点只有一个子节点，即&lt;html&gt;元素，称之为**文档元素**。每个文档只能有一个文档元素。
* 每一段标记都可以通过树中的一个节点表示：HTML元素通过元素节点表示，特性通过特性节点表示，文档类型通过文档类型表示，注释通过注释节点表示。总共有12种节点类型，这些类型都继承自同一个基类型。



#### Node类型

DOM1级定义了一个Node接口，该接口将由DOM中的所有节点类型实现。这个Node接口在JavaScript中是作为Node类型实现的；除了IE以外，在其他所有浏览器中都可以访问到这个类型。

JavaScript中的所有节点类型都继承自Node类型，因此所有节点类型都共享着相同的基本属性和方法。

每一个节点都有一个NodeType属性，用于表明节点的类型。节点类型由在Node类型中定义的下列12个数值常量表示，任何节点类型必居其一：

- [ ] Node.ELEMENT_NODE(1);
- [ ] Node.ATTRIBUTE_NODE(2);
- [ ] Node.TEXT_NODE(3);
- [ ] Node.CDATA_SECTION_NODE(4);
- [ ] Node.ENTITY_REFERENCE_NODE(5);
- [ ] Node.ENTITY_NODE(6);
- [ ] Node.PROCESSING_INSTRUCTION_NODE(7);
- [ ] Node.COMMENT_NODE(8);
- [ ] Node.DOCUMENT_NODE(9);
- [ ] Node.DOCUMENT_TYPE_NODE(10);
- [ ] Node.DOCUMENT_FRAGMENT_NODENODE(11);
- [ ] Node.NOTATION_NODE(12)。

通过比较上面这些常量，可以很容易地确定节点的类型，比如：

````js
if(someNode.nodeType == Node.ELEMENT_NODE) { // 在IE中无效
	alert("Node is an element.");
}	
````

然而Node没有公开Node类型的构造函数，所以为了确保跨浏览器兼容，最好是将nodeType属性与数字值进行比较。如下：

````js
if(someNode.nodeType == 1) { // 适用于所有浏览器
	alert("Node is an element.");
}
````

并不是所有节点类型都受到Web浏览器的支持，开发最常用的是元素和文本节点。后续将讨论每个节点类型的受支持情况和使用方法。

* 1. nodeName和nodeValue属性

使用这两个属性了解节点信息。这两个属性值完全取决于节点类型。使用这两个值之前，最好先检测一下节点的类型。

````js
if(someNode.nodeType == 1) {
	value = someNode.nodeName // nodeValue的值是元素的标签名
}
````

对于元素节点，nodeName中保存的始终都是元素的标签名，而nodeValue的值始终为null。

* 2. 节点关系

文档中所有的节点之间都存在着关系，这种关系可以用传统的家族关系来描述，相当于把文档书比喻成家谱。

存在的关系有：互为父子元素、互为同胞元素等等。

每个节点都有一个childNodes属性，其中保存着一个NodeList对象。NodeList是一种类数组对象，用于保存一组有序的节点，可以通过位置来访问这些节点。

> 可以通过方括号语法来访问NodeList的值，而且这个对象也有length属性，但它并不是Array的实例。NodeList对象是**基于DOM结构动态查询的结果**，因此DOM结构的变化能够自动反映在NodeList对象中。

下面展示了如何访问保存在NodeList中的节点：

````js
var firstChild = someNode.childNodes[0];  // 方括号方法
var secondChile = someNode.childNodes.item(1); // item(index)方法
var count = someNode.childNodes.length;  // length表示的是访问NodeList的那一刻，其中包含的节点数量
````

可以将类数组NodeList转换为数组（前面说到的Array.prototype.slice()方法）：

````js
// 在IE8及之前版本中无效
var arrayOfNodes = Array.prototype.slice.call(someNode.childNodes, 0);  // 此时创建了一个新数组
````

为了兼容IE8及更早版本，可以进行以下处理：

````js
function convertToArray(nodes) {
	var array = null;
	try {
		array = Array.prototype.slice.call(nodes, 0);
	}catch(ex) {
		array = new Array(); // 捕获错误则手动创建数组
		for(var i = 0; len = nodes.length; i++) {
			array.push(nodes[i]);
		}
	}
}
````

每一个节点都有一个parentNode属性，该属性指向文档树中的父节点。包含在childNodes中的节点的parentNode属性指向同一个节点。每个节点之间互为同胞节点，可以通过每个节点的previousSibling和nextSibling属性访问前一个或后一个节点。列表中第一个节点的previousSibling为Null，最后一个节点的nextSibling为null。

父节点与第一个和最后一个子节点之间也存在特殊关系，父节点在firstChild和lastChild属性分别指向其childNodes列表中的第一个和最后一个节点。在只有一个节点的情况下，二者指向同一个节点。没有子节点，则二者同为null。

还有一个hasChildNodes()方法，这个方法在节点包含一或多个子节点的情况下返回true，比查询childNodes列表的length属性更简单。

所有节点都有的最后一个属性是ownerDocument，该属性指向表示整个文档的文档节点。这种关系表示任何节点都属于它所在的文档，任何节点都不能同时存在于两个或更多个文档中。并且，不必在节点层次中层层回溯到达顶端，而是可以直接访问文档节点。

* 3. 操作节点

因为关系指针都是只读的，DOM提供了一些操作节点的方法。

appendChild()方法最常用，用于向childNodes列表末尾添加一个节点。添加后，childNodes的新增节点，父节点以及以前最后一个子节点的关系指针都会相应更新。更新完后，appendChild()返回新增的节点。

> 如果传入到appendChild中的节点已经是文档的一部分，那结果就是该节点从原来的位置**转移**到新位置。（任何DOM节点不能同时出现在文档的多个位置上）。

````js
// 如果在调用appendChild()时传入了父节点的第一个子节点，那么该节点就会成为父节点的最后一个子节点。
// someNode有多个子节点
var returnedNode = someNode.appendChild(someNode.firstChild);
alert(returnedNode == someNode.firstChild); // false
alert(returnedNode == someNode.lastChild); // true
````

insertBefore()可以将节点放在某个特定位置上。这个方法接受两个参数：要插入的节点和作为参照的节点。插入节点后，被插入的节点会变成参照节点的前一个同胞节点（previousSibling），同时被方法返回。如果参照节点是null，那么insertBefore()和appendChild()执行相同的操作。

````js
// 没有api实现在节点后增加节点的方法，自己写一个：
function insertAfter(newEl, targetEl) {
	var parentEl = targetEl.parentNode;
	if(parent.El.lastChild == targetEl) {
		parentEl.appendChild(newEl);
	}else {
		parentEl.insertBefore(newEl, targetEl.nextSibling);
	}
}
````

replaceChild()插入一个节点时，该节点的所有关系指针都会从被它替换的节点复制过来。

removeChild()移除节点。这个方法接受一个参数，即要移除的节点。

> 调用replaceChild()和removeChild()的方法后，被替换/移除的节点仍为文档所有，只是在文档中已经没有了自己的位置。

> 前面说到的4个方法操作的都是某个节点的子节点，使用时要先去的父节点（使用parentNode属性）。但是并非所有类型的节点都有子节点，如果在不支持子节点的节点上调用了这些方法，将导致错误。

有两个方法是所有类型的节点都有的：cloneNode()和normalize()

* cloneNode()用于创建调用这个方法的节点的一个完全相同的副本。这个方法接受一个布尔值参数，表示是否深复制。参数为true时，深复制，也就是赋值节点及其整个子节点树；参数为false的情况下，执行浅复制，即只复制节点本身。复制后返回的节点副本属于文档所有，但并没有为它指定父节点。除非通过appendChild()、insertBefore()或replaceChild()将它添加到文档中，否则这个副本就是一个"孤儿"。

````js
// 有如下HTML代码
<ul>
	<li>item 1</li>
	<li>item 2</li>
	<li>item 3</li>
</ul>

// 将<ul>元素的引用保存在变量myList中，分别看看cloneNode()的两种模式：
var deepList = myList.cloneNode(true);
alert(deepList.childNodes.length); // 3(IE < 9) 或 7(其他浏览器)，因为IE9之前版本与其他浏览器处理空白字符的方式不同，不会为空白符创建节点。

var shallowList = myList.cloneNode(false);
alert(shallowList.childNodes.length); // 0
````

* normalize()方法唯一的作用是处理文档树中的文本节点。由于解析器的实现或DOM操作等原因，可能会出现文本节点不包含文本，或者接连出现两个文本节点的情况。本章后续将具体讨论。

#### Document类型

JS通过Document类型表示文档。浏览器中，document对象是HTMLDocument(继承自Document类型)的一个实例，表示整个HTML页面。而且，document对象也是window对象的一个属性，因此可以当做全局对象来访问。Document节点有以下特征：

- [ ] nodeType的值为9；
- [ ] nodeName的值为"#document"；
- [ ] nodeValue的值为null；
- [ ] parentNode的值为null；
- [ ] ownerDocument的值为null；
- [ ] 其子节点可能是一个DocumentType（最多一个）、Element（最多一个）、ProcessingInstruction或Comment。

document文档对象不仅可以取得与页面有关的信息，还能操作页面的外观及其底层结构。

* 1 文档的子节点

DOM明确规定了子节点的类型，也提供了两个内置的访问其子节点的快捷方式：documentElement属性和childNodes列表

documentElement属性始终指向HTML页面中的&lt;html&gt;元素（更快捷、更直接访问该元素）;

childNodes列表访问文档元素。

如下所示：

````js
<html>
	<body>
	</body>
</html

// 经过浏览器解析，其文档中只包含一个子节点&lt;html&gt;元素，通过以上两种方式访问：
var html = document.documentElement; // 取得对&lt;html&gt;的引用
alert(html === document.childNodes[0]); // true
alert(html === document.firstChild); // true
````

document还有一个body属性，指向&lt;body&gt;元素，通过`document.body`访问。

Document另一个可能的子节点是DocumentType。通常将&lt;DOCTYPE&gt;看成一个与文档其他部分不同的实体，在浏览器中通过`document.doctype`访问。

但不同浏览器对document.doctype的支持差别很大，尽量减少使用。

不同浏览器对出现在&lt;html&gt;外部的注释的解释也很不同，也导致外部注释没有什么用。

* 2 文档的信息

作为HTMLDocument的实例，document对象还有一些标准的Document对象没有的属性。这些属性提供了document对象所表现的网页的一些信息。

	1.title：包含&lt;title&gt;元素中的文本，现在在浏览器窗口标题栏或标签页上。可以获取title内容也可以修改title。`document.title`
	2.URL：包含页面完整的URL（即地址栏显示的URL）。`document.URL`
	3.domain：包含页面的域名。`document.domain`
	4.referrer：保存着链接到当前页面的那个页面的URL。在没有源页面的情况下，这个属性可能包含空字符串。`document.referrer`
	
	domain属性也可以设置，但出于安全考虑，不能将domain设置为URL中不包含的域。当页面中包含来自其他子域的框架或者内嵌框架时，将domain设置一样使得不同页面可以互相访问对方的JavaScript对象。
	domain还有一个限制，如果域名一开始是"松散的"（loose），那么就不能设置为"紧绷的"（tight）。比如域名一开始是"wrox.com"，那么就不能再设置为"p2p.wrox.com"	
* 3 查找元素

document对象有一个取得特定或某组元素的引用的方法：

	1. getElementById(id)，根据id能找到相应元素（严格匹配）则返回第一次出现的该元素，否则返回null
	2. getElementByTagName(tag)，接受一个参数即要取得元素的标签名，返回的是包含0或多个元素的NodeList。会返回一个HTMLCollection对象，是一个**动态集合**，和NodeList对象类似。

	可以通过HTMLCollection对象的namedItem()方法访问，也可以通过方括号语法访问。
	
	````js
	// 有如下html
	// <img src="myimage.gif" name="myImage" />
	var images = document.getElementByTagName("img");
	// namedItem
	var myImage0 = images.namedItem("myImage");
	// 方括号语法
	var myImage1 = images["myImage"];
	````
	
	getElementByTagName()方法传入"*"可以获取到整个页面元素的所有元素——按它们出现的先后顺序。
	
	3. getElementsByName()，是只有HTMLDocument类型才有的方法，会返回带有给定name特性的所有元素。常用这个方法取得单选按钮，name特性可以确保三个值中只有一个被发送给浏览器。

* 4 特殊集合

document对象还有一些特殊的集合，这些集合都是HTMLCollection对象，为访问文档常用的部分提供了快捷方式，包括：

- [ ] document.anchors，包含文档中所有带name特性的&lt;a&gt;元素；
- [ ] document.applets，包含文档中所有的&lt;applet&gt;（applet元素不再推荐使用了）；
- [ ] document.forms，包含文档中所有的&lt;form&gt;元素，与document.getElementsByTagName("form")得到的结果相同；
- [ ] document.images，包含文档中所有的&lt;img&gt;元素，与document.getElementsByTagName("img")得到的结果相同；
- [ ] document.links，包含文档中所有带href特性的&lt;a&gt;元素。

与HTMLCollection对象类似，集合中的项也会随着当前文档内容的更新而更新。

* 5 DOM一致性检测

由于DOM分为多个级别，也含有多个部分，因此检测浏览器实现了DOM的哪个部分就十分必要。`document.implementation`属性就是为此提供相应信息和功能的对象，与浏览器对DOM的实现直接对应。

DOM1级只为document.implementation规定了一个方法，即hasFeature()。这个方法接受两个参数：要检测的DOM功能的名称及版本号。如果浏览器支持给定的名称和版本，则返回true。

````js
var hasXmlDom = document.implementation.hasFeature("XML", "1.0");
````

hasFeature()也有缺点，这个方法返回true并不意味着现实与规范的一致。

因此在多数情况下，除了hasFeature()一致性检测外，还应同时使用能力检测。

* 6 文档写入

document对象具有将输出流写入到网页中的能力。体现在write()、writeln()、open()和close()方法中。

其中前两个方法接受一个参数，即要写入到输出流中的文本，write()原样写入，writeln()会换行。其中前两个方法可以引入外部资源或是动态地向页面加入内容，但对特殊符号需要**转义处理**。如"</script>"转义后应该是"<\/script>"。

open()和close()分别用于打开和关闭网页的输出流。

#### Element类型

Element类型用于表现XML或HTML元素，提供了对元素标签名、子节点及特性的访问。Element节点具有以下特征：

- [ ] nodeType的值为1；
- [ ] nodeName的值为元素的标签名；
- [ ] nodeValue的值为null；
- [ ] parentNode可能是Document或Element；
- [ ] 其子节点可能是Element、Text、Comment、ProcessingInstruction、CDATASection或EntityReference。

访问标签名可以使用nodeName或tagName属性，这两个属性返回值相同。HTML中，返回的标签名全部以大写表示，而XML中则不同。因此保险起见，最好在比较之前转换为相同大小写格式。

````js
if(element.tagName.toLowerCase() == "div") { // 这样适用于任何格式的文档
	// 这里执行某些操作
}
````

* 1 HTML元素

所有的HTML元素都由HTMLElement类型表示，直接通过这个类型或是通过它的子类型。HTMLElement类型直接继承自Element类型并添加了一些属性，这些属性分别对应与每个HTML元素中都存在的下列标准特性：

- [ ] id，元素在文档中的唯一标识符；
- [ ] title，有关元素的附加说明信息，一般通过工具提示条显示；
- [ ] lang，元素内容的语言代码；
- [ ] dir，语言的方向，值为ltr或rtl；
- [ ] className，与元素的class特性对应，即为元素指定的CSS类。

通过JavaScript代码，可以取得元素以上的内容，也可以修改对应的每个特性。不是所有的修改都会在页面上直观地表现出来。

* 2 取得特性








	



































































