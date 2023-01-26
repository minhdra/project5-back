const CategorySub = require('../models/CategorySub');
const { ObjectId } = require('mongodb');

class CategorySubController {
  // Get all
  search(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sortName = req.body.sortName;
    let sort = {};
    const myQuery = {
      id: { $exists: true },
      sub_category_name: { $regex: `.*${req.body.sub_category_name ?? ''}.*`, $options: 'i' },
      active: true,
    };

    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'categories', // Match with to collection what want to search
          startWith: '$category', // Name of array (origin)
          connectFromField: 'category', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category', // Add or replace field in origin collection
        },
      },
    ];

    if (sortName) {
      if (sortName) sort.sub_category_name = sortName;
      aggregateQuery.push({ $sort: sort });
    }

    CategorySub.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((categorySubs) => {
        categorySubs.forEach(item => item.category = item.category[0]);
        return res.status(200).json(categorySubs);
      })
      .catch((err) => res.status(400).json({message: 'Có lỗi xảy ra!'}));
  }

  // Get all for menu
  // searchForMenu(req, res) {
  //   // let page = req.body.page || 1;
  //   // let pageSize = req.body.pageSize || 10;
  //   let sortName = req.body.sortName;
  //   let sort = {};
  //   const myQuery = {
  //     id: { $exists: true },
  //     sub_category_name: { $regex: `.*${req.body.sub_category_name ?? ''}.*`, $options: 'i' },
  //     active: true,
  //   };

  //   let aggregateQuery = [
  //     { $match: myQuery },
  //     {
  //       $graphLookup: {
  //         from: 'categories', // Match with to collection what want to search
  //         startWith: '$category', // Name of array (origin)
  //         connectFromField: 'category', // Field of array
  //         connectToField: 'id', // from which field it will match
  //         as: 'category', // Add or replace field in origin collection
  //       },
  //     },
  //   ];

  //   if (sortName) {
  //     if (sortName) sort.sub_category_name = sortName;
  //     aggregateQuery.push({ $sort: sort });
  //   }

  //   CategorySub.aggregate(aggregateQuery)
  //     // .skip(page * pageSize - pageSize)
  //     // .limit(pageSize)
  //     .then((categorySubs) => {
  //       categorySubs.forEach(item => item.category = item.category[0]);
  //       return res.status(200).json(categorySubs);
  //     })
  //     .catch((err) => res.status(400).json({message: 'Có lỗi xảy ra!'}));
  // }

  // Get by id
  getById(req, res) {
    const myQuery = { _id: ObjectId(req.params._id), active: true };
    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'categories', // Match with to collection what want to search
          startWith: '$category', // Name of array (origin)
          connectFromField: 'category', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category', // Add or replace field in origin collection
        },
      },
    ];
    CategorySub.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((categorySubs) => {
        categorySubs[0].category = categorySubs[0].category[0];
        return res.status(200).json(categorySubs[0]);
      })
      .catch((err) => res.status(400).json({message: 'Có lỗi xảy ra!'}));
  }

  // Get by path
  getByPath(req, res) {
    const myQuery = { path: req.params.path, active: true };
    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'categories', // Match with to collection what want to search
          startWith: '$category', // Name of array (origin)
          connectFromField: 'category', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category', // Add or replace field in origin collection
        },
      },
    ];
    CategorySub.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((categorySubs) => {
        categorySubs[0].category = categorySubs[0].category[0];
        return res.status(200).json(categorySubs[0]);
      })
      .catch((err) => res.status(400).json({message: 'Có lỗi xảy ra!'}));
  }

  // Create
  create(req, res) {
    let categorySub;
    CategorySub.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        categorySub = new CategorySub({
          id: newId,
          sub_category_name: req.body.sub_category_name,
          path: req.body.path,
          category: req.body.category,
          description: req.body.description,
        });
        categorySub.save((err, item) => {
          if (err) {
            return res.status(400).json({message: 'Có lỗi xảy ra!'});
          } else {
            return res
              .status(200)
              .json({ data: item, message: 'Cập nhật thành công!' });
          }
        });
      });
  }

  // update
  async update(req, res) {
    CategorySub.findOne({ _id: ObjectId(req.body._id) })
      .then((categorySub) => {
        if (!categorySub)
          return res.status(404).json({ message: 'Không tìm thấy!' });
        categorySub.sub_category_name = req.body.sub_category_name;
        categorySub.path = req.body.path;
        categorySub.category = req.body.category;
        categorySub.description = req.body.description;
        categorySub.save((err, item) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
        });
      })
      .catch((err) => res.status(422).json({message: 'Có lỗi xảy ra!'}));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    CategorySub.findOne(myQuery)
      .then((categorySub) => {
        if (categorySub) {
          categorySub.active = false;
          categorySub.save((err, item) => {
            if (err) return res.status(400).json({message: 'Có lỗi xảy ra!'});
            else
              return res
                .status(200)
                .json({ data: item, message: 'Cập nhật thành công!' });
          });
        } else return res.status(404).json({ message: 'Không tìm thấy!' });
      })
      .catch((err) => res.status(404).json({message: 'Có lỗi xảy ra!'}));
  }
}

module.exports = new CategorySubController();
