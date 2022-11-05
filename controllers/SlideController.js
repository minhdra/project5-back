const Slide = require('../models/Slide');
const { ObjectId } = require('mongodb');

class SlideController {
  // Get all
  search(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sort = req.body.sort;
    const myQuery = {
      id: { $exists: true },
      title: { $regex: `.*${req.body.title}.*`, $options: 'i' },
      contentLink: { $regex: `.*${req.body.contentLink}.*`, $options: 'i' },
      redirectTo: { $regex: `.*${req.body.redirectTo}.*`, $options: 'i' },
      active: true,
    };

    Slide.find(myQuery)
      .sort(sort ? { title: sort } : '')
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((slides) => res.json(slides))
      .catch((err) => res.status(400).json('Error: ' + err.message));
  }

  // Get by id
  getById(req, res) {
    const myQuery = { _id: ObjectId(req.params._id), active: true };

    User.findOne(myQuery)
      .then((slide) => {
        if (slide) return res.json(slide);
        return res.status(404).json({
          message: 'Slide not founded!',
        });
      })
      .catch((err) => res.status(400).json('Error: ' + err.message));
  }

  // Create
  create(req, res) {
    let slide;
    Slide.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        slide = new Slide({
          id: newId,
          title: req.body.title,
          backgroundImage: req.body.backgroundImage,
          contentLink: req.body.contentLink,
          redirectTo: req.body.redirectTo,
        });
        slide.save((err, slide) => {
          if (err) {
            return res.status(400).json('Cannot save!');
          } else {
            return res
              .status(200)
              .json('Created successful with slide: ' + slide.title);
          }
        });
      });
  }

  // update
  async update(req, res) {
    Slide.findOne({ _id: ObjectId(req.body._id) })
      .then((slide) => {
        if (!slide)
          return res.status(404).json({ message: 'Slide not founded!' });
        slide.title = req.body.title;
        slide.contentLink = req.body.contentLink;
        slide.backgroundImage = req.body.backgroundImage;
        slide.redirectTo = req.body.redirectTo;
        slide.save((err) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ message: 'Updated successful!' });
        });
      })
      .catch((err) => res.status(422).json({ message: 'Cannot find' }));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    Slide.findOne(myQuery)
      .then((slide) => {
        if (slide) {
          slide.active = false;
          slide.save((err) => {
            if (err) return res.status(400).json('Error deleting slide');
            else
              return res
                .status(200)
                .json(`Successfully deleted slide: ${slide.title}`);
          });
        } else return res.status(404).json('Slide not found');
      })
      .catch((err) => res.status(404).json(`Error!!!`));
  }
}

module.exports = new SlideController();
