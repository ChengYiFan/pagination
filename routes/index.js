//引入需要的模块
var express = require('express'),
	router = express.Router(),
	crypto = require('crypto'); //加密功能
	QuesList = require('../models/ques.js');
	PointList = require('../models/point.js');


//主页路由
router.get('/', function(req, res){
	// quesList.get(null, function(err, questionList){
	// 	if(err){
	// 		questionList = [];
	// 	}
		res.render('index',{
			title:'问答中心-我的问答',
			//questionList: questionList
		});
	// });
});

router.post('/queslist', function(req,res){
	var pagesize = req.body.pagesize,
		currentPage = req.body.pagenumber;
	QuesList.getByPage(pagesize,currentPage,function(err,quess){
		if(err){
			return res.redirect('/');
		}
		res.json(JSON.stringify(quess));
	});
});

router.post('/search', function(req,res){
	var key = req.body.key,pageSize = req.body.pageSize;
	QuesList.getByKey(key,pageSize,function(err,quess){
		if(err){
			return res.redirect('/');
		}
		res.json(JSON.stringify(quess));
	});
	

});

router.post('/quesPagelist',function(req,res){
	var pagesize = req.body.pagesize,
		currentPage = req.body.pagenumber;
	QuesList.getByPage2(pagesize,currentPage,function(err,obj){
		if(err){
			return res.redirect('/');
		}
		res.json(obj);
	});
});
module.exports = router;