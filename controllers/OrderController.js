const Order = require('../models/Order');
const { ObjectId } = require('mongodb');

class OrderController {
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
          connectToField: '_id', // from which field it will match
          as: 'customer', // Add or replace field in origin collection
        },
      },
    ];

    if (sortName) {
      if (sortName) sort.id = sortName;
      aggregateQuery.push({ $sort: sort });
    }

    Order.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((orders) => res.json(orders))
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by id
  getById(req, res) {
    const myQuery = { id: req.params.id, active: true };
    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'customers', // Match with to collection what want to search
          startWith: '$customer', // Name of array (origin)
          connectFromField: 'customer', // Field of array
          connectToField: '_id', // from which field it will match
          as: 'customer', // Add or replace field in origin collection
        },
      },
    ];
    Order.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((orders) => res.json(orders[0]))
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Create
  create(req, res) {
    let order;
    Order.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        order = new Order({
          id: newId,
          customer: ObjectId(req.body.customer),
          payment_type: req.body.payment_type,
          delivery_address: req.body.delivery_address,
          note: req.body.note,
          total: req.body.total,
          details: req.body.details,
        });
        order.save((err) => {
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
    Order.findOne({ _id: ObjectId(req.body._id) })
      .then((order) => {
        if (!order) return res.status(404).json({ message: 'Không tìm thấy!' });
        order.payment_type = req.body.payment_type;
        order.paid = req.body.paid;
        order.delivery_address = req.body.delivery_address;
        order.note = req.body.note;
        order.total = req.body.total;
        order.details = req.body.details;
        order.save((err) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ message: 'Cập nhật thành công!' });
        });
      })
      .catch((err) => res.status(422).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    Order.findOne(myQuery)
      .then((order) => {
        if (order) {
          order.active = false;
          order.save((err) => {
            if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
            else
              return res.status(200).json({ message: 'Cập nhật thành công!' });
          });
        } else return res.status(404).json({ message: 'Không tìm thấy!' });
      })
      .catch((err) => res.status(404).json({ message: 'Có lỗi xảy ra!' }));
  }
}

module.exports = new OrderController();
