(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype =
    {
        constructor: Player,
        musicList: [],
        otherList: [],
        changList: [],
        patternRand: false,
        init: function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        currentIndex: -1
        ,
        playMusic: function (index, music) {
            if (index == this.currentIndex) {
                if (this.audio.paused)
                    this.audio.play();
                else this.audio.pause();
                return 0;
            }
            else {
                this.currentIndex = index;
                this.$audio.attr('src', '/QQMusic/' + music.link_url);
                this.audio.play();
                return 1;
            }
        }
        , changeMusic(index) {
            this.musicList.splice(index, 1);
            if (this.currentIndex > index) this.currentIndex--;
            else if (this.currentIndex == index) {
                this.currentIndex--;
                return true;
            }
            return false;

        }
        ,
        changeIndex(index) {
            if (this.patternRand)
                return this.changList[index];//获取当前索引值实际的音乐序号
            else return index;
        }
        , getuDration: function () {
            return this.audio.duration;
        }
        , getCurrentTime: function () {
            return this.audio.currentTime;
        }
        , setCurrentTime: function (time) {
            this.audio.currentTime = time;
        }
        , listLoopPlay:
            function (isp) {
                this.listLoop = isp;
            }
        , isend: function () {
            return this.audio.ended;
        }
        , Volume: function (v) {
            if (v != 0 && !v)//v==0 时为false
                return this.audio.volume;
            else this.audio.volume = v;
        }
        , Loop: function (lean) {
            this.audio.loop = lean;
        }, listLoopPlay:
            function (isp) {
                this.listLoop = isp;
            }
        , replaceList:
            function () {
                var tot = [];
                tot = this.musicList;
                this.musicList = this.otherList;
                this.otherList = tot;
            }
        , resetList:
            function () {
                if (!this.patternRand) return;
                this.patternRand = false;
                this.replaceList();
            }
        , randPlay: function () {
            this.patternRand = true;
            tot = [];
            this.otherList = [];
            this.changList = [];
            for (var i = 0; i < this.musicList.length; i++)tot.push(i);
            while (tot.length) {
                var rand = Math.round(Math.random() * (tot.length - 1));
                this.otherList.push(this.musicList[tot[rand]]);
                this.changList.push(tot[rand]);
                tot.splice(rand, 1);
            }
            //交换主副列表
            this.replaceList();
        }
        , next: function () {//顺序播放和列表循环播放
            if (this.currentIndex + 1 != this.musicList.length || this.listLoop) {
                if (this.currentIndex + 1 == this.musicList.length && this.listLoop)
                    this.currentIndex = -1;
                return this.playMusic(this.currentIndex + 1, this.musicList[this.currentIndex + 1]);
            }
            return -1;

        }
        , prev:
            function () {
                if (this.currentIndex)
                    return this.playMusic(this.currentIndex - 1, this.musicList[this.currentIndex - 1]);
                else return -1;
            }
        //css nowplayer 相当于 currentIndex
        , getSongTime:
            function (music_name) {
                this.$audio.attr('src', '/QQMusic/' + music_name);
                return this.getuDration();
            }

    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;

})(window);