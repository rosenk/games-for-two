/// <reference types="vite/client" />
import { games } from "./catalog.ts";
import { gameViews } from "./view-registry.ts";

import.meta.glob("./*/view.ts", { eager: true });
gameViews.sort((left, right) => games.findIndex((game) => game.kind === left.kind) - games.findIndex((game) => game.kind === right.kind));
