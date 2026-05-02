const Courses = require("../models/Courses");
const { multipleMongooseToObject } = require("../../util/mongoose");

class MeController {
  // [GET] /me/stored/courses
  storedCourses(req, res, next) {
    let courseQuery = Courses.find({});
    Promise.all([
      courseQuery.sortable(req),
      Courses.countDocumentsDeleted()])
      .then(([courses, deletedCount]) => {
        res.render("me/stored-courses", {
          courses: multipleMongooseToObject(courses),
          deletedCount,
        });
      })
      .catch(next);
  }

  // [GET] /me/trash/courses
  trashCourses(req, res, next) {
    Courses.findDeleted({})
      .then((courses) => {
        // console.log(courses);
        res.render("me/trash-courses", {
          courses: multipleMongooseToObject(courses),
          deleted: req.query.deleted,
        });
      })
      .catch(next);
  }
}

module.exports = new MeController();
