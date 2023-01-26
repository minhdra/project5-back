const Invoice = require('../models/Invoice');
const { ObjectId } = require('mongodb');

class InvoiceController {
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
          from: 'products', // Match with to collection what want to search
          startWith: '$product', // Name of array (origin)
          connectFromField: 'product', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'product', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'staffs', // Match with to collection what want to search
          startWith: '$staff', // Name of array (origin)
          connectFromField: 'staff', // Field of array
          connectToField: '_id', // from which field it will match
          as: 'staff', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'suppliers', // Match with to collection what want to search
          startWith: '$supplier', // Name of array (origin)
          connectFromField: 'supplier', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'supplier', // Add or replace field in origin collection
        },
      },
    ];

    // if (sortName) {
    //   if (sortName) sort.sub_category_name = sortName;
    //   aggregateQuery.push({ $sort: sort });
    // }

    Invoice.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((invoices) => {
        invoices.forEach((item) => {
          item.product = item.product[0];
          item.staff = item.staff[0];
          item.supplier = item.supplier[0];
        });
        return res.status(200).json(invoices);
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
          from: 'products', // Match with to collection what want to search
          startWith: '$product', // Name of array (origin)
          connectFromField: 'product', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'product', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'staffs', // Match with to collection what want to search
          startWith: '$staff', // Name of array (origin)
          connectFromField: 'staff', // Field of array
          connectToField: '_id', // from which field it will match
          as: 'staff', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'suppliers', // Match with to collection what want to search
          startWith: '$supplier', // Name of array (origin)
          connectFromField: 'supplier', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'supplier', // Add or replace field in origin collection
        },
      },
    ];
    Invoice.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((invoices) => {
        invoices[0].product = invoices[0].product[0];
        invoices[0].staff = invoices[0].staff[0];
        invoices[0].supplier = invoices[0].supplier[0];
        return res.status(200).json(invoices[0]);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Create
  create(req, res) {
    let invoice;
    Invoice.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        invoice = new Invoice({
          id: newId,
          product: req.body.product,
          staff: req.body.staff,
          supplier: req.body.supplier,
          paid: req.body.paid,
          total: req.body.total,
          details: req.body.details,
        });
        invoice.save((err, item) => {
          if (err) {
            return res.status(400).json({ message: 'Có lỗi xảy ra!' });
          } else {
            return res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
          }
        });
      });
  }

  // update
  update(req, res) {
    Invoice.findOne({ _id: ObjectId(req.body._id) })
      .then((invoice) => {
        if (!invoice)
          return res.status(404).json({ message: 'Không tìm thấy!' });
        invoice.product = req.body.product;
        invoice.staff = req.body.staff;
        invoice.supplier = req.body.supplier;
        invoice.paid = req.body.paid;
        invoice.total = req.body.total;
        invoice.details = req.body.details;
        invoice.save((err, item) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
        });
      })
      .catch((err) => res.status(422).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    Invoice.findOne(myQuery)
      .then((invoice) => {
        if (invoice) {
          invoice.active = false;
          invoice.save((err, item) => {
            if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
            else
              return res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
          });
        } else return res.status(404).json({ message: 'Không tìm thấy!' });
      })
      .catch((err) => res.status(404).json({ message: 'Có lỗi xảy ra!' }));
  }
}

module.exports = new InvoiceController();
