# Node-Bog

## Setup

- `npm init` => tạo file `package.json`

- `npm install express`

- `npm install nodemon`

- `npm install morgan`

- `npm install handlebars`

- Static file và SCSS

- Prettier, lint-staged, husky => github

```bash
npm i prettier lint-staged husky --save-dev
```

**Prettier:** [Docs](https://prettier.io/docs/cli.html)

```bash
npm run beauty
```

**lint-staged:** `git status` => `git add` => `git status` => `npm run beauty`

**Husky:** chạy tự động trước mỗi commit

---

## Cài đặt MongoDB Compass

[https://www.mongodb.com/try](https://www.mongodb.com/try)

---

## Model trong MVC

Cài đặt mongoose:

```bash
npm install mongoose
```

[https://github.com/Automattic/mongoose](https://github.com/Automattic/mongoose)

Kết nối database — `src/config/db`:

```js
await mongoose.connect("mongodb://localhost:27017/blog-test");
```

Tạo model — `src/app/models/Courses`

## JSON Viewer / Route methods / App listen log / Resource path

## Read From DB

handlebarjs

## Courses Detail Page

Mongoosejs [](https://mongoosejs.com/docs/queries.html)

## Create new courses

[https://mongoosejs.com/docs/models.html#constructing-documents]

npm i mongoose-slug-generator (https://www.npmjs.com/package/mongoose-slug-generator) -> tự động tạo slug /model/Courses
-> KHÔNG tương thích với Mongoose 8

npm install slugify

## update courses

[https://handlebarsjs.com/guide/] -> đánh index hiện thị từ 1 (handlebarJS)

express-handlebar ->
`app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    helpers: {
     sum: (a, b) => a + b,
    },
  }),
);`

`<th scope="row">{{ sum @index 1 }}</th>`

method cần dùng PUT/PATCH -> [https://expressjs.com/en/resources/middleware/method-override.html]
npm install method-override
const methodOverride = require('method-override')
// override with POST having ?\_method=DELETE
app.use(methodOverride('\_method')

lưu lại vào db sau khi sửa -> mongoose: updateOne()

## Delete course

`          <a
            href="/courses/{{this._id}}/delete"
            class="btn btn-link"
            data-bs-toggle="modal"
            data-bs-target="#delete-course-modal"
            data-id="{{this._id}}"
          >Xóa</a>`

## soft delete

delete
restore
force delete

mongoose delete plugin: npm install mongoose-delete [https://github.com/dsanel/mongoose-delete]

soft delete -> khi xóa thêm 1 filed delete = true ? false
restore -> update -> PATCH chuyển trạng thái delete = true -> false
force -> xóa vĩnh viễn sử dụng deleteOne()

## Select all with check box 

xóa tất cả
khôi phục tất cả
xóa vĩnh viễn tất cả


## Sort middleware

a type = asc/ desc

Method Res.locals in Express

tấn công XSS   {{sortable "name" _sort}} thành {{{sortable "name" _sort}}}

thêm sortable sau 

-> xử lý khi nhiều request cùng 1 lúc tránh lỗi
upsert mongodb 
mongoose-sequence-github

 npm install --save mongoose-sequence
