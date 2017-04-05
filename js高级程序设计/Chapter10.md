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

<img src="./images/10_1dom.jpg" width=400 /

* **文档节点**（Document）是每个文档的根节点。
* 文档节点只有一个子节点，即&lt;html&gt;元素，称之为**文档元素**。每个文档只能有一个文档元素。
* 每一段标记都可以通过树中的一个节点表示：HTML元素通过元素节点表示，特性通过特性节点表示，文档类型通过文档类型表示，注释通过注释节点表示。总共有12种节点类型，这些类型都继承自同一个基类型。



#### Node类型

DOM1级定义了一个Node接口，该接口将由DOM中的所有节点类型实现。这个Node接口在JavaScript中是作为Node类型实现的；除了IE以外，在其他所有浏览器中都可以访问到这个类型。

JavaScript中的所有节点类型都继承自Node类型，因此所有节点类型都共享着相同的基本属性和方法。

每一个节点都有一个NodeType属性，用于表明节点的类型。节点类型由在Node类型中定义的下列12个数值常量表示，任何节点类型必居其一：

- [ ]: Node.ELEMENT_NODE(1);
- [ ]: Node.ATTRIBUTE_NODE(2);
- [ ]: Node.TEXT_NODE(3);
- [ ]: Node.CDATA_SECTION_NODE(4);
- [ ]: Node.ENTITY_REFERENCE_NODE(5);
- [ ]: Node.ENTITY_NODE(6);
- [ ]: Node.PROCESSING_INSTRUCTION_NODE(7);
- [ ]: Node.COMMENT_NODE(8);
- [ ]: Node.DOCUMENT_NODE(9);
- [ ]: Node.DOCUMENT_TYPE_NODE(10);
- [ ]: Node.DOCUMENT_FRAGMENT_NODENODE(11);
- [ ]: Node.NOTATION_NODE(12)。

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




































































