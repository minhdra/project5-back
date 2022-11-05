const Product = require('../models/Product');
const { ObjectId } = require('mongodb');

class ProductController {
  // Get all
  search(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sortName = req.body.sortName;
    let sort = {};
    const myQuery = {
      id: { $exists: true },
      product_name: { $regex: `.*${req.body.product_name}.*`, $options: 'i' },
      origin: { $regex: `.*${req.body.origin}.*`, $options: 'i' },
      material: { $regex: `.*${req.body.material}.*`, $options: 'i' },
      style: { $regex: `.*${req.body.style}.*`, $options: 'i' },
      active: true,
    };

    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'discounts', // Match with to collection what want to search
          startWith: '$discount', // Name of array (origin)
          connectFromField: 'discount', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'discount', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'sub_categories', // Match with to collection what want to search
          startWith: '$category_sub', // Name of array (origin)
          connectFromField: 'category_sub', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category_sub', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'brands', // Match with to collection what want to search
          startWith: '$brand', // Name of array (origin)
          connectFromField: 'brand', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'brand', // Add or replace field in origin collection
        },
      },
    ];

    if (sortName) {
      if (sortName) sort.product_name = sortName;
      aggregateQuery.push({ $sort: sort });
    }

    Product.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((products) => res.json(products))
      .catch((err) => res.status(400).json({message: 'Có lỗi xảy ra!'}));
  }

  searchBySubCategory(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sortName = req.body.sortName;
    let sort = {};
    const myQuery = {
      id: { $exists: true },
      category_sub: req.body.category_sub,
      product_name: { $regex: `.*${req.body.product_name}.*`, $options: 'i' },
      origin: { $regex: `.*${req.body.origin}.*`, $options: 'i' },
      material: { $regex: `.*${req.body.material}.*`, $options: 'i' },
      style: { $regex: `.*${req.body.style}.*`, $options: 'i' },
      active: true,
    };

    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'discounts', // Match with to collection what want to search
          startWith: '$discount', // Name of array (origin)
          connectFromField: 'discount', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'discount', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'sub_categories', // Match with to collection what want to search
          startWith: '$category_sub', // Name of array (origin)
          connectFromField: 'category_sub', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category_sub', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'brands', // Match with to collection what want to search
          startWith: '$brand', // Name of array (origin)
          connectFromField: 'brand', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'brand', // Add or replace field in origin collection
        },
      },
    ];

    if (sortName) {
      if (sortName) sort.product_name = sortName;
      aggregateQuery.push({ $sort: sort });
    }

    Product.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((products) => res.json(products))
      .catch((err) => res.status(400).json({message: 'Có lỗi xảy ra!'}));
  }

  // Get by id
  getById(req, res) {
    const myQuery = { _id: ObjectId(req.params._id), active: true };
    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'discounts', // Match with to collection what want to search
          startWith: '$discount', // Name of array (origin)
          connectFromField: 'discount', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'discount', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'sub_categories', // Match with to collection what want to search
          startWith: '$category_sub', // Name of array (origin)
          connectFromField: 'category_sub', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category_sub', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'brands', // Match with to collection what want to search
          startWith: '$brand', // Name of array (origin)
          connectFromField: 'brand', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'brand', // Add or replace field in origin collection
        },
      },
    ];
    Product.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((products) => res.json(products[0]))
      .catch((err) => res.status(400).json({message: 'Có lỗi xảy ra!'}));
  }

  // Get by path
  getByPath(req, res) {
    const myQuery = { path: req.params.path, active: true };
    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'discounts', // Match with to collection what want to search
          startWith: '$discount', // Name of array (origin)
          connectFromField: 'discount', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'discount', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'sub_categories', // Match with to collection what want to search
          startWith: '$category_sub', // Name of array (origin)
          connectFromField: 'category_sub', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category_sub', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'brands', // Match with to collection what want to search
          startWith: '$brand', // Name of array (origin)
          connectFromField: 'brand', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'brand', // Add or replace field in origin collection
        },
      },
    ];
    Product.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((products) => res.json(products[0]))
      .catch((err) => res.status(400).json({message: 'Có lỗi xảy ra!'}));
  }

  // Create
  create(req, res) {
    let product;
    Product.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        product = new Product({
          id: newId,
          product_name: req.body.product_name,
          path: req.body.path,
          thumbnail: req.body.thumbnail,
          discount: req.body.discount,
          category_sub: req.body.category_sub,
          brand: req.body.brand,
          origin: req.body.origin,
          material: req.body.material,
          style: req.body.style,
          description: req.body.description,
          variants: req.body.variants,
        });
        product.save((err) => {
          if (err) {
            return res.status(400).json({message: 'Có lỗi xảy ra!'});
          } else {
            return res
              .status(200)
              .json({ message: 'Cập nhật thành công!' });
          }
        });
      });
  }

  // update
  async update(req, res) {
    Product.findOne({ _id: ObjectId(req.body._id) })
      .then((product) => {
        if (!product)
          return res.status(404).json({ message: 'Không tìm thấy!' });
        product.product_name = req.body.product_name;
        product.path = req.body.path;
        product.thumbnail = req.body.thumbnail;
        product.discount = req.body.discount;
        product.category_sub = req.body.category_sub;
        product.brand = req.body.brand;
        product.origin = req.body.origin;
        product.material = req.body.material;
        product.style = req.body.style;
        product.description = req.body.description;
        product.variants = req.body.variants;
        product.save((err) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ message: 'Cập nhật thành công!' });
        });
      })
      .catch((err) => res.status(422).json({message: 'Có lỗi xảy ra!'}));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    Product.findOne(myQuery)
      .then((product) => {
        if (product) {
          product.active = false;
          product.save((err) => {
            if (err) return res.status(400).json({message: 'Có lỗi xảy ra!'});
            else
              return res
                .status(200)
                .json({message: 'Cập nhật thành công!'});
          });
        } else return res.status(404).json({ message: 'Không tìm thấy!' });
      })
      .catch((err) => res.status(404).json({message: 'Có lỗi xảy ra!'}));
  }
}

module.exports = new ProductController();
