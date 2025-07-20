const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 500 },
  family_name: { type: String, required: true, maxLength: 500 },
  age: { type: String, required: true, maxLength: 100 },
  gender: { type: String, enum: ["male", "female"], required: true },
  height: { type: Number }, 
  weight: { type: Number },
  
  email_id: { type: String, required: true, maxLength: 500 },
  password: { type: String, required: true },
  dietary_preference: {type: String}, 
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  is_admin: {
    type: Boolean,
    required: true,
    default: false,
  },

},
{
    timestamps: true
});

// Virtual for author "full" name.
UserSchema.virtual("name").get(function () {
  return this.family_name + ", " + this.first_name;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
