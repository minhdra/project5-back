const Category = require('../models/Category');
const { ObjectId } = require('mongodb');
const CategorySub = require('../models/CategorySub');

class CategoryController {
  // Get all
  search(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sort = req.body.sortName;
    const myQuery = {
      id: { $exists: true },
      category_name: {
        $regex: `.*${req.body.category_name ?? ''}.*`,
        $options: 'i',
      },
      active: true,
    };

    Category.find(myQuery)
      .sort(sort ? { category_name: sort } : '')
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((categories) => res.json(categories))
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get all for menu
  async searchForMenu(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sort = req.body.sortName;
    const myQuery = {
      id: { $exists: true },
      category_name: {
        $regex: `.*${req.body.category_name ?? ''}.*`,
        $options: 'i',
      },
      active: true,
    };

    Category.aggregate([
      { $match: myQuery },
      {
        $lookup: {
          from: 'sub_categories',
          localField: 'id',
          foreignField: 'category',
          as: 'subs',
        },
      },
    ]).then((categories) => {
      if (categories && categories?.length > 0)
        categories.forEach((category) =>
          category.subs = category.subs.filter(c => c.active)
        )
      
      return res.json(categories);
    });
  }

  // Get by path
  getByPath(req, res) {
    const myQuery = {
      id: { $exists: true },
      path: {
        $regex: `.*${req.body.path}.*`,
        $options: 'i',
      },
      active: true,
    };

    Category.aggregate([
      { $match: myQuery },
      {
        $lookup: {
          from: 'sub_categories',
          localField: 'id',
          foreignField: 'category',
          as: 'subs',
        },
      },
    ]).then((categories) => {
      if (categories && categories?.length > 0)
        categories.forEach((category) =>
          category.subs = category.subs.filter(c => c.active)
        )
      
      return res.json(categories[0]);
    });
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
        category = new Category();
        category.id = newId;
        category.category_name = req.body.category_name;
        category.description = req.body.description;
        category.thumbnail = req.body.thumbnail;
        category.path = req.body.path;
        category.save((err, item) => {
          if (err) {
            return res.status(400).json({ message: 'Có lỗi xảy ra!' });
          } else {
            return res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
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
        category.thumbnail = req.body.thumbnail;
        category.path = req.body.path;
        category.save((err, item) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
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
          category.save((err, item) => {
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
