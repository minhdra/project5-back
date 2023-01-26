const Customer = require('../models/Customer');
const { ObjectId } = require('mongodb');
const User = require('../models/User');

class CustomerController {
  // Get all
  search(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sortName = req.body.sortName;
    let sort = {};
    const myQuery = {
      id: { $exists: true },
      first_name: { $regex: `.*${req.body.first_name ?? ''}.*`, $options: 'i' },
      last_name: { $regex: `.*${req.body.last_name ?? ''}.*`, $options: 'i' },
      // email: { $regex: `.*${req.body.email ?? ''}.*`, $options: 'i' },
      phone: { $regex: `.*${req.body.phone ?? ''}.*`, $options: 'i' },
      active: true,
    };

    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'users', // Match with to collection what want to search
          startWith: '$user', // Name of array (origin)
          connectFromField: 'user', // Field of array
          connectToField: '_id', // from which field it will match
          as: 'user', // Add or replace field in origin collection
        },
      },
    ];

    if (sortName) {
      if (sortName) sort.first_name = sortName;
      aggregateQuery.push({ $sort: sort });
    }

    Customer.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((customers) => {
        customers.forEach((customer) => (customer.user = customer.user[0]));
        return res.status(200).json(customers);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by id
  getByUserId(req, res) {
    const myQuery = { user: ObjectId(req.params._id), active: true };
    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'users', // Match with to collection what want to search
          startWith: '$user', // Name of array (origin)
          connectFromField: 'user', // Field of array
          connectToField: '_id', // from which field it will match
          as: 'user', // Add or replace field in origin collection
        },
      },
    ];
    Customer.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((customers) => {
        customers[0].user = customers[0].user[0];
        return res.json(customers[0]);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by id
  getById(req, res) {
    const myQuery = { _id: ObjectId(req.params._id), active: true };
    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'users', // Match with to collection what want to search
          startWith: '$user', // Name of array (origin)
          connectFromField: 'user', // Field of array
          connectToField: '_id', // from which field it will match
          as: 'user', // Add or replace field in origin collection

        },
      },
    ];
    Customer.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((customers) => {
        customers[0].user = customers[0].user[0];
        return res.json(customers[0]);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by path
  getByPath(req, res) {
    const myQuery = { path: req.params.path, active: true };
    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'users', // Match with to collection what want to search
          startWith: '$user', // Name of array (origin)
          connectFromField: 'user', // Field of array
          connectToField: '_id', // from which field it will match
          as: 'user', // Add or replace field in origin collection
        },
      },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'customer',
          as: 'orders',

        },
      },
    ];
    Customer.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((customers) => {
        customers[0].user = customers[0].user[0];
        customers[0].orders = customers[0].orders.filter(order => order.active);
        return res.json(customers[0]);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // update
  async updateClient(req, res) {
    Customer.findOne({ _id: ObjectId(req.body._id) })
      .then((customer) => {
        if (!customer)
          return res.status(404).json({ message: 'Không tìm thấy!' });
        customer.first_name = req.body.first_name;
        customer.last_name = req.body.last_name;
        customer.email = req.body.email;
        customer.birth = req.body.birth;
        customer.gender = req.body.gender;
        customer.avatar = req.body.avatar;
        customer.address = req.body.address;
        customer.phone = req.body.phone;
        customer.carts = req.body.carts;
        customer.delivery_addresses = req.body.delivery_addresses;
        customer.save((err, item) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
        });
      })
      .catch((err) => res.status(422).json({ message: 'Có lỗi xảy ra!' }));
  }

  // update
  async update(req, res) {
    Customer.findOne({ _id: ObjectId(req.body._id) })
      .then((customer) => {
        if (!customer)
          return res.status(404).json({ message: 'Không tìm thấy!' });
        customer.first_name = req.body.first_name;
        customer.last_name = req.body.last_name;
        customer.email = req.body.email;
        customer.birth = req.body.birth;
        customer.gender = req.body.gender;
        customer.avatar = req.body.avatar;
        customer.address = req.body.address;
        customer.phone = req.body.phone;
        customer.carts = req.body.carts;
        customer.delivery_addresses = req.body.delivery_addresses;
        customer.save((err, item) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
        });
      })
      .catch((err) => res.status(422).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    Customer.findOne(myQuery)
      .then((customer) => {
        if (customer) {
          customer.active = false;
          customer.save(async (err) => {
            if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
            else {
              await deleteAccount(customer.user);
              return res.status(200).json({ message: `Cập nhật thành công!` });
            }
          });
        } else return res.status(404).json({ message: 'Không tìm thấy!' });
      })
      .catch((err) => res.status(404).json({ message: 'Có lỗi xảy ra!' }));
  }
}

function deleteAccount(user_id) {
  const myQuery = { _id: ObjectId(user_id), active: true };
  User.findOne(myQuery).then((user) => {
    if (user) {
      user.active = false;
      user.save();
    }
  });
}

module.exports = new CustomerController();
