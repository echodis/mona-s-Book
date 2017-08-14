## PC端input和inputcheck的探索

本章内容

- [ ] input事件总结
- [ ] 输入即提示的input check
- [ ] 综合多种类型的input check

### input事件总结

input事件有`onkeyup`、`onkeydown`、`onkeypress`、`onchange`、`oninput`等，网上找了个比较具体的参考文档是[input输入框的事件触发及其顺序](http://www.cnblogs.com/llauser/p/6715409.html)，源代码在`./index.html`有介绍。

首先，综述一下input各事件触发顺序（chrome中）：

1. 仅鼠标点击（无键盘事件）

    ````js
    onfocus
    onblur
    ````
2. 点击加输入（鼠标移入->键盘输入->鼠标移出）
    
    - 非中文输入
    
    ````js
    // 鼠标移入
    onfocus
    // 键盘输入
    onkeydown
    onkeypress
    onInput // onkeypress后触发了onInput
    onkeyup
    // 鼠标移出
    onChange
    onblur
    ````
    
    - 中文输入
    
    ````js
    // 鼠标移入
    onfocus
    // 键盘输入
    onkeydown
    onInput // onkeypress后触发了onInput
    onkeyup
    // 鼠标移出
    onChange
    onblur
    ````
    
    #### tips: keypress
    只有具有ASCII码的字符才会触发keypress事件，因此keypress不能对系统功能键（后退，删除等）和中文输入法进行有效响应。
    
3. 粘贴输入

- ctrl+v输入

    ````js
    onfocus
    2*onkeydown
    onInput
    2*onkeyup
    onChange
    onblur
    ````

- 右键->粘贴

    ````js
    onfocus
    onInput
    onChange
    onblur
    ````
    
### 输入即提示的input check

输入即提示的input输入校验在某些业务场景下，能给用户带来更好的操作体验（不需要返回查看输入前部分有哪些校验不通过的问题）。

移动端的处理方法一般是提供软键盘模拟用户输入操作，这里不做讨论。

综合以上对全部input情况的总结，可以在`onInput`阶段对输入进行校验。

代码见`./index.html`中的第二个input示例。


### 综合多种类型的输入check

针对面向用户的产品端，这个需求有点*伪需求*的意味，因为面向用户的输入形式是有限且固定的。但是面向企业，尤其是企业内部运营活动，经常涉及到诸如：多个数值字符串，以逗号分隔的需求。这类需求一般是用以方便运营人员进行批量操作。

代码见`./index.html`中的第三个input示例。









































































