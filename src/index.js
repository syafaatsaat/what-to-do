import "./styles.css";
import { Storage } from "./js/storage.js";
import { Application } from "./js/application.js";
import { ScreenController } from "./js/screencontroller.js";

const storage = new Storage();
const app = new Application(storage);
const screenController = new ScreenController(app);

