const { redis } = require("./utils/Redis");

// file deepcode ignore UseCsurfForExpress: CSRF Protection will disallow Socket to function properly!
const app = require("express")(),
  helmet = require("helmet"),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  rateLimit = require("express-rate-limit"),
  http = require("http").Server(app),
  { dbConfig } = require("./utils/db"),
  APIRouter = require("./utils/router"),
  PORT = process.env.PORT || 4000,
  compression = require("compression");

require("dotenv").config();

app
  .use(cors())
  .use(morgan("dev"))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(helmet())
  .use(compression());

global.__basedir = __dirname;

/**
 * @dev configuration utils
 * 1. Database Configuration
 */
dbConfig();

// @dev pusher configuration

/**
 * @dev Router Configuration
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app
  .get("/", (req, res) => {
    redis.flushall();
    res.json({ message: "Welcome to V1 Playpoint API! 👌" });
  })
  // this must be used for production
  .use("/api/v1", apiLimiter, APIRouter)
  // .use("/api/v1", APIRouter)
  .get("*", (req, res) =>
    res.status(404).json({
      msg: "404 Not Found! 🦟",
    })
  );

http.listen(PORT, () => {
  redis.flushall();
  console.log(`👾 : Server listening on ${PORT}!`);
});

module.exports = http;
