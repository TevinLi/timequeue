/**
 * timeQueue.js v0.4
 * https://github.com/TevinLi/timeQueue
 *
 * by Tevin Li
 *
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

    //延迟时间方式添加执行列队成员
    Q.prototype.delay = function (delayTime, callback) {
        this.que.push([delayTime, callback]);
        this.run();
        return this;
    };

    //持续时间方式添加执行列队成员
    Q.prototype.duration = function (duration, callback) {
        duration = duration ? duration : 0;
        var surplus = this.que.length;
        if (surplus == 0) {
            this.que.push([0, callback]);
            this.que.push([duration, null]);
        } else if (surplus >= 1) {
            //如果上一成员不存在回调，则在上一成员中加入
            if (!this.que[surplus - 1][1]) {
                this.que[surplus - 1][1] = callback;
            }
            //如果存在，则作为无延迟时间成员加入
            else {
                this.que.push([0, callback]);
            }
            this.que.push([duration, null]);
        }
        this.run();
        return this;
    };

    //数组形式，按两种方式添加列队
    Q.prototype.actionList = function (type, list) {
        if (!type || typeof type != 'string' || (type != 'duration' && type != 'delay') ) {
            throw new Error('No type!');
        }
        if (!list || typeof list.length == 'undefined') {
            throw new Error('No action list!');
        }
        for (var i = 0; i < list.length; i++) {
            this[type](list[i][0], list[i][1]);
        }
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
    Q.prototype.run = function () {
        if (!this.atPlay && !this.atPause) {
            this.atPlay = true;
            this.step();
        }
        return this;
    };

    return window.TimeQueue = Q

})(window);