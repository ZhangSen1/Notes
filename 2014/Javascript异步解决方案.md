javascript异步解决方案
====
同步
```javascript
a();
b();
c();
d();
```
异步
```javascript
a(function(){
    b(function(){
        c(function(){
            d(function(){
                
            });
        });
    });
});
```
 如果需要满足 a,b,c完成之后执行d

 回调噩梦

 解决方案
 Promise模式
消息驱动
[列表](httpsgithub.comjoyentnodewikimodules#async-flow)

 Promise模式
JQuery Deferred
promisejs
ECMA 6 原生