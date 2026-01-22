import os
import re
os.environ["CUDA_VISIBLE_DEVICES"] = ""  # FORCE CPU

from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, date
import json
from dotenv import load_dotenv

import spacy
from sentence_transformers import SentenceTransformer, util

from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate

# ----------------------------------------------------
# App Setup
# ----------------------------------------------------
app = Flask(__name__)
CORS(app)
load_dotenv()

# ----------------------------------------------------
# MongoDB Setup (SINGLE SOURCE)
# ----------------------------------------------------
client = MongoClient("mongodb://localhost:27017")
db = client["scrumbotdb"]

developers_col = db["developers"]
projects_col = db["projects"]
sprints_col = db["sprints"]
stories_col = db["user_stories"]
tasks_col = db["tasks"]
subtasks_col = db["subtasks"]
standups_col = db["standups"]
blockers_col = db["blockers"]
reports_col = db["reports"]

# ----------------------------------------------------
# NLP MODELS
# ----------------------------------------------------
nlp = spacy.load("en_core_web_sm")
embedder = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")

# ----------------------------------------------------
# LLM Setup
# ----------------------------------------------------
llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task="text-generation"
)
model = ChatHuggingFace(llm=llm)

# ----------------------------------------------------
# NLP HELPERS (UNCHANGED LOGIC)
# ----------------------------------------------------
def detect_status(text):
    t = text.lower()
    if any(w in t for w in ["done", "completed", "finished"]):
        return "Done"
    if any(w in t for w in ["blocked", "stuck", "issue", "error"]):
        return "Blocked"
    return "In Progress"


def extract_percent(text):
    t = text.lower()
    if "half" in t:
        return 50
    if "almost" in t:
        return 80
    if any(w in t for w in ["done", "completed", "finished"]):
        return 100
    return None


def clean_blocker_reason(text):
    text = re.sub(r"(done|completed|finished)[^,]*,?", "", text, flags=re.I)
    return text.strip().capitalize()


def match_subtask(sentence):
    subtasks = list(subtasks_col.find({}))
    if not subtasks:
        return None, 0.0

    titles = [s["title"] for s in subtasks]

    sent_emb = embedder.encode(sentence, convert_to_tensor=True)
    task_emb = embedder.encode(titles, convert_to_tensor=True)

    scores = util.cos_sim(sent_emb, task_emb)[0]
    best_idx = scores.argmax().item()

    return subtasks[best_idx], float(scores[best_idx])


def parse_sentence(sentence):
    subtask, score = match_subtask(sentence)

    if not subtask or score < 0.40:
        return None

    task = tasks_col.find_one({"_id": subtask["task_id"]})

    return {
        "subtask_id": str(subtask["_id"]),
        "subtask_title": subtask["title"],
        "task_title": task["title"] if task else None,
        "status": detect_status(sentence),
        "percent_complete": extract_percent(sentence),
        "raw_sentence": sentence,
        "confidence": round(score, 2)
    }

# ----------------------------------------------------
# NLP CHAT ENDPOINT (FLASK VERSION)
# ----------------------------------------------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    developer_id = data["developer_id"]
    message = data["message"]

    sentences = [s.strip() for s in re.split(r"[.,]", message) if s.strip()]

    updates = []
    replies = []

    for s in sentences:
        parsed = parse_sentence(s)
        if not parsed:
            continue

        update_fields = {"status": parsed["status"]}
        if parsed["percent_complete"] is not None:
            update_fields["percent_complete"] = parsed["percent_complete"]

        subtasks_col.update_one(
            {"_id": ObjectId(parsed["subtask_id"])},
            {"$set": update_fields}
        )

        if parsed["status"] == "Blocked":
            blockers_col.insert_one({
                "subtask_id": ObjectId(parsed["subtask_id"]),
                "reason": clean_blocker_reason(s),
                "reported_by": developer_id,
                "created_at": datetime.utcnow()
            })

        updates.append(parsed)
        replies.append(
            f"{'⚠️' if parsed['status']=='Blocked' else '✅'} "
            f"{parsed['subtask_title']} → {parsed['status']}"
        )

    standups_col.insert_one({
        "developer_id": developer_id,
        "message": message,
        "updates": updates,
        "created_at": datetime.utcnow()
    })

    if not replies:
        return jsonify({"reply": "❓ I couldn’t confidently match any task."})

    return jsonify({
        "reply": "\n".join(replies),
        "updates": updates
    })
# ----------------------------------------------------
# Sprint Planning Prompt
# ----------------------------------------------------
sprint_prompt = PromptTemplate(
    input_variables=["stories", "team_size", "sprint_days"],
    template="""
You are an Agile Scrum Planning AI.

Context:
- Team size: {team_size} developers
- Sprint length: {sprint_days} working days
- First sprint (no historical velocity)

User Stories:
{stories}

Rules:
1. Pick only stories that realistically fit the sprint.
2. Create a clear Sprint Goal.
3. Break each story into Tasks.
4. Each task must have Subtasks.
5. Subtasks must be small (4–8 hours).
6. Output ONLY valid JSON.

JSON format:
{{
  "sprint_name": "Sprint Name",
  "sprint_goal": "Goal",
  "stories": [
    {{
      "story_id": "US1",
      "title": "Story title",
      "tasks": [
        {{
          "title": "Task title",
          "description": "Task description",
          "subtasks": [
            {{
              "title": "Subtask title",
              "description": "Subtask description",
              "estimated_hours": 6
            }}
          ]
        }}
      ]
    }}
  ]
}}
"""
)


