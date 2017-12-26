var mongoose=require('mongoose');
var MoiveSchema=new mongoose.Schema({
    doctor:String,
    title:String,
    lan:String,
    country:String,
    summary:String,
    flash:String,
    poster:String,
    year:Number,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});

MoiveSchema.pre('save',function (next) {
    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now();
    }else {
        this.meta.updateAt=Date.now();
    }
    next()
});
MoiveSchema.statics={
    fetch:function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById:function (id,cb) {
        return this
            .findOne({_id:id})
            .exec(cb);
    }
};

module.exports=MoiveSchema;