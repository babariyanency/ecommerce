const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentMethods = {
  values: ["cash", "card"],
  message: "enum validator failed for payment methods",
};
const orderSchema = new Schema(
  {
    items: { type: [Schema.Types.Mixed], require: true },
    totalAmount: { type: Number },
    totalItems: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethod: { type: String, require: true, enum: paymentMethods },
    paymentStatus: { type: String, default: "pending" },
    status: { type: String, default: "pending" },
    selectedAddress: { type: Schema.Types.Mixed, require: true },
  },
  { timestamps: true }
);
const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Order = mongoose.model("Order", orderSchema);
