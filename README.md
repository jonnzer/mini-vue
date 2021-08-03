# mini-vue

### 需要安装

+ rollup 打包类库工具
+ rollup-plugin-babel rollup和babel的桥梁
+ rollup-plugin-serve 起静态服务
+ cross-env 设置环境变量
+ @babel/core babel核心模块
+ @babel/preset-env  高级语法转为低级语法

### 零碎知识点 
+ rollup-c 使用当前的rollup config文件打包
+ rollup -c -w 实时打包 -w 就是watch的意思
+ AST语法树 是用对象来描述JS原生语法 解析前
+ 虚拟dom 是用对象来描述dom节点 解析后
+ Node.insertBefore() 方法在参考节点之前插入一个拥有指定父节点的子节点 eg: var insertedNode = parentNode.insertBefore(newNode, referenceNode);


### 代码写法
+ 初始化的功能，也会把用到的传入对象信息和初始化状态 等等方法都分成一个一个小函数。（分治的思想）

### 疑惑
+ 当需要出现归类，对统一数据进行多种操作，class 或许为不错选择
+ 当需要在原型链上出现公共方法时，挂载在原型也是极好
+ class和原型的应用场景，需要更加留意下

### 通用的标识
+ @question : 疑惑点

### 感想
+ 写一个不错的函数，要先考虑自己想输出什么结果
