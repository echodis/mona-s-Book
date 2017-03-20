## 第六章：面向对象的程序设计

1. 理解对象属性
2. 理解并创建对象
3. 理解继承

对象是"无序属性的集合，其属性可以包含包含基本值、对象或者函数"。每个对象都是基于一个引用类型创建的。

### 6.1 理解对象

#### 属性类型

ECMA-262第5版描述了两种属性：数据属性和访问器属性。（放在两对方括号中以表示该特性是内部值。）

* 数据属性：包含一个数据值的位置，有4个描述其行为的特性。
	* [[Configurable]]：能否通过删除属性，修改属性或是修改为访问器属性。默认true。
	* [[Enumerable]]：能否通过for-in循环返回属性。默认true。
	* [[Writable]]：能否修改属性的值。默认true。
	* [[Value]]：包含这个属性的数据值。读取属性值时，从这个位置读；写入属性时，把新值保存在这个位置。
	
使用`Object.defineProperty()`方法可以修改默认属性的特性，接收3个参数：属性所在的对象、属性的名字和一个描述符对象。其中描述符对象的属性必须是：configurable、enumberable、writable和value。设置其中的一或多个值，就可以修改对应的特性值。

就像下面这样：

````js
var person = {};
Object.defineProperty(person, "name", {
	writable: false,
	value: "Nicholas"
});
````

name属性是只读的。为它指定新值时，在非严格模式下，赋值操作将被忽略；严格模式下，赋值操作将会导致错误。

在把configurable设置为false后，修改其他设置将会收到限制。

* 访问器属性：不包含数据值，它们包含一对getter和setter函数。在读取访问器属性时会调用getter函数，这个函数返回有效的值；在写入访问器属性时，会调用setter函数并传入新值。访问器属性有4个特性：
	* [[Configurable]]：能否通过删除属性，修改属性或是修改为数据属性。默认true。
	* [[Enumerable]]：能否通过for-in循环返回属性。默认true。
	* [[Get]]：在读取属性时调用的函数。默认为undefined。
	* [[Value]]：在写入属性时调用的函数，默认值为undefined。

访问器属性不能直接定义，必须使用Object.defineProperty()来定义。







