import { makeAutoObservable, runInAction } from "mobx";

import { createContext } from "react";
import sample from "./data.json";

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

class Store {
	isLoaded = false;
	locations = [];
	envs = [];
	servers = [];

	fetchData = async () => {
		await sleep(3000);
		runInAction(() => {
			this.locations = sample.locations;
			this.envs = sample.envs;
			this.servers = sample.servers;
			this.isLoaded = true;
		});
	};

	constructor() {
		makeAutoObservable(this);
	}
}

export const store = new Store();
export const storeContext = createContext(store);
