* 纯函数
```javascript
var xs = [1,2,3,4,5];
  
// 纯的
xs.slice(0,3);
//=> [1,2,3]
  
xs.slice(0,3);
//=> [1,2,3]
  
xs.slice(0,3);
//=> [1,2,3]
  
  
// 不纯的
xs.splice(0,3);
//=> [1,2,3]
  
xs.splice(0,3);
//=> [4,5]
  
xs.splice(0,3);
//=> []
```
 
* 柯里化 (curry)
```javascript
var add = function(x) {
  return function(y) {
    return x + y;
  };
};
  
var increment = add(1);
var addTen = add(10);
  
increment(2);
// 3
  
addTen(2);
// 12
```
* 组合(compose)
```javascript
var compose = function(f,g) {
  return function(x) {
    return f(g(x));
  };
};
var toUpperCase = function(x) { return x.toUpperCase(); };
var exclaim = function(x) { return x + '!'; };
var shout = compose(exclaim, toUpperCase);
  
shout("send in the clowns");
//=> "SEND IN THE CLOWNS!"
```
* 声明式
```javascript
// 命令式
var makes = [];
for (i = 0; i < cars.length; i++) {
  makes.push(cars[i].make);
}
  
  
// 声明式
var makes = cars.map(function(car){ return car.make; });
```
