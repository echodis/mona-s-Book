## 第二章：在HTML中使用JavaScript

### 2.1 &lt;script&gt;元素

向HTML页面中插入js代码的主要方法是使用&lt;script&gt;元素。HTML 4.0.1为&lt;script&gt;定义了5个属性。

* charset: 可选，表示通过src属性指定的代码的字符集（大多数浏览器忽略它的值）；
* defer: 可选，表示脚本可以延迟到文档完全被解析和显示之后再执行；
* language: 已废弃，表示编写代码使用的脚本语言；
* src: 可选，表示要执行的外部文件；
* type: 必选，可看成language的替代属性，表示编写代码使用的脚本语言的内容类型(MIME)，通常取值text/javascript。

使用&lt;script&gt;的方式有两种：

1. 在页面嵌入js代码；
2. 包含外部JavaScript文件。

包含在&lt;script&gt;元素内部的js代码将被从上至下依次解释。在解释器对&lt;script&gt;内部所有代码处理完毕以前，页面中其他内容不会被继续加载或显示。

一般推荐**外部引入js文件**的方案。有优点如：可维护性、可缓存、可适应未来。

> 值得注意的是，&lt;script&gt;元素的src可以包含来自外部域的js文件。这一点与&lt;img&gt;类似。

> 可是，不论如何包含代码，浏览器都会按照&lt;script&gt;在页面中出现的先后顺序依次解析。（第1解析完才开始解析第2）

#### 标签的位置

&lt;script&gt;可以在body标签前或body标签后引入，这将影响页面内容出现的时间。具体选择要依据使用场景而定。

#### 延迟脚本

defer属性表明脚本在执行时不会影响页面构造，即脚本被延迟到整个页面都解析完毕后再运行。 (仅IE和firefox3.1支持）

### 2.2 文档模式

HTML文档模式通过文档类型（doctype）来指定。一般讨论最初的两种文档模式：

* 混杂模式（quirks mode）
* 标准模式（standards mode）

html5 对文档类型进行了统一，统一表示为：&lt;!DOCTYPE html&gt;

### 2.3 &lt;noscript&gt;元素

&lt;noscript&gt;元素是对不支持javascript的浏览器的兼容。

当浏览器不支持脚本或浏览器支持脚本但脚本被禁用时，&lt;noscript&gt;中的内容才会显现在页面中。
