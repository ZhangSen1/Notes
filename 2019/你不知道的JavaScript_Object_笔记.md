## 对象

* 语法
```javascript
var myObj = {
    key:value
};

var myObj = new Object();
myObj.key = value;
```
* 主要类型
  * string
  * number
  * boolean
  * null
  * undefined
  * object
* 内置对象
  * String
  * Number
  * Boolean
  * Object
  * Function
  * Array
  * Date
  * RegExp
  * Error
```javascript
var str = "string";
typeof str; //"string"
str instanceof String; //false

var strObj = new String("String");
typeof strObj; "object";
strObj instanceof String; // true
```
* 引擎在必要时会自动把字面量转换成对象
* 复制对象
  * 浅复制
    * Object.assign({}, myObject);
  * 深复制
    * var newObj = JSON.parse(JSON.stringfy(someObj));
* 属性描述符
  * getOwnPropertyDescriptor 方法
  ```javascript
  var myObject = {a:2};
  Object.getOwnPropertyDescriptor(myObject, "a");
  //{
  //  value: 2,
  //  writable: true,
  //  enumerable: true,
  //  configurable: true
  //}
  ```
  * defineProperty
    * writable 是否可以更改属性值
    * configurable 是否可以修改属性描述符
    * enumerable 是否可枚举
    ```javascript
    var myObject = {a: 2};
    myObject.a; //a

    delete myObject.a;
    myObject.a; // undefined

    Object.defineProperty(myObject, "a", {
        value: 2,
        writable: false,
        configurable: false,
        enumerable: false //不会出现在 for...in 循环中
    });

    myObject.a; //2
    delete myObject.a;
    myObject.a; //2

    myObject.a = 4; // 严格模式报 TypeError, 非严格模式修改失败
    ```
* 不变性
  * 对象常量
    * 设置 writable:false 和 configurable: false
  * 禁止扩展
    * Object.preventExtensions(..);
    ```javascript
    var myObject = {
        a: 2
    };

    Object.preventExtensions(myObject);
    myObject.b = 3; //严格模式下报 TypeError
    myObject.b; //undefined
    ```
  * 密封
    * Object.seal(..)
      * 实际上是在现有对象上调用 Object.preventExtensions(..)并把所有现有属性标记为 configurable: false.
      * 所以，seal 之后不仅不能添加新属性，也不能重新配置或删除任何现有属性
  * 冻结
    * Object.freeze(..)
      * 实际上是在现有对象上调用 Object.seal(..) 并把所有属性标记为 writable: false
      * 最高级别的不可变性
      * 禁止对于对象本身及其任意直接属性的修改
* [[Get]]
    ```javascript
    var myObject = {a: 2};
    myObject.a; //a
    ```
    * 实际上是实现了 [[Get]] 操作
    * 对象默认的内置 [[Get]] 操作首先在对象中查找是否有名称相同的属性, 如果找到就会返回这个属性的值
    * 如果没有找到名称相同的属性, [[Get]] 算法会便利可能存在的 [[Prototype]] 链,也就是原型链
    * 如果都找不到，返回 undefined
* [[Put]]
    * 如果属性存在，则检查
        1. 属性是否是访问描述符?如果是并且存在 setter 就调用 setter
        2. 属性的数据描述符中 writable 是否是 false? 如果是，非严格模式失败，严格模式抛出 TypeError
        3. 如果都不是,将该值设置为属性的值
* Getter 和 Setter
  * 都是隐藏函数
  * 当给一个属性定义 getter、setter 或者两者都有时, 这个属性会被定义为"访问描述符"(和 "数据描述符" 相对)
  * 对于访问描述符来说, javascript会忽略他们的 value 和 writable 特性，取而代之的是关心 set 和 get
  ```javascript
  var myObject = {
      get a(){
          return this._a_;
      }

      set a(val){
          this._a_ = value * 2;
      }
  };

  myObject.a = 2;

  myObject.a; // 4
  ```
* 存在性
  ```javascript
  var myObject = {a: 2};

  ("a" in myObject); // true
  ("b" in myObject); // false

  myObject.hasOwnProperty("a"); // true
  myObject.hasOwnProperty("b"); // false
  ```
  * Object.prototype.hasOwnProperty.call(object, property)
  * 可枚举
  ```javascript
  var myObject = {};
  Object.defineProperty(
      myObject,
      "a",
      {enumerable: true, value:2}
  );

  object.defineProperty(
      myObject,
      "b",
      {enumerable: false, value: 3}
  );

  myObject.propertyIsEnumerable("a"); // true
  myObject.propertyIsEnumerable("b"); // false

  Object.keys(myObject); //["a"]
  Object.getOwnPropertyNames(myObject); // ["a", "b"]
  ```
  * 生成器


