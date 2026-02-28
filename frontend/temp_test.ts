import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: "test",
  version: "weekly",
  libraries: ["places"],
});

// Check what methods exist
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(loader)));
