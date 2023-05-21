const Navigation = require('../models/Navigation');
const { ObjectId } = require('mongodb');

class NavigationController {
  // Get all
  search(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sort = req.body.sortName;
    const myQuery = {
      id: { $exists: true },
      title: {
        $regex: `.*${req.body.title ?? ''}.*`,
        $options: 'i',
      },
      active: true,
    };

    if (typeof req.body.isAdmin === 'boolean')
      myQuery.isAdmin = req.body.isAdmin;

    Navigation.find(myQuery)
      .sort(sort ? { title: sort, order: -1 } : {order: -1})
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((navigates) => res.json(navigates))
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by id
  getById(req, res) {
    const myQuery = { _id: ObjectId(req.params._id), active: true };
    Navigation.findOne(myQuery)
      .then((navigate) => {
        if (navigate) return res.json(navigate);
        return res.status(404).json({
          message: 'Không tìm thấy',
        });
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Create
  create(req, res) {
    let navigate;
    Navigation.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        navigate = new Navigation();
        navigate.id = newId;
        navigate.title = req.body.title;
        navigate.path = req.body.path;
        navigate.icon = req.body.icon;
        navigate.isAdmin = req.body.isAdmin;
        navigate.order = req.body.order;
        navigate.save((err, item) => {
          if (err) {
            return res.status(400).json({ message: 'Có lỗi xảy ra!' });
          } else {
            return res
              .status(200)
              .json({ data: item, message: 'Cập nhật thành công!' });
          }
        });
      });
  }

  // update
  async update(req, res) {
    Navigation.findOne({ _id: ObjectId(req.body._id) })
      .then((navigate) => {
        if (!navigate)
          return res.status(404).json({ message: 'Không tìm thấy!' });
        navigate.title = req.body.title;
        navigate.path = req.body.path;
        navigate.icon = req.body.icon;
        navigate.isAdmin = req.body.isAdmin;
        navigate.order = req.body.order;
        navigate.save((err, item) => {
          if (err) return res.status(500).json({ message: err.message });
          else
            res
              .status(200)
              .json({ data: item, message: 'Cập nhật thành công!' });
        });
      })
      .catch((err) => res.status(422).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    Navigation.findOne(myQuery)
      .then((navigate) => {
        if (navigate) {
          navigate.active = false;
          navigate.save((err, item) => {
            if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
            else
              return res
                .status(200)
                .json(`Successfully deleted navigate: ${navigate.title}`);
          });
        } else return res.status(404).json({ message: 'Không tìm thấy!' });
      })
      .catch((err) => res.status(404).json({ message: 'Có lỗi xảy ra!' }));
  }
}

module.exports = new NavigationController();
