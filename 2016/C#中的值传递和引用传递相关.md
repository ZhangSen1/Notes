# C# 中的值传递和引用传递相关

## 值类型和引用类型

  要谈 C# 中的值传递和引用传递，势必需要先了解 CLR 对于值类型和引用类型的定义。
  在 CLR 中所有的类型都是派生自 System.Object，而值类型都派生自 System.ValueType，当然，System.ValueType 也是派生自 System.Object。
  对于自定义的类型来说，常用的有 class 和 struct，有时候也会用到 Emue，其实 Emue 是派生自 System.ValueType，也属于值类型的一种。
  引用类型和值类型从底层上说就是分配在内存中的位置不同（引用类型在托管堆中，值类型在堆栈中），简单的说就是引用类型的变量通过 new 操作符存储的是对象的内存地址，值类型的变量直接存储的数据本身，举例子来说，在 BCL 中定义的引用类型有 File，List<T>等，像 DateTime，int，double 这些都是值类型，需要注意的是 string 并不是一个值类型，而是一个引用类型，虽然 string 的一些行为表现出来特别像是值类型，这里不展开讨论这个。值类型并不受 CLR 垃圾回收的控制。 在实际情况中何时使用 class，何时使用 struct，一般是根据语义来决定：
* 简单类型，不会更改该类型的任何实例字段。
* 不需要继承任何类型也不派生任何类型（CLR 中并没有开放值类型的继承，但是可以实现接口）。

除了以上两种情况都应该使用 class 来自定义类型。
以下代码说明了使用 struct 有可能会忽略的问题：

```c#
   public struct AStruct
   {
       public int A { get; set; }
   }
	
   // 这里很容易出问题，如果外面还会用到 AStruct，就会出现值并没有改变的情况，使用 class 定义类型或者使用
   // ref 来进行引用传递可解决此问题
   private static void ChangeStruckProperty(AStruct aStruct)
   {
        aStruct.A = 1;
   }

	var aStruck = new AStruct { A = 0 };
	ChangeStruckProperty(aStruck);
	Console.WriteLine(aStruck.A); //0
	
	// 重新复制成员
	var bStruck = aStruck;
	// 更改的是 bStruck 上的 A，和 ASruck已无关系 
	bStruck.A = 2;
	Console.WriteLine(aStruck.A); //0
```

## 值类型的装箱拆箱

简单来说值类型有两种状态：已装箱和未装箱，而引用类型只有一种状态：已装箱。
以下代码：

```c#
    AStruct a = new AStruct { A = 0};
	// 装箱
    object o = a;
    // 拆箱
    AStruct c = (AStruct)o;
```

先声明一个 AStruct 类型的变量 a，之后将 a 赋值给一个 object 类型的变量 o，此时 C# 编译器发现 a 是一个值类型，会先将 a 实例中所有字段都复制到一个新分配的 AStruck 引用类型中，然后将这个新分配的 AStruck 的地址返回给 o，这个过程称为装箱。之后将 object 类型的 o 赋值给 AStruck 类型的 c，这个时候 CLR 将会先获取到 o 对象上的所有字段的地址，然后将这些字段的值复制到新分配到栈上的值类型中，这个过程称为拆箱。不严谨的说就是值类型转换成引用类型称为装箱，反之称为拆箱。
一般来说拆箱比较明显，比如强制类型转换，但装箱很有可能会在不经意间发生。
以下代码：
```c#
    var arrayList = new ArrayList();
    for (var i = 0; i < 1000; i++)
    {
		// 1000次装箱
        arrayList.Add(i);
    }

    for (var i = 0; i < arrayList.Count; i++)
    {
		// 1000次拆箱
        int number = (int)arrayList[i];
    }
```

原因就是因为 ArrayList 的 Add 方法的参数是 Object 类型，所以每次调用并传入值类型时都会发生装箱，相对于拆箱来说装箱开销要大很多，因为装箱会创建非常多的对象，无形之中就会增加垃圾回收的负担。
当然现在是不推荐用 ArrayList 了，一般这种情况都是直接使用 List\<T> 就可以，因为泛型直接约束了可以接受的类型（List\<int>），也就不存在装箱拆箱的问题了，当然泛型的优点不止于此，这里不展开说。

## 引用类型的值传递
要明白的是，在 C# 中所有的参数传递默认都是值传递，除非在传递时加上 ref 或者 out。
以下代码可以说明问题：
```c#
   private static void AppendStr(StringBuilder stringBuilder)
   {
	   // 容易误认为是引用传递
       stringBuilder.Append("abc");
   }

   var stringBuilder = new StringBuilder();
   AppendStr(stringBuilder);
   Console.WriteLine(stringBuilder.ToString()); // 输出 "abc"
  
   //======================================//
   
   // 传参时可以加入 ref 或 out 来变成引用传递
   private static void AppendStr(StringBuilder stringBuilder)
   {	
		// 不注意的话会是个小坑
	   // 在这里重新给 stringBuilder 重新赋值，但是外面的 stringBuilder 并未修改，
       // 说明并不是引用传递
	   stringBuilder = new StringBuilder();
       stringBuilder.Append("abc");
   }

   var stringBuilder = new StringBuilder();
   AppendStr(stringBuilder);
   Console.WriteLine(stringBuilder.ToString()); // 输出 ""
```
在调用 AppendStr 时参数是以值传递的方式传递的，只不过传入的值正好是一个地址，所以方法内部的 stringBuilder 和外面的 stringBuilder 还是一个对象，但是在第二个方法中给 stringBuilder 重新赋值，因为是通过值传递的方式传递的，所以跟外面的 stringBuilder 已经无关，所以输出为空。当然，可以在传参的时候加入 ref 或 out 来变成引用传递来解决这个问题(ref 和 out 编译成的 IL 代码完全相同，只不过 C# 编译器将两个关键字区别对待，如果使用 out 标记在传入前可以不用初始化，但是在方法内必须初始化，而使用 ref 则必须在传入前初始化)。

当然，VB也是基于CLR,以上所有同样适用。
																							
###### 参考:
MSDN
CLR Via C#
深入理解C#