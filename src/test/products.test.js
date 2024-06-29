const request = require("supertest");
const sinon = require("sinon");
const app = require("../app.js"); /

const ProductController = require("../controllers/products.controller.js");

let chai;

before(async () => {
  chai = await import("chai");
});

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

    const res = await request(app)
      .get("/api/products")
      .expect("Content-Type", /json/)
      .expect(200);

    chai.expect(res.body.docs).to.be.an("array");
    chai.expect(res.body.docs.length).to.equal(1);
    chai
      .expect(res.body.docs[0])
      .to.include({ id: 1, name: "Product 1", price: 100 });
  });

  it("should create a new product", async () => {
    const newProduct = { id: 3, name: "Product 3", price: 300 };

    sandbox
      .stub(ProductController.prototype, "addProduct")
      .resolves(newProduct);

    const res = await request(app)
      .post("/api/products")
      .send(newProduct)
      .expect("Content-Type", /json/)
      .expect(201);

    chai.expect(res.body).to.include(newProduct);
  });

  it("should update an existing product", async () => {
    const updatedProduct = { id: 1, name: "Updated Product 1", price: 150 };

    sandbox
      .stub(ProductController.prototype, "updateProduct")
      .resolves(updatedProduct);

    const res = await request(app)
      .put("/api/products/1")
      .send(updatedProduct)
      .expect("Content-Type", /json/)
      .expect(200);

    chai.expect(res.body).to.include(updatedProduct);
  });

  it("should delete a product", async () => {
    sandbox
      .stub(ProductController.prototype, "deleteProduct")
      .resolves({ id: 1 });

    await request(app).delete("/api/products/1").expect(204);
  });
});
