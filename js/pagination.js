/**
* 分页插件
* @author:Cynthia
*/
var pagination = (function($){
	var options = {
		$container : null,
		totalCount : 0, //数据显示总条数
		totalPage  : 0, //总页数
		pageSize   : 6, //页面大小
		currentPage: 1, //当前页默认1
 		prevContent: '<',     //上一页内容
 		nextContent: '>',     //下一页内容
 		isJump     : true,    //是否跳转到指定页数
 		shiftingLeft:2,       //当前页左侧保留项
 		shiftingRight:2,      //当前页右侧保留项
 		preLeast:1,           //向前翻页保留项 
 		nextLeast:1,          //向后翻页保留项
 		url: "http://192.168.6.228:8008/quesPagelist",  //ajax url
 		dataType   :"json",
 		success:null,   //ajax success callback
 		error:function(){alert('请求出错，请重新请求！');}
	},
	classes = {
		preCls     : 'pre',  //上一页class
 		nextCls    : 'next',  //下一页class
 		activeCls  : 'active',// 当前页选中状态
 		jumpCls    : 'goto',   //跳转块样式
 		jumpBtnCls : 'goto-btn'//跳转按钮class
	},
	commonHtmlText = {
		createSpan    : '<span class="{0}">{1}</span>',
		pageIndexHtml : '<a href="javascript:;" class="{0}">{1}</a>',
		rightHtml : '<span class="'+classes.jumpCls+'">共{0}页，跳转至 <input type="text" id="gotoinput" value=""><a href="javascript:;" class="'+classes.jumpBtnCls+'">GO</a></span>'
	},
	getTotalPage,
	createIndexHtml,
	createSpanHtml,
	createPreBtn,
	createNextBtn,
	createIndexBtn,
	renderHtml,
	doPageData,eBind,
	stringFormat,
	initModule;

	//获取总页数
	getTotalPage = function(){
		if(options.totalCount >0){
			var pagesize = options.pageSize;
			options.totalPage = Math.floor((options.totalCount+pagesize-1)/pagesize);
		}
	};
	//创建分页导航目录html
	createIndexHtml = function(cls,content){
		return stringFormat(commonHtmlText.pageIndexHtml,cls,content);
	};
	createSpanHtml = function(cls,content){
		return stringFormat(commonHtmlText.createSpan,cls,content);
	};
	//创建上一页按钮
	createPreBtn = function(){
		if(options.currentPage == 1){
			//pre不可用
			return createSpanHtml("pre",options.prevContent);
		}else{
			//pre可用
			return createIndexHtml("pre",options.prevContent);
		}
	}
	//创建下一页按钮
	createNextBtn = function(){
		if(options.currentPage == options.totalPage){
			//next不可用
			return createSpanHtml("next",options.nextContent);
		}else{
			//next可用
			return createIndexHtml("next",options.nextContent);
		}
	};
	//创建分页导航目录标签按钮
	createIndexBtn = function(){
		/**
		 *前：当前页 > 偏移量+至少保留+1
		 *后：当前页 < 总页码-偏移量-至少保留
		 */
		var leftStart = options.shiftingLeft + options.preLeast + 1,
			rightStart = options.totalPage - options.shiftingRight - options.nextLeast - 1,
			cp = options.currentPage,
			html = '<span class="paginate-list">';
		if(cp > leftStart){
			for(var i = 1;i <= options.preLeast; i++){
				html += createIndexHtml("",i);
			}
			html +="<em>···</em>";
			for(var i = cp - options.shiftingLeft; i < cp; i++){
				html += createIndexHtml("",i);
			}
		}else{
			for(var i = 1; i < cp; i++){
				html += createIndexHtml("",i);
			}
		}
		html += createSpanHtml("active",cp);
		if(cp <= rightStart){
			for(var i = cp + 1; i < cp + options.shiftingRight + 1; i++){
				html += createIndexHtml("",i);
			}
			html +="<em>···</em>";
			for(var i = options.totalPage-options.nextLeast+1; i<= options.totalPage;i++){
				html += createIndexHtml("",i);
			}
		}else{
			for(var i = cp + 1; i<=options.totalPage; i++){
				html += createIndexHtml("",i);
			}
		}
		html += '</span>';
		return html;
	};
	//将处理过的html添加到分页容器中
	renderHtml = function(){
		var html = createPreBtn()+createIndexBtn()+createNextBtn(),
			rightHtml = stringFormat(commonHtmlText.rightHtml, options.totalPage);
		options.$container.html(html).append(rightHtml);
	};
	//获取分页数据
	doPageData = function(){
		$.ajax({
			type: "post",  
		    url: options.url,  
		    data:{pagesize: options.pageSize, pagenumber: options.currentPage},
		    dataType:options.dataType,
		    success:function(data){
		    	options.success(data.items);
		    	//后台返回数据格式{"total":20,"items":[]}
		    	//console.log(data.total);
		    	options.totalCount = ~~data.total;
		    	getTotalPage();
		    	if(options.totalCount > 0 && options.currentPage > 0){
		    		renderHtml();
		    	}
		    }
		});
	};
	//绑定事件
	eBind = function(){
		var con = options.$container,
			pre = con.find('.'+classes.preCls),
			next = con.find('.'+classes.nextCls),
			pagelist = con.find('.paginate-list a'),
			jumpbtn = con.find('.'+classes.jumpBtnCls);
		pre.live('click',function(){
			options.currentPage--;
			if(options.currentPage>0){
				doPageData();
			}
			return false;
		});
		next.live('click',function(){
			options.currentPage++;
			if(options.currentPage<= options.totalPage){
				doPageData();
			}
			return false;
		});
		pagelist.live('click',function(){
			var page = ~~$(this).text();
			options.currentPage = page;
			doPageData();
			return false;
		});
		jumpbtn.live('click',function(){
			var oIpt = con.find('#gotoinput'), pageIndex = ~~oIpt.val();
			if(oIpt.val() != "" && !isNaN(oIpt.val())){
				if(pageIndex >0 && pageIndex <= options.totalPage){
					options.currentPage = pageIndex;
					doPageData();
				}else if(pageIndex <= 0){
					options.currentPage = 1;
					doPageData();
				}else if(pageIndex > options.totalPage){
					options.currentPage = options.totalPage;
					doPageData();
				}
			}else{
				oIpt.focus();
			}
			return false;
		});
	};

	//格式化字符串
	stringFormat = function(){
		if(arguments.length == 0){
			return null;
		}
		var str = arguments[0];
		for(var i=1; i<arguments.length; i++){
			var reg = new RegExp('\\{' +(i-1)+ '\\}', 'gm');
			str = str.replace(reg,arguments[i]);
		}
		return str;
	};
	//初始化
	initModule = function(opts){
		options = $.extend(options, opts);
		doPageData();
		eBind();
	};
	return {initModule:initModule};
})(jQuery);