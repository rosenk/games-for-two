import { chooseComputerMove } from "./computer.ts";

self.onmessage = (event) => {
  self.postMessage(chooseComputerMove(event.data));
};
