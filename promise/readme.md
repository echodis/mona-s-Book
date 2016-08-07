### Promise

#### 1.`Promise简介`

##### 1.1. `Promise`简介

promise的功能是将复杂的异步处理轻松地进行模式化。

根据[ES6 Promises](/)标准中定义的API，目前大致有三种类型:

<strong>Constructor</strong><br>

从构造函数<code>Promise</code>来创建一个新<code>Promise</code>对象作为接口。使用<code>new</code>来调用构造器进行实例化。

~~~js
var promise = new Promise(function(resolve, reject) {
	//异步处理
	//异步处理结束后，调用resolve或reject
});
~~~

<strong>Instance Method</strong><br>

设置promise对象在resolve/reject时调用的回调函数，使用<code>promsise.then()</code>实例方法。

~~~js
promise.then(onFulfilled, onRejected);
~~~

resolve(成功)时，
	<code>onFulfilled</code>会被调用，
reject(失败)时，
	<code>onRejected</code>会被调用

两者均为可选参数，<code>promise.then</code>成功和失败时都可以调用，
只对异常进行处理可以只指定onRejected函数，比如

~~~js
promise.then(undefined, onRejected)
~~~

等同于promise.catch(onRejected) //.catch(onRejected)是个更好的选择

<strong>Static Method</strong><br>

Promise.resove()或是Promise.all()等静态方法。

##### 1.2. `Promise`的状态

用<code>new Promise</code>实例化的promise对象有三种状态：

<strong>Fulfilled</strong>
	resolve(成功)时，此时会调用<code>onFulfilled</code>

<strong>Rejected</strong>
	reject(失败)时，此时会调用<code>onRejected</code>

<strong>Pending</strong>
	既不是resolve又不是reject状态。也就是promise对象刚被创建后的初始化状态等。

#### 2. 实战Promise

静态实例方法：Promise.resolve(value); //返回一个Promise对象
resolve(value)会让promise对象立即进入确定即resolved状态，并将value传递给then里所指定的onFulfilled函数。

~~~js
Promise.resolve(42).then(onFulfilled, onRejected);
~~~

静态实例方法：Promise.reject(value).catch() //立即进入rejected状态，并且调用catch()

方法链：taskA 中<code>return</code>的返回值，会在taskB执行时以参数传给他。

~~~js
promise.then(function taskA() {	
	//do A
	return a;
	}).then(function taskB() {
	//do B
	return b;
	}).catch(function() {
	//do something
	});
~~~

静态实例方法：Promise.catch(); 该方法注册promise状态变为rejected时的回调函数。

Promise和数组

Promise.all()接收一个promise对象的数组作为参数，当这个数组里所有的promise对象全部变成resolve或reject时，它才会去调用then方法。

~~~js
Promise.all([request.comment(), request.people()])
~~~

Promise.reace()
接收一个promise对象的数组作为参数，只要数组里有一个对象进入Fulfilled状态时，它就开始后续处理。(其他promise会执行，但对后续的处理不会重复)

##### 3.关于错误处理
~~~js
//bad
Promise.resolve(42).then(throeError, onRejected)
//good
Promise.resolve(42).then(throwError).catch(onRejected) //onRejected可以捕获throwError中的error
~~~


[Promise book](http://liubin.org/promises-book/) C01, C02






