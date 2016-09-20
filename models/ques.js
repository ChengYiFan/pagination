var mongodb = require('./db');

function Ques(avatar,source,title,summary){
	this.avatar = avatar;
	this.source = source;
	this.title = title;
	this.summary = summary;
};

module.exports = Ques;

Ques.getAll = function getAll(callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('ques',function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			collection.find(query).toArray(function(err, docs){
				mongodb.close();
				if(err){
					callback(err, null);
				}
				var quess = [];
				docs.forEach(function(doc, index){
					var ques = new Ques(doc.avatar,doc.source,doc.title,doc.summary);
					quess.push(ques);
				});
				callback(null,quess);
			});
		});
	});
};
Ques.getByPage = function(pagesize,currentPage,callback){
	var skip = pagesize*(currentPage-1);
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('ques',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			collection.find(query).sort({ObjectId:-1}).skip(skip).limit(~~pagesize).toArray(function(err,docs){
				mongodb.close();
				if(err){
					callback(err,null);   
				}
				var quess = [];
				if(docs.length <=0){
					callback(err,null);
				}
				docs.forEach(function(doc,index){
					var ques = new Ques(doc.avatar,doc.source,doc.title,doc.summary);
					quess.push(ques);
				});
				callback(null,quess);
			});
		});
	});
};
Ques.getByPage2 = function(pagesize,currentPage,callback){
	var skip = pagesize*(currentPage-1);
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		var query = {};
		//使用count 返回特定查询的文档数 total
		db.collection('ques',function(err,collection){
			collection.count(query,function(err,total){
				collection.find(query).sort({ObjectId:-1}).skip(skip).limit(~~pagesize).toArray(function(err,docs){
					mongodb.close();
			        if (err) {
			           return callback(err);
			        }
					var quess = [];
					if(docs.length <=0){
						callback(err,null);
					}
					docs.forEach(function(doc,index){
						var ques = new Ques(doc.avatar,doc.source,doc.title,doc.summary);
						quess.push(ques);
					});
					callback(null,{total:total,items:quess});
				});
			});
		});
	});
};
Ques.getByKey = function(key,pageSize,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('ques',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if (key) {    //如果有搜索请求就增加查询条件
			   //用正则表达式得到的pattern对title属性进行模糊查询
			   //这里是搜集合里title属性包含str串的所有结果
			   var pattern = new RegExp("^.*"+key+".*$");
			   query.title = pattern;
			}
			collection.find(query).sort({ObjectId:-1}).limit(~~pageSize).toArray(function(err,docs){
				mongodb.close();
				if(err){
					callback(err,null);   
				}
				var quess = [];
				if(docs.length <=0){
					callback(null,quess);
				}
				docs.forEach(function(doc,index){
					var ques = new Ques(doc.avatar,doc.source,doc.title,doc.summary);
					quess.push(ques);
				});
				callback(null,quess);
			});
		});
	});
};
