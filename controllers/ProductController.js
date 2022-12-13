const Product = require('../models/Product');
const Order = require('../models/Order');
const Brand = require('../models/Brand');
const { ObjectId } = require('mongodb');

class ProductController {
  // Get all
  search(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sortName = req.body.sortName;
    let sort = {};
    const myQuery = {
      id: { $exists: true },
      product_name: {
        $regex: `.*${req.body.product_name ?? ''}.*`,
        $options: 'i',
      },
      origin: { $regex: `.*${req.body.origin ?? ''}.*`, $options: 'i' },
      material: { $regex: `.*${req.body.material ?? ''}.*`, $options: 'i' },
      style: { $regex: `.*${req.body.style ?? ''}.*`, $options: 'i' },
      active: true,
    };

    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'discounts', // Match with to collection what want to search
          startWith: '$discount', // Name of array (origin)
          connectFromField: 'discount', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'discount', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'collects', // Match with to collection what want to search
          startWith: '$collect', // Name of array (origin)
          connectFromField: 'collect', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'collect', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'categories', // Match with to collection what want to search
          startWith: '$category', // Name of array (origin)
          connectFromField: 'category', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'sub_categories', // Match with to collection what want to search
          startWith: '$category_sub', // Name of array (origin)
          connectFromField: 'category_sub', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category_sub', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'brands', // Match with to collection what want to search
          startWith: '$brand', // Name of array (origin)
          connectFromField: 'brand', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'brand', // Add or replace field in origin collection
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

    if (sortName) {
      if (sortName) sort.product_name = sortName;
      aggregateQuery.push({ $sort: sort });
    }

    Product.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((products) => {
        products.forEach((item) => {
          item.category_sub = item.category_sub[0];
          item.category = item.category[0];
          item.brand = item.brand[0];
          item.discount = item.discount ? item.discount[0] : undefined;
          item.collect = item.collect ? item.collect[0] : undefined;
          item.supplier = item.supplier ? item.supplier[0] : undefined;
        });
        return res.status(200).json(products);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get products for client
  searchClientProducts(req, res) {
    let page = req.body.page || 1;
    let pageSize = req.body.pageSize;
    const myQuery = {
      id: { $exists: true },
      product_name: {
        $regex: `.*${req.body.product_name ?? ''}.*`,
        $options: 'i',
      },
      origin: { $regex: `.*${req.body.origin ?? ''}.*`, $options: 'i' },
      material: { $regex: `.*${req.body.material ?? ''}.*`, $options: 'i' },
      style: { $regex: `.*${req.body.style ?? ''}.*`, $options: 'i' },
      active: true,
    };

    if (req.body.brand) myQuery.brand = req.body.brand;

    if (req.body.category_sub) myQuery.category_sub = req.body.category_sub;
    else {
      if (req.body.category) myQuery.category = req.body.category;
    }

    if (req.body.collect) {
      myQuery.collect = req.body.collect;
    }

    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'discounts', // Match with to collection what want to search
          startWith: '$discount', // Name of array (origin)
          connectFromField: 'discount', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'discount', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'collects', // Match with to collection what want to search
          startWith: '$collect', // Name of array (origin)
          connectFromField: 'collect', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'collect', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'sub_categories', // Match with to collection what want to search
          startWith: '$category_sub', // Name of array (origin)
          connectFromField: 'category_sub', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category_sub', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'categories', // Match with to collection what want to search
          startWith: '$category', // Name of array (origin)
          connectFromField: 'category', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'brands', // Match with to collection what want to search
          startWith: '$brand', // Name of array (origin)
          connectFromField: 'brand', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'brand', // Add or replace field in origin collection
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

    const priceFilter = req.body.priceFilter;

    let sort = {};
    switch (req.body.sort) {
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'az':
        sort.product_name = 1;
        break;
      case 'za':
        sort.product_name = -1;
        break;
      default:
        sort._id = 1;
        break;
    }

    if (page && pageSize)
      aggregateQuery.push(
        { $limit: pageSize },
        { $skip: page * pageSize - pageSize }
      );

    aggregateQuery.push({ $sort: sort });

    Product.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((products) => {
        let result = [];
        products.forEach((item) => {
          if (item.variants.length > 0) {
            let newVariants = item.variants.filter(
              (variant) => variant.status === true
            );
            if (newVariants.length > 0 && priceFilter) {
              let arrValues;
              switch (true) {
                case priceFilter.indexOf('<') >= 0:
                  arrValues = priceFilter.split('<');
                  break;
                case priceFilter.indexOf('>') >= 0:
                  arrValues = priceFilter.split('>');
                  break;
                case priceFilter.indexOf('-') >= 0:
                  arrValues = priceFilter.split('-');
                  break;

                default:
                  break;
              }
              if (arrValues) {
                newVariants = newVariants.filter((item) => {
                  const price = Number(item.sell_price.replace(/,/g, ''));
                  if (priceFilter.indexOf('<') >= 0)
                    return price < Number(arrValues[1]) * 1000;
                  else if (priceFilter.indexOf('>') >= 0)
                    return price > Number(arrValues[1]) * 1000;
                  else if (priceFilter.indexOf('-') >= 0)
                    return (
                      price > Number(arrValues[0]) * 1000 &&
                      price < Number(arrValues[1]) * 1000
                    );
                });
              }
            }
            if (newVariants.length > 0) {
              item.variants = newVariants;
              const arr = item.variants.map((variant) =>
                Number(variant.sell_price.replace(/,/g, ''))
              );
              item.min_price = Math.min(...arr).toLocaleString('en');
              item.max_price = Math.max(...arr);
              item.category_sub = item.category_sub[0];
              item.category = item.category[0];
              item.brand = item.brand[0];
              item.discount = item.discount ? item.discount[0] : undefined;
              item.collect = item.collect ? item.collect[0] : undefined;
              item.supplier = item.supplier ? item.supplier[0] : undefined;
              result.push(item);
            }
          }
        });
        if (req.body.sort === 'priceLowToHigh')
          result = result.sort((a, b) => a.max_price - b.max_price);
        else if (req.body.sort === 'priceHighToLow')
          result = result.sort((a, b) => b.max_price - a.max_price);
        result.forEach(
          (item) => (item.max_price = item.max_price.toLocaleString('en'))
        );
        // if (result.length > pageSize) result.length = pageSize;
        return res.status(200).json(result);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get featured products
  searchFeaturedProducts(req, res) {
    let page = req.body.page || 1;
    let pageSize = req.body.pageSize;
    let sortName = req.body.sortName;
    let sort = {};
    const myQuery = {
      id: { $exists: true },
      active: true,
    };

    Order.find()
      .then(async (orders) => {
        let products = orders.reduce(
          (prev, curr) => [...prev, ...curr.details],
          []
        );
        products = products.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.product_id === value.product_id
            )
        );

        products.length = pageSize || 5;

        products = await products.reduce(async (prev, curr) => {
          return [...prev, await Product.findOne({id: curr.product_id})];
        }, []);

        const result = [];
        await products.forEach(async (item) => {
          const clone = JSON.parse(JSON.stringify(item));
          if (clone.variants.length > 0) {
            const newVariants = clone.variants.filter(
              (variant) => variant.status === true
            );
            if (newVariants.length > 0) {
              clone.variants = newVariants;
              const arr = clone.variants.map((variant) =>
                Number(variant.sell_price.replace(/,/g, ''))
              );
              clone.min_price = Math.min(...arr)?.toLocaleString('en');
              clone.max_price = Math.max(...arr)?.toLocaleString('en');
              // clone.category_sub = clone.category_sub[0];
              // clone.category = clone.category[0];
              // clone.brand = await Brand.findOne({id: clone.brand});
              // clone.discount = clone.discount ? clone.discount[0] : undefined;
              // clone.collect = clone.collect ? clone.collect[0] : undefined;
              // clone.supplier = clone.supplier ? clone.supplier[0] : undefined;
              result.push(clone);
            }
          }
        });
        return res.status(200).json(result);
      })
      .catch((err) => res.status(401).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get selling products
  searchSellingProducts(req, res) {
    let page = req.body.page;
    let pageSize = req.body.pageSize;
    let sortName = req.body.sortName;
    let sort = {};
    const myQuery = {
      id: { $exists: true },
      product_name: {
        $regex: `.*${req.body.product_name ?? ''}.*`,
        $options: 'i',
      },
      origin: { $regex: `.*${req.body.origin ?? ''}.*`, $options: 'i' },
      material: { $regex: `.*${req.body.material ?? ''}.*`, $options: 'i' },
      style: { $regex: `.*${req.body.style ?? ''}.*`, $options: 'i' },
      active: true,
    };

    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'discounts', // Match with to collection what want to search
          startWith: '$discount', // Name of array (origin)
          connectFromField: 'discount', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'discount', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'collects', // Match with to collection what want to search
          startWith: '$collect', // Name of array (origin)
          connectFromField: 'collect', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'collect', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'sub_categories', // Match with to collection what want to search
          startWith: '$category_sub', // Name of array (origin)
          connectFromField: 'category_sub', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category_sub', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'categories', // Match with to collection what want to search
          startWith: '$category', // Name of array (origin)
          connectFromField: 'category', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'brands', // Match with to collection what want to search
          startWith: '$brand', // Name of array (origin)
          connectFromField: 'brand', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'brand', // Add or replace field in origin collection
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

    aggregateQuery.push({ $sort: { createdAt: -1 } });

    if (page && pageSize)
      aggregateQuery.push(
        { $limit: pageSize },
        { $skip: page * pageSize - pageSize }
      );

    Product.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((products) => {
        const result = [];
        products.forEach((item) => {
          if (item.variants.length > 0) {
            const newVariants = item.variants.filter(
              (variant) => variant.status === true
            );
            if (newVariants.length > 0) {
              item.variants = newVariants;
              const arr = item.variants.map((variant) =>
                Number(variant.sell_price.replace(/,/g, ''))
              );
              item.min_price = Math.min(...arr)?.toLocaleString('en');
              item.max_price = Math.max(...arr)?.toLocaleString('en');
              item.category_sub = item.category_sub[0];
              item.category = item.category[0];
              item.brand = item.brand[0];
              item.discount = item.discount ? item.discount[0] : undefined;
              item.collect = item.collect ? item.collect[0] : undefined;
              item.supplier = item.supplier ? item.supplier[0] : undefined;

              result.push(item);
            }
          }
        });
        return res.status(200).json(result);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get new products
  searchNewProducts(req, res) {
    let page = req.body.page;
    let pageSize = req.body.pageSize;
    let sortName = req.body.sortName;
    let sort = {};
    const myQuery = {
      id: { $exists: true },
      product_name: {
        $regex: `.*${req.body.product_name ?? ''}.*`,
        $options: 'i',
      },
      origin: { $regex: `.*${req.body.origin ?? ''}.*`, $options: 'i' },
      material: { $regex: `.*${req.body.material ?? ''}.*`, $options: 'i' },
      style: { $regex: `.*${req.body.style ?? ''}.*`, $options: 'i' },
      active: true,
    };

    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'discounts', // Match with to collection what want to search
          startWith: '$discount', // Name of array (origin)
          connectFromField: 'discount', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'discount', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'collects', // Match with to collection what want to search
          startWith: '$collect', // Name of array (origin)
          connectFromField: 'collect', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'collect', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'sub_categories', // Match with to collection what want to search
          startWith: '$category_sub', // Name of array (origin)
          connectFromField: 'category_sub', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category_sub', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'categories', // Match with to collection what want to search
          startWith: '$category', // Name of array (origin)
          connectFromField: 'category', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'brands', // Match with to collection what want to search
          startWith: '$brand', // Name of array (origin)
          connectFromField: 'brand', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'brand', // Add or replace field in origin collection
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

    aggregateQuery.push({ $sort: { createdAt: -1 } });

    if (page && pageSize)
      aggregateQuery.push(
        { $limit: pageSize },
        { $skip: page * pageSize - pageSize }
      );

    Product.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((products) => {
        const result = [];
        products.forEach((item) => {
          if (item.variants.length > 0) {
            const newVariants = item.variants.filter(
              (variant) => variant.status === true
            );
            if (newVariants.length > 0) {
              item.variants = newVariants;
              const arr = item.variants.map((variant) =>
                Number(variant.sell_price.replace(/,/g, ''))
              );
              item.min_price = Math.min(...arr)?.toLocaleString('en');
              item.max_price = Math.max(...arr)?.toLocaleString('en');
              item.category_sub = item.category_sub[0];
              item.category = item.category[0];
              item.brand = item.brand[0];
              item.discount = item.discount ? item.discount[0] : undefined;
              item.collect = item.collect ? item.collect[0] : undefined;
              item.supplier = item.supplier ? item.supplier[0] : undefined;

              result.push(item);
            }
          }
        });
        return res.status(200).json(result);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  searchBySubCategory(req, res) {
    let page = req.body.page;
    let pageSize = req.body.pageSize;
    let sortName = req.body.sortName;
    let sort = {};
    const myQuery = {
      id: { $exists: true },
      category_sub: req.body.category_sub,
      product_name: { $regex: `.*${req.body.product_name}.*`, $options: 'i' },
      origin: { $regex: `.*${req.body.origin}.*`, $options: 'i' },
      material: { $regex: `.*${req.body.material}.*`, $options: 'i' },
      style: { $regex: `.*${req.body.style}.*`, $options: 'i' },
      active: true,
    };

    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'discounts', // Match with to collection what want to search
          startWith: '$discount', // Name of array (origin)
          connectFromField: 'discount', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'discount', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'collects', // Match with to collection what want to search
          startWith: '$collect', // Name of array (origin)
          connectFromField: 'collect', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'collect', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'sub_categories', // Match with to collection what want to search
          startWith: '$category_sub', // Name of array (origin)
          connectFromField: 'category_sub', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category_sub', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'categories', // Match with to collection what want to search
          startWith: '$category', // Name of array (origin)
          connectFromField: 'category', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'brands', // Match with to collection what want to search
          startWith: '$brand', // Name of array (origin)
          connectFromField: 'brand', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'brand', // Add or replace field in origin collection
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

    if (sortName) {
      if (sortName) sort.product_name = sortName;
      aggregateQuery.push({ $sort: sort });
    }

    if (page && pageSize)
      aggregateQuery.push(
        { $limit: pageSize },
        { $skip: page * pageSize - pageSize }
      );

    Product.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((products) => {
        products.forEach((item) => {
          item.category_sub = item.category_sub[0];
          item.category = item.category[0];
          item.brand = item.brand[0];
          item.discount = item.discount ? item.discount[0] : undefined;
          item.collect = item.collect ? item.collect[0] : undefined;
          item.supplier = item.supplier ? item.supplier[0] : undefined;
        });
        return res.status(200).json(products);
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
          from: 'discounts', // Match with to collection what want to search
          startWith: '$discount', // Name of array (origin)
          connectFromField: 'discount', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'discount', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'collects', // Match with to collection what want to search
          startWith: '$collect', // Name of array (origin)
          connectFromField: 'collect', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'collect', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'sub_categories', // Match with to collection what want to search
          startWith: '$category_sub', // Name of array (origin)
          connectFromField: 'category_sub', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category_sub', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'categories', // Match with to collection what want to search
          startWith: '$category', // Name of array (origin)
          connectFromField: 'category', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'brands', // Match with to collection what want to search
          startWith: '$brand', // Name of array (origin)
          connectFromField: 'brand', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'brand', // Add or replace field in origin collection
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
    Product.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((products) => {
        products[0].category_sub = products[0].category_sub[0];
        products[0].category = products[0].category[0];
        products[0].brand = products[0].brand[0];
        products[0].discount = products[0].discount
          ? products[0].discount[0]
          : undefined;
        products[0].collect = products[0].collect
          ? products[0].collect[0]
          : undefined;
        products[0].supplier = products[0].supplier
          ? products[0].supplier[0]
          : undefined;
        return res.status(200).json(products[0]);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by path for client
  getByPathClient(req, res) {
    const myQuery = { path: req.params.path, active: true };
    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'discounts', // Match with to collection what want to search
          startWith: '$discount', // Name of array (origin)
          connectFromField: 'discount', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'discount', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'collects', // Match with to collection what want to search
          startWith: '$collect', // Name of array (origin)
          connectFromField: 'collect', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'collect', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'sub_categories', // Match with to collection what want to search
          startWith: '$category_sub', // Name of array (origin)
          connectFromField: 'category_sub', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category_sub', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'categories', // Match with to collection what want to search
          startWith: '$category', // Name of array (origin)
          connectFromField: 'category', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'brands', // Match with to collection what want to search
          startWith: '$brand', // Name of array (origin)
          connectFromField: 'brand', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'brand', // Add or replace field in origin collection
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
    Product.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((products) => {
        if (products[0].variants.length > 0) {
          const newVariants = products[0].variants.filter(
            (variant) => variant.status === true
          );
          if (newVariants.length > 0) {
            products[0].variants = newVariants;
            const arr = products[0].variants.map((variant) =>
              Number(variant.sell_price.replace(/,/g, ''))
            );
            products[0].min_price = Math.min(...arr)?.toLocaleString('en');
            products[0].max_price = Math.max(...arr)?.toLocaleString('en');
            products[0].category_sub = products[0].category_sub[0];
            products[0].category = products[0].category[0];
            products[0].brand = products[0].brand[0];
            products[0].discount = products[0].discount
              ? products[0].discount[0]
              : undefined;
            products[0].collect = products[0].collect
              ? products[0].collect[0]
              : undefined;
            products[0].supplier = products[0].supplier
              ? products[0].supplier[0]
              : undefined;

            return res.status(200).json(products[0]);
          }
        }
        return res.status(404).json({ message: 'Không tìm thấy!' });
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
          from: 'discounts', // Match with to collection what want to search
          startWith: '$discount', // Name of array (origin)
          connectFromField: 'discount', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'discount', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'collects', // Match with to collection what want to search
          startWith: '$collect', // Name of array (origin)
          connectFromField: 'collect', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'collect', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'sub_categories', // Match with to collection what want to search
          startWith: '$category_sub', // Name of array (origin)
          connectFromField: 'category_sub', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category_sub', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'categories', // Match with to collection what want to search
          startWith: '$category', // Name of array (origin)
          connectFromField: 'category', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'category', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'brands', // Match with to collection what want to search
          startWith: '$brand', // Name of array (origin)
          connectFromField: 'brand', // Field of array
          connectToField: 'id', // from which field it will match
          as: 'brand', // Add or replace field in origin collection
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
    Product.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((products) => {
        products[0].category_sub = products[0].category_sub[0];
        products[0].category = products[0].category[0];
        products[0].brand = products[0].brand[0];
        products[0].discount = products[0].discount
          ? products[0].discount[0]
          : undefined;
        products[0].collect = products[0].collect
          ? products[0].collect[0]
          : undefined;
        products[0].supplier = products[0].supplier
          ? products[0].supplier[0]
          : undefined;
        return res.status(200).json(products[0]);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Create
  create(req, res) {
    let product;
    Product.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        product = new Product();
        product.id = newId;
        product.product_name = req.body.product_name;
        product.path = req.body.path;
        product.thumbnail = req.body.thumbnail;
        product.discount = req.body.discount;
        product.collect = req.body.collect;
        product.category = req.body.category;
        product.category_sub = req.body.category_sub;
        product.brand = req.body.brand;
        // product.supplier = req.body.supplier;
        product.origin = req.body.origin;
        product.material = req.body.material;
        product.style = req.body.style;
        product.description = req.body.description;
        // product.variants = req.body.variants;
        product.save((err) => {
          if (err) {
            return res.status(400).json({ message: 'Có lỗi xảy ra!' });
          } else {
            return res.status(200).json({ message: 'Cập nhật thành công!' });
          }
        });
      });
  }

  // update
  async update(req, res) {
    Product.findOne({ _id: ObjectId(req.body._id) })
      .then((product) => {
        if (!product)
          return res.status(404).json({ message: 'Không tìm thấy!' });
        product.product_name = req.body.product_name;
        product.path = req.body.path;
        product.thumbnail = req.body.thumbnail;
        product.discount = req.body.discount;
        product.collect = req.body.collect;
        product.category = req.body.category;
        product.category_sub = req.body.category_sub;
        product.brand = req.body.brand;
        product.supplier = req.body.supplier;
        product.origin = req.body.origin;
        product.material = req.body.material;
        product.style = req.body.style;
        product.description = req.body.description;
        product.variants = req.body.variants;
        product.save((err) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ message: 'Cập nhật thành công!' });
        });
      })
      .catch((err) => res.status(422).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    Product.findOne(myQuery)
      .then((product) => {
        if (product) {
          product.active = false;
          product.save((err) => {
            if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
            else
              return res.status(200).json({ message: 'Cập nhật thành công!' });
          });
        } else return res.status(404).json({ message: 'Không tìm thấy!' });
      })
      .catch((err) => res.status(404).json({ message: 'Có lỗi xảy ra!' }));
  }
}

const getAggregate = (myQuery='') => {
  let aggregateQuery = [
    { $match: myQuery },
    {
      $graphLookup: {
        from: 'discounts', // Match with to collection what want to search
        startWith: '$discount', // Name of array (origin)
        connectFromField: 'discount', // Field of array
        connectToField: 'id', // from which field it will match
        as: 'discount', // Add or replace field in origin collection
      },
    },
    {
      $graphLookup: {
        from: 'collects', // Match with to collection what want to search
        startWith: '$collect', // Name of array (origin)
        connectFromField: 'collect', // Field of array
        connectToField: 'id', // from which field it will match
        as: 'collect', // Add or replace field in origin collection
      },
    },
    {
      $graphLookup: {
        from: 'sub_categories', // Match with to collection what want to search
        startWith: '$category_sub', // Name of array (origin)
        connectFromField: 'category_sub', // Field of array
        connectToField: 'id', // from which field it will match
        as: 'category_sub', // Add or replace field in origin collection
      },
    },
    {
      $graphLookup: {
        from: 'categories', // Match with to collection what want to search
        startWith: '$category', // Name of array (origin)
        connectFromField: 'category', // Field of array
        connectToField: 'id', // from which field it will match
        as: 'category', // Add or replace field in origin collection
      },
    },
    {
      $graphLookup: {
        from: 'brands', // Match with to collection what want to search
        startWith: '$brand', // Name of array (origin)
        connectFromField: 'brand', // Field of array
        connectToField: 'id', // from which field it will match
        as: 'brand', // Add or replace field in origin collection
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
  return aggregateQuery;
}

module.exports = new ProductController();
