const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const stakeholderSchema = new mongoose.Schema({
  name: String, role: String, responsibility: String, status: { type: String, default: "Active" }
}, { timestamps: true });

const changeSchema = new mongoose.Schema({
  title: String, description: String, createdBy: String, priority: { type: String, default: "Medium" },
  status: { type: String, default: "Open" }, affectedStakeholders: [String],
  affectedTasks: [String], impacts: [String], approvalsRequired: [String]
}, { timestamps: true });

const actionSchema = new mongoose.Schema({
  title: String, assignee: String, priority: { type: String, default: "Medium" },
  status: { type: String, default: "Pending" }, dueDate: String, sourceChange: String
}, { timestamps: true });

const activitySchema = new mongoose.Schema({
  message: String, actor: String, type: { type: String, default: "Activity" }
}, { timestamps: true });

const Stakeholder = mongoose.model("Stakeholder", stakeholderSchema);
const Change = mongoose.model("Change", changeSchema);
const Action = mongoose.model("Action", actionSchema);
const Activity = mongoose.model("Activity", activitySchema);

let memoryMode = false;
const mem = { stakeholders: [], changes: [], actions: [], activities: [] };

const seed = {
  stakeholders: [
    { name:"Aarav Sharma", role:"Client", responsibility:"Approvals & project decisions", status:"Active" },
    { name:"Kavya Singh", role:"Architect", responsibility:"Floor plans & design revisions", status:"Active" },
    { name:"Rohan Verma", role:"Interior Designer", responsibility:"Furniture, finishes & material layout", status:"Active" },
    { name:"Neha Gupta", role:"Electrical Engineer", responsibility:"Electrical layout & load review", status:"Active" },
    { name:"Vikram Yadav", role:"Contractor", responsibility:"Site execution & procurement", status:"Active" },
    { name:"Ishita Rao", role:"Plumbing Engineer", responsibility:"Plumbing routing & fixture review", status:"Active" }
  ],
  changes: [
    {
      title:"Master bathroom layout revised",
      description:"Client requested a larger shower area and relocated wash basin.",
      createdBy:"Aarav Sharma", priority:"High", status:"Open",
      affectedStakeholders:["Kavya Singh","Rohan Verma","Neha Gupta","Ishita Rao","Vikram Yadav"],
      affectedTasks:["Update floor plan","Review electrical points","Review plumbing points","Update tile/material schedule"],
      impacts:["Floor Plan","Electrical Layout","Plumbing Layout","Tile Schedule","Procurement"],
      approvalsRequired:["Client approval","Architect approval"]
    }
  ],
  actions: [
    { title:"Update master bathroom floor plan", assignee:"Kavya Singh", priority:"High", status:"Pending", dueDate:"2026-09-10", sourceChange:"Master bathroom layout revised" },
    { title:"Review electrical points", assignee:"Neha Gupta", priority:"High", status:"Done", dueDate:"2026-09-10", sourceChange:"Master bathroom layout revised" },
    { title:"Review plumbing points", assignee:"Ishita Rao", priority:"High", status:"Pending", dueDate:"2026-09-11", sourceChange:"Master bathroom layout revised" },
    { title:"Approve revised bathroom layout", assignee:"Aarav Sharma", priority:"High", status:"Pending", dueDate:"2026-09-11", sourceChange:"Master bathroom layout revised" }
  ],
  activities: [
    { message:"Client requested master bathroom layout change", actor:"Aarav Sharma", type:"Change" },
    { message:"Potential electrical and plumbing impacts identified", actor:"CoordiFlow Intelligence", type:"Impact" },
    { message:"Electrical review completed", actor:"Neha Gupta", type:"Action" },
    { message:"Client approval is still pending", actor:"CoordiFlow Intelligence", type:"Approval" }
  ]
};

function impactEngine(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  const rules = [
    { keys:["bathroom","toilet","shower","wash basin"], impacts:["Floor Plan","Plumbing Layout","Electrical Layout","Tile Schedule"], roles:["Architect","Plumbing Engineer","Electrical Engineer","Interior Designer"] },
    { keys:["kitchen","sink","counter"], impacts:["Kitchen Layout","Plumbing Layout","Electrical Layout","Cabinet Schedule"], roles:["Architect","Plumbing Engineer","Electrical Engineer","Interior Designer"] },
    { keys:["bedroom","room","wall"], impacts:["Floor Plan","Furniture Layout","Electrical Layout"], roles:["Architect","Interior Designer","Electrical Engineer"] },
    { keys:["material","tile","marble","finish"], impacts:["Material Schedule","Procurement","Cost Estimate"], roles:["Interior Designer","Contractor","Client"] },
    { keys:["electrical","socket","light","switch"], impacts:["Electrical Layout","Ceiling Plan"], roles:["Electrical Engineer","Architect","Contractor"] }
  ];
  const matched = rules.filter(r => r.keys.some(k => text.includes(k)));
  const impacts = [...new Set(matched.flatMap(r=>r.impacts))];
  const roles = [...new Set(matched.flatMap(r=>r.roles))];
  if (!impacts.length) impacts.push("Design deliverables","Related tasks","Project approval");
  if (!roles.length) roles.push("Project Manager","Responsible discipline owner");
  return { impacts, roles, confidence: matched.length ? "High" : "Medium" };
}

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/coordiflow", { serverSelectionTimeoutMS: 2000 });
    console.log("MongoDB connected");
  } catch (e) {
    memoryMode = true;
    console.log("MongoDB unavailable — running in demo memory mode.");
    mem.stakeholders = structuredClone(seed.stakeholders);
    mem.changes = structuredClone(seed.changes);
    mem.actions = structuredClone(seed.actions);
    mem.activities = structuredClone(seed.activities);
  }
}

