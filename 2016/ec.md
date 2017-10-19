### Execution Contexts
* Stack
* 两种EC
	* 全局(程序启动)
		
		```javascript
			ECStack = [
			  globalContext
			];
		```
	* 函数
	
		* 执行时依次压入 Stack
		* 函数执行完毕后弹出 Stack
		* 最后只剩下全局 EC
* Eval
	* 多一个调用 context (即 Eval 执行时产生的 EC)

### Variable Object

* 是 EC 的一个属性
* 全局 VO
	* 全局对象初始化时创建
* 函数 VO
	* VO === AO((activation object)
	* 进入执行上下文
		* 创建 AO
		* AO 包含的属性:
			1. 函数形参
			2. 函数声明(function a(){})
			3. 变量声明(var a;) 默认值为 undefined，不会干扰已经存在的同名函数声明或形参声明
	* 执行代码
		* 依次赋值
			```javascript
				alert(x); // function
				 
				var x = 10;
				alert(x); // 10
				 
				x = 20;
				 
				function x() {};
				 
				alert(x); // 20
			```

### this
	
* 是 EC 的一个属性
* 进入上下文时确定，运行时不会变
* 全局 this
	* this == global
* 函数中的 this
	* 因为是进入上下文时确定，所以是动态的，且运行时不会变
	* this 为调用函数的父上下文(当前函数的调用者上下文)
	* this 由调用者提供，由调用函数的方式来决定
	* 引用类型
		* base
		* propertyName
		```javascript
			function GetValue(value) {
			 
			  if (Type(value) != Reference) {
			    return value;
			  }
			 
			  var base = GetBase(value);
			 
			  if (base === null) {
			    throw new ReferenceError;
			  }
			 
			  return base.[[Get]](GetPropertyName(value));
			 
			}
		```
	* 如果调用括号()的左边是引用类型的值，this将设为引用类型值的base对象（base object），在其他情况下，这个值为null
	* 构造器调用 (new)
		* 先调用函数内部的 [[Construct]] 
		* 在调用内部的 [[Call]] 
		* 将 this 指向为新 Object
	* call,apply
	
### 作用域链

* 为 EC 的一个属性 (scope)
* Scope = AO + 函数.[[Scope]]
* 创建时
	* 函数.[[Scope]] = [parent.VO, ...] 为父变量对象的层级链
* 调用时
	* Scope = AO|VO + [[Scope]]
* 链式查找
* 二维链查找
	* 作用域链
	* 每个作用域链的原型链
	```javascript
		function foo() {
		  alert(x);
		}
		 
		Object.prototype.x = 10;
		 
		foo(); // 10 
	```
	* VO 没有原型
	```javascript
		function foo() {
		 
		  var x = 20;
		 
		  function bar() {
		    alert(x);
		  }
		 
		  bar();
		}
		 
		Object.prototype.x = 10;
		 
		foo(); // 20
	```
* eval
	* 当前的调用上下文（calling context）拥有同样的作用域链


#### ECMAScript使用静态（词法）作用域
```javascript
var x = 10;

function foo() {
  alert(x);
}

(function (funArg) {

  var x = 20;

  // 变量"x"在(lexical)上下文中静态保存的，在该函数创建的时候就保存了
  funArg(); // 10, 而不是20

})(foo);
```

