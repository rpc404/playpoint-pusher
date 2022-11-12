// file deepcode ignore UseCsurfForExpress: CSRF Protection will disallow Socket to function properly!
const app = require("express")();
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const http = require("http").Server(app);

const { dbConfig } = require("./utils/db");
const APIRouter = require("./utils/router");
const { socketConfig } = require("./utils/socket");
const PORT = process.env.PORT || 4000;

app
  .use(cors())
  .use(morgan("dev"))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(helmet());

global.__basedir = __dirname;

/**
 * @dev configuration utils
 * 1. Database Configuration
 */
dbConfig();
socketConfig(http);

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
  .get("/", (req, res) =>
    res.json({ message: "Welcome to V1 Playpoint API! 👌" })
  )
  // this must be used for production
  // .use("/api/v1", apiLimiter, APIRouter)
  .use("/api/v1", APIRouter)
  .get("*", (req, res) =>
    res.status(404).json({
      msg: "404 Not Found! 🦟",
    })
  );

http.listen(PORT, () => {
  console.log(`👾 : Server listening on ${PORT}!`);
});

module.exports = http;
