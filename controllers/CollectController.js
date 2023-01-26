const Collect = require('../models/Collect');
const { ObjectId } = require('mongodb');

class CollectController {
  // Get all
  search(req, res) {
    let page = req.body.page || 1;
    let pageSize = req.body.pageSize || 1000;
    let sort = req.body.sortName;
    const limit = req.body.limit;
    const myQuery = {
      id: { $exists: true },
      collect_name: { $regex: `.*${req.body.collect_name ?? ''}.*`, $options: 'i' },
      active: true,
    };

    Collect.find(myQuery)
      .sort({ status: -1, order: 1 })
      .limit(limit ?? limit)
      .skip(page * pageSize - pageSize)
      .limit(pageSize)
      .then((collects) => res.json(collects))
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by id
  getById(req, res) {
    const myQuery = { _id: ObjectId(req.params._id), active: true };
    Collect.findOne(myQuery)
      .then((collect) => {
        if (collect) return res.json(collect);
        return res.status(404).json({
          message: 'Không tìm thấy',
        });
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by path
  getByPath(req, res) {
    const myQuery = { path: req.params.path, active: true };
    Collect.findOne(myQuery)
      .then((collect) => {
        if (collect) return res.json(collect);
        return res.status(404).json({
          message: 'Không tìm thấy',
        });
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Create
  create(req, res) {
    let collect;
    Collect.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        collect = new Collect();
        collect.id = newId,
        collect.collect_name = req.body.collect_name;
        collect.path = req.body.path;
        collect.thumbnail = req.body.thumbnail;
        collect.description = req.body.description;
        collect.order = req.body.order;
        collect.status = req.body.status;
        collect.hashtag = req.body.hashtag;
        collect.save((err, item) => {
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
    Collect.findOne({ _id: ObjectId(req.body._id) })
      .then((collect) => {
        if (!collect)
          return res.status(404).json({ message: 'Không tìm thấy!' });
        collect.collect_name = req.body.collect_name;
        collect.path = req.body.path;
        collect.thumbnail = req.body.thumbnail;
        collect.description = req.body.description;
        collect.order = req.body.order;
        collect.status = req.body.status;
        collect.hashtag = req.body.hashtag;
        collect.save((err, item) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
        });
      })
      .catch((err) => res.status(422).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    Collect.findOne(myQuery)
      .then((collect) => {
        if (collect) {
          collect.active = false;
          collect.save((err, item) => {
            if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
            else
              return res
                .status(200)
                .json(`Successfully deleted collect: ${collect.collect_name}`);
          });
        } else return res.status(404).json({ message: 'Không tìm thấy!' });
      })
      .catch((err) => res.status(404).json({ message: 'Có lỗi xảy ra!' }));
  }
}

module.exports = new CollectController();
