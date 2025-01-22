const mongoose = require("mongoose");
const {Schema} = mongoose

const productSchema = new Schema({
    title:{type:String,required:true,unique:true},
    description:{type:String,required:true},
    price:{type:Number,min:[0,'wrong minimum price'],max:[10000,'worng maximum price']},
    discountPercentage:{type:Number,min:[1,'wrong minimum discount'],max:[99,'worng maximum discount']},
    rating:{type:Number,min:[0,'wrong minimum rating'],max:[10000,'worng maximum rating'],default:0},
    stock:{type:Number,min:[0,'wrong minimum stock'],default:0},
    brand:{type:String,required:true},
    category:{type:String,required:true},
    thumbnail:{type:String,required:true},
    images:{type:[String],required:true},
    colors:{type:[Schema.Types.Mixed]},
    sizes:{type:[Schema.Types.Mixed]},
    highlights:{type:[String]},
    discountPrice:{type:Number},
    deleted:{type:Boolean,default:false},


})
const virtualId =productSchema.virtual('id')
virtualId.get(function(){
    return this._id
})
//we can't usinf the virtual fields better to make this field at time of doc creation
// const virtuaDiscountPrice =productSchema.virtual('discountPrice')
// virtuaDiscountPrice.get(function(){
//     return Math.round(this.price*(1-this.discountPercentage/100))
// })
productSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function(doc,ret){delete ret._id}
})

exports.Product  = mongoose.model('Product',productSchema)
