
(function (window) {
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }

    Lyric.prototype =
    {
        lyricList: [],
        timeList: [],
        tts: [],
        path: "",
		index:0,
        parseNumber:
            function (time) {
                var t = time.split(':');
				//console.log(t);
                var m = parseInt(t[0]) * 60;
                var su = +parseFloat(t[1]).toFixed(2);
                return +Number(m+su).toFixed(2);
            },
		getIndex:
		function(time)
		{
		if(time>=this.timeList[this.index]){
			while(time>this.timeList[this.index+1]&&this.index<this.timeList.length)this.index++;
		}
		else 
		{
			while(time<this.timeList[this.index-1])this.index--;
		}
		return this.index;		
		},
		
        parseLyric: function (data) {
            this.lyricList = data.split('\n');
            this.timeList = new Array(); console.log(typeof this.timeList);
            var $this = this;
            var tt = $.map(this.lyricList, function (ele) {
				var ttys = ele.substring(ele.lastIndexOf(']') + 1, ele.length);
                var t = ele.match(/\d\d+:\d\d\.\d\d/);
                if (t != null&&ttys!="")
                    $this.timeList.push($this.parseNumber(t[0]));
                return ttys.trim()== "" ? null : ttys;
            });
            this.tts = tt;
            console.log(this.timeList);
			console.log(this.tts);
        },
        init: function (path) {//可变
            this.path = path;
        },
        loadLyric: function (Callback) {
            var $this = this;
            $.ajax({
                url: this.path,
                data: '',
                success: function (data) {
                    $this.parseLyric(data);
                    Callback();
                },
                error: function (e) {
                    console.log(e);
                }
            }//请求json
            )
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;

})(window);