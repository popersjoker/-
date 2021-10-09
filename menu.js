$(function () {
    var $audio = $('audio');
    var player = new Player($audio);
    var lyric = null;
    var $p1 = $('.midder_in_right p').find('span');
    var $name = $('.time_show .names');
    var $time = $('.time_show .fn');
    var $alpum = $('.alpum');
    function creatli(dataList) {
        var $item = $('.item');
        $.each(dataList, function (index, ele) {
            var $newli = $('<li class="song">\
            <div class="input" >\
            </div > <div class="song_num">\
            '+ (parseInt(index) + 1) + '\
                                </div>\
            <div class="song_name">\
            '+ ele['name'
                ] + '\
                                    <div class="aset" style="float: right;">\
                                    <a href="javascript:;" class="small_play1"></a>\
                                    <a href="javascript:;"></a>\
                                    <a href="javascript:;"></a>\
                                    <a href="javascript:;"></a>\
                                </div>\
                            </div>\
            <div class="songer">\
            '+ ele['singer'
                ] + '\
                                </div>\
            <div class="song_time">\
                                <span>'+ ele['time'
                ] + '</span>\
                                <a href="javascript:;" title="删除" class="dels"></a>\
                            </div>\
                        </li >');
            $newli.get(0).index = index;
            $newli.get(0).music = ele;
            $newli.appendTo($('.list'));
          //  console.log(ele);
            //console.log(ele['time']);
        }
        );
    }

    function getPlayerList() {
        $.ajax({
            url: '/QQMusic/music_list.json',
            dataType: 'json',
            async: false,
            success: function (data) {
                player.musicList = data;
                creatli(data);
                $(".list").mCustomScrollbar();
            },
            error: function (error) {
                ////////console.log(error);
            }
        }
        );
    }

    getPlayerList();
    var $smallplayer = $('.aset a:nth-child(1)');
    var $div2 = $('.song div:nth-child(2)');
    function rightLoad(music) //歌曲信息加载
    {
        $p1.eq(0).text(music['name'
        ]);
        $p1.eq(1).text(music['singer'
        ]);
        $p1.eq(2).text(music['album'
        ]);
        $name.text(music['name'
        ]);
        $time.text(music['time'
        ]);
        $alpum.attr('src', '/QQMusic/' + music['cover'
        ]);
        var cos='url(' + music['cover']+')';
        console.log(cos);
        console.log(music);
    //   console.log(music['cover']+'url('+music['cover']+')');
        $('.mask_bg').css('backgroundImage','url(\''+music['cover']+'\')');
        console.log($('.mask_bg').css('backgroundImage')+"???");
    }
    var $song = $('.song');
    $song.hover(function () {
        $(this).find('.aset').stop().fadeIn(100); //条件display:none  
        $(this).find('.song_time span').stop(true).fadeOut(1000,
            "swing", $(this).find('.song_time a').stop(true).fadeIn(100));
    }, function () {
        $(this).find('.aset').stop().fadeOut(100); //条件display:none  
        $(this).find('.song_time span').stop(true).fadeIn(1000,
            "swing", $(this).find('.song_time a').stop(true).fadeOut(100));
    });
    $song.find('.input').on('click', function () {

        var $input = $(this);
        if ($input.text().trim())
            $input.html('');
        else $input.html('✓');
    });
    $('.item .input').click(function () {
        $song.find('.input').click();
        var $input = $(this);
        if ($input.text().trim())
            $input.html('');
        else $input.html('✓');
    });
    $('.prev').click(
        function () {
         var isp=player.prev();
		if(isp!=-1)
		playingMove(player.currentIndex,1);
        }
    );
	function playingMove(ind,isPlay)//播放时界面的改动
	
	{       //console.log("Preindex"+ind);
			if(isPlay)
			ind=player.changeIndex(ind);
			var $this=$smallplayer.eq(ind);
			var parent=$this.parents('.song').get(0);
			if(isPlay||player.playMusic(parent.index,parent.music)){
		    $lyric.css('bottom',0);
			//console.log("Index:"+ind);
			//console.log($(parent));
			//console.log(parent.music);
			//console.log("parent.index"+parent.index);
			LoadMusicLyric(parent.index);
			rightLoad(parent.music);
			 if ($playjs.hasClass('play2') == false) //如果不是播放状态将改为播放状态  hasClass返回true false
                $playjs.toggleClass('play2');
			}
			else 
			{
				$playjs.toggleClass('play2');
			}
		
 		$smallplayer.not($this).removeClass('small_play2');//小括号清除
       	$smallplayer.not($this).parents('.song').children('div:nth-child(2)').removeClass('song_num1');//数字清楚
		if (!(player.isend() && $this.hasClass('small_play2'))) //不合法不播放
        $this.toggleClass('small_play2');
        $this.parents('.song').children('div:nth-child(2)').toggleClass('song_num1');
		
	}
    $('.next').click(
        function () {
		var isp=player.next();
		if(isp!=-1)
		playingMove(player.currentIndex,1);
        }
    );
    var $lyric = $('.lyric');
    function LoadMusicLyric(index) {

        $lyric.empty();
        lyric = new Lyric('/QQMusic/' + player.musicList[index
        ][' link_lrc'
        ]);
        lyric.loadLyric(function () {
            //////console.log(lyric.tts);
            $.each(lyric.tts, function (index, ele) {
                $li = $('<li class="lyli">' + ele + '</li>');
                $lyric.append($li);
            });
        });
}
    LoadMusicLyric(0);
    //播放设置
    function timeFormate(time) {
        var m = Math.floor(time / 60); //min
        var s = Math.floor(time - m * 60);
        if (m < 10) m = '0' + m;
        if (s < 10) s = '0' + s;
        return m + ':' + s;
    }
    var $arrive = $('.true .arrive');
    var $be = $('.be');
    var $fn = $('.fn');
    //监听播放进度
    $audio.on('timeupdate', function () {
        var tot = player.getuDration();
        var currentTime = player.getCurrentTime();
        $arrive.css('width', (currentTime / tot * 100).toFixed(2) + '%');
        $be.text(timeFormate(currentTime));
        $fn.text(timeFormate(tot));
        if (player.isend()) {$('.playjs').click();$('.next').click();}
        var nowIndex1 = lyric.getIndex(currentTime);
        var $rt = $lyric.children().eq(nowIndex1);
        $rt.css('color', 'rgba(199,196,194,0.5)');
        $rt.siblings().css('color', ' rgba(49,194,124, 0.5)')
        if (nowIndex1) {
            $lyric.css({
                bottom: (nowIndex1 - 1) * 30
            });
        }
    });

    $('.true .point').on('mousedown', function () {
        var $parent = $(this).parent();

        $('html').on('mousemove', function (ev) {
            var Event = ev || event;
            var $tot = $parent.parent();
            var rate = Math.min(Math.round((Event.clientX - $parent.offset().left) / parseInt($tot.css('width')) * 100),
                100);
            if (rate < 0) rate = 0;
            player.setCurrentTime(rate * 0.01 * player.getuDration());
        });
        $('html').on('mouseup', function () {
            $('html').off('mousemove');
            $('html').off('mouseup');
        });
        return false;
    });
    //界面按钮互动
    var playMode0 = 0;
    var like0 = 0;
    var pure0 = 0;
    // var player.currentIndex = -1;
    var sound0 = 0; //0 正常 1静音
    $('.fake .point').on('mousedown', function () {
        var $parent = $(this).parent();
        $('html').on('mousemove', function (ev) {
            var Event = ev || event;
            var $tot = $parent.parent();
            var rate = Math.min(Math.round((Event.clientX - $parent.offset().left) / parseInt($tot.css('width')) * 100),
                100);
            $parent.css('width', rate + '%');
            if (rate < 0) rate = 0;
            if (rate == 0 && sound0 != 1 || sound0 == 1 && rate != 0) {
                $('.sounding i').click();
            }
            player.Volume(rate * 0.01);
        });
        $('html').on('mouseup', function () {
            $('html').off('mousemove');
            $('html').off('mouseup');
        });
        return false;
    });



    //底部功能区
    $('.playjs').on('click', function () {
        //应该与小按钮同步
        $smallplayer.eq(player.changeIndex(player.currentIndex)).click();
    });
    $('.modejs').on('click', function () {
        $(this).removeClass('play_mode' + (playMode0 + 1));
		var modePre=playMode0;
        playMode0 = (playMode0 + 1) % 4;
		//0 列表循环 1列表播放 2随机播放 3单曲循环
		if(modePre==2)//列表更新时更新li的music属性和index这时与音乐内容不匹配但无需显示
		{
			player.currentIndex=player.changeIndex(player.currentIndex);
			$.each($('.song'), function (index, ele) {
            $ele = $(ele);
            $ele.get(0).index = index;

        });
		}
		//console.log(player.currentIndex+"{{{}}}");
		player.Loop(false);
		player.resetList();
		player.listLoopPlay(false);
		//console.log(player.musicList);
		switch(playMode0)
		{
			case 0:player.listLoopPlay(true);break;
			case 1:break;
			case 2:
			player.listLoopPlay(true);
			player.randPlay();
			var rlist=player.changList;
			var $rsong=$('.song');
			for(var i=0;i<player.musicList.length;i++)
			$rsong.eq(rlist[i]).get(0).index=i;//更新歌曲列表的实际顺序
			player.currentIndex=$rsong.eq(player.currentIndex).get(0).index;
			break;
			case 3:player.Loop(true);break;
		}

        $(this).addClass('play_mode' + (playMode0 + 1));
    });
    $('.likejs').on('click', function () {
        $(this).removeClass('like_mode' + (like0 + 1));
        like0 = (like0 + 1) % 2;
        $(this).addClass('like_mode' + (like0 + 1));
    });
    $('.pruejs').on('click', function () {
        $(this).removeClass('prue_mode' + (pure0 + 1));
        pure0 = (pure0 + 1) % 2;
        $(this).addClass('prue_mode' + (pure0 + 1));
    });
    $('.sounding').delegate('i', 'click', function () {

        $(this).removeClass();
        sound0 = (sound0 + 1) % 2;
        if (sound0 == 1) {
            player.Volume(0.0);
        }
        $(this).addClass('sound_mode' + (sound0 + 1));
    });
    $('.list').delegate('.dels', 'click', function () {
        $Wsong = $(this).parents('.song');
        $Wsong.remove();
        var nowindex = $Wsong.get(0).index;//实际的索引值
        var ju=player.changeMusic(nowindex); 
        $smallplayer = $('.aset a:nth-child(1)');
		if(ju){
			$('.next').click();
		}
        $.each($('.song'), function (index, ele) {
            $ele = $(ele);
            $ele.get(0).index = index;
            $ele.children('.song_num').text('' + (index + 1));
        })
    });
    var $playjs = $('.playjs');
    $smallplayer.click(function () {
        var now = $smallplayer.index($(this));//点击项
       playingMove(now,0);
    });
    $smallplayer.eq(0).click();
    $('.toolbar span:nth-child(5)').click(

        function () {
            $('.song').remove();
        }
    );
    //默认静音
    player.Volume(0.0);
    $('.sounding i').click();
});