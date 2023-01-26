const Supplier = require('../models/Supplier');
const { ObjectId } = require('mongodb');

class SupplierController {
  // Get all
  search(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sort = req.body.sortName;
    const myQuery = {
      id: { $exists: true },
      supplier_name: { $regex: `.*${req.body.supplier_name ?? ''}.*`, $options: 'i' },
      phone: { $regex: `.*${req.body.phone ?? ''}.*`, $options: 'i' },
      address: { $regex: `.*${req.body.address ?? ''}.*`, $options: 'i' },
      email: { $regex: `.*${req.body.email ?? ''}.*`, $options: 'i' },
      active: true,
    };

    Supplier.find(myQuery)
      .sort(sort ? { supplier_name: sort } : '')
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((suppliers) => res.json(suppliers))
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by id
  getById(req, res) {
    const myQuery = { _id: ObjectId(req.params._id), active: true };
    Supplier.findOne(myQuery)
      .then((supplier) => {
        if (supplier) return res.json(supplier);
        return res.status(404).json({
          message: 'Không tìm thấy',
        });
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Create
  create(req, res) {
    let supplier;
    Supplier.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        supplier = new Supplier({
          id: newId,
          supplier_name: req.body.supplier_name,
          phone: req.body.phone,
          email: req.body.email,
          address: req.body.address,
          description: req.body.description,
        });
        supplier.save((err, item) => {
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
    Supplier.findOne({ _id: ObjectId(req.body._id) })
      .then((supplier) => {
        if (!supplier)
          return res.status(404).json({ message: 'Không tìm thấy!' });
        supplier.supplier_name = req.body.supplier_name;
        supplier.phone = req.body.phone;
        supplier.email = req.body.email;
        supplier.address = req.body.address;
        supplier.description = req.body.description;
        supplier.save((err, item) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
        });
      })
      .catch((err) => res.status(422).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    Supplier.findOne(myQuery)
      .then((supplier) => {
        if (supplier) {
          supplier.active = false;
          supplier.save((err, item) => {
            if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
            else
              return res
                .status(200)
                .json(`Successfully deleted supplier: ${supplier.name}`);
          });
        } else return res.status(404).json({ message: 'Không tìm thấy!' });
      })
      .catch((err) => res.status(404).json({ message: 'Có lỗi xảy ra!' }));
  }
}

module.exports = new SupplierController();
