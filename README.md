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

### 大知识点：
+ watcher来源：
    - 数据更新时候，期望可以自动更新视图。所以要在数据更新的时候设置watcher，动态去捕获更新，执行渲染。
+ watcher交互：
    - 先存放Dep.target,在set值时通知所有依赖该值的属性更新
    - watcher和dep的关系是多对多

+ 响应式原理：（最简单的概括）
    - Dep.target实例是全局唯一的
    - mounted周期，watcher 实例执行一次render函数,初始化Dep.target，让其等于当前watcher（绑定render函数求值）。
    - 收集依赖：对象或者数组生成闭包 Dep 实例 ，然后在每次各个需要做响应式求值的 get函数，都会在Dep.target上添加并绑定 Dep 实例。Dep 实例也会添加当前watcher，以便后续遍历调用更新。
    - 派发更新：响应式对象的值，在Object.defineProperty的set方法，传入新值的时候，就会调用当前依赖dep实例的更新方法，dep实例就将自身绑定的watcher统统都更新。
    - 执行完render函数，求值完，就重置Dep.target为null
    - 新watcher 实例的时候，又会更新Dep.target

+ router基本原理在：**custom-router**文件夹, 目前实现了hash模式的路由写法，history模式还在进行中

+ vuex基本原理在：**custom-store**文件夹
    - 同步
    - 异步：用setTimeout 1s模拟



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

