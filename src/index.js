const VGGPaymentGateway = require('./VGGPaymentGateway');

const config = {
    projectId: '999DEMO',
    SecretKey: '88d4012da55e249ab48cffbe2f19d6326e524680d5dfa8b5990b02fdc9473682',
    SecretIV: '6ad4dabbb9844769fb33e8655a78a7fc'
};

const gateway = new VGGPaymentGateway(config);

//Create a payment order
const orderData = {
    m_orderid: 'yourShopOrder12345679',
    currency: 'EUR',
    amount: '815.23',
    notify_url: 'https://my-notify-api.com',
    notify_txt: '{"Product":"iPhone 13","modelColor":"red","myStrings":"Custom Strings"}',
};
gateway.createOrder(orderData)
    .then(response => console.log('Create Order Response:', response))
    .catch(error => console.error('Error:', error));


//Create a recharge order
const TopUpData = {
    m_userid: 'userdemo001',
    firewall: '2',
    notify_url: 'https://my-notify-api.com',

};
gateway.createTopUp(TopUpData)
    .then(response => console.log('Create Order Response:', response))
    .catch(error => console.error('Error:', error));


// VGGPay sends callback data to your server. Here is an example of how to decrypt the callback data.
const decryptData = "jdtdW1+nP8D3geSHQ0+5h0V5Dpez3Lmon0dpW6Dd4BnOEPDqdWNeuow7MM0XHxshHDJxP1QXslO81Enw+JryoRqEWCQYaS282TjqxXtxXfkL1NeLqwlJsKk/EKCnlDGZy2tP5fgCrGaWxAhGWVUtrTppidgFmJrHGh1c5qKFZe0jsxzIY+YI37KyhsOCJzKYgP4GwkQljh+SNF0AuH6vmnI710cczfIXjT2/GJjnJugnVtYuV/W4UN8qgPj3NAZWuDXM6oe1xTufGb8lNU1HctbBRheqUU2/xyGqJz8AOZnb9Z6//r7U90vfdhBolZ94PojBucyifPyShnTaNS+Uy4ZB6UmACWmFtDZTjmOzLbm/dL0ppFVxqMbxQjpTr7OeZKHEkMZLoxJygjThoTbUNQspM5DeVgwgeXHBUnlGma9MkOuIPppfbWrGbtlpZVj6";

let dData = gateway.decryptData(decryptData);
console.log(dData)

