 /* MongoDB query Design
- Store the array of each ancestor category in each category document.
- 

*/ 
var categorySchema = { // schema desidgned for the mongoDB query to build a tree like struct. 
	_id : { type: String},
	parent:{ // will refer to the parent category
		type: String,
		ref: 'Category' //reference to parent category
	},
	ancestors:[{  //array of all ancestors category, telling which subcategory this element belongs to
		type: String,
		ref: 'Category'
	}]
};

/* for eg. if you want to find all categories that are sub categories f electronics, then we have to run the query that finds 'Electronics'
in the array of ancestors like this: */ db.categories.find({ancestors : 'Electronics'});

/* Similarly to find categories that are child categories of phones :*/ db.categories.find({parent:'Phones'});

/* we can import schemas from other files just like we inmport javascript modules using */ var catergory = require('./catergory');
/* the contents of the category file will have an export function just like a node module */
/* following will export the schema that we defines earlier up there. */
module.exports = new mongoose.Schema(categorySchema); //plain old exporting of javascript schema
module.exports.categorySchema = categorySchema; // this is a mongoose schema, so that we can use it as a schema int he file we're importing it to.

// --- Code chunk that shows reusing the schema defined above in another schema file
var productSchema = {
	name: { type: String, required: true},
	pictures:[{ type: String, match: /^http:\/\//i}], //pictures must start with http.
	price:{
		amount:{ type: Number, required: true},
		currency:{
			type: String,
			enum: ['USD','EUR','GBP'],
			required: true
		}
	},
	category: Category.categorySchema // using category schema. remember that we have to import it into this file with var catergory = require('./catergory');
};

// =================
/* User schema Design */ 
// remmber, unlike previous schemas, in this schema, we have to hide user's cart and his oauth ID from other users.
module.exports = new mongoose.Schema({
	profile: {
		username:{
			type: String,
			required: true,
			lowercase: true
		},
		picture:{
			type: String,
			required: true,
			match: /^http:\/\//i
		}
	},
	data:{
		oauth: { type: String, required: true}, //allows login using facebook
		cart:[{
			product:{
				type:mongoose.Schema.Types.ObjectId //we can embed the product Ids to keep the track of products in user carts. Considering users will have max 10 items in the carts.
			},
			quantity:{
				type: Number,
				default: 1,
				min: 1
			}
		}]
		
	}
});

/* to control the access to the part of documents, mongoDB has a notion of 'Projections'
example of the projection is: */
db.users.findOne({}, {data:0})

/*and if you want to modify the user profile document and not allow user to modify certain feild like
oauth, we just have to point that function to the subdocument. like this: */
function.modifyUserProfile(user, profile, callback){
	user.profile = profile;
	user.save(function(error, user){
		//handle result+ 
	});
}

// CUSTOM SETTERS
// with custom setters, you can tell mongoose to execute a certain function every time a value of a certain feild is set. 
// every time someone sets the part of a sub-document, this function will be called.
//for example, for in productSchema, 
 price: {
    amount: { 
      type: Number,
      required: true,
      set: function(v) { //when someone sets the price.amount, this function is called.
        this.internal.approximatePriceUSD = //updates the internal.approximatePriceUSD value ti update it in price.amount
          v / (fx()[this.price.currency] || 1); // how does it calculate - takes the given price 'v' and devides it by the exchange rate. 
        return v;
      }
    },

  //internal.approximatePriceUSD  is a property of the product schema, and is on level with price, name etc in the document tree.
  internal: {
    approximatePriceUSD: Number
  }  


//REST - Representational State Transfer
// HTTP requests are usually made of several components. •Verb: Such as GET •Resourse: such as  /home •Optional JSON data: Also known as body
