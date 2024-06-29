//Importamos supertest:
import supertest from "supertest";

//Importamos chai, recuerden que es una librería de aserciones para Node.js.
import chai from "chai";
const expect = chai.expect;

//Vamos a crear la constante "requester", quien se encargará de realizar las peticiones al servidor.
const requester = supertest("http://localhost:8080");

describe("Products Router", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should get all products", async () => {
    const mockProducts = {
      docs: [{ id: 1, name: "Product 1", price: 100 }],
      totalDocs: 1,
      limit: 10,
      totalPages: 1,
      page: 1,
    };

    sandbox
      .stub(ProductController.prototype, "getProducts")
      .resolves(mockProducts);

    const res = await requester
      .get("/api/products")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body.docs).to.be.an("array");
    expect(res.body.docs.length).to.equal(1);
    expect(res.body.docs[0]).to.include({
      id: 1,
      name: "Product 1",
      price: 100,
    });
  });

  it("should create a new product", async () => {
    const newProduct = { id: 3, name: "Product 3", price: 300 };

    sandbox
      .stub(ProductController.prototype, "addProduct")
      .resolves(newProduct);

    const res = await requester
      .post("/api/products")
      .send(newProduct)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(res.body).to.include(newProduct);
  });

  it("should update an existing product", async () => {
    const updatedProduct = { id: 1, name: "Updated Product 1", price: 150 };

    sandbox
      .stub(ProductController.prototype, "updateProduct")
      .resolves(updatedProduct);

    const res = await requester
      .put("/api/products/1")
      .send(updatedProduct)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).to.include(updatedProduct);
  });

  it("should delete a product", async () => {
    sandbox
      .stub(ProductController.prototype, "deleteProduct")
      .resolves({ id: 1 });

    await requester.delete("/api/products/1").expect(204);
  });
});
