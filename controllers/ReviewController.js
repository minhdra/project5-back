const Review = require('../models/Review');
const Order = require('../models/Order');
const { ObjectId } = require('mongodb');

class ReviewController {
  // Get all
  search(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sortName = req.body.sortName;
    let sort = {};
    const myQuery = {
      id: { $exists: true },
      active: true,
    };

    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'customers', // Match with to collection what want to search
          startWith: '$customer', // Name of array (origin)
          connectFromField: 'customer', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'customer', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'products', // Match with to collection what want to search
          startWith: '$product', // Name of array (origin)
          connectFromField: 'product', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'product', // Add or replace field in origin collection
        },
      },
    ];

    Review.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((reviews) => {
        reviews.forEach((item) => {
          item.customer = item.customer[0];
          item.product = item.product[0];
        });
        return res.status(200).json(reviews);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by customer and product
  getByCustomerAndProduct(req, res) {
    const myQuery = {
      product: req.body.product,
      customer: req.body.customer,
      active: true,
    };
    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'customers', // Match with to collection what want to search
          startWith: '$customer', // Name of array (origin)
          connectFromField: 'customer', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'customer', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'products', // Match with to collection what want to search
          startWith: '$product', // Name of array (origin)
          connectFromField: 'product', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'product', // Add or replace field in origin collection
        },
      },
    ];
    Review.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((reviews) => {
        reviews[0].customer = reviews[0].customer[0];
        reviews[0].product = reviews[0].product[0];
        return res.status(200).json(reviews[0]);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by product
  getByProduct(req, res) {
    const myQuery = { product: req.body.product, active: true };
    if (req.body.rating) myQuery.rating = req.body.rating;
    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'customers', // Match with to collection what want to search
          startWith: '$customer', // Name of array (origin)
          connectFromField: 'customer', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'customer', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'products', // Match with to collection what want to search
          startWith: '$product', // Name of array (origin)
          connectFromField: 'product', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'product', // Add or replace field in origin collection
        },
      },
    ];
    Review.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((reviews) => {
        reviews.forEach((item) => {
          item.customer = item.customer[0];
          item.product = item.product[0];
        });
        return res.status(200).json(reviews);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by customer
  getByCustomer(req, res) {
    const myQuery = { customer: req.params.id, active: true };
    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'customers', // Match with to collection what want to search
          startWith: '$customer', // Name of array (origin)
          connectFromField: 'customer', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'customer', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'products', // Match with to collection what want to search
          startWith: '$product', // Name of array (origin)
          connectFromField: 'product', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'product', // Add or replace field in origin collection
        },
      },
    ];
    Review.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((reviews) => {
        reviews.forEach((item) => {
          item.customer = item.customer[0];
          item.product = item.product[0];
        });
        return res.status(200).json(reviews);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Check user
  async checkCustomerReview(req, res) {
    const myQuery = {
      product: req.body.product,
      customer: req.body.customer,
      active: true,
    };

    const review = await Review.findOne(myQuery);

    if (review) return res.status(200).json(false);

    await Order.find({ customer: req.body.customer_id, active: true }).then(
      (orders) => {
        let isCheck = false;
        orders.forEach((order) => {
          let c = false;
          order.details.forEach((item) => {
            if (item.product_id === req.body.product) c = true;
          });
          if (c && order.paid) isCheck = false;
          else if (c && !order.paid) isCheck = true;
        });

        return res.status(200).json(isCheck);
      }
    );
  }

  // Get by id
  getById(req, res) {
    const myQuery = { _id: ObjectId(req.params._id), active: true };
    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'customers', // Match with to collection what want to search
          startWith: '$customer', // Name of array (origin)
          connectFromField: 'customer', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'customer', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'products', // Match with to collection what want to search
          startWith: '$product', // Name of array (origin)
          connectFromField: 'product', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'product', // Add or replace field in origin collection
        },
      },
    ];
    Review.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((reviews) => {
        reviews[0].customer = reviews[0].customer[0];
        reviews[0].product = reviews[0].product[0];
        return res.status(200).json(reviews[0]);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Create
  create(req, res) {
    let review;
    Review.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        review = new Review();
        review.id = newId;
        review.customer = req.body.customer;
        review.product = req.body.product;
        review.rating = req.body.rating;
        review.classify = req.body.classify;
        review.comment = req.body.comment;
        review.tags = req.body.tags;
        review.save((err, item) => {
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
    Review.findOne({ _id: ObjectId(req.body._id) })
      .then((review) => {
        if (!review)
          return res.status(404).json({ message: 'Không tìm thấy!' });
        review.customer = req.body.customer;
        review.product = req.body.product;
        review.rating = req.body.rating;
        review.classify = req.body.classify;
        review.comment = req.body.comment;
        review.tags = req.body.tags;
        review.save((err, item) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
        });
      })
      .catch((err) => res.status(422).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    Review.findOne(myQuery)
      .then((review) => {
        if (review) {
          review.active = false;
          review.delete((err) => {
            if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
            else
              return res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
          });
          // review.save((err, item) => {
          //   if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
          //   else
          //     return res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
          // });
        } else return res.status(404).json({ message: 'Không tìm thấy!' });
      })
      .catch((err) => res.status(404).json({ message: 'Có lỗi xảy ra!' }));
  }
}

module.exports = new ReviewController();
