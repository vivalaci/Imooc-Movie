var mongoose=require('mongoose');
var MoiveSchema=require('../schemas/movies');
var Movie=mongoose.model('Movie',MoiveSchema);

module.exports=Movie;