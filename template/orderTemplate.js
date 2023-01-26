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
      Bạn đã đặt hàng thành công với mã đơn hàng: ${object.orderId}, xem chi tiết tại <a scr='${object.orderLink}'>đây</a>
    </body>
    </html>
  
  `;
};
module.exports = templateSubscribe;
