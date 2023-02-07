const { Router } = require("express");
const uploader = require("../utils");
// const {options} = require("../config/options");

const router = Router();

//MONGODB

const ProductMongoManager = require("../dao/mongoManager/productManager.mongoose");
const CartMongoManager = require("../dao/mongoManager/cartManager.mongoose");

const ecommerce = new ProductMongoManager();
const ecommerceCarts = new CartMongoManager();

//PRODUCTS

router.get("/", async (req, res) => {
  const product = await ecommerce.getProducts();

  if (product && product != false) {
    const data = {
      status: true,
      title: "Real Time Products",
      style: "index.css",
      list: product,
    };

    res.render("realTimeProducts", data);
  } else {
    return res.status(404).render("realTimeProducts", {
      status: false,
      style: "index.css",
      data: "Empty list",
    });
  }
});

router.post("/", uploader.single("thumbnail"), async (req, res) => {
  const addNewProduct = req.body;
  const socket = req.app.get("socket");
  const filename = req.file.filename;

  const newProduct = await ecommerce.addProduct(
    addNewProduct.title,
    addNewProduct.description,
    addNewProduct.code,
    +addNewProduct.price,
    (addNewProduct.thumbnail = filename),
    +addNewProduct.stock,
    addNewProduct.category,
    addNewProduct.status
  );
  socket.emit("newProduct", newProduct);
  res.send({ status: "success" });
});

//CART

router.get("/cart/", async (req, res) => {
  const cartById = await ecommerceCarts.getCarts();

  if (cartById && cartById != false) {
    const data = {
      status: true,
      title: "Cart",
      style: "index.css",
      list: cartById,
    };

    res.render("cart", data);
  } else {
    return res.status(404).render("cart", {
      status: false,
      style: "index.css",
      data: "The cart is empty",
    });
  }
});

router.get("/cart/:cid", async (req, res) => {
  const cartId = +req.params.cid;
  const cartById = await ecommerceCarts.getCartById(cartId);

  if (cartById && cartById != false) {
    const data = {
      status: true,
      title: "Cart",
      style: "index.css",
      list: cartById,
    };

    res.render("cart", data);
  } else {
    return res.status(404).render("cart", {
      status: false,
      style: "index.css",
      data: "The cart is empty",
    });
  }
});

// CHAT
router.get("/chat", (req, res) => {
  const data = {
    status: true,
    title: "Chat",
    style: "index.css",
  };

  res.render("chat", data);
});

module.exports = router;

//FILESYSTEM

// const ProductManager = require("../dao/fileManager/ProductManager");

// const ecommerce = new ProductManager(options.FileSystem.products);

// router.get("/", async (req, res) => {
//   const product = await ecommerce.getProducts();

//   if (product && (product != false)) {
//     const data = {
//       status: true,
//       title: "Home",
//       style: "index.css",
//       list: product,
//     };

//     res.render("home", data);
//   } else {
//     return res.status(404).render("home", {
//       status: false,
//       style: "index.css",
//       data: "Empty list",
//     });
//   }
// });

// router.get("/realtimeproducts", async (req, res) => {
//   const product = await ecommerce.getProducts();

//   if (product && (product != false)) {
//     const data = {
//       status: true,
//       title: "Real Time Products",
//       style: "index.css",
//       list: product,
//     };

//     res.render("realTimeProducts", data);
//   } else {
//     return res.status(404).render("realTimeProducts", {
//       status: false,
//       style: "index.css",
//       data: "Empty list",
//     });
//   }
// });

// router.post(
//   "/realtimeproducts",
//   uploader.single("thumbnail"),
//   async (req, res) => {
//     const addNewProduct = req.body;
//     const socket = req.app.get("socket");
//     const filename = req.file.filename;

//     const newProduct = await ecommerce.addProduct(
//       addNewProduct.title,
//       addNewProduct.description,
//       addNewProduct.code,
//       +addNewProduct.price,
//       (addNewProduct.thumbnail = filename),
//       +addNewProduct.stock,
//       addNewProduct.category,
//       addNewProduct.status
//     );
//     socket.emit("newProduct", newProduct);
//     res.send({ status: "success" });
//   }
// );

// module.exports = router;