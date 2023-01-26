const Payment = require('../models/Payment');
const { ObjectId } = require('mongodb');

class PaymentController {
  // Get all
  search(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sortName = req.body.sortName;
    let sort = {};
    const myQuery = {
      id: { $exists: true },
      payment_type: { $regex: `.*${req.body.payment_type ?? ''}.*`, $options: 'i' },
      provider: { $regex: `.*${req.body.provider ?? ''}.*`, $options: 'i' },
      account_no: { $regex: `.*${req.body.account_no ?? ''}.*`, $options: 'i' },
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
      if (sortName) sort.payment_type = sortName;
      aggregateQuery.push({ $sort: sort });
    }

    Payment.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((payments) => res.json(payments))
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by id
  getByUserId(req, res) {
    const myQuery = { customer: ObjectId(req.params.id), active: true };
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
    Payment.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((payments) => res.json(payments[0]))
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
    Payment.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((payments) => res.json(payments[0]))
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Create
  create(req, res) {
    let payment;
    Payment.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        payment = new Payment({
          id: newId,
          customer: ObjectId(req.body.customer),
          payment_type: req.body.payment_type,
          provider: req.body.provider,
          account_no: req.body.account_no,
          expiry: req.body.expiry,
        });
        payment.save((err, item) => {
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
    Payment.findOne({ _id: ObjectId(req.body._id) })
      .then((payment) => {
        if (!payment) return res.status(404).json({ message: 'Không tìm thấy!' });
        payment.payment_type = req.body.payment_type;
        payment.provider = req.body.provider;
        payment.account_no = req.body.account_no;
        payment.expiry = req.body.expiry;
        payment.save((err, item) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
        });
      })
      .catch((err) => res.status(422).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    Payment.findOne(myQuery)
      .then((payment) => {
        if (payment) {
          payment.active = false;
          payment.save((err, item) => {
            if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
            else
              return res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
          });
        } else return res.status(404).json({ message: 'Không tìm thấy!' });
      })
      .catch((err) => res.status(404).json({ message: 'Có lỗi xảy ra!' }));
  }
}

module.exports = new PaymentController();
