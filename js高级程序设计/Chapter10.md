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

> 如果传入到appendChild中的节点已经是文档的一部分，那结果就是该节点从原来的位置转移到新位置。（任何DOM节点不能同事出现在文档的多个位置上）。

````js
// 如果在调用appendChild()时传入了父节点的第一个子节点，那么该节点就会成为父节点的最后一个子节点。
// someNode有多个子节点
var returnedNode = someNode.appendChild(someNode.firstChild);
alert(returnedNode == someNode.firstChild); // false
alert(returnedNode == someNode.lastChild); // true
````

:open_mouth: 需要了解appendChild实现的源码，待更新





































































