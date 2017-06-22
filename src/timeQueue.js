/**
 * timeQueue.js v0.4.2
 * https://github.com/TevinLi/timeQueue
 *
 * by Tevin Li
 *
 * Released under the MIT license.
 */

(function (window) {

    'use strict';

    /**
     * 声明Queue类
     * @param {boolean} pause
     */
    var Queue = function (pause) {
        //列队
        this.que = [];
        //当前执行的成员
        this.current = null;
        //当前执行的timeout的id
        this.timeout = -1;
        //是否暂停，默认不暂停
        this.atPause = !!pause;
        //是否正在播放
        this.atPlay = false;
    };

    /**
     * 延迟时间方式添加执行列队成员
     * @param {number} delayTime
     * @param callback
     * @return {Queue}
     */
    Queue.prototype.delay = function (delayTime, callback) {
        this.que.push([delayTime, callback]);
        this.run();
        return this;
    };

    /**
     * 持续时间方式添加执行列队成员
     * @param {number} duration
     * @param callback
     * @return {Queue}
     */
    Queue.prototype.duration = function (duration, callback) {
        duration = duration ? duration : 0;
        var surplus = this.que.length;
        if (surplus === 0) {
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

    /**
     * 数组形式，按两种方式添加列队
     * @param {string} type - 'duration' or 'delay'
     * @param {array} list
     * @return {Queue}
     */
    Queue.prototype.actionList = function (type, list) {
        if (!type || typeof type !== 'string' || (type !== 'duration' && type !== 'delay') ) {
            throw new Error('No type!');
        }
        if (!list || typeof list.length === 'undefined') {
            throw new Error('No action list!');
        }
        for (var i = 0; i < list.length; i++) {
            this[type](list[i][0], list[i][1]);
        }
        return this;
    };

    /**
     * 清除延迟列队并阻止计时
     * @return {Queue}
     */
    Queue.prototype.clean = function () {
        this.que = [];
        this.current = [0];
        this.atPlay = false;
        clearTimeout(this.timeout);
        return this;
    };

    /**
     * 暂停执行列队
     * @return {Queue}
     */
    Queue.prototype.pause = function () {
        this.atPause = true;
        return this;
    };

    /**
     * 从暂停恢复
     * @return {Queue}
     */
    Queue.prototype.continue = function () {
        if (this.atPause === true) {
            this.atPause = false;
            this.step();
        }
        return this;
    };

    /**
     * 执行动作
     * @return {Queue}
     */
    Queue.prototype.step = function () {
        var that = this;
        if (this.que.length > 0 && !this.atPause) {
            this.atPlay = true;
            this.current = this.que.shift();
            this.timeout = setTimeout(function () {
                that.current[1] && that.current[1]();
                that.step();
            }, this.current[0]);
        } else {
            this.atPlay = false;
        }
        return this;
    };

    /**
     * 启动
     * @return {Queue}
     */
    Queue.prototype.run = function () {
        if (!this.atPlay && !this.atPause) {
            this.atPlay = true;
            this.step();
        }
        return this;
    };

    return window.TimeQueue = Q

})(window);