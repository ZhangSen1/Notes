## 异步
* 程序是分块的
  ```javascript
  function now(){
      return 21;
  } //现在执行的部分

  function later(){
      answer = answer * 2;
      console.log(answer);
  } //将来执行的部分

  var answer = now(); 
  setTimeout(later, 1000); //42

  ```
* 异步控制台
  * console.log
* 事件循环
  ```javascript
  //伪代码
  // eventLoop 是一个用作队列的数组
  //(先进先出)
  var eventLoop = [];
  var event;

  //一直执行
  while(true){
      //一次 tick
      if (eventLoop.length > 0){
          // 拿到队列中的下一个事件
          event = eventLoop.Shift();

          //执行下一个事件

          try{
              event();
          }catch(err){
              reportError(err);
          }
      }
  }
  ```
  * setTimeout
    * setTimeout并不是把回调函数过载事件循环队列中, 它所作的是一个定时器, 当定时器到时后，环境会把回调函数放到事件循环中，这样，在未来某个时刻的 tick 会摘下并执行这个回调，所以setTimeout 的精度并不高.
    * setTimeout(..., 0)并不直接把项目插入到事件村换队列，定时器会在有机会的时候插入事件，举例来说,两个连续的 setTimeout(...0) 调用不能保证会严格按照调用顺序处理
  * ES6 中精确制定了事件循环的工作细节
  * 函数(事件)的执行顺序存在不确定性(竞态条件)，因为无法可靠预测多个异步执行的最终结果，所以才是竞态条件

## 回调

* continuation
```javascript
// A
setTimeout(function(){
    //C
}, 1000);
//B
```

* 非线性,没有顺序
* 执行与计划
* 嵌套回调与链式回调
  * 不直观,反直觉
  ```javascript
  doA(function(){
      doB();

      doC(funciton(){
          doD();
      });

      doE();
  });

  doF();
  ```
* 信任问题
  * 最严重的问题
  * 控制反转了，也就是把一部分执行控制权交给了某个第三方
    * 调用回调过早
    * 调用回调过晚,或者没有调用
    * 调用回调的次数太少或太多
    * 没有把所需的环境/参数成功传给你的回调
    * 吞掉可能出现的错误或异常
    * .......
  ```javascript
  //你并不知道 doSomethingAsync 会调用几次 doA，也不知道何时调用 doA，等于把 doA 的控制权交给了第三方
  doSomethingAsync(function(){
      doA();
  });
  ```
* 挽救回调
  * 调用超时
  ```javascript
  function timeoutify(fn, delay){
      var intv = setTimeout(function(){
          intv = null;
          fn(new Error("Timeout"));
      }, delay);

      return function(){
          //没有超时
          if (intv){
              clearTimeout(intv);
              fn.apply(this, arguments);
          }
      }
  }

  function foo(err, data){
      if (err ){
          console.error(err);
      }else{
          console.log(data);
      }
  }

  ajax("http://.....", timeoutify(foo, 500));
  ```
  * 调用过早
  ```javascript
  function asyncify(fn) {
      var orig_fn = fn;
      intv = setTimeout(function(){
          intv = null;
          if (fn) fn();
      }, 0);

    fn = null;

    return function(){
        //触发太快，在定时器 intv 触发指示异步转换发生之前
        if(intv){
            fn = orig_fn.bind.apply(orig_fn, [this].concat([].slice.call(arguments)));
        }
        //已经是异步
        else {
            orig_fn.apply(this, arguments);
        }
    }
  }

  //使用
  funciton result(data){
      console.log(a);
  } 

  var a = 0;
  ajax("http://....", asyncify(result));

  a++;


  //总是输出 1
  ```

* 解决
  * Promise
  * 生成器
  * async 

