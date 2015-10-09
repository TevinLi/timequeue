# timeQueue.js #

一个时间列队管理的小工具  
使用它，没有N层嵌套，使用“相对时间”，顺序简单，可暂停、继续、清空

## 用法 ##

### 引入script ###
	<script src="../src/timeQueue.js"></script>

#### 使用示例 ####

	var que1 = new TimeQueue();
	que1.delay(800, function() {
		$('#div1').addClass('show');
	});
	que1.delay(4500, function() {
		$('#div2').addClass('show');
	}).delay(500, function() {	//连写
		$('#div3').addClass('show');
	});
	que1.run();

### 方法说明 ###

**new TimeQueue(pause);**  
创建一个新的时间列队，可以创建多个相互不影响  
- **pause**：布尔，可选，默认false不暂停，是否在申明时就处于暂停状态

**.delay(time, callback);**  
从上一个动作**开始**算起，延迟多少时间后执行本次动作  
处于非暂停状态时添加节点，则立即开始列队第一个节点计时  
- **time**：毫秒，必须，延迟时间  
- **callback**：回调，可选，要执行的动作

**.pause();**  
暂停此时间列队

**.continue();**  
取消暂停继续执行  
当处于非暂停状态时，此为空动作

**.clean();**  
清空时间列队，阻止正在计时的动作  
当列队已经播放完成时，此为空动作

## Demo ##
[http://code.xf09.net/timequeue/demo/](http://code.xf09.net/timequeue/demo/index.html "http://code.xf09.net/timequeue/demo/index.html")

## 背景 ##

对于小而密集的多动画页面，需要大量的时间控制来让动画依次执行  
如果不思考一下，拿着任务就开始写，于是就像这样

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

一般来说，动画是很难一次调整到位的，常常伴随着改来改去  

**问题一： 需要把动画3和动画5对调**   
直接移动 setTimeout 将是一件非常麻烦的事情，若只移动动画和时间也还是有些麻烦和容易出错

处于对这个问题的考虑，再多想一步，于是又有了下面这个版本

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

显而易见，这样就把嵌套分开了，这也是我们通常处理的办法，jQuery都是类似这种思路

    $("#div1").delay('slow').fadeIn();
    $("#div2").delay('fast').fadeIn();
    $("#div3").delay(1000).fadeIn();
    $("#div4").delay(1400).fadeIn();
    $("#div5").delay(1800).fadeIn();

对于一般的情况，这种确实已经够用，但是如果动画比较多呢？大量小而密集的动画呢？

**问题二：改变某个点的动画时间**  
由于列队采用的是同一时间起点的“绝对时间”，相互之间依靠数值大小来控制播放次序  
对于较长的列队，各个节点相互咬合紧密，若其中的某一个节点动画延长、缩短、提前、推后，则其后的所有节点需要**跟随重算一遍时间**  
例如：animate2的时间若要提前170毫秒，后面的节点时间需要依次改为1830、2660、3490、4320...，这需要我们手工去计算

基于这些问题考虑，设计了这个集二者之所长的时间列队管理工具  
对于问题一，从调用方法上就不存在，并且播放顺序由加入顺序决定  
对于问题二，因为是“相对时间”，节点变化只需要改变相应的时间即可

## 更新说明 ##

### v 0.3 ###
取消 run() 方法，列队播放与否，仅由暂停、非暂停两种状态控制  
new申明时，新增是否处于暂停状态参数