/**
 * timeQueue.js v0.3
 * https://github.com/TevinLi/timeQueue
 *
 * Copyright 2015, Tevin Li
 * Released under the MIT license.
 */

(function (window) {

    'use strict';

    //主对象
    var Q = function (pause) {
        //列队
        this.que = [];
        //是否暂停，默认不暂停
        this.atPause = !!pause;
        //是否正在播放
        this.atPlay = false;
    };

    //添加执行列队成员
    Q.prototype.delay = function (time, callback) {
        this.que.push([time, callback]);
        this.run();
        return this;
    };

    //清除延迟列队并阻止计时
    Q.prototype.clean = function () {
        this.que = [];
        this.current = [0];
        this.atPlay = false;
        return this;
    };

    //暂停执行列队
    Q.prototype.pause = function () {
        this.atPause = true;
        return this;
    };

    //从暂停恢复
    Q.prototype.continue = function () {
        if (this.atPause == true) {
            this.atPause = false;
            this.step();
        }
        return this;
    };

    //执行动作
    Q.prototype.step = function () {
        var that = this;
        if (this.que.length > 0 && !this.atPause) {
            this.atPlay = true;
            this.current = this.que.shift();
            setTimeout(function () {
                that.current[1] && that.current[1]();
                that.step();
            }, this.current[0]);
        } else {
            this.atPlay = false;
        }
        return this;
    };

    //启动
    Q.prototype.run = function(){
        if (!this.atPlay && !this.atPause) {
            this.atPlay = true;
            this.step();
        }
        return this;
    };

    return window.TimeQueue = Q

})(window);