async function all(model, key) {
  return memoryMode ? mem[key] : model.find().sort({createdAt:-1}).lean();
}
async function create(model, key, data) {
  if (memoryMode) {
    const item = {_id: Date.now().toString(), ...data, createdAt:new Date()};
    mem[key].unshift(item); return item;
  }
  return model.create(data);
}
async function update(model, key, id, patch) {
  if (memoryMode) {
    const item = mem[key].find(x=>String(x._id)===String(id));
    if (!item) return null; Object.assign(item, patch); return item;
  }
  return model.findByIdAndUpdate(id, patch, {new:true}).lean();
}

app.get("/api/health", (req,res)=>res.json({ok:true, mode:memoryMode?"demo":"mongodb"}));

app.get("/api/dashboard", async (req,res)=>{
  const [stakeholders, changes, actions, activities] = await Promise.all([
    all(Stakeholder,"stakeholders"), all(Change,"changes"), all(Action,"actions"), all(Activity,"activities")
  ]);
  res.json({
    counts:{
      stakeholders:stakeholders.length,
      changes:changes.length,
      pendingActions:actions.filter(a=>a.status!=="Done").length,
      alerts:changes.filter(c=>c.priority==="High" && c.status!=="Resolved").length
    },
    stakeholders, changes, actions, activities
  });
});

app.get("/api/stakeholders", async (req,res)=>res.json(await all(Stakeholder,"stakeholders")));
app.post("/api/stakeholders", async (req,res)=>{
  const item=await create(Stakeholder,"stakeholders",req.body);
  await create(Activity,"activities",{message:`Stakeholder ${req.body.name} added as ${req.body.role}`,actor:"Project Manager",type:"Stakeholder"});
  res.status(201).json(item);
});

app.get("/api/changes", async (req,res)=>res.json(await all(Change,"changes")));
app.post("/api/changes", async (req,res)=>{
  const {title,description,createdBy,priority="Medium"}=req.body;
  const result=impactEngine(title,description);
  const stakeholders=await all(Stakeholder,"stakeholders");
  const affectedStakeholders=stakeholders.filter(s=>result.roles.includes(s.role)).map(s=>s.name);
  const item=await create(Change,"changes",{
    title,description,createdBy,priority,status:"Open",
    affectedStakeholders,
    affectedTasks: result.impacts.map(x=>`Review ${x}`),
    impacts:result.impacts,
    approvalsRequired: priority==="High"?["Project owner approval"]:["Responsible discipline approval"]
  });
  await create(Activity,"activities",{message:`Change "${title}" created. ${result.impacts.length} potential impacts identified.`,actor:"CoordiFlow Intelligence",type:"Impact"});
  for(const name of affectedStakeholders.slice(0,4)){
    const role=stakeholders.find(s=>s.name===name)?.role;
    await create(Action,"actions",{title:`Review impact of: ${title}`,assignee:name,priority,status:"Pending",dueDate:"2026-09-12",sourceChange:title});
  }
  res.status(201).json({...item.toObject?.()||item, intelligence:result});
});

app.get("/api/actions", async (req,res)=>res.json(await all(Action,"actions")));
app.patch("/api/actions/:id", async (req,res)=>{
  const item=await update(Action,"actions",req.params.id,{status:req.body.status});
  if(item) await create(Activity,"activities",{message:`Action "${item.title}" marked ${item.status}`,actor:item.assignee,type:"Action"});
  res.json(item);
});

app.get("/api/activities", async (req,res)=>res.json(await all(Activity,"activities")));

app.get("/api/impact/:id", async (req,res)=>{
  const changes=await all(Change,"changes");
  const c=changes.find(x=>String(x._id)===String(req.params.id));
  if(!c) return res.status(404).json({message:"Change not found"});
  res.json({
    change:c,
    graph:[
      {label:"Change",value:c.title},
      {label:"Impacts",value:c.impacts||[]},
      {label:"People",value:c.affectedStakeholders||[]},
      {label:"Actions",value:c.affectedTasks||[]},
      {label:"Approvals",value:c.approvalsRequired||[]}
    ]
  });
});

app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));

connect().then(()=>app.listen(PORT,()=>console.log(`CoordiFlow running on http://localhost:${PORT}`)));
