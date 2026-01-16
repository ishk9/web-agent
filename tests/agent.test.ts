import { AgentController } from "../src/agent/controller";

const agent = new AgentController();


await agent.init();
await agent.run("https://www.easellm.com", "What is the main purpose of this website?");
await agent.stop();