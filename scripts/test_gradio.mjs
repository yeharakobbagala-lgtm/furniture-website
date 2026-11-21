import { Client } from "@gradio/client";

async function test() {
  console.log("Connecting to Hugging Face Space...");
  try {
    // Try TripoSR first (usually fast and public)
    const client = await Client.connect("stabilityai/TripoSR");
    console.log("Connected to stabilityai/TripoSR successfully!");
    const info = await client.view_api();
    console.log("API endpoints:", Object.keys(info.named_endpoints));
  } catch (err) {
    console.log("stabilityai/TripoSR error:", err.message);
  }

  try {
    // Also check TRELLIS
    console.log("\nConnecting to JeffreyXiang/TRELLIS...");
    const clientTrellis = await Client.connect("JeffreyXiang/TRELLIS");
    console.log("Connected to JeffreyXiang/TRELLIS successfully!");
    const infoTrellis = await clientTrellis.view_api();
    console.log("TRELLIS endpoints:", Object.keys(infoTrellis.named_endpoints));
  } catch (err) {
    console.log("JeffreyXiang/TRELLIS error:", err.message);
  }
}

test();
