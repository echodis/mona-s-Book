//可以理解为：then：注册onFulfilled时的回调函数，catch：注册onRejected时的回调函数
var promise = Promise.resolve();  //resolve()可以传值
promise.then(function taskA() {
	console.log('A');
	return 'this is from A'   //taskA中的return会在taskB中执行
}).then(function taskB() {
	console.log('B');
}).catch(function onRejected(error) {
	console.log(error);
}).then(function final(){

});

//兼容Promise.catch()在IE8及以下版本中不能兼容的问题：用中括号标记法
//点标记法：要求对象的属性必须是有效的标识符
//中括号标记法：可以将非合法标识符作为对象的属性名使用