const authRouter = require('./user');
const productRouter = require('./product');
const brandRouter = require('./brand');
const categoryRouter = require('./category');
const customerRouter = require('./customer');
const discountRouter = require('./discount');
const orderRouter = require('./order');
const paymentRouter = require('./payment');
const staffRouter = require('./staff');
const sub_categoryRouter = require('./sub_category');
const supplierRouter = require('./supplier');
const userRouter = require('./user');
const imageRouter = require('./image');
const slideRouter = require('./slide');
const mailRouter = require('./email');

function directionRoute(app) {
  app.use('/api/auth', authRouter);
  app.use('/api/product', productRouter);
  app.use('/api/brand', brandRouter);
  app.use('/api/category', categoryRouter);
  app.use('/api/customer', customerRouter);
  app.use('/api/discount', discountRouter);
  app.use('/api/order', orderRouter);
  app.use('/api/payment', paymentRouter);
  app.use('/api/staff', staffRouter);
  app.use('/api/sub-category', sub_categoryRouter);
  app.use('/api/supplier', supplierRouter);
  app.use('/api/user', userRouter);
  app.use('/api/slide', slideRouter);
  app.use('/api/image', imageRouter);
  app.use('/api/contact', mailRouter);
}

module.exports = directionRoute;