var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//方法1：普通回调函数风格的多个xhr
//利用回调减少多层嵌套的问题：good code
//进行异常处理，到处都是回调
/*function getURLCallback(URL, callback) {
	var req = new XMLHttpRequest();
	req.open('GET', URL, true);
	req.onload = function() {
		if(req.status === 200) {
			callback(null, req.responseText);
		}else {
			callback(new Error(req.statusText), req.response);
		}
	};
	req.onerror = function() {
		callback(new Error(req.statusText));
	};
	req.send();
}*/

//<1>对JSON数据进行安全的解析
function jsonParse(callback, error, value) {
	if(error) {
		callback(error, value);
	}else {
		try {
			var result = JSON.parse(value);
			callback(null, result);
		}catch(e) {
			callback(e, value);
		}
	}
}
/*
//<2>发送XHR请求
var request = {
	comment: function getComment(callback) {
		return getURLCallback('http://azu.github.io/promises-book/json/comment.json', jsonParse.bind(null, callback));
	},
	people: function getPeople(callback) {
		return getURLCallback('http://azu.github.io/promises-book/json/people.json', jsonParse.bind(null, callback));
	}
};

// <3>启动多个xhr请求，当所有请求返回时调用callback
function allRequest(requests, callback, results) {
	if(requests.length === 0) {
		return callback(null, results);
	}
	var req = requests.shift();
	req(function(error, value) {
		if(error) {
			callback(error, value);
		}else {
			results.push(value);
			allRequest(requests, callback, results);
		}
	});
}

//入口：main()
function main(callback) {
	allRequest([request.comment, request.people], callback, []);
}

//运行example
main(function(error, results) {
	if(error) {
		return console.error(error);
	}else {
		console.log(results);
	}
});*/

//Promise.then同时处理多个异步的解决方案 
/*function getURL(URL) {
	return new Promise(function(resolve, reject) {
		var req = new XMLHttpRequest();
		req.open('GET', URL, true);
		req.onload = function() {
			if(req.status === 200) {
				resolve(req.responseText);
			}else {
				reject(new Error(req.statusText));
			}
		};
		req.onerror = function() {
			reject(new Error(req.statusText));
		};
		req.send();
	});
}

var request = {
	comment: function getComment(callback) {
		return getURL('http://azu.github.io/promises-book/json/comment.json', jsonParse.bind(null, callback));
	},
	people: function getPeople(callback) {
		return getURL('http://azu.github.io/promises-book/json/people.json', jsonParse.bind(null, callback));
	}
};

function main() {
	function recordValue(results, value) {
		results.push(value);
		return results;
	}
	//[]用来保存初始化的值
	var pushValue = recordValue.bind(null, []);
	console.log('pushValue', pushValue);
	return request.comment().then(pushValue).then(request.people).then(pushValue);
	
}
//运行
main().then(function(value) {
	console.log(value);
}).catch(function(error) {
	console.log(error);
});*/

//Promise.all的解决方案其实更适合
//Promise.all接收一个promise对象的数组作为参数，当数组中所有promise对象全部变为resolve或reject状态时，才会调用.then方法

//main()函数区别于Promise.then()的链式调用
function main() {
	return Promise.all([request.comment(), request.people()]); //request.comment()和request.people()会同时执行，而且每个promise的结果(resolve和reject传递的参数),和传递给Promise.all的promise数组的顺序是一致的
}

//Promise.race(array): 在array中的promise对象第一个变为确定状态后，.then注册的回调函数就会被调用，此时其他的promise对象也会继续执行（但不再触发.then()）

//Propmise.then(onFulfillfed, onRejected) ,在onFulfilled中发生异常时，onRejeced中是捕获不到这个异常的
// 正确的捕获方法是：Promise.then(onFulfilled).catch(onRejected)















