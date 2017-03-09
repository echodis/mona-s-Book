## 第三章：基本概念

基本概念涉及内容多而繁杂，根据目录的编码，包括以下8部分：

1. 语法
2. 关键字和保留字
3. 变量
4. 数据类型
5. 操作符
6. 语句
7. 函数

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

ECMAScript中其他类型的值可以通过调用转型函数Boolean()转换为对应的Boolean值。<span id="to_boolean">转换规则</span>如下：


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

````js
console.log(10/0); // 只有0/0返回NaN，正数/0返回Infinity，负数返回-Infinity
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

:one: Number()函数的<span id="to_int">转换规则</span>如下：

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

对象是一组数据和功能的集合。对象可以通过执行new操作符后跟要创建的对象类型的名称来创建。如：

````js
var o = new Object();
````

在ECMAScript中，Object类型是所有实例的基础。（Object类型具有的任何属性和方法同样存在与具体对象中）。

Object每个实例都具有以下属性和方法：

* constructor: 保存创建当前对象的函数。
* hasOwnProperty(propertyName):检查给定属性在当前对象实例中是否存在。
* isPrototypeOf(object):检查传入对象是否是传入对象的原型。
* propertyIsEnumerable(propertyName):检查给定属性是否能够使用for-in语句来枚举。
* toLocaleString():返回对象的字符串表示（）。
* toString():返回对象的字符串表示。
* valueOf():返回对象的字符串、数值或布尔值。通常与toString()方法返回值相同。

toLocaleString()、toString()和valueOf()在后文具体分析。

### 3.5 操作符

操作符包括：算术操作符、位操作符、关系操作符和相等操作符。

#### 一元操作符

只能操作一个值的操作符。有递增和递减操作符（适用任何数值，基本规则同[数值转换的规则](#to_int)），一元加减操作符（对数值不产生影响）

#### 位操作符

按内存中表示数值的位来操作数值。过程像转换32位的整数。以二进制表示整数进行对应操作后转换为整数。

具体操作符有：

* 按位非（NOT）：返回数值的反码。本质是操作数的负值减一。
* 按位与（AND）：对应位是1才返回1，否则返回0。
* 按位或（OR）：对应位有一个为1则返回1，否则返回0。
* 按位异或（XOR）：对应位只有一个是1才返回1，否则返回0。
* 左移（<<）：将数值向左移动指定位数，以0补足右侧空位。
* 有符号的右移（>>）：将数值向右移指定位数，保留符号位。
* 无符号的右移（>>>）：将数值向右移指定位数，不保留符号位，以0填充。

#### 布尔操作符
非（NOT）、与（AND）、或（OR）三个。

* 逻辑非(!)：一个操作数，先转换为布尔值然后求其反。查看[转换布尔值的规则](#to_boolean)
* 逻辑与(&&)：有两个操作数，规则同逻辑与真值表。可应用与任何类型的操作数。在有一个操作数不是布尔值的情况下，不一定返回布尔值。规则：
	* 第一个操作数是对象，则返回第二个操作数；
	* 第二个操作数是对象，在第一个为true时才返回第二个操作数；
	* 两个操作数都是对象，返回第二个操作数；
	* 有一个操作数是null，返回null；
	* 有一个操作数是NaN，返回NaN；
	* 有一个操作数是undefined，返回undefined。
* 逻辑或(||)：有一个操作数不是布尔值的情况下，不一定返回布尔值。规则：
	* 第一个操作数是对象，则返回第一个操作数；
	* 第一个操作数求值结果为false，则返回第二个操作数；
	* 两个操作数都是对象，返回第一个操作数；
	* 有一个操作数是null，返回null；
	* 有一个操作数是NaN，返回NaN；
	* 有一个操作数是undefined，返回undefined。

> 逻辑与和逻辑或都是**短路操作符**。如果第一个操作数的求值结果能够决定整体求值结果，后续运算就不会进行。

#### 乘性操作符

乘法（*）、除法（/）和求模（%）（返回余数）。

使用Number()将非数值转换为数值后再运算。

#### 加性操作符

* 加法。有操作数为字符串的运算规则需要注意：

	* 如果两个操作符都是字符串，那么将两个操作数按序拼接起来；
	* 如果只有一个是字符串，那么将另一个转换为字符串后进行拼接。

如果有一个操作数是对象、数值或布尔值，则调用toString()方法取得对应字符串值之后再运用字符串运算的规则。

举个栗子:chestnut:：

````js
var message = "The sum of 5 and 10 is " + 5 + 10;
console.log(message); // The sum of 5 and 10 is 510
````
* 减法。有操作数为非数值时，转换为数值后再执行数值减法运算。

#### 关系操作符

小于（<）、大于（>）、小于等于（<=）和大于等于（>=）。

* 有一个操作数是非数值，那么将其为数值后进行比较。若不能转换为数值，那么就会被转换成NaN（和任何数对比都返回false）。
* 两个字符串比较时，则从左向右逐个比较对应位的编码。

#### 相等操作符

有两组相等比较操作符：

* 相等（==）和不相等（！=）：先转换操作数（强制转型），然后比较其相等性。（一般转为数值）
* 全等和不全等：不转换进行比较。==推荐使用这个方法==

#### 条件操作符

和Java中条件操作符相同的语法格式，有三个操作数，也叫三目操作符：

````js
variable = boolean_expression ? true_value : false_value;
````

#### 赋值操作符

等于号（=）表示，将右侧值赋值给左侧变量。

和其他运算符可组合成复合赋值操作。如 `/=`，`+=`。

#### 逗号操作符

使用逗号操作符可以在一条语句中执行多个操作。

可以用于声明多个变量，赋值。赋值时，总是返回表达式总的最后一项。

### 3.6 语句

* if语句；
* do-while语句；
* while语句；
* for语句；
* for-in语句：一种精准迭代语句，可用来枚举对象的属性。for-in循环前最好先确认对象的值是否为null或undefined；
* babel语句：代码中的标签，以便break和continue语句使用；
* break和continue语句：`break`立即退出循环，强制执行循环后面的语句，而`continue`仅退出本次循环，执行下一次循环。

#### with语句

作用是将代码的作用域设置到特定的对象中。

````js
var qs = location.search.substring(1);
// 等同于
with(location) {
	var qs = search.substring(1);
}
````

#### switch语句

语法和c语言中的`switch`语法非常接近。

ECMAScript中`switch`语句更为灵活，`switch`括号中的表达式可以是任意类型，case的值也可以是数值、变量和**表达式**。

### 3.7 函数

函数使用`function`关键字来声明，后跟参数及函数体。

函数通过器函数名调用，函数名后面要加上一对圆括号和参数（如果有）。

ECMAScript中的函数不必指定返回值。

* 理解参数
	
函数的参数存储在arguments对象中，这个对象和数组类似（不是Array的实例），可以通过方括号语法访问每一个元素，可以通过length属性确定传入的参数。

* 没有重载

ECMAScript没有函数签名（接收参数的类型和数量），因此没有可能做到重载。

定义同名函数时，先定义的函数会被后定义的函数覆盖。

:sparkles: