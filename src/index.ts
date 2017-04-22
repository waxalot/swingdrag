import { SwingDragPlugIn } from './swingDragPlugIn';
import { SwingDragOptions } from './swingDragOptions';

require("./css/swingdrag.scss");

// Create and register the PlugIn
let swingDragPlugIn: SwingDragPlugIn = new SwingDragPlugIn();
swingDragPlugIn.register();