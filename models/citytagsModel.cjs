var mongoose=require('mongoose');
var Schema=mongoose.Schema;

module.exports=mongoose.model('CityTags',new Schema({  
    tag:String
}));