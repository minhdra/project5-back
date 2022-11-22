const Product = require('../models/Product');
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
          item.brand = item.brand[0];
          item.discount = item.discount ? item.discount[0] : undefined;
          item.collect = item.collect ? item.collect[0] : undefined;
          item.supplier = item.supplier ? item.supplier[0] : undefined;
        });
        return res.status(200).json(products);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get featured products
  searchClientProducts(req, res) {
    let page = req.body.page || 1;
    let pageSize = req.body.pageSize || 10;
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

    if (req.body.category) {
      myQuery.category_sub = req.body.category;
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
        if (result.length > pageSize) result.length = pageSize;
        return res.status(200).json(result);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get featured products
  searchFeaturedProducts(req, res) {
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
              item.brand = item.brand[0];
              item.discount = item.discount ? item.discount[0] : undefined;
              item.collect = item.collect ? item.collect[0] : undefined;
              item.supplier = item.supplier ? item.supplier[0] : undefined;

              result.push(item);
            }
          }
        });
        if (result.length > 5) result.length = 5;
        return res.status(200).json(result);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get selling products
  searchSellingProducts(req, res) {
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
              item.brand = item.brand[0];
              item.discount = item.discount ? item.discount[0] : undefined;
              item.collect = item.collect ? item.collect[0] : undefined;
              item.supplier = item.supplier ? item.supplier[0] : undefined;

              result.push(item);
            }
          }
        });
        if (result.length > 9) result.length = 9;
        return res.status(200).json(result);
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  searchBySubCategory(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
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

module.exports = new ProductController();
