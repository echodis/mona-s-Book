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


















	







































































