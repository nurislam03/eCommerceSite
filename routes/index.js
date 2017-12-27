var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');
var Order = require('../models/order');


/* GET home page. */
router.get('/', function(req, res, next) {
    var successMsg = req.flash('success')[0]; // for success message.
    Product.find(function(err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for(var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', { title: 'Hat Bazar', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
    });
});

/* Shopping Cart */
router.get('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {} );

    Product.findById(productId, function(err, product) {
        if(err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
});

/**/
router.get('/shopping-cart', function(req, res, next) {
    if(!req.session.cart) {
        return res.render('shop/shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
});

router.get('/checkout',isLoggedIn, function(req, res, next) {
    if(!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});


/* Stripe post  route| */
router.post('/checkout', isLoggedIn, function(req, res, next) {
    if(!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var stripe = require("stripe")(
        "sk_test_XCV42NhkHl3pSls0PRDT8LSS"
    );

    stripe.charges.create({
      amount: cart.totalPrice * 100, // amount is in minimum currency unit. like cent for dollar.
      currency: "usd",
      source: req.body.stripeToken, // we created stripeToken as a hidden input fill in checkout.js file
      description: "Test Charge"
    }, function(err, charge) {
          // asynchronously called
          if(err) {
              req.flash('error', err.message);
              return res.redirect('/checkout');
          }
          var order = new Order({
             user: req.user,
             cart: cart,
             address:  req.body.address,
             name: req.body.name,
             paymentId: charge.id
          });
          order.save(function(err, result) {
              // to-do here | handle possible errors.

              req.flash('success', 'You are done! Thanks for Buying our Product!');
              req.session.cart = null;
              res.redirect('/');
          });

    });
});

module.exports = router;


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
