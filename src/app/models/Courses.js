const mongoose = require("mongoose");
const slugify = require("slugify");
var mongooseDelete = require("mongoose-delete");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const Courses = new Schema(
  {
    _id: { type: Number },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    level: {
      type: String,
      default: "Cơ bản",
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  { 
    _id: false,
    timestamps: true },
);

// Tự tạo slug trước khi save
// Courses.pre("save", function (next) {
//   if (this.name) {
//     this.slug = slugify(this.name, {
//       lower: true,
//       strict: true,
//     });
//   }
// }
// );
Courses.pre("save", async function () {
  // tạo slug gốc
  const baseSlug = slugify(this.name, {
    lower: true,
    strict: true,
  });

  // kiểm tra đã tồn tại chưa
  const existingCourse = await mongoose.models.Courses.findOne({
    slug: baseSlug,
  });
  if (!existingCourse) {
    this.slug = baseSlug;
  } else {
    const randomString = Math.random().toString(36).substring(2, 8);
    this.slug = baseSlug + "-" + randomString;
  }
});

// custom query helper
Courses.query.sortable = function (req) {
      if (Object.prototype.hasOwnProperty.call(req.query, "_sort")) {
      // res.json({ message: "Sorting courses..." });
      const isValidtype = ["asc", "desc"].includes(req.query.type);
      return this.sort({
        // name: 'asc'
        [req.query.column]: isValidtype ? (req.query.type === "asc" ? 1 : -1) : 0,

      });
    }
    return this;
  };

  Courses.plugin(AutoIncrement, { id: "course_id_counter", inc_field: "_id" });
Courses.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("Courses", Courses);
