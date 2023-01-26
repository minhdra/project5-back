const Order = require('../models/Order');
const { ObjectId, Long } = require('mongodb');

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

    // if (sortName) {
    //   if (sortName) sort.id = sortName;
    //   aggregateQuery.push({ $sort: sort });
    // }
    aggregateQuery.push({ $sort: {delivery_status: -1, paid: 1} });

    Order.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((orders) => {
        orders.forEach((item) => item.customer = item.customer[0])
        
        return res.json(orders);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by id
  getById(req, res) {
    const myQuery = { id: Long(req.params.id), active: true };
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
      .then((orders) => {
        if (orders.length > 0)
        {
          orders[0].customer = orders[0].customer[0];
          return res.status(200).json(orders[0]);
        }
        else return res.status(200).json(false);
      })
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
        order = new Order();
        order.id = req.body.id ? req.body.id : newId;
        order.customer = ObjectId(req.body.customer);
        order.payment_type = req.body.payment_type;
        order.delivery_address = req.body.delivery_address;
        order.note = req.body.note;
        order.total = req.body.total;
        order.details = req.body.details;
        order.save((err, item) => {
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
    Order.findOne({ _id: ObjectId(req.body._id) })
      .then((order) => {
        if (!order) return res.status(404).json({ message: 'Không tìm thấy!' });
        order.payment_type = req.body.payment_type;
        order.paid = req.body.paid;
        order.delivery_address = req.body.delivery_address;
        order.note = req.body.note;
        order.total = req.body.total;
        order.details = req.body.details;
        order.delivery_status = req.body.delivery_status;
        order.card_type = req.body.card_type;
        order.card_name = req.body.card_name;
        order.card_info = req.body.card_info;
        order.save((err, item) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
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
          order.save((err, item) => {
            if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
            else
              return res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
          });
        } else return res.status(404).json({ message: 'Không tìm thấy!' });
      })
      .catch((err) => res.status(404).json({ message: 'Có lỗi xảy ra!' }));
  }
}

module.exports = new OrderController();
