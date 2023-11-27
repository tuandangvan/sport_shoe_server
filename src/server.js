/* eslint-disable no-console*/
import express from "express";
import { CONNECT_DATABASE, CLOSE_DATABASE } from "./config/MongoDB.js";
import exitHook from "async-exit-hook";
import { env } from "./config/environment.js";
import cors from "cors";
import { APIs_V1 } from "./routes/v1/index.js";
import { oAuth2Router } from "./routes/v1/oAuth2Routes.js";
import { notFound, errorHandler } from "./middleware/errorHandlingMiddleware.js";
import morgan from "morgan";
import cookieSession from "cookie-session";
import path from "path";
import passport from "./middleware/passportMiddleware.js";

const START_SERVER = () => {
  const app = express();

  // app.use(passportMiddleware);

  // Enable req.body json data
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true
    })
  );

  const allowedDomains = [
    env.CLIENT_URL_VERCEL,
    env.ADMIN_URL_VERCEL,
    env.CLIENT_URL,
    env.ADMIN_URL,
    env.ADMIN_FIAU_URL
  ];

  app.use(
    cors({
      origin: function (origin, callback) {
        // bypass the requests with no origin (like curl requests, mobile apps, etc )
        if (!origin) return callback(null, true);

        if (allowedDomains.indexOf(origin) === -1) {
          var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      methods: "GET,POST,PUT,DELETE",
      credentials: true
    })
  );
  app.use(
    cookieSession({
      name: "session",
      keys: [env.COOKIE_SESSION_KEYS],
      maxAge: 24 * 60 * 80 * 1000
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.static(path.join(__dirname, "/public")));

  //Use APIs v1
  app.use("/api/v1", APIs_V1);
  app.use("/auth", oAuth2Router);

  // Middleware xử lý lỗi tập trung
  app.use(notFound);
  app.use(errorHandler);

  app.use(morgan("combined"));
  app.get("/api/config/paypal", (req, res) => {
    res.send(env.PAYPAL_CLIENT_ID);
  });

  const PORT = env.APP_PORT || 1000;

  app.listen(PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(
      `3. Hello ${env.AUTHOR} Back-end Server is running successfully at http://${env.APP_HOST}:${env.APP_PORT}/`
    );
  });

  // Thực hiện các tác vụ clean up trước khi dừng server
  exitHook(() => {
    console.log("4. Server is shutting down");
    CLOSE_DATABASE();
    console.log("5. Disconnected from MongoDB Cloud Atlas");
  });
};

console.log("1. Connecting to MongoDB Cloud Atlas");
CONNECT_DATABASE()
  .then(() => {
    console.log("2. Connected to MongoDb Cloud Atlas !");
  })
  .then(() => START_SERVER())
  .catch((err) => {
    console.error(err);
    process.exit(0);
  });
