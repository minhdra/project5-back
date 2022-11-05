const Category = require('../models/Category');
const { ObjectId } = require('mongodb');

class CategoryController {
  // Get all
  search(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sort = req.body.sortName;
    const myQuery = {
      id: { $exists: true },
      category_name: { $regex: `.*${req.body.category_name}.*`, $options: 'i' },
      active: true,
    };

    Category.find(myQuery)
      .sort(sort ? { category_name: sort } : '')
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((categories) => res.json(categories))
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by id
  getById(req, res) {
    const myQuery = { _id: ObjectId(req.params._id), active: true };
    Category.findOne(myQuery)
      .then((category) => {
        if (category) return res.json(category);
        return res.status(404).json({
          message: 'Không tìm thấy',
        });
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Create
  create(req, res) {
    let category;
    Category.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        category = new Category({
          id: newId,
          category_name: req.body.category_name,
          description: req.body.description,
        });
        category.save((err) => {
          if (err) {
            return res.status(400).json({ message: 'Có lỗi xảy ra!' });
          } else {
            return res.status(200).json({ message: 'Cập nhật thành công!' });
          }
        });
      });
  }

  // update
  async update(req, res) {
    Category.findOne({ _id: ObjectId(req.body._id) })
      .then((category) => {
        if (!category)
          return res.status(404).json({ message: 'Không tìm thấy!' });
        category.category_name = req.body.category_name;
        category.description = req.body.description;
        category.save((err) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ message: 'Cập nhật thành công!' });
        });
      })
      .catch((err) => res.status(422).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    Category.findOne(myQuery)
      .then((category) => {
        if (category) {
          category.active = false;
          category.save((err) => {
            if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
            else
              return res
                .status(200)
                .json(`Successfully deleted category: ${category.name}`);
          });
        } else return res.status(404).json({ message: 'Không tìm thấy!' });
      })
      .catch((err) => res.status(404).json({ message: 'Có lỗi xảy ra!' }));
  }
}

module.exports = new CategoryController();
