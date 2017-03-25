## 第七章：函数表达式

本章内容

- [ ] 函数表达式的特征
- [ ] 使用函数实现递归
- [ ] 使用闭包定义私有变量

定义函数有两种方式：

1. 函数声明：函数声明提升（意味着函数声明可以放在调用语句后面）
2. 函数表达式：创建匿名函数，在使用前必须赋值。

### 7.1 递归

递归函数是在一个函数通过名字调用自身的情况下构成的。

function factorail(num) {
	if(num <= 1) {
		return 1;
	}else {
		return num * arguments.callee(num-1);
	}
}

auguments.callee：一个指向正在执行的函数的指针。
auguments.caller：在一个函数中调用另一个函数，被调用的函数会自动生成一个caller属性，指向调用它的函数对象。若当前函数未被调用或并非被其他函数调用，则caller为null。

### 闭包

闭包是指有权访问另一个函数作用域中的变量

````js
function createComparisonFunction(propertyName) {
	return function(object1, object2) {
		**var value1 = object1[propertyName];
		var value2 = object2[propertyName];**
		
		if(value1 < value2) {
			return -1;
		}else if (value1 > value2) {
			return 1;
		}else {
			return 0;
		}
	}
}
````

即使内部函数被返回后在其他地方被调用了，但它仍然可以访问外部函数传入的变量propertyName。

当某个函数被调用时，会创建一个执行环境（execution context）及相应的作用域链。

