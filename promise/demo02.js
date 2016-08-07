var promise = new Promise(function(resolve, reject) {
	console.log("inner promise"); // 1
    reject(42);
});

//1：不处理onFulfilled，只定义onRejected出错的情况
/*promise.then(undefined, function onRejected(value) {  
	console.log(value);
});*/

//2：1这种情况，不如用这种解决方案
/*promise.then().catch(function onRejected(value){
	console.log(value);
});

console.log('outer promise');*/


//Promise.resolve(value)可以认为是new Promise(function(resolve){})的快捷方式
Promise.resolve(42).then(function(value){ //resolve(42)会让promise迅速进入确定（resolve）状态，并将42传递给then后面指定的onFulfilled函数
    console.log(value);
});

