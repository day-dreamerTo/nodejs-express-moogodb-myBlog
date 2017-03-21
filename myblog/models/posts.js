var Post = require('../lib/mongo').Post;
var marked = require('marked');
//把post的content从markdown转化成html
Post.plugin('contentToHtml',{
	afterFind:function(posts){
		return posts.map(function(post){
			post.content = marked(post.content);
			return post;
		})
	},
	afterFindOne:function(post){
		if(post){
			post.content = marked(post.content);
		}
		return post;
	}
});

module.exports = {
	create:function (post){
		return Post.create(post).exec();
	},
	//使用Populate可以实现在一个 document 中填充其他 collection(s) 的 document(s)。
	getPostById:function(postId){
		return Post
		   .findOne({_id:postId})
		   .populate({path:'author',model:'User'})
		   .addCreatedAt()
		   .contentToHtml()
		   .exec();
	},
	 // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
	 getPosts:function(author){
	 	var query = {};
	 	if(author){
	 		query.author = author;
	 	}
	 	return Post
	 		.find(query)
	 		.populate({path:'author',model:'User'})
	 		.sort({_id:-1})
	 		.addCreatedAt()
	 		.contentToHtml()
	 		.exec();
	 },
	 //通过文章id给pv加1  ???
     incPv:function(postId){
     	return Post
     		.update({_id:postId},{$inc:{pv:1}})
     		.exec();
     },
     // 通过文章 id 获取一篇原生文章（编辑文章）
     getRawPostById:function(postId){
     	return Post
     		.findOne({ _id :postId})
     		.populate({path: 'author',model:'User'})
     		.exec();
     },
     // 通过用户 id 和文章 id 更新一篇文章
     updatePostById:function(postId,author,data){
     	return Post.update({author:author,_id:postId},{$set:data}).exec();
     },
     // 通过用户 id 和文章 id 删除一篇文章
     delPostById:function(postId,author){
     	return Post.remove({author:author, _id:postId}).exec();
     }
};





