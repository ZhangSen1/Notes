## this

* 误解
  * 指向自身
  ```javascript
  fucntion foo(num){
      console.log("foo: " + num);

      this.count++;
  }

  foo.count = 0;

  var i;

  for(i = 0; i< 10; i++){
      if (i > 5){
          foo(i);
      }
  }

  //foo: 6
  //foo: 7
  //foo: 8
  //foo: 9

  console.log(foo.count); //0
  ```
  * 指向它的作用域
    * 任何情况下都不指向函数的词法作用域
    ```javascript
    function foo() {
        var a = 2;
        this.bar();
    }

    function bar() {
        // this 是 window
        console.log(this.a);
    }

    foo(); //ReferenceError: a is not defined
    ```

* 运行时进行绑定, 和函数声明的位置没有任何关系，只取决于函数的调用方式
* 当一个函数被调用时，会创建一个活动记录（执行上下文）， 这个记录会包括函数在哪里被调用（调用栈）、函数的调用方式、传入的参数等信息。this 是这个记录的一个属性，会在函数执行过程中用到
* 调用位置
  * 在当前正在执行的函数的前一个调用中
* 绑定规则
  * 默认绑定
  ```javascript
  function foo(){
      //this 默认绑定到全局对象
      console.log(this.a);
  }

  var a = 2;

  foo(); //2


  function foo() {
      "use strict";
      // 严格模式下不能将全局对象用域默认绑定， this 会绑定到 undefined
      console.log(this.a);
  }

  var a = 2;

  foo(); // typeError: this is undefined

  function foo() {
      // this 绑定到全局对象
      console.log(this.a);
  }

  var a = 2;

  (function() {
      "use strict";

      // 在严格模式下调用 foo() 不影响默认绑定，只有 foo() 运行在严格模式才是 undefined
      foo(); // 2
  })()
  ```
  * 隐式绑定
  ```javascript
  function foo(){
      console.log(this.a);
  }

  var obj = {
      a: 2,
      foo: foo
  };

  // 调用位置会使用 obj 上下文来引用函数， 当 foo() 被调用时， 会加上对 obj 的引用，当函数引用有上下文对象时， 隐式绑定规则会把函数调用总的 this 绑定到这个上下文对象, 但只有最后一层再调用位置中起作用
  obj.foo(); //2



  var obj2 = {
      a: 43,
      obj: obj
  }

  obj2.obj.foo(); // 43
  ```
   * 隐式丢失
        ```javascript
        function foo() {
            console.log(this.a);
        }

        var obj = {
            a : 2;
            foo: foo
        };

        var bar = obj.foo; //只是函数的别名
        var a = "global";
        bar(); //"global"
        ```
  * 显示绑定
    * call
    * apply
  * new 绑定
    1. 创建一个全新的对象
    2. 这个对象执行 [[Prototype]] 连接
    3. 新对象绑定到函数调用的 this
    4. 如果函数没有返回其他对象， 那么 new 表达式中的函数调用会自动返回这个新对象
    ```javascript
    function foo(a){
        this.a = a;
    }

    var bar = new foo(2);
    console.log(bar.a) //a
    ```
* 优先级
  * new 绑定 > 显示绑定(call, apply) > 隐式绑定 > 默认绑定
* 绑定例外
  * 被忽略
  ```javascript
  function foo() {
      console.log(this.a);
  }

  var a = 2;
  //绑定到全局对象
  foo.call(null); //2  
  ```
  * 间接引用
  ```javascript
  function foo(){
      console.log(this.a);
  }

  var a = 2;
  var o = {a: 3, foo: foo};
  var p = {a: 4};

  o.foo(); //3
  //非严格模式会绑定到全局对象，严格模式会绑定到 undefined
  (p.foo = o.foo)(); //2
  ```
  * 软绑定
  ```javascript
  if(!Function.prototype.softBind){
      Function.prototype.softBind = function(obj){
          var fn = this;
          var curried = [].slice.call(arguments, 1);
          var bound = function() {
              return fn.apply((!this }} this === (window || global)) ? 
              obj: this,
              curried.concat.apply(curried, arguments));
          };
      };
  }
  ```
* 箭头函数
  * 根据外层（函数或全局）作用域来决定 this
  * 箭头函数的绑定无法被修改
* Notes(二选一)
  * 只使用词法作用域并完全抛弃错误 this 风格的代码
  * 完全采用 this 风格， 在必要时使用 bind(...), 尽量避免使用 self = this 和箭头函数