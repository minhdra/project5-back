const Staff = require('../models/Staff');
const { ObjectId } = require('mongodb');
const User = require('../models/User');

class StaffController {
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
      phone: { $regex: `.*${req.body.phone ?? ''}.*` },
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

    Staff.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((staffs) => {
        staffs.forEach((staff) => (staff.user = staff.user[0]));
        return res.status(200).json(staffs);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

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
    Staff.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((staffs) => {
        staffs[0].user = staffs[0].user[0];
        return res.json(staffs[0]);
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
    Staff.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((staffs) => {
        staffs[0].user = staffs[0].user[0];
        return res.json(staffs[0]);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // update
  async update(req, res) {
    Staff.findOne({ _id: ObjectId(req.body._id) })
      .then((staff) => {
        if (!staff) return res.status(404).json({ message: 'Không tìm thấy!' });
        staff.first_name = req.body.first_name;
        staff.last_name = req.body.last_name;
        // staff.email = req.body.email;
        staff.birth = req.body.birth;
        staff.gender = req.body.gender;
        staff.avatar = req.body.avatar;
        staff.address = req.body.address;
        staff.phone = req.body.phone;
        staff.save((err, item) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
        });
      })
      .catch((err) => res.status(422).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    Staff.findOne(myQuery)
      .then((staff) => {
        if (staff) {
          staff.active = false;
          staff.save(async (err) => {
            if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
            else {
              await deleteAccount(staff.user);
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

module.exports = new StaffController();
