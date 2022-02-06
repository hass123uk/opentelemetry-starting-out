const opentelemetry = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const process = require("process");

const sdk = new opentelemetry.NodeSDK({
  resource: new opentelemetry.resources.Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "express-starting-out",
  }),
  traceExporter: new ZipkinExporter(),
  //   traceExporter: new opentelemetry.tracing.ConsoleSpanExporter(),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk
  .start()
  .then(() => console.log("Tracing initialized"))
  .catch((error) => console.log("Error initializing tracing", error));

// gracefully shut down the SDK on process exit
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});
