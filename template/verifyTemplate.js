const templateVerify = (object) => {
  return `
    <div>
      Bấm <a href="${object.href}">vào đây</a> để có thể xác minh tài khoản của bạn.
    </div>
  `;
};

module.exports = templateVerify;