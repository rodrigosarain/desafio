const generarInfoError = (products) => {
  return ` Los datos estan incompletos o no son válidos. 
    Necesitamos recibir los siguientes datos: 
    - title: String,se recibio ${products.title}
    - price: String, se recibio ${products.price}
    `;
};

const generarInfoExist = () => {
  return `Ya existe querido`;
};

module.exports = {
  generarInfoError,
  generarInfoExist,
};
