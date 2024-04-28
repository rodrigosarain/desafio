const generarInfoError = (products) => {
  return ` Los datos estan incompletos o no son válidos. 
    Necesitamos recibir los siguientes datos: 
    - title: se recibio ${products.title}
    - price: se recibio ${products.price}
    `;
};

const generarInfoExist = () => {
  return `Ya existe querido`;
};

module.exports = {
  generarInfoError,
  generarInfoExist,
};
