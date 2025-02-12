import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in removeAllFromCart controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    let { quantity } = req.body;
    const user = req.user;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: "Product ID and quantity are required." });
    }

    // Garante que a quantidade seja um número válido e maior ou igual a zero
    quantity = parseInt(quantity, 10);
    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).json({ message: "Invalid quantity value." });
    }

    const existingItem = user.cartItems.find((item) => String(item.id) === String(productId));

    if (!existingItem) {
      return res.status(404).json({ message: "Product not found in cart." });
    }

    if (quantity === 0) {
      // Remove o item do carrinho se a quantidade for 0
      user.cartItems = user.cartItems.filter((item) => String(item.id) !== String(productId));
      await user.save();
      return res.json({ message: "Item removed from cart", cartItems: user.cartItems });
    }

    // Atualiza a quantidade do item
    existingItem.quantity = quantity;
    await user.save();

    res.json({ message: "Quantity updated successfully", cartItems: user.cartItems });
  } catch (error) {
    console.error("Error in updateQuantity controller:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });
    const cartItems = products.map(product => {
      const item = req.user.cartItems.find(cartItem => cartItem.id === product.id)
      return {...product.toJSON(), quantity:item.quantity}
    })

    res.json(cartItems)
  } catch (error) {
    console.log("Error in getCartProducts controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
