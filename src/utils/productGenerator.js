const faker = require("faker");

function generarProductoFicticio() {
  return {
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    price: faker.commerce.price(),
    img: faker.image.imageUrl(),
    code: faker.datatype.uuid(),
    stock: faker.datatype.number({ min: 1, max: 50 }),
    category: faker.commerce.department(),
    thumbnails: [faker.image.imageUrl(), faker.image.imageUrl()],
  };
}

function generarProductosFicticios(cantidad) {
  const productos = [];
  for (let i = 0; i < cantidad; i++) {
    productos.push(generarProductoFicticio());
  }
  return productos;
}

module.exports = {
  generarProductosFicticios,
};
