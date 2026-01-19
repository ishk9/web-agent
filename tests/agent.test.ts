import { AgentController } from "../src/agent/controller";

const agent = new AgentController();


await agent.init();
await agent.run("https://www.easellm.com", "Fetch the contact information of the company. ");
await agent.stop();