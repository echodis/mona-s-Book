## 第三章：基本概念

基本概念涉及内容多而繁杂，根据目录的编码，包括以下8部分：

1. 语法
2. 关键字和保留字
3. 变量
4. 数据类型
5. 操作符
6. 语句
7. 函数
8. 小结

### 3.1 语法

ECMAScript的语法大量借鉴了C及类C语言，且ES的语法更为宽松。

* 区分大小写: 变量、函数名和操作符都区分大小写
* 标识符: 即变量、函数、属性的名字或函数的参数。由字母、下划线（_）、美元符号（$）和数字组成，第一个字符不能是数字。
    * 标识符一般采用驼峰大小写格式：`whoCaresAboutIt`。函数和对象命名推荐使用这种格式。
    * 不要把关键字、保留字、`true`、`false`、`null`用作标识符
* 注释: 单行注释 `// 注释内容` 和 多行注释 `/* 注释内容 */`

### 3.2 关键字和保留字

有特定用途的关键字可用于表示控制语句的开始或结束，或用于执行特定操作。

[保留字和关键字列表](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar)

使用关键字作为标识符在多数浏览器中都会导致'Identifier Expected'（缺少标识符）错误。也尽量不要使用保留字。

### 3.3 变量

ECMAScript的变量是松散类型的，每个变量都可以用来保存任何类型的数据(每个变量仅仅是一个用来保存值的占位符而已)。

````js
var message;
````

这行代码定义了一个名为message的遍历，在未经初始化前会保存一个特殊值`undefined`。

也可以在定义变量后立刻初始化：

````js
var message = "hi";
````

> 需要注意，var操作符定义该变量作用域中的局部变量，在作用域之外不会被访问到。

全局变量可以通过省略var 操作符进行定义。像这样：

````js
message = "hi";
````

一条语句也可以定义多个变量, 多个变量通过逗号间隔：

````js
var message = "hi",
    found = false,
    age = 29;
````

### 3.4 数据类型

ECMAScript中有5种简单数据类型（基本数据类型）和1种复杂数据类型，且不支持任何创建自定义类型的机制。

* 基本数据类型：Undefined、Null 、Boolean 、Number 和String。
* 复杂数据类型：Object，Object本质是由一组无序的名值对组成的。

在具体介绍每个数据前，先介绍检测给定变量数据类型的手段 ——typeof。

#### typeof操作符

对一个值使用typeof操作符可能返回下列某个字符串：

* "undefined": 值未定义;
* "boolean": 值是布尔值;
* "string": 值是字符串; 
* "number": 值是数值; 
* "object": 值是对象或null; 
* "function": 值是函数。

typeof的操作数可以是变量：`typeof message`，也可以是数值自变量：`typeof 95`。

#### Undefined类型

Undefined类型只有一个值：undefined。

使用var声明变量但未对其加以初始化时，这个变量的值就是undefined。

> 需要注意：typeof对为未初始化和未声明的遍历执行操作都会返回undefined值。

````js
var message;
// var age
console.log(typeof message); // undefined
console.log(typeof age); // undefined
````

#### Null类型

Null类型也只有一个值：null。

null值表示一个空指针，因此使用typeof检测null时会返回**"object"**：

````js
var car = null;
console.log(typeof car); // "object"
````

在定义一个用于保存对象的变量时，最好将变量初始化为null。

undefined和null的关系：

undefined实际上是派生自null值的，在进行相等性测试时会返回true：

````js
console.log(null == undefined); // true
````

尽管二者有这样的关系，它们的用途是完全不同的。

#### Boolean类型

该类型只有两个字面值：true和false，与数字值（0,1...）无关。

true和false是区分大小写的。

ECMAScript中其他类型的值可以通过调用转型函数Boolean()转换为对应的Boolean值。转换规则如下：


数据类型 | 转换为true的值 | 转换为false的值
------- | ------- | ------- |
Boolean | true | false |
String | 任何非空字符串 |""(空字符串) |
Number | 任何非零数字值(包括无穷大) | 0和**NaN** |
Object | 任何对象 | null|
Undefined| 不适用 | undefined |

在判断语句中，对应的Boolean转换会自动执行。因此需要确切知道使用的是什么变量（判断**Object**数据类型时需要注意）。

#### Number类型

* 十进制为基本进制

支持多种进制的表达方式：

````js
var intNum = 55; // 整数（十进制）
var octa1Num1 = 079; // 整数
var octa1Num2 = 070; // 八进制（前一位是0）的56
var octa1Num3 = 0xA ; // 十六进制（前两位是0x， 后接0~9及A~F）的10
````

在算数计算时，所有八进制、十六进制都将被转换为十进制计算。

* 浮点数值

某些情况，浮点数值（包含小数点且小数点后至少一位数字）会被转换为整数值以节省空间。

由于浮点和整数的精度和计算精度不同，不要直接测试某个特定的浮点数值，如: 

````js
console.log(0.1+0.2 == 0.3); //false
// 可以使用倍乘（扩大1000倍）或四舍五入的方法。
console.log((0.1+0.2).toFixed(1) == 0.3.toFixed(1)); //true
````

* 数值范围

ECMAScript能表示的最小，最大数值分别保存在`Number.MIN_VALUE`,`Number.MAX_VALUE`中。超出范围的数值将被自动转换为`-Infinity`和`Infinity`。

Infinity值无法参与计算。

可以用`isFinite()`判断数值是否有穷，有穷则返回true，否则返回false。

* NaN

NaN(非数值)是一个特殊的数值，用于表示本来要返回数值的操作未返回数值的情况。如：

==需要参考第三版内容进行确认，和chrome最新版console不一致==

````js
console.log(10/0); // ??
// NaN和任何值都不相等
console.log(NaN == NaN); // false
````

针对NaN定义了isNaN()函数，它接受一个可以是任何类型的函数，判断这个参数是否"不是数值"。

这个函数首先尝试将这个参数转换为数值，如字符串和Boolean，只有**不能转换为数值**的值才会判断为true。

````js
console.log(isNaN(NaN)); // true
console.log(isNaN("10")); // false
console.log(isNaN("blue")); // false
console.log(isNaN(true)); // true，转换为数值1（参见以下数值转换规则）
````

* 数值转换

三个把非数值转换为数值的函数：

1. `Number()`：适用于任何数据类型；
2. `parseInt()`：将字符串转换为数值；
3. `parseFloat()`：将字符串转换为数值。

:one: Number()函数的转换转换规则如下：

传入参数| Number()转换值
------- | -------
Boolean | true返回1，false返回0
数字值 | 直接返回数字
null | 0
undefined | NaN
字符串：只包含数字 | 返回十进制数字，忽略前导零
字符串：包含有效浮点值 | 对应浮点数值
字符串：包含有效十六进制格式 | 相同大小的十进制整数值
空字符串 | 0
除以上格式的字符串 | 返回NaN
对象 | 调用对象的valueOf方法，再依次转换返回值。若转换结果是NaN，则调用对象的toString()方法，再一次转换返回值。

:two: parseInt(string, [radix])：

parseInt()传入两个参数，第一个是要解析为整数的值，第二个是转换时用的基数（多少进制，常用取值10，2，8，16）。可选，但推荐明确指定。

 ````js
 console.log(parseInt("070")); // 56(十六进制)，和Number()取值不同
 console.log(parseInt("0xf")); // 15(八进制)
 console.log(parseInt("AF", 16)) // 175, 第二个参数允许字符串不带0x
 conosle.log(parseInt("AF")); // NaN，这种情况下转换失败
 ````

:three: parseFloat(string):

parseFloat()从第一个字符开始解析每个字符，一直解析到字符串末尾或解析到遇见一个无效的浮点数字字符为止（第一个小数点有效，第二个小数点则是无效的，因此它后面的字符串将被忽略）。

parseFloat()会始终忽略前导零。只解析十进制值，十六进制格式也会始终被转换为0，所以没有第二个参数。

````js
console.log("1234blue"); // 1234(整数)
console.log("0xA"); // 0
console.log("22.34.5"); // 22.34
console.log("3.125e7"); // 31250000
````

#### String类型

以配对的双引号或单引号表示。

* String数据类型包含一些特殊的字符字面量，也叫转义序列。使用`\`进行转义。
* 字符串一旦创建就不可改变。改变某个变量保存的字符串首先要销毁原来的，在用新的值来填充
* 转换为字符串有两种方法：
	* toString([radix])，几乎每个值都有这个方法（null和undefined没有，后面详细讨论），返回相应值的字符串表现。可选的基数表示进制数；
	* String()，能够将任何类型的值转换为字符串（null和undefined），转换规则如下：
		* 如果值有toString()方法，则调用之并返回相应结果；
		* 如果值是null，返回"null"；
		* 如果值是undefined，返回"undefined"
	
````js
console.log(10.toString(8)); // "12"
console.log(10.toString(16)); // "a"
console.log(String(true)); // "true"
````

#### Object类型

:dizzy:







### 3.5 操作符

### 3.6 语句


### 3.7 函数

### 3.8 小结


