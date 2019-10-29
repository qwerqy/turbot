import * as dotenv from "dotenv";
import * as Sentry from "@sentry/node";
// @ts-ignore
global.WebSocket = require("ws");
dotenv.config();
Sentry.init({
  dsn: "https://dbbae63d48f64902b049b539d2441a46@sentry.io/1796824",
});

import "./main";
