
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const productsRouter = require("./routes/Products");
const cookieParser = require('cookie-parser');
const categoriesRouter = require("./routes/Category");
const brandsRouter = require("./routes/Brands");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { User } = require("./model/User");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
var jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require('dotenv').config()
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const path = require('path')

// console.log(process.env);

//JWT options

//webhook

//TODO:we will capture actual order after deploying out server live on public URL

const endpointSecret =process.env.ENDPOINT_SECRET;

server.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  }
  catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log({paymentIntent});
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.send();
});


const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey =process.env.JWT_SECRET_KEY; //TODO:should not be in code

//middlewares
server.use(express.static(path.resolve(__dirname,'build')))
server.use(cookieParser())
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);

server.use(passport.authenticate("session"));

server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

server.use(express.json()); //to parse req.body

server.use("/products", isAuth(), productsRouter.router); //we can also use JWT token for client-only auth
server.use("/categories",isAuth(), categoriesRouter.router);
server.use("/brands",isAuth(), brandsRouter.router);
server.use("/users",isAuth(), usersRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart",isAuth(), cartRouter.router);
//this /orders is clashing with react /orders
server.use("/orders",isAuth(), ordersRouter.router);
//this line we add to make router work in case of other routes doesnt match
server.get('*',(req,res)=>res.sendFile(path.resolve('build',('index.html'))))

main().catch((err) => console.log(err));

//passport stratiges

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email })
      console.log(email,password,user);
      
      if (!user) {
        done(null, false, { message: "invelid credentials " });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invelid credentials" });
          }
          const token = jwt.sign(sanitizeUser(user),  process.env.JWT_SECRET_KEY);
          done(null, {id:user.id,role:user.role,token}); //this lines sends to serializer
        }
      );
    } catch (error) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({ jwt_payload });
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); //this calls serilzer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

//this session create session veriable req.user on being called
passport.serializeUser(function (user, cb) {
  console.log("serialize", user);

  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

//this changes creates session variables req.user when called from authorized request
passport.deserializeUser(function (user, cb) {
  console.log("de-serialize", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

//payments 
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

server.post("/create-payment-intent",async(req,res)=>{
  const {totalAmount} = req.body

  const paymentIntent = await stripe.paymentIntents.create({
    amount:totalAmount*100,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
})


async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("database connected");
}

server.listen(process.env.PORT, () => {
  console.log("servere is started");
});