def clean_json(text):
    match = re.search(r"\{.*\}", text, re.DOTALL)
    return json.loads(match.group()) if match else {}

# ----------------------------------------------------
# 1️⃣ Generate Sprint
# ----------------------------------------------------
@app.route("/generate_sprint", methods=["POST"])
def generate_sprint():
    try:
        payload = request.json

        project_id = payload["project_id"]
        sprint_name = payload["sprint_name"]
        sprint_days = payload["sprint_length_days"]
        team_size = payload["team_size"]
        user_stories = payload["user_stories"]

        prompt = sprint_prompt.invoke({
            "stories": json.dumps(user_stories),
            "team_size": team_size,
            "sprint_days": sprint_days
        })

        response = model.invoke(prompt)
        sprint_data = clean_json(response.content)

        # Insert Sprint
        sprint_doc = {
            "name": sprint_data["sprint_name"],
            "goal": sprint_data["sprint_goal"],
            "project_id": project_id,
            "start_date": date.today().isoformat(),
            "end_date": date.today().isoformat(),
            "status": "Planned",
            "created_at": datetime.utcnow()
        }

        sprint_id = sprints_col.insert_one(sprint_doc).inserted_id

        # Insert Stories, Tasks, Subtasks
        for story in sprint_data["stories"]:
            story_doc = {
                "story_code": story["story_id"],
                "title": story["title"],
                "sprint_id": sprint_id,
                "status": "To Do",
                "created_at": datetime.utcnow()
            }
            story_id = stories_col.insert_one(story_doc).inserted_id

            for task in story["tasks"]:
                task_doc = {
                    "title": task["title"],
                    "description": task["description"],
                    "story_id": story_id,
                    "sprint_id": sprint_id,
                    "status": "To Do",
                    "created_at": datetime.utcnow()
                }
                task_id = tasks_col.insert_one(task_doc).inserted_id

                for sub in task["subtasks"]:
                    subtasks_col.insert_one({
                        "title": sub["title"],
                        "description": sub["description"],
                        "task_id": task_id,
                        "status": "To Do",
                        "estimated_hours": sub["estimated_hours"],
                        "actual_hours": 0,
                        "created_at": datetime.utcnow()
                    })

        return jsonify({
            "message": "Sprint generated successfully",
            "sprint_id": str(sprint_id),
            "goal": sprint_data["sprint_goal"]
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------------------------------------------
# 2️⃣ Standup Submission (NLP Ready)
# ----------------------------------------------------
@app.route("/submit_standup", methods=["POST"])
def submit_standup():
    try:
        data = request.json

        standups_col.insert_one({
            "dev_id": data["dev_id"],
            "sprint_id": ObjectId(data["sprint_id"]),
            "date": date.today().isoformat(),
            "yesterday": data.get("yesterday", []),
            "today": data.get("today", []),
            "blockers": data.get("blockers", []),
            "raw_text": data.get("raw_text"),
            "created_at": datetime.utcnow()
        })

        # Auto-create blockers
        for b in data.get("blockers", []):
            blockers_col.insert_one({
                "subtask_id": b["subtask_id"],
                "dev_id": data["dev_id"],
                "sprint_id": ObjectId(data["sprint_id"]),
                "description": b["issue"],
                "status": "Open",
                "reported_at": datetime.utcnow()
            })

        return jsonify({"message": "Standup recorded"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------------------------------------------
# 3️⃣ Generate Reports
# ----------------------------------------------------
report_prompt = PromptTemplate(
    input_variables=["type", "data"],
    template="""
You are an AI Scrum Report Generator.

Generate a professional report for {type}:

{data}

Include:
- Summary
- Observations
- Risks
- Recommendations

Plain text only.
"""
)

@app.route("/generate_report", methods=["POST"])
def generate_report():
    try:
        payload = request.json
        report_type = payload["type"]
        ref_id = payload["id"]

        if report_type == "sprint":
            data = sprints_col.find_one({"_id": ObjectId(ref_id)})
        elif report_type == "standup":
            data = standups_col.find_one({"_id": ObjectId(ref_id)})
        else:
            return jsonify({"error": "Invalid report type"}), 400

        prompt = report_prompt.invoke({
            "type": report_type,
            "data": json.dumps(data, default=str)
        })

        response = model.invoke(prompt)

        reports_col.insert_one({
            "type": report_type,
            "content": response.content,
            "created_at": datetime.utcnow()
        })

        return jsonify({"report": response.content}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------------------------------------------
# 4️⃣ Dashboards
# ----------------------------------------------------
@app.route("/get_sprints", methods=["GET"])
def get_sprints():
    sprints = list(sprints_col.find({}, {"_id": 1, "name": 1, "goal": 1, "status": 1}))
    for s in sprints:
        s["_id"] = str(s["_id"])
    return jsonify({"sprints": sprints})

@app.route("/get_projects", methods=["GET"])
def get_projects():
    projects = list(projects_col.find())
    for p in projects:
        p["_id"] = str(p["_id"])
    return jsonify({"projects": projects})

# ----------------------------------------------------
# Run App
# ----------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
