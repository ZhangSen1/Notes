1. 三元,||, &&, ^
2. 全局变量(垃圾回收)
3. 链式语法
4. 回调 promise
5. 惰性函数
```javascript
var a = (function(){
    if (document.addEventListener){
        return function(type, element, fun){
            element.addEventListener(type, fun, false);
        };
    }else if (document.attachEvent){
        return function(){}
    }else{
        return function(){};   
    }
})()
```
6. 函数节流 (autocompleted)
7. jquery优化 
  * 父元素中找子元素
  * $parent.find('.child')(调用原生)
  * $('#parent > .child') (从右到左)
  * jquery对象缓存
  * 用委托  on("parentelement", "element", function(){})
 
8. 字符串链接和array.join