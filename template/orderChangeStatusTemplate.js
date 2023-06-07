const templateSubscribe = (object) => {
  return `
  <!doctype html>
    <html>

    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>Simple Transactional Email</title>
    </head>
    <body>
      <h1>Xin chào, ${object.first_name} ${object.last_name}</h1>
      Đơn hàng của bạn đã chuyển sang trạng thái <span style="color: red; font-weight: bold">${object.status}</span>
    </body>
    </html>
  
  `;
};
module.exports = templateSubscribe;
