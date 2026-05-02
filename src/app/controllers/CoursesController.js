const Courses = require("../models/Courses");
const { mongooseToObject } = require("../../util/mongoose");

class CoursesController {
  // [GET] /courses/:slug
  show(req, res, next) {
    Courses.findOne({ slug: req.params.slug })
      .then((course) => {
        // res.json(Courses);
        if (!course) return res.status(404).send("Course not found");
        res.render("courses/show", mongooseToObject(course));
      })
      .catch(next);
    // res.send("COURSE DETAIL: " + req.params.slug);
  }

  // async show(req, res, next) {
  //   try {
  //     const course = await Courses.findOne({
  //       slug: req.params.slug,
  //     }).lean();
  //     if (!course) {
  //       return res.status(404).send("Course not found");
  //     }
  //     res.render("courses/show", { course });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // [GET] /courses/create
  create(req, res, next) {
    res.render("courses/create");
  }
  // [POST] /courses/store -> lưu trữ dữ liệu từ form tạo mới
  store(req, res, next) {
    // res.json(req.body);
    const course = new Courses(req.body);
    course
      .save()
      .then(() => res.redirect("/me/stored/courses"))
      .catch(next);

    // res.send("Course created successfully");
  }

  // [GET] /courses/:id/edit
  edit(req, res, next) {
    // res.render("courses/edit");
    Courses.findById(req.params.id)
      .then((course) => {
        res.render("courses/edit", {
          course: mongooseToObject(course),
        });
      })
      .catch(next);
  }

  // [PUT] /courses/:id
  update(req, res, next) {
    // res.json(req.body);
    Courses.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/me/stored/courses"))
      .catch(next);
  }

  // [DELETE] /courses/:id (Soft delete)
  delete(req, res, next) {
    Courses.delete({ _id: req.params.id })
      .then(() => res.redirect("/me/stored/courses"))
      .catch(next);
  }

  // [PATCH] /courses/:id/restore
  restore(req, res, next) {
    Courses.restore({ _id: req.params.id })
      .then(() => res.redirect("/me/trash/courses"))
      .catch(next);
  }

  // [DELETE] /courses/:id/force
  forceDelete(req, res, next) {
    Courses.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("/me/trash/courses"))
      .catch(next);
  }

  // [POST] /courses/handel-form-actions
  handelFormActions(req, res, next) {
    switch (req.body.action) {
      case "delete":
        Courses.delete({ _id: { $in: req.body.coursesIds } })
          .then(() => res.redirect("/me/stored/courses"))
          .catch(next);
        break;
      default:
        res.json({ message: "Action is invalid!" });
    }
  }
}

module.exports = new CoursesController();
