## PC端input和inputcheck的探索

本章内容

- [ ] input事件总结
- [ ] 输入即提示的input check
- [ ] 中/英文输入的input check

### input事件总结

input事件有`onkeyup`、`onkeydown`、`onkeypress`、`onchange`、`oninput`等，比较详细的参考文档是[input输入框的事件触发及其顺序](http://www.cnblogs.com/llauser/p/6715409.html)，jsfiddle中对[源代码](https://jsfiddle.net/monaz_/m7cm7n6k/)进行了展示。

通过以上demo中源码的实践，可以总结出一下观点：

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









































































