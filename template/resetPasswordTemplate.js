const templateResetPassword = (object) => {
  return `
    <div>
      Nhấn <a href="${object.href}">vào đây</a> để reset mật khẩu.
    </div>
  `;
};

module.exports = templateResetPassword;