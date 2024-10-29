import { defineStore } from "pinia";
import { Environment } from "../models/Environment";
import environments from "../assets/environments.json?json";

export const useEnvironmentStore = defineStore("environment", {
  state: () => ({
    environments: environments.map((i) => new Environment(i)),
  }),
});
