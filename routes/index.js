var express = require("express");
var router = express.Router();

const { dbUrl, mongodb, MongoClient } = require("../dbConfig");

router.get("/products", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);

  try {
    const db = await client.db("equipments");
    const product = await db.collection("products").find().toArray();
    res.send({
      data: product,
    });
  } catch (error) {
    Console.log(error);
    res.json({
      message: "Error in DB",
    });
  } finally {
    client.close();
  }
});

router.post("/create-products", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  let data = {
    productId: req.body.productId,
    productName: req.body.productName,
    image: req.body.image,
    quantity: req.body.quantity,
    price: req.body.price,
    bookedStatus: "Available",
    date: "",
    startTime: "",
    endTime: "",
  };
  try {
    const db = await client.db("equipments");
    const product = await db.collection("products").insertOne(data);

    res.json({
      message: "product added successfully",
    });
  } catch (error) {
    console.log(error);
    res.send({ message: "Error in DB" });
  } finally {
    client.close();
  }
});

router.post("/booking", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("equipments");
    const product = await db
      .collection("products")
      .findOne({ productId: req.body.productId });
    if (product.productId && product.bookedStatus == "Available") {
      const item = await db
        .collection("products")
        .updateOne(
          { productId: product.productId },
          {
            $set: {
              bookedStatus: "Booked",
              date: req.body.date,
              startTime: req.body.startTime,
              endTime: req.body.endTime,
            },
          }
        );
      res.send({
        message: "Equipment booked successfully",
      });
    }
    else{
      res.send({
        message:"Equipment booked Already"
      })
    }
  } catch (error) {
    console.log(error);
    res.send({ message: "Error in DB" });
  } finally {
    client.close();
  }
});

module.exports = router;
