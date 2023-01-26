const Discount = require('../models/Discount');
const { ObjectId } = require('mongodb');

class DiscountController {
  // Get all
  search(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sort = req.body.sortName;
    const myQuery = {
      id: { $exists: true },
      discount_name: { $regex: `.*${req.body.discount_name ?? ''}.*`, $options: 'i' },
      active: true,
    };

    Discount.find(myQuery)
      .sort(sort ? { discount_name: sort } : '')
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((discounts) => res.json(discounts))
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by id
  getById(req, res) {
    const myQuery = { _id: ObjectId(req.params._id), active: true };
    Discount.findOne(myQuery)
      .then((discount) => {
        if (discount) return res.json(discount);
        return res.status(404).json({
          message: 'Không tìm thấy',
        });
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Create
  create(req, res) {
    let discount;
    Discount.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        discount = new Discount({
          id: newId,
          discount_name: req.body.discount_name,
          discount_percent: req.body.discount_percent,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
        });
        discount.save((err, item) => {
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
    Discount.findOne({ _id: ObjectId(req.body._id) })
      .then((discount) => {
        if (!discount)
          return res.status(404).json({ message: 'Không tìm thấy!' });
        discount.discount_name = req.body.discount_name;
        discount.discount_percent = req.body.discount_percent;
        discount.start_date = req.body.email;
        discount.end_date = req.body.end_date;
        discount.save((err, item) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
        });
      })
      .catch((err) => res.status(422).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    Discount.findOne(myQuery)
      .then((discount) => {
        if (discount) {
          discount.active = false;
          discount.save((err, item) => {
            if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
            else
              return res
                .status(200)
                .json(`Successfully deleted discount: ${discount.name}`);
          });
        } else return res.status(404).json({ message: 'Không tìm thấy!' });
      })
      .catch((err) => res.status(404).json({ message: 'Có lỗi xảy ra!' }));
  }
}

module.exports = new DiscountController();
