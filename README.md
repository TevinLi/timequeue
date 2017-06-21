# timeQueue.js

一个能简化 H5 复杂动作列队次序与时间管理的小工具  
timeQueue.js 是为了有效解决了大量 setTimeout 密集调用时难以维护的问题而创建的，使用 timeQueue.js，没有 N 层嵌套，使用“相对时间”，单个添加、批量添加、改序、暂停、继续、清空等操作让时间列队简单可控。

## 用法

### 引入script
```html
<script src="../src/timeQueue.js"></script>
```

### 使用示例
```js
var queue1 = new TimeQueue();
//加入一个列队成员
queue1.duration(800, function() {
  $('#div1').addClass('show');
});
//多个列队成员加入链写
queue1
  .duration(4500, function() {
    $('#div2').addClass('show');
  })
  .duration(500, function() {	
    $('#div3').addClass('show');
  });
```

### 方法说明

**new TimeQueue( pause );**  
创建一个新的时间列队，可以创建多个相互不影响  
- pause： 布尔，可选，默认false(不暂停)，在开始时是否就处于暂停状态  

**.duration( durationTime, callback );**  
持续时间方式加入列队成员，本成员开始执行后，持续多长时间后再执行下一个成员（推荐）  
- durationTime： 毫秒，必须，本成员执行需要占用多长时间  
- callback： 回调，可选  

**.delay( delayTime, callback );**  
延迟时间方式加入列队成员，从上一个成员**开始执行**算起，延迟多少时间后执行本成员  
- delayTime： 毫秒，必须，上一成员开始执行后(尚未结束)的延迟时间  
- callback： 回调，可选  

**.actionList( type, list )**  
批量添加成员  
- type： 'duration' / 'delay'，必须，list中时间的类型  
- list： 数组，必须，成员列表  

list格式如下
```js
[
  [500, function(){ /* do something a */ }],
  [700, function(){ /* do something b */ }]
]
```

**.pause();**  
暂停此时间列队  

**.continue();**  
取消暂停继续执行  

**.clean();**  
清空时间列队，阻止正在计时的动作  

## H5 Demo
[https://tevinli.github.io/timequeue/index.html](https://tevinli.github.io/timequeue/index.html "timequeue.js h5 demo")

<br>

## 项目背景

对于小而密集的多动画页面，需要大量的时间控制来让动画依次执行  
如果不思考一下，拿着任务就开始写，于是就像这样
```js
//animate 1	
setTimeout(function() {
	//animate 2
	setTimeout(function() {
		//animate 3
		setTimeout(function() {
			//animate 4
			setTimeout(function() {
				//animate 5
				setTimeout(function() {
					//animate 6
					//7、8、9...
				}, 1000);
			}, 1000);
		}, 1000);
	}, 1000);
}, 1000);
```

一般来说，动画是很难一次调整到位的，常常伴随着改来改去  

**问题一： 需要把动画3和动画5对调**   
直接移动 setTimeout 将是一件非常麻烦的事情，若只移动动画和时间也还是有些麻烦和容易出错

处于对这个问题的考虑，再多想一步，于是又有了下面这个版本
```js
//animate 1
setTimeout(function() {
	//animate 2
}, 1000);
setTimeout(function() {
	//animate 3
}, 2000);
setTimeout(function() {
	//animate 4
}, 3000);
setTimeout(function() {
	//animate 5
}, 4000);
setTimeout(function() {
	//animate 6
}, 5000);
//7、8、9...
```

显而易见，这样就把嵌套分开了，这也是我们通常一些的处理办法
对于数量较少的情况，这种确实已经够用，但是如果动画比较多呢？大量小而密集的动画呢？

**问题二：改变某个点的动画时间**  
由于列队采用的是同一时间起点的“绝对时间”，相互之间依靠数值大小来控制播放次序  
对于较长的列队，各个节点相互咬合紧密，若其中的某一个节点动画延长、缩短、提前、推后，则其后的所有节点需要**跟随重算一遍时间**  
例如：animate2的时间若要提前170毫秒，后面的节点时间需要依次改为1830、2660、3490、4320...，这需要我们手工去计算

jQuery中也存在类似问题
```js
$("#div1").fadeIn(500, function() {
	$("#div2").fadeIn(500, function() {
		$("#div3").fadeIn(500, function() {
			//...
		});
	});
});
$("#div4").delay(1000).fadeIn();
$("#div5").delay(1400).fadeIn();
$("#div6").delay(1800).fadeIn();
//...
```

基于优化这些问题考虑，设计了这个时间列队管理工具  
对于问题一，从调用方法上就不存在，且播放顺序由加入顺序决定  
对于问题二，因为是“相对时间”，某节点变化只需要改变相应的时间即可

