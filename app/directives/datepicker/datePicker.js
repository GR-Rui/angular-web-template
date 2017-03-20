(function () {
    if (!window.Calendar || typeof (Calendar) !== "function") {

        var util = {

            /**
             * 处理小于10的数字前自动加0
             * @para num {num} int
             * return {string} '02'
             */
            formatNum: function (num) {
                if (num < 10) {
                    num = '0' + num;
                }

                return num;
            },

            /**
             * 连接年月日，连接符为`-`
             * return {string} yyyy-mm-dd
             */
            joinDate: function (year, month, day) {
                var formatNum = util.formatNum;

                return year + '-' + formatNum(month) + '-' + formatNum(day);
            },

            /**
             * 将格式化后日期转化为数字，便于日期计算
             * @para date {string|date object} yyyy-mm-dd|日期对象
             * return {string} yyyymmdd
             */
            dateToNum: function (date) {
                var rst = '';
                if (typeof date == 'string') {
                    rst = date.split('-').join('');
                } else {
                    rst = util.formatDate(date).split('-').join('');
                }

                return rst;
            },

            /**
             * 格式化日期对象
             * @para {date object} 日期对象
             * return {string} yyyy-mm-dd
             */
            formatDate: function (dateObj) {
                var year = dateObj.getFullYear(),
                    month = dateObj.getMonth() + 1,
                    day = dateObj.getDate();

                return util.joinDate(year, month, day);
            },

            formatMonth: function (date) {

                return date.substring(0, 8) + '01';
            },

            formatSeason: function (date) {
                var month = new Date(date).getMonth(), m;
                if (month < 3) {
                    m = '01';
                }
                else if (month >= 3 && month < 6) {
                    m = '04'
                }
                else if (month >= 6 && month < 9) {
                    m = '07'
                }
                else if (month >= 9) {
                    m = '10'
                }

                return date.substring(0, 4) + '-' + m + '-' + '01';
            },

            formatYear: function (date) {
               return new Date(date).getFullYear() + '-01-01';
            },

            getSeason: function (date) {
                var month = new Date(date).getMonth(), s;
                if (month < 3) {
                    s = 1;
                }
                else if (month >= 3 && month < 6) {
                    s = 2
                }
                else if (month >= 6 && month < 9) {
                    s = 3
                }
                else if (month >= 9) {
                    s = 4
                }

                return s;
            },

            getMonth: function (date) {
                return new Date(date).getMonth() + 1;
            },

            getCurDays: function (year, month) {
                month = parseInt(month, 10);
                var d = new Date(year, month, 0);
                return d.getDate();
            },

            /**
             * 获取当前日期的下一天
             * @para date {string|date object} yyyy-mm-dd|日期对象
             * @para num {int} 获取指定日期之后的几天
             * return {string} yyyy-mm-dd
             */
            getNextDate: function (date, num) {
                return util.formatDate(new Date(+new Date(date) + num * 86400000));
            },

            getNextMonth: function (date, num) {
                var year = new Date(date).getFullYear(),
                    month = new Date(date).getMonth() + 1;
                //d = new Date(date).getDate();
                month = month + num;
                year = year + Math.floor(month / 12);

                if (month % 12 == 0) {
                    year = year - 1;

                }

                if (month > 12) {
                    month = Math.abs(month % 12);
                }
                else if (month <= 0) {
                    month = 12 + month
                }
                return util.joinDate(year, month, 1);
            },

            getNextYear: function (date, num) {
                var year = new Date(date).getFullYear();
                return util.joinDate(year+num, 1, 1);
            },

            /**
             * 根据日期，获取一周的日期
             * @para date {string|date object} yyyy-mm-dd|日期对象
             * return {arry} yyyy-mm-dd[]
             */
            getWeekDates: function (date) {
                var cur = (new Date(date) ).getDay() - 1;
                if (cur == -1) {
                    cur = 6
                }
                var dateArr = [];
                for (var i = 0; i < 7; i++) {
                    var temp = new Date(1000 * 60 * 60 * 24 * (i - cur) + (new Date(date) ).getTime());
                    dateArr.push(util.formatDate(temp))
                }
                return dateArr;
            },

            getMonday: function (date) {
                return util.getWeekDates(date)[0];
            },

            getSunday: function (date) {
                return util.getWeekDates(date)[6];
            },
            getDateDiff: function (startDate, endDate) {
                var startTime = new Date(startDate).getTime();
                var endTime = new Date(endDate).getTime();
                return Math.abs((endTime - startTime)) / (1000 * 60 * 60 * 24);

            },
            hslToRgb: function (str) {
                var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
                var sColor = str.toLowerCase();
                if (sColor && reg.test(sColor)) {
                    if (sColor.length === 4) {
                        var sColorNew = "#";
                        for (var i = 1; i < 4; i += 1) {
                            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                        }
                        sColor = sColorNew;
                    }
                    //处理六位的颜色值
                    var sColorChange = [];
                    for (var i = 1; i < 7; i += 2) {
                        sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                    }
                    return "rgb(" + sColorChange.join(", ") + ")";
                } else {
                    return sColor;
                }

            }


        };

        var weekTpl = [
            '<ul class="week">',
            '<li>一</li>',
            '<li>二</li>',
            '<li>三</li>',
            '<li>四</li>',
            '<li>五</li>',
            '<li class="wk">六</li>',
            '<li class="wk">日</li>',
            '</ul>'
        ].join('');
        //
        // var tabTpl = [
        //   '<div class="tab">',
        //   '<span><select><option>全国</option></select>',
        //   '<span class="arrow-down"></span></span>',
        //
        //   '<span data-type="day">日</span>',
        //   '<span data-type="week">周</span>',
        //   '<span data-type="month">月</span>',
        //   '<span data-type="total">累计</span>',
        //   '</div>'
        // ].join('');

        var headerTpl = [
            '<div class="header">',
            '<p class="middle"><span class="previous-box"><a class="previous"></a></span><span class="ipt">',
            '<span>{%date%}</span></span><span class="next-box"><a class="next"></a></span></p>',
            '</div>'
        ].join('');

        var tpl = [
            '<div class="calendar-wrapper">',
            //     tabTpl,
            '<div class="content">',
            headerTpl,
            '<div class="calendar"></div>',
            '</div></div><div class="calendar-mask"></div>'
        ].join('');

        var daytpl = [
            '<div class="month">',
            '<div class="month-title"><span class="previous-box"><a class="previous"></a></span><span>{%date%}</span><span class="next-box"><a class="next"></a></span></div>',
            weekTpl,
            '<ul class="day">',
            '{%day%}',
            '</ul>',
            '</div>'
        ].join('');

        var monthtpl = [
            '<div class="month">',
            '<div class="month-title"><span class="previous-box"><a class="previous"></a></span><span>{%year%}</span><span class="next-box"><a class="next"></a></span></div>',
            '<ul class="day wh">',
            '{%month%}',
            '</ul>',
            '</div>'
        ].join('');

        var yeartpl = [
            '<div class="month">',
            '<ul class="day wh">',
            '{%year%}',
            '</ul>',
            '</div>'
        ].join('');


        var holidaysMap = [
            {
                name: '今天',
                date: [util.formatDate(new Date())]
            },
            {
                name: '明天',
                date: [util.formatDate(new Date(+new Date() + 86400000))]
            },
            {
                name: '后天',
                date: [util.formatDate(new Date(+new Date() + 2 * 86400000))]
            },
            {
                name: '圣诞节',
                date: ['2014-12-25', '2015-12-25', '2016-12-25', '2017-12-25', '2018-12-25', '2019-12-25', '2020-12-25']
            },
            {
                name: '情人节',
                date: ['2015-02-14', '2016-02-14', '2017-02-14', '2018-02-14', '2019-02-14', '2020-02-14']
            },
            {
                name: '元旦',
                date: ['2015-01-01', '2016-01-01', '2017-01-01', '2018-01-01', '2019-01-01', '2020-01-01']
            },
            {
                name: '除夕',
                date: ['2015-02-18', '2016-02-07', '2017-01-27', '2018-02-15', '2019-02-04', '2020-01-2']
            },
            {
                name: '春节',
                date: ['2015-02-19', '2016-02-08', '2017-01-28', '2018-02-16', '2019-02-05', '2020-01-25']
            },
            {
                name: '元宵节',
                date: ['2015-03-05', '2016-02-22', '2017-02-11', '2018-03-02', '2019-02-19', '2020-02-18']
            },
            {
                name: '清明节',
                date: ['2015-04-05', '2016-04-04', '2017-04-04', '2018-04-05', '2019-04-05', '2020-04-04']
            },
            {
                name: '五一',
                date: ['2015-05-01', '2016-05-01', '2017-05-01', '2018-05-01', '2019-05-01', '2020-05-01']
            },
            {
                name: '端午节',
                date: ['2015-06-20', '2016-06-09', '2017-05-30', '2018-06-18', '2019-06-07', '2020-06-25']
            },
            {
                name: '中秋节',
                date: ['2015-09-27', '2016-09-15', '2017-10-04', '2018-09-24', '2019-09-13', '2020-10-01']
            },
            {
                name: '国庆节',
                date: ['2015-10-01', '2016-10-01', '2017-10-01', '2018-10-01', '2019-10-01', '2020-10-01']
            }
        ];

        var Calendar = function (config) {
            this.defaultConfig = {
                /**
                 * 日历外层容器ID
                 * type {string|jq object} id字符串或jq对象
                 */
                el: '.container',

                /**
                 * 初始化日历显示个数
                 */
                count: 1,

                /**
                 * 用于初始化日历开始年月
                 * type {date object} 日期对象
                 */
                date: new Date(),

                /**
                 * 日期最小值，当小于此日期时日期不可点
                 * type {date object} 日期对象
                 */
                minDate: new Date(),

                /**
                 * 日期最大值，当大于此日期时日期不可点
                 * type {date object} 日期对象
                 */
                maxDate: new Date('9999-00-00'),  //日期对象

                /**
                 * 初始化当前选中日期，用于高亮显示
                 * type {date object} 日期对象
                 */
                selectDate: new Date(),

                /**
                 * 选中日期时日期下方文案
                 * type {string}
                 */
                selectDateName: '入住',

                /**
                 * 是否显示节假日
                 * type {boolean}
                 */
                isShowHoliday: true,

                scope: 'day',

                color: ''

            };

            this.config = $.extend({}, this.defaultConfig, config || {});
            this.el = ( typeof this.config.el === 'string' ) ? $(this.config.el) : this.config.el;

            this.init.call(this);
        };

        $.extend(Calendar.prototype, {
            init: function () {
                this._initDate();
                if (this.color) {
                    this._initCss();
                }
                this.createHeader(this.config.date);
                this._initRender();
                this._initEvent();
                this._toggleCal();
            },

            _initDate: function () {
                var config = this.config,
                    dateObj = config.date;

                //初始化日历年月
                this.year = dateObj.getFullYear();
                this.month = dateObj.getMonth() + 1;

                this.minDate = util.formatDate(config.minDate);
                this.maxDate = util.formatDate(config.maxDate);
                this.selectDate = util.formatDate(config.selectDate);
                this.showMonth = util.formatMonth(util.formatDate(config.selectDate));
                this.showYear = this.year;
                this.callBack = config.callBack;
                this.scope = config.scope;
                this.color = config.color;

            },

            _initCss: function () {
                var me = this, curCss, color = me.color,
                    ssl = document.styleSheets;

                var subcolor = me.color.substr(0, 3);
                if (subcolor != 'rgb' && subcolor != 'RGB') {
                    color = util.hslToRgb(me.color);
                }

                for (var i in ssl) {
                    if (ssl[i].cssRules[0].selectorText == '.calendar-wrapper') {
                        curCss = ssl[i];
                        break;
                    }
                }
                for (var j in curCss.cssRules) {
                    var ct = curCss.cssRules[j].cssText;
                    if (ct) {
                        if (ct.indexOf('rgb(251, 85, 88)') > -1) {
                            var styles = curCss.cssRules[j].style;
                            for (var m in styles) {
                                if (typeof styles[m] == 'string') {
                                    if (styles[m].indexOf('rgb(251, 85, 88)') > -1) {
                                        var style = curCss.rules[j].style[m];

                                        style = style.replace('rgb(251, 85, 88)', color);
                                        curCss.rules[j].style[m] = style;
                                        curCss.cssRules[j].style[m] = style;
                                    }
                                }
                            }
                            var curText = ct.replace('rgb(251, 85, 88)', color);
                            curCss.cssRules[j].cssText = curText;
                            curCss.rules[j].cssText = curText
                        }
                    }

                }

            },

            _initRender: function () {
                var date = new Date(this.selectDate),
                    year = date.getFullYear(),
                    month = date.getMonth() + 1;
                this.render(year, month);
                this.fill();
            },
            initRender: function () {
                this._initRender();
                this.afterSelected();
            },

            /**
             * 根据日期对象渲染日历
             * @para {date object} 日期对象
             */
            _renderForDay: function (year, month, isWeek) {
                var me = this,
                    tmpTplArr = [],
                    min = this.minDate,
                    max = this.maxDate;

                if (isWeek) {
                    var minDay = new Date(me.minDate).getDay();
                    var maxDay = new Date(me.maxDate).getDay();

                    if (minDay != 1) {
                        min = util.getMonday(me.minDate);
                    }
                    if (maxDay != 0) {
                        max = util.getSunday(me.maxDate);
                    }

                }
                var dateStr = month + '月',
                    dayList = this._getDayList(year, month, min, max);

                var curTpl = daytpl.replace('{%date%}', dateStr)
                    .replace('{%day%}', dayList);

                tmpTplArr.push(curTpl);
                this.el.find('.calendar').html(tmpTplArr.join(''));
            },

            _renderForWeek: function (year, month) {
                this._renderForDay(year, month, true)
            },
            _renderForMonth: function (year) {
                var me = this,
                    tmpArr = [],
                    yearStr = year + '年';

                for (var i = 1; i < 13; i++) {
                    var m = util.formatNum(i),
                        firstDay = year + '-' + m + '-' + '01',
                        lastDay = year + '-' + m + '-' + util.formatNum(util.getCurDays(year, m));
                    if (firstDay > me.maxDate || lastDay < me.minDate) {
                        tmpArr.push('<li class="iv" data-date="' + firstDay + '">' + i + '月</li>');
                    }
                    else {
                        tmpArr.push('<li data-date="' + firstDay + '">' + i + '月</li>');
                    }
                }
                var tmpTpl = monthtpl.replace('{%year%}', yearStr).replace('{%month%}', tmpArr.join(''))

                this.el.find('.calendar').html(tmpTpl);
            },
            _renderForSeason: function (year) {
                var me = this,
                    tmpArr = [],
                    yearStr = year + '年';

                for (var i = 0; i < 4; i++) {
                    var m = i * 3 + 1,
                        firstDay = year + '-' + util.formatNum(m) + '-' + '01',
                        lastDay = year + '-' + util.formatNum(m + 2) + '-' + util.formatNum(util.getCurDays(year, m + 2));
                    if (firstDay > me.maxDate || lastDay < me.minDate) {
                        tmpArr.push('<li class="iv" data-date="' + firstDay + '">第' + (i + 1) + '季度</li>');
                    }
                    else {
                        tmpArr.push('<li data-date="' + firstDay + '">第' + (i + 1) + '季度</li>');
                    }
                }
                var tmpTpl = monthtpl.replace('{%year%}', yearStr).replace('{%month%}', tmpArr.join(''))

                this.el.find('.calendar').html(tmpTpl);
            },
            _renderForYear: function () {
                var me = this,
                    tmpArr = [],
                    minYear = new Date(me.minDate).getFullYear(),
                    maxYear = new Date(me.maxDate).getFullYear();

                for (var i = minYear; i <= maxYear; i++) {
                    var firstDay = i + '-01-01';
                    tmpArr.push('<li data-date="' + firstDay + '">' +i + '年</li>');
                }
                var tmpTpl = yeartpl.replace('{%year%}', tmpArr.join(''));

                this.el.find('.calendar').html(tmpTpl);

            },
            _renderForAll: function () {
                this.el.find('.calendar').html('');
            },

            render: function (year, month) {

                //this.toggleTab();
                switch (this.scope) {
                    case 'day':
                        this._renderForDay(year, month);
                        break;
                    case 'week':
                        this._renderForWeek(year, month);
                        break;
                    case 'month':
                        this._renderForMonth(year);
                        break;
                    case 'season':
                        this._renderForSeason(year);
                        break;
                    case 'year':
                        this._renderForYear();
                        break;
                    case 'all':
                        this._renderForAll();
                        break;

                }

            },
            createHeader: function (date) {
                tpl = tpl.replace('{%date%}', util.formatDate(date));
                this.el.html(tpl);
            },
            _initEvent: function () {
                var me = this,
                    config = this.config;

                this.el.on('click', 'ul.day li', function (e) {
                    var curItem = $(this);
                    if (!curItem.hasClass('iv')) {
                        me.selectDate = curItem.data('date');
                        me.fill();
                        me.afterSelected();
                        me._toggleCal();
                    }
                    e.preventDefault();
                    e.stopPropagation()
                });

                this.el.on('click', '.previous-box,.next-box', function (e) {
                    var curItem = $(this);
                    if (curItem.parent('.month-title').length > 0) {
                        if (me.scope == 'month' || me.scope == 'season') {
                            if (curItem.hasClass('previous-box')) {
                                me.prevYear();
                            }
                            else {
                                me.nextYear();
                            }
                        }
                        else {
                            if (curItem.hasClass('previous-box')) {
                                me.prevMonth();
                            }
                            else {
                                me.nextMonth();
                            }
                        }
                    }
                    else {
                        var preStep,
                            nextStep;
                        switch (me.scope) {
                            case 'day':
                                if (curItem.hasClass('previous-box')) {
                                    preStep = util.getNextDate(me.selectDate, -1);
                                    me.selectDate = preStep;
                                }
                                else if (curItem.hasClass('next-box')) {
                                    nextStep = util.getNextDate(me.selectDate, 1);
                                    me.selectDate = nextStep;
                                }

                                break;
                            case 'week':
                                if (curItem.hasClass('previous-box')) {
                                    preStep = util.getNextDate(me.selectDate, -7);
                                    me.selectDate = preStep;
                                }
                                else if (curItem.hasClass('next-box')) {
                                    nextStep = util.getNextDate(me.selectDate, 7);
                                    me.selectDate = nextStep;
                                }
                                break;
                            case 'month':
                                if (curItem.hasClass('previous-box')) {
                                    preStep = util.getNextMonth(me.selectDate, -1);
                                    me.selectDate = preStep;
                                }
                                else if (curItem.hasClass('next-box')) {
                                    nextStep = util.getNextMonth(me.selectDate, 1);
                                    me.selectDate = nextStep;
                                }
                                break;
                            case 'season':
                                if (curItem.hasClass('previous-box')) {
                                    preStep = util.getNextMonth(me.selectDate, -3);
                                    me.selectDate = preStep;
                                }
                                else if (curItem.hasClass('next-box')) {
                                    nextStep = util.getNextMonth(me.selectDate, 3);
                                    me.selectDate = nextStep;
                                }
                                break;
                            case 'year':
                                if (curItem.hasClass('previous-box')) {
                                    preStep = util.getNextYear(me.selectDate, -1);
                                    me.selectDate = preStep;
                                }
                                else if (curItem.hasClass('next-box')) {
                                    nextStep = util.getNextYear(me.selectDate, 1);
                                    me.selectDate = nextStep;
                                }
                                break;
                        }
                        me.fill();
                        me.afterSelected();
                        me._hideCal();
                    }
                    e.preventDefault();
                    e.stopPropagation()

                });

                // this.el.on('click', '.tab span', function (e) {
                //   $('.tab span').removeClass('selected');
                //   $(this).addClass('selected');
                //   me.scope = $(this).attr('data-type');
                //   me.initRender
                // });

                this.el.on('click', '[class^=arrow-]', function (e) {
                    me.toggleArrow($(this))
                });

                this.el.on('click', '.ipt', function (e) {
                    if (me.scope != 'all') {
                        me._toggleCal();
                    }
                });

                $('body').on('click', function (e) {
                    var t = $(e.target);
                    if (t.closest('.calendar-wrapper .content').length == 0 && !t.hasClass('previous-box') && !t.hasClass('next-box')) {
                        me._hideCal()
                    }
                });

            },

            fill: function () {
                switch (this.scope) {
                    case 'day':
                        this._setSelectDate();
                        this._updateHeaderForDate();
                        break;
                    case 'week':
                        this._setSelectWeek();
                        this._updateHeaderForWeek();
                        break;
                    case 'month':
                        this._setSelectMonth();
                        this._updateHeaderForMonth();
                        break;
                    case 'season':
                        this._setSelectSeason();
                        this._updateHeaderForSeason();
                        break;
                    case 'year':
                        this._setSelectYear();
                        this._updateHeaderForYear();
                        break;
                    case 'all':
                        this._updateHeaderForAll();
                        break;
                }

            },
            _updateHeaderForDate: function () {
                var date = this.selectDate,
                    tpl = '<span id="date">' + date + '</span>',
                    $title = this.el.find('.ipt');
                $title.html(tpl);
                if (date == this.minDate) {
                    $title.siblings('.previous-box').hide();
                }
                else {
                    $title.siblings('.previous-box').css('display', 'inline-block');
                }
                if (date == this.maxDate) {
                    $title.siblings('.next-box').hide();
                }
                else {
                    $title.siblings('.next-box').css('display', 'inline-block');
                }

            },
            _updateHeaderForWeek: function () {
                var date = this.selectDate,
                    sunday = util.getSunday(date),
                    tpl = '<span id="date">' + date + '~' + sunday + '</span>',
                    $title = this.el.find('.ipt');
                $title.html(tpl);

                if (date <= this.minDate) {
                    $title.siblings('.previous-box').hide();
                }
                else {
                    $title.siblings('.previous-box').css('display', 'inline-block');
                }
                if (sunday >= this.maxDate) {
                    $title.siblings('.next-box').hide();
                }
                else {
                    $title.siblings('.next-box').css('display', 'inline-block');
                }
            },
            _updateHeaderForMonth: function () {
                var date = this.selectDate,
                    month = new Date(date).getMonth() + 1,
                    tpl = '<span id="date">' + month + '月' + '</span>',
                    $title = this.el.find('.ipt');
                $title.html(tpl);
                if (date == util.formatMonth(this.minDate)) {
                    $title.siblings('.previous-box').hide();
                }
                else {
                    $title.siblings('.previous-box').css('display', 'inline-block');
                }
                if (date == util.formatMonth(this.maxDate)) {
                    $title.siblings('.next-box').hide();
                }
                else {
                    $title.siblings('.next-box').css('display', 'inline-block');
                }
            },
            _updateHeaderForSeason: function () {
                var date = this.selectDate,
                    year = new Date(date).getFullYear(),
                    season = util.getSeason(date),
                    tpl = '<span id="date">' + year + '年第' + season + '季度' + '</span>',
                    $title = this.el.find('.ipt');
                $title.html(tpl);
                if (date == util.formatSeason(this.minDate)) {
                    $title.siblings('.previous-box').hide();
                }
                else {
                    $title.siblings('.previous-box').css('display', 'inline-block');
                }
                if (date == util.formatSeason(this.maxDate)) {
                    $title.siblings('.next-box').hide();
                }
                else {
                    $title.siblings('.next-box').css('display', 'inline-block');
                }
            },
            _updateHeaderForYear: function () {
                var date = this.selectDate,
                    year = new Date(date).getFullYear(),
                    tpl = '<span id="date">' + year + '年</span>',
                    $title = this.el.find('.ipt');
                $title.html(tpl);
                if (date == util.formatYear(this.minDate)) {
                    $title.siblings('.previous-box').hide();
                }
                else {
                    $title.siblings('.previous-box').css('display', 'inline-block');
                }
                if (date == util.formatYear(this.maxDate)) {
                    $title.siblings('.next-box').hide();
                }
                else {
                    $title.siblings('.next-box').css('display', 'inline-block');
                }
            },
            _updateHeaderForAll: function () {
                var minDate = this.minDate,
                    maxDate = this.maxDate,
                    tpl = '<span id="date">' + minDate + '~' + maxDate + '</span>',
                    $title = this.el.find('.ipt');
                $title.html(tpl);
                $title.siblings('.next-box').hide();
                $title.siblings('.previous-box').hide();
            },


            /**
             * 根据当前年月，获取日期列表html字体串
             * @para year {int} eg: 2014 YYYY
             * @para month {int} eg: 12 MM/M
             * @return {string}
             */
            _getDayList: function (year, month, min, max) {
                var me = this,
                    config = this.config,

                    days = new Date(year, month, 0).getDate(),
                    firstDay = Math.abs(new Date(year, month - 1, 1).getDay()),

                    dateToNum = util.dateToNum,
                    joinDate = util.joinDate,

                    tmpEptArr = [],
                    tmpDayDataArr = [],
                    tmpDayTplArr = [];

                //如果是星期天
                if (firstDay == 0) {
                    firstDay = 7;
                }

                //插入空白字符
                for (var i = 0; i < firstDay - 1; i++) {
                    tmpEptArr.push('<li class="ept"></li>');
                }


                for (var i = 0; i < days; i++) {
                    var day = i + 1,
                        date = joinDate(year, month, day),
                        wkDay = new Date(date).getDay(),
                        dateNum = dateToNum(date),
                        jrClassName = 'jr';

                    //默认不做任何处理
                    tmpDayDataArr.push({
                        class: '',
                        date: date,
                        day: day,
                        name: ''
                    });

                    //双休单独标注出
                    if (wkDay == 6 || wkDay == 0) {
                        jrClassName = 'jr wk';
                        tmpDayDataArr[i]['class'] = 'wk';
                    }

                    //不在指定范围内的日期置灰
                    if (( min && dateNum < dateToNum(min) ) ||
                        ( max && dateNum > dateToNum(max) )
                    ) {
                        jrClassName = 'iv';
                        tmpDayDataArr[i]['class'] = 'iv';
                    }

                    //节假日处理
                    if (config.isShowHoliday) {
                        for (var k = 0, hlen = holidaysMap.length; k < hlen; k++) {
                            var name = holidaysMap[k]['name'],
                                dateArr = holidaysMap[k]['date'];

                            for (var j = 0, len = dateArr.length; j < len; j++) {
                                var item = dateArr[j];

                                if (dateNum == dateToNum(item)) {
                                    tmpDayDataArr[i]['class'] = jrClassName;
                                    tmpDayDataArr[i]['day'] = name;
                                    break;
                                }
                            }
                        }
                    }

                    //初始化当前选中日期状态
                    if (config.selectDate) {
                        if (me.scope == 'day') {
                            if (dateNum == dateToNum(me.selectDate)) {
                                tmpDayDataArr[i]['class'] += ' cur';
                            }
                        }
                        else if (me.scope == 'week') {
                            var monday = dateToNum(util.getMonday(me.selectDate)),
                                sunday = dateToNum(util.getSunday(me.selectDate));


                            if (dateNum == monday) {
                                tmpDayDataArr[i]['class'] += ' wk-l';
                            } else if (dateNum == sunday) {
                                tmpDayDataArr[i]['class'] += ' wk-r';
                            } else if (dateNum < sunday && dateNum > monday) {
                                tmpDayDataArr[i]['class'] += ' wk-m';
                            }
                        }
                    }

                }

                //生成日期模板字符串
                for (var i = 0, len = tmpDayDataArr.length; i < len; i++) {
                    var item = tmpDayDataArr[i];
                    tmpDayTplArr.push(
                        '<li class="' + item.class + '" data-date="' + item.date + '">' +
                        '<i>' + item.day + '</i><i>' + item.name + '</i>' +
                        '</li>'
                    );
                }

                return tmpEptArr.concat(tmpDayTplArr).join('');
            },


            /**
             * 设置选中日期格式
             * @para {date object|date string} YYYY-MM-DD
             */

            _setSelectDate: function (flag) {
                var me = this,
                    curSltItem,
                    thisSltItem,
                    str = '',
                    //config = this.config,
                    date = ( typeof me.selectDate == 'string' ) ? me.selectDate : util.formatDate(me.selectDate),

                    lastSltItem;

                //先移到上次选中日期高亮
                if (flag == 'w') {
                    lastSltItem = this.el.find('li.wk-l,li.wk-r,li.wk-m');
                    if (lastSltItem.length) {
                        lastSltItem.removeClass('wk-l').removeClass('wk-r').removeClass('wk-m');
                    }
                }
                else if (flag == 'm') {
                    lastSltItem = this.el.find('li.mt');
                    if (lastSltItem.length) {
                        lastSltItem.removeClass('mt');
                    }
                }

                else {
                    lastSltItem = this.el.find('li.cur');
                    if (lastSltItem.length) {
                        var lastDateNameEl = $(lastSltItem.find('i')[1]);
                        lastSltItem.removeClass('cur');
                        if (!lastSltItem.hasClass('jr')) {
                            lastSltItem.removeClass('dl');
                            lastDateNameEl.text('');
                        }
                    }
                }


                //选择一周
                if (flag == 'w') {

                    str = 'li[data-date="{%d%}"]';
                    var arr = util.getWeekDates(date);
                    curSltItem = me.el.find(str.replace('{%d%}', arr[0]));
                    if (curSltItem.length) {
                        curSltItem.addClass('wk-l')
                    }
                    curSltItem = me.el.find(str.replace('{%d%}', arr[6]));
                    if (curSltItem.length) {
                        curSltItem.addClass('wk-r')
                    }
                    arr.shift();
                    arr.pop();
                    arr.forEach(function (date) {
                        curSltItem = me.el.find(str.replace('{%d%}', date));
                        if (curSltItem.length) {
                            curSltItem.addClass('wk-m')
                        }
                    });

                }

                else {
                    curSltItem = this.el.find('li[data-date="' + date + '"]');
                    if (curSltItem.length) {
                        if (flag == 'm') {
                            curSltItem.addClass('mt');
                        } else {
                            curSltItem.addClass('cur');
                        }
                    }
                }


            },
            _setSelectWeek: function () {
                this.selectDate = util.getMonday(this.selectDate)
                this._setSelectDate('w')
            },

            _setSelectMonth: function () {
                this.selectDate = util.formatMonth(this.selectDate);
                this._setSelectDate('m')
            },

            _setSelectSeason: function () {
                this.selectDate = util.formatSeason(this.selectDate);
                this._setSelectDate('m')
            },
            _setSelectYear: function () {
                this.selectDate = util.formatYear(this.selectDate);
                this._setSelectDate('m')
            },

            _toggleCal: function () {
                var cal = this.el.find('.calendar'),
                    mask = this.el.find('.calendar-mask'),
                    display = cal.css('display');
                if (display == 'none') {
                    cal.show();
                    mask.show();
                }
                else {
                    cal.hide();
                    mask.hide();
                }
            },

            _hideCal: function () {
                this.el.find('.calendar').hide();
                this.el.find('.calendar-mask').hide();

            },

            nextMonth: function () {
                this.showMonth = util.getNextMonth(this.showMonth, 1);
                var year = new Date(this.showMonth).getFullYear(),
                    month = new Date(this.showMonth).getMonth() + 1;
                this.render(year, month);
                this.fill();
            },

            prevMonth: function () {
                this.showMonth = util.getNextMonth(this.showMonth, -1);
                var year = new Date(this.showMonth).getFullYear(),
                    month = new Date(this.showMonth).getMonth() + 1;
                this.render(year, month);
                this.fill();

            },
            prevYear: function () {
                this.showYear = parseInt(this.showYear) - 1;
                this.render(this.showYear);
                this.fill();
            },
            nextYear: function () {
                this.showYear = parseInt(this.showYear) + 1;
                this.render(this.showYear);
                this.fill();

            },
            toggleArrow: function ($this) {
                if ($this.hasClass('arrow-up')) {
                    $this.removeClass('arrow-up').addClass('arrow-down');
                } else {
                    $this.removeClass('arrow-down').addClass('arrow-up');
                }

            },
            toggleTab: function () {
                this.el.find('.tab span').removeClass('selected');
                this.el.find('.tab span[data-type=' + this.scope + ']').addClass('selected')
            },
            afterSelected: function () {
                var data = {};
                data.date = this.selectDate;
                data.scope = this.scope;
                this.callBack(data);
            }
        });

        window.Calendar = Calendar;
    }
})();
