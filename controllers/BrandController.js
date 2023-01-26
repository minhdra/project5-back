const Brand = require('../models/Brand');
const { ObjectId } = require('mongodb');

class BrandController {
  // Get all
  search(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sort = req.body.sortName;
    const myQuery = {
      id: { $exists: true },
      brand_name: { $regex: `.*${req.body.brand_name ?? ''}.*`, $options: 'i' },
      active: true,
    };

    Brand.find(myQuery)
      .sort(sort ? { brand_name: sort } : '')
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((brands) => res.json(brands))
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by id
  getById(req, res) {
    const myQuery = { _id: ObjectId(req.params._id), active: true };
    Brand.findOne(myQuery)
      .then((brand) => {
        if (brand) return res.json(brand);
        return res.status(404).json({
          message: 'Không tìm thấy',
        });
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by path
  getByPath(req, res) {
    const myQuery = { path: req.params.path, active: true };
    Brand.findOne(myQuery)
      .then((brand) => {
        if (brand) return res.json(brand);
        return res.status(404).json({
          message: 'Không tìm thấy',
        });
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Create
  create(req, res) {
    let brand;
    Brand.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        brand = new Brand();
        brand.id = newId;
        brand.brand_name = req.body.brand_name;
        brand.path = req.body.path;
        brand.thumbnail = req.body.thumbnail;
        brand.description = req.body.description;
        brand.save((err, item) => {
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
    Brand.findOne({ _id: ObjectId(req.body._id) })
      .then((brand) => {
        if (!brand)
          return res.status(404).json({ message: 'Không tìm thấy!' });
        brand.brand_name = req.body.brand_name;
        brand.path = req.body.path;
        brand.thumbnail = req.body.thumbnail;
        brand.description = req.body.description;
        brand.save((err, item) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
        });
      })
      .catch((err) => res.status(422).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    Brand.findOne(myQuery)
      .then((brand) => {
        if (brand) {
          brand.active = false;
          brand.save((err, item) => {
            if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
            else
              return res
                .status(200)
                .json(`Successfully deleted brand: ${brand.name}`);
          });
        } else return res.status(404).json({ message: 'Không tìm thấy!' });
      })
      .catch((err) => res.status(404).json({ message: 'Có lỗi xảy ra!' }));
  }
}

module.exports = new BrandController();
