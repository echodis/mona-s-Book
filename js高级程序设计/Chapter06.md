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

#### 定义多个属性

Object.defineProperties()，这个方法可一次定义多个属性。

````js
// _xxx下划线开始，表示只能通过对象方法访问的属性。
var book = {};
Object.defineProperties(book, {
	_year: {
		value: 2004
	},
	
	edition: {
		value: 1
	},
	
	year: {
		get: function() {
			return this._year;
		},
		
		set: function(newValue) {
			if(newValue > 2004) {
				this._year = newValue;
				this.edition += newValue - 2004;
			}
		}
	}
});
````

以上代码同时定义了两个数据属性（_year和edition）和一个访问器属性（year）。

#### 读取属性的特性

Object.getOwnPropertyDescriptor()，取得给定属性的描述符。接收两个参数：属性所在的对象和要读取其描述符的属性名称。返回一个对象，对象的属性与访问器属性和数据属性对象的属性一一对应。

````js
// 数据属性：
var descriptor = Object.getOwnPropertyDescriptor(book, "_year");
console.log(descriptor.value); // 2004
console.log(descriptor.configurable); // false
console.log(typeof descriptor.get); // "undefined"
// 访问器属性：
var descriptor = Object.getOwnPropertyDescriptor(book, "year");
console.log(descriptor.value); // undefined
console.log(descriptor.enumerable); // false
console.log(typeof descriptor.get); // "function"
````

### 6.2 创建对象

Object构造函数或对象字面量来创建对象会产生大量重复代码，人们研究了工厂模式、构造函数模式、原型模式、组合使用构造函数模式和原型模式、动态原型模式和寄生构造函数模式等不同创建对象方法。接下来一一介绍。

#### 工厂模式

广为人知的一种模式，抽象了创建具体对象的过程。又因为ES中无法创建类，于是用函数来封装创建对象的细节。

````js
function createPerson(name, age, job) {
	var o = new Object();
	o.name = name;
	o.age = age;
	o.job = job;
	o.sayName = function() {
		alert(this.name);
	};
	return o;	
}

var person1 = createPerson("Nicholas", 29, "Software Engineer");
var person2 = createPerson("Greg", 27, "Doctor");

````

调用`createPerson()`函数便可以多次创建包含三个属性和一个方法的对象，但是无法进行对象识别。（没有对引用类型进行实例化的过程）

#### 构造函数模式

ECMAScript中的构造函数可以用来创建特定类型的对象。

````js
function Person(name, age, job) {
	this.name = name;
	this.age = age;
	this.job = job;
	this.sayName = function() {
		alert(this.name);
	};	
}
````

大写字母P将构造函数Person与普通函数区分开，创建实例时必须使用new操作符。

也可以判断对象类型：

````js
alert(person1 instanceof Object); // true
alert(person1 instanceof Person); // true
````

针对构造函数的几点解释：

* 构造函数可以当做普通函数使用。直接调用时，属性和方法都会被添加给当前作用域。
* 构造函数的主要问题是每个方法都要在每个实例上重新创建一遍。

针对问题可以进行以下改进：

````js
function Person(name, age, job) {
	 this.name = name;
	 this.age = age;
	 this.job = job;
	 this.sayName = sayName;
}

function sayName() {
    alert(this.name);
}
````

这样，每个实例都共享全局作用域中共同的函数sayName()，缺点是对象的私有方法暴露在全局作用域中，破坏其封装性。这个问题可以通过原型模式解决。

#### 原型模式

每个函数都有一个prototype（原型）属性，这个属性是一个指针，指向一个对象，这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法。那么可以将对象实例共享的属性和方法直接添加到原型对象中。

代码如下：

````js
function Person() {}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function() {
	alert(this.name);
};

var person1 = new Person();
person1.sayName();  // "Nicholas"

var person2 = new Person();
person2.sayName();  // "Nicholas"

alert(person1.sayName == person2.sayName); // true

````

* 理解原型对象



#### 组合使用构造模式和原型模式

#### 动态原型模式和寄生构造函数模式







