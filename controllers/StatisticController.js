const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { ObjectId } = require('mongodb');

class StatisticController {
  // Get all
  // search(req, res) {
  //   // let page = req.body.page || 1;
  //   // let pageSize = req.body.pageSize || 10;
  //   let sortName = req.body.sortName;
  //   let sort = {};
  //   const myQuery = {
  //     id: { $exists: true },
  //     sub_category_name: {
  //       $regex: `.*${req.body.sub_category_name ?? ''}.*`,
  //       $options: 'i',
  //     },
  //     active: true,
  //   };

  //   let aggregateQuery = [
  //     { $match: myQuery },
  //     {
  //       $graphLookup: {
  //         from: 'categories', // Match with to collection what want to search
  //         startWith: '$category', // Name of array (origin)
  //         connectFromField: 'category', // Field of array
  //         connectToField: 'id', // from which field it will match
  //         as: 'category', // Add or replace field in origin collection
  //       },
  //     },
  //   ];

  //   if (sortName) {
  //     if (sortName) sort.sub_category_name = sortName;
  //     aggregateQuery.push({ $sort: sort });
  //   }

  //   CategorySub.aggregate(aggregateQuery)
  //     // .skip(page * pageSize - pageSize)
  //     // .limit(pageSize)
  //     .then((categorySubs) => {
  //       categorySubs.forEach((item) => (item.category = item.category[0]));
  //       return res.status(200).json(categorySubs);
  //     })
  //     .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  // }

  // Get user numbers by month
  async statisticUserOfMonth(req, res) {
    const myQueryLast = {
      active: true,
      $and: [
        {
          createdAt: {
            $gte: new Date(
              `${req.body.month === 1 ? req.body.year - 1 : req.body.year}-${
                req.body.month === 1 ? 12 : req.body.month - 1
              }-01`
            ),
          },
        },
        {
          createdAt: {
            $lte: new Date(
              `${req.body.month === 1 ? req.body.year - 1 : req.body.year}-${
                req.body.month === 1 ? 12 : req.body.month - 1
              }-31`
            ),
          },
        },
      ],
    };
    const myQueryCurrent = {
      active: true,
      $and: [
        {
          createdAt: {
            $gte: new Date(`${req.body.year}-${req.body.month}-01`),
          },
        },
        {
          createdAt: {
            $lte: new Date(`${req.body.year}-${req.body.month}-31`),
          },
        },
      ],
    };

    const last = await Customer.find(myQueryLast);
    const current = await Customer.find(myQueryCurrent);

    const lengthLast = last.length;
    const lengthCurrent = current.length;

    const status = lengthCurrent >= lengthLast ? 'up' : 'down';
    const percent = lengthCurrent===0 && lengthLast===0 ? 0 : ((Math.abs(lengthCurrent - lengthLast) / Math.max(lengthCurrent, lengthLast))*100).toFixed(2);

    return res.status(200).json({ status, percent, data: lengthCurrent });
  }

  // Total of current month
  async calculateTotalOfMonth(req, res) {
    const myQueryLast = {
      active: true,
      paid: true,
      $and: [
        {
          createdAt: {
            $gte: new Date(
              `${req.body.month === 1 ? req.body.year - 1 : req.body.year}-${
                req.body.month === 1 ? 12 : req.body.month - 1
              }-01`
            ),
          },
        },
        {
          createdAt: {
            $lte: new Date(
              `${req.body.month === 1 ? req.body.year - 1 : req.body.year}-${
                req.body.month === 1 ? 12 : req.body.month - 1
              }-31`
            ),
          },
        },
      ],
    };
    const myQueryCurrent = {
      active: true,
      paid: true,
      $and: [
        {
          createdAt: {
            $gte: new Date(`${req.body.year}-${req.body.month}-01`),
          },
        },
        {
          createdAt: {
            $lte: new Date(`${req.body.year}-${req.body.month}-31`),
          },
        },
      ],
    };

    let last = await Order.find(myQueryLast);
    let current = await Order.find(myQueryCurrent);

    last = last.reduce((prev, curr) => prev + Number(curr.total), 0);
    current = current.reduce((prev, curr) => prev + Number(curr.total), 0);

    const status = current >= last ? 'up' : 'down';
    const percent = current===0 && last===0 ? 0 : ((Math.abs(current - last) / Math.max(current, last))*100).toFixed(2);
    return res.status(200).json({ status, percent, data: current });
  }

  // Total of all time
  calculateTotalOfAllTime(req, res) {
    const myQuery = {
      paid: true,
      active: true,
    };

    Order.find(myQuery)
      .then((orders) => {
        if (orders) {
          const total = orders.reduce((prev, curr) => {
            return prev + Number(curr.total);
          }, 0);

          res.status(200).json(total);
        }
      })
      .catch((err) => res.status(401).json({ message: 'Có lỗi xảy ra!' }));
  }

  // orders unverified
  statisticOrdersUnverified(req, res) {
    const myQuery = {
      active: true,
      delivery_status: { $not: 0 },
    };

    Order.find(myQuery)
      .then((orders) => {
        res.status(200).json(orders.length);
      })
      .catch((err) => res.status(401).json({ message: 'Có lỗi xảy ra!' }));
  }

  // total of products
  async statisticProducts(req, res) {
    const myQueryLast = {
      active: true,
    }

    let last = await Product.find(myQueryLast);
    last = last.reduce((prev, curr) => {
      if (curr.variants && curr.variants?.length > 0)
      {
        const c = curr.variants.find(item => item.status);
        return c ? [...prev, curr] : prev;
      }
      else
        return prev;
    }, []);

    return res.status(200).json({ data: last.length });
  }

  // orders delivered
  async statisticOrdersDeliveredOfMonth(req, res) {
    const myQueryLast = {
      active: true,
      delivery_status: 0,
      $and: [
        {
          createdAt: {
            $gte: new Date(
              `${req.body.month === 1 ? req.body.year - 1 : req.body.year}-${
                req.body.month === 1 ? 12 : req.body.month - 1
              }-01`
            ),
          },
        },
        {
          createdAt: {
            $lte: new Date(
              `${req.body.month === 1 ? req.body.year - 1 : req.body.year}-${
                req.body.month === 1 ? 12 : req.body.month - 1
              }-31`
            ),
          },
        },
      ],
    };
    const myQueryCurrent = {
      active: true,
      delivery_status: 0,
      $and: [
        {
          createdAt: {
            $gte: new Date(`${req.body.year}-${req.body.month}-01`),
          },
        },
        {
          createdAt: {
            $lte: new Date(`${req.body.year}-${req.body.month}-31`),
          },
        },
      ],
    };

    const last = await Order.find(myQueryLast);
    const current = await Order.find(myQueryCurrent);

    const lengthLast = last.length;
    const lengthCurrent = current.length;

    const status = lengthCurrent >= lengthLast ? 'up' : 'down';
    const percent = lengthCurrent===0 && lengthLast===0 ? 0 : ((Math.abs(lengthCurrent - lengthLast) / Math.max(lengthCurrent, lengthLast))*100).toFixed(2);

    return res.status(200).json({ status, percent, data: lengthCurrent });
  }
}

module.exports = new StatisticController();
