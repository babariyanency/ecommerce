const { Category } = require("../model/Category");

exports.fatchCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
};


exports.createCategory = async(req, res) => {
  //this product we have to get from API body


  const category = new Category(req.body);
  console.log(category);
  try{
    const doc = await category.save();
    res.status(201).json(doc);
  } catch (err){
    res.status(400).json(err)
  }
  
};
