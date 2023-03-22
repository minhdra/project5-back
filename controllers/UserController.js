const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Staff = require('../models/Staff');
const Cart = require('../models/Cart');
const {
  registerValidator,
  changePasswordValidator,
} = require('../validations/auth');
const { ObjectId } = require('mongodb');

let refreshTokens = [];

class UserController {
  // Get all
  search(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sort = req.body.sort;
    const myQuery = {
      id: { $exists: true },
      username: { $regex: `.*${req.body.username ?? ''}.*`, $options: 'i' },
      active: true,
    };
    User.find(myQuery)
      .sort(sort ? { username: sort } : '')
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((users) => res.json(users))
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by id
  getById(req, res) {
    const myQuery = { _id: ObjectId(req.params._id), active: true };
    User.findOne(myQuery)
      .then((user) => {
        if (user) return res.json(user);
        return res.status(404).json({
          message: 'Không tìm thấy',
        });
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Get by id
  getByIdClient(req, res) {
    const myQuery = { _id: ObjectId(req.params._id), active: true };
    User.findOne(myQuery)
      .then((user) => {
        if (user)
          return res.json({
            username: user.username,
            email: user.email,
            _id: user._id,
          });
        return res.status(404).json({
          message: 'Không tìm thấy tài khoản này!',
        });
      })
      .catch((err) => res.status(400).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Login
  async login(req, res) {
    const options = {
      $or: [{ username: req.body.username }, { email: req.body.username }],
      // username: req.body.username,
      active: true,
    };

    // return res.status(200).send('logging')

    const user = await User.findOne(options).catch((err) =>
      res.status(400).json({ message: 'Có lỗi xảy ra!' })
    );

    if (!user)
      return res
        .status(422)
        .json({ message: 'Tài khoản hoặc mật khẩu không chính xác!' });

    const checkPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!checkPassword)
      return res
        .status(422)
        .json({ message: 'Tài khoản hoặc mật khẩu không chính xác!' });

    // role 2 is client
    if (
      (req.body.type === 'admin' && user.role === 2) ||
      (req.body.type === 'client' && user.role !== 2) ||
      !req.body.type ||
      (req.body.type !== 'admin' && req.body.type !== 'client')
    )
      return res.status(422).json({ message: 'Thông tin không chính xác!' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    refreshTokens.push(refreshToken);
    res.cookie('refresh_token', refreshToken, {
      path: '/',
      sameSite: 'strict',
    });

    const { password, ...others } = user._doc;
    // res.header('auth-token', token);
    const message = `${user.username} đang đăng nhập...`;
    return res.status(200).json({ data: { ...others, accessToken }, message });
  }

  async requestRefreshToken(req, res) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken)
      res.status(401).json({ message: 'Bạn chưa được chứng thực!' });
    // if (!refreshTokens.includes(refreshToken))
    //   res.status(401).json({ message: 'Bạn chưa được chứng thực' });
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) res.status(401).json({ message: 'Xin may day!' });
      else {
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        refreshTokens.push(newRefreshToken);
        res.cookie('refresh_token', newRefreshToken, {
          path: '/',
          sameSite: 'strict',
        });

        return res.status(200).json({ accessToken: newAccessToken });
      }
    });
  }

  // Register
  async register(req, res) {
    await User.find()
      .sort({ id: -1 })
      .limit(1)
      .then(async (data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        const { error } = registerValidator(req.body);

        if (error)
          return res.status(422).json({ message: error.details[0].message });

        const checkUsernameExist = await User.findOne({
          username: req.body.username,
          active: true,
        });

        if (checkUsernameExist)
          return res.status(422).json({ message: 'Tài khoản đã tồn tại!' });

        const checkEmailExist = await User.findOne({
          email: req.body.email,
          active: true,
        });

        // if (checkEmailExist && checkEmailExist?.role >= 2)
        if (checkEmailExist)
          return res.status(422).json({ message: 'Email đã tồn tại!' });

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User();
        user.id = newId;
        user.username = req.body.username;
        user.password = hashPassword;
        user.email = req.body.email;
        user.role = req.body.role;

        user.save(async (err, user) => {
          if (err) {
            return res.status(400).json({ message: 'Hệ thống đang có lỗi!' });
          } else {
            await createUser(user.role, user);

            return await res
              .status(200)
              .json({ message: 'Đăng ký thành công!', user });
          }
        });
      });
  }

  // Verify
  async verifyUser(req, res) {
    const myQuery = { _id: ObjectId(req.body._id), active: true };

    User.findOne(myQuery)
      .then((user) => {
        if (!user)
          return res
            .status(404)
            .json({ message: 'Không tìm thấy tài khoản này!' });
        if (user.verified)
          return res
            .status(422)
            .json({ message: 'Tài khoản của bạn đã được xác thực rồi.' });

        user.verified = true;
        user.save((err, item) => {
          if (err) return res.status(404).json({ message: 'Có lỗi xảy ra!' });
          return res.status(200).json({ message: 'Xác thực thành công!' });
        });
      })
      .catch((err) => res.status(500).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Change password
  async changePassword(req, res) {
    const myQuery = { _id: ObjectId(req.body._id), active: true };
    const user = await User.findOne(myQuery);
    if (!user) return res.status(422).json('Không tìm thấy!');

    const { error } = changePasswordValidator(req.body);

    if (error) return res.status(422).json(error.details[0].message);

    // Start check old password
    const checkPassword = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );

    if (!checkPassword)
      return res.status(422).json({ message: 'Mật khẩu không chính xác!' });
    // End check old password

    // Start check old password and check new password
    const checkPassword2 = await bcrypt.compare(
      req.body.oldPassword,
      req.body.newPassword
    );

    if (checkPassword2)
      return res
        .status(422)
        .json({ message: 'Mật khẩu mới của bạn giống với mật khẩu cũ!' });
    // End check old password and check new password

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.newPassword, salt);

    user.password = hashPassword;
    user.save((err, item) => {
      if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
      else
        return res
          .status(200)
          .json({ message: 'Thay đổi mật khẩu thành công!' });
    });
  }

  // Delete
  delete(req, res) {
    const myQuery = { _id: ObjectId(req.params._id), active: true };
    User.findOne(myQuery)
      .then((user) => {
        if (user) {
          user.active = false;
          user.save(async (err, user) => {
            if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
            else {
              await deleteUser(user);
              return await res
                .status(200)
                .json({ data: item, message: 'Cập nhật thành công!' });
            }
          });
        } else return res.status(404).json({ message: 'Không tìm thấy!' });
      })
      .catch((err) => res.status(404).json({ message: 'Có lỗi xảy ra!' }));
  }

  // Reset password
  async resetPassword(req, res) {
    const myQuery = { email: req.body.email };
    const user = await User.findOne({ email: myQuery.email });
    if (!user)
      return res.status(404).json({ message: 'Không tìm thấy emai này' });
    const pass = (Math.random() + 1).toString(36).toUpperCase().substring(6);

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(pass, salt);

    user.password = newPassword;
    user.save((err) => {
      if (err) return res.status(401).json({ message: 'Có lỗi xảy ra' });
      return res
        .status(200)
        .json({
          data: { newPass: pass },
          message: 'Reset mật khẩu thành công',
        });
    });
  }

  // create user

  // createCart(customer) {
  //   let cart;
  //   Cart.find()
  //     .sort({ id: -1 })
  //     .limit(1)
  //     .then((data) => {
  //       const newId = data.length > 0 ? data[0].id + 1 : 1;
  //       cart = new Cart({
  //         id: newId,
  //         customer: ObjectId(customer._id),
  //       });
  //       cart.save((err, item) => {
  //         if (err) {
  //           return res.status(400).json({ message: 'Có lỗi xảy ra!' });
  //         } else {
  //           return res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
  //         }
  //       });
  //     });
  // }

  // delete user

  // deleteCart(customer) {
  //   const myQuery = { customer: ObjectId(customer._id) };
  //   Cart.findOne(myQuery)
  //     .then((cart) => {
  //       if (cart) {
  //         cart.active = false;
  //         cart.save((err, item) => {
  //           if (err) return res.status(400).json({ message: 'Có lỗi xảy ra!' });
  //           else {
  //             return res.status(200).json({ data: item, message: 'Cập nhật thành công!' });
  //           }
  //         });
  //       } else return res.status(404).json({ message: 'Không tìm thấy!' });
  //     })
  //     .catch((err) => res.status(404).json({ message: 'Có lỗi xảy ra!' }));
  // }
}

function createUser(role, user) {
  if (role === 2) {
    let customer;
    Customer.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        customer = new Customer({
          id: newId,
          user: ObjectId(user._id),
          path: user.username,
          carts: [],
          first_name: '',
          last_name: '',
          phone: '',
          avatar:
            'https://res.cloudinary.com/de2haobkl/image/upload/v1669357208/avatar_zhsccj.jpg',
          address: {},
          delivery_addresses: [],
        });
        customer.save();
      });
  } else {
    let staff;
    Staff.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        staff = new Staff({
          id: newId,
          user: ObjectId(user._id),
          first_name: '',
          last_name: '',
          phone: '',
          avatar: '',
          address: {},
        });
        staff.save();
      });
  }
}

function deleteUser(user) {
  const myQuery = { user: ObjectId(user._id) };
  if (user.role === 0) {
    Customer.findOne(myQuery).then((customer) => {
      if (customer) {
        customer.active = false;
        customer.save();
      }
    });
  } else {
    Staff.findOne(myQuery).then((staff) => {
      if (staff) {
        staff.active = false;
        staff.save();
      }
    });
  }
}

// Generate access token
function generateAccessToken(user) {
  const token = jwt.sign(
    { _id: user._id, username: user.username, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '365d',
    }
  );

  return token;
}

// Generate access token
function generateRefreshToken(user) {
  const token = jwt.sign(
    { _id: user._id, username: user.username, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '365d',
    }
  );

  return token;
}

module.exports = new UserController();
