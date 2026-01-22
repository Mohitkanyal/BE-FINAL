# import os
# import re
# os.environ["CUDA_VISIBLE_DEVICES"] = ""  # FORCE CPU

# from fastapi import FastAPI
# from pydantic import BaseModel
# from pymongo import MongoClient
# from datetime import datetime
# import spacy
# from sentence_transformers import SentenceTransformer, util

# # --------------------------------------------------
# # 1. FASTAPI INIT
# # --------------------------------------------------
# app = FastAPI(title="Scrum NLP Chatbot Backend")
# from fastapi.middleware.cors import CORSMiddleware

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # for development only
#     allow_credentials=True,
#     allow_methods=["*"],  # allows OPTIONS, POST, etc.
#     allow_headers=["*"],
# )
# # --------------------------------------------------
# # 2. DATABASE (MongoDB)
# # --------------------------------------------------
# client = MongoClient("mongodb://localhost:27017")
# db = client["scrum_bot"]

# subtasks_col = db["subtasks"]
# standups_col = db["standups"]
# blockers_col = db["blockers"]

# # --------------------------------------------------
# # 3. INSERT DUMMY DATA (ONLY ONCE)
# # --------------------------------------------------
# if subtasks_col.count_documents({}) == 0:
#     subtasks_col.insert_many([
#         {
#             "_id": "ST1",
#             "title": "Login API integration",
#             "status": "In Progress",
#             "percent_complete": 40,
#             "assignee": "dev1"
#         },
#         {
#             "_id": "ST2",
#             "title": "JWT authentication",
#             "status": "Not Started",
#             "percent_complete": 0,
#             "assignee": "dev1"
#         },
#         {
#     "_id": "ST3",
#     "title": "Frontend login UI",
#     "status": "In Progress",
#     "percent_complete": 60,
#     "assignee": "dev1"
#   },
#   {
#     "_id": "ST4",
#     "title": "User registration API",
#     "status": "Not Started",
#     "percent_complete": 0,
#     "assignee": "dev1"
#   },
#   {
#     "_id": "ST5",
#     "title": "Password reset flow",
#     "status": "Not Started",
#     "percent_complete": 0,
#     "assignee": "dev1"
#   },
#   {
#     "_id": "ST6",
#     "title": "API testing and validation",
#     "status": "Not Started",
#     "percent_complete": 0,
#     "assignee": "dev1"
#   }
#     ])

# # --------------------------------------------------
# # 4. NLP MODELS
# # --------------------------------------------------
# nlp = spacy.load("en_core_web_sm")
# embedder = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")

# # --------------------------------------------------
# # 5. REQUEST MODEL
# # --------------------------------------------------
# class ChatRequest(BaseModel):
#     developer_id: str
#     message: str

# # --------------------------------------------------
# # 6. NLP HELPERS
# # --------------------------------------------------
# def detect_status(text: str):
#     text = text.lower()

#     # IMPORTANT: Done must be detected BEFORE Blocked
#     if any(w in text for w in ["done", "completed", "finished"]):
#         return "Done"

#     if any(w in text for w in ["blocked", "stuck", "issue", "error"]):
#         return "Blocked"

#     return "In Progress"


# def extract_percent(text: str):
#     text = text.lower()

#     if "half" in text:
#         return 50
#     if "almost" in text:
#         return 80
#     if any(w in text for w in ["done", "completed", "finished"]):
#         return 100

#     return None


# def clean_blocker_reason(text: str):
#     # Remove completed part
#     text = re.sub(r"(done|completed|finished)[^,]*,?", "", text, flags=re.I)
#     return text.strip().capitalize()


# def match_subtask(text: str):
#     subtasks = list(subtasks_col.find())
#     titles = [s["title"] for s in subtasks]

#     text_embedding = embedder.encode(text, convert_to_tensor=True)
#     task_embeddings = embedder.encode(titles, convert_to_tensor=True)

#     scores = util.cos_sim(text_embedding, task_embeddings)[0]
#     best_idx = scores.argmax().item()

#     return subtasks[best_idx], float(scores[best_idx])

# # --------------------------------------------------
# # 7. PARSE ONE SENTENCE
# # --------------------------------------------------
# def parse_sentence(sentence: str):
#     subtask, score = match_subtask(sentence)

#     if score < 0.40:
#         return None

#     return {
#         "subtask_id": subtask["_id"],
#         "title": subtask["title"],
#         "status": detect_status(sentence),
#         "percent_complete": extract_percent(sentence),
#         "raw_sentence": sentence
#     }

# # --------------------------------------------------
# # 8. CHAT ENDPOINT (MULTI-SENTENCE LOGIC)
# # --------------------------------------------------
# @app.post("/chat")
# def chat(req: ChatRequest):

#     # Split on comma + dot
#     sentences = [
#         s.strip()
#         for s in re.split(r"[.,]", req.message)
#         if s.strip()
#     ]

#     parsed_results = []
#     replies = []

#     for sentence in sentences:
#         parsed = parse_sentence(sentence)
#         if not parsed:
#             continue

#         # ---------------- UPDATE SUBTASK ----------------
#         update_fields = {"status": parsed["status"]}

#         if parsed["percent_complete"] is not None:
#             update_fields["percent_complete"] = parsed["percent_complete"]

#         subtasks_col.update_one(
#             {"_id": parsed["subtask_id"]},
#             {"$set": update_fields}
#         )

#         # ---------------- BLOCKER HANDLING ----------------
#         if parsed["status"] == "Blocked":
#             blockers_col.insert_one({
#                 "subtask_id": parsed["subtask_id"],
#                 "reason": clean_blocker_reason(sentence),
#                 "reported_by": req.developer_id,
#                 "date": datetime.utcnow()
#             })

#         parsed_results.append(parsed)

#         replies.append(
#             f"{'⚠' if parsed['status']=='Blocked' else '✅'} "
#             f"{parsed['title']} marked as {parsed['status']}"
#         )

#     # ---------------- STANDUP ENTRY ----------------
#     standups_col.insert_one({
#         "developer_id": req.developer_id,
#         "raw_message": req.message,
#         "parsed_updates": parsed_results,
#         "date": datetime.utcnow()
#     })

#     if not replies:
#         return {"reply": "❓ I couldn’t confidently match any subtask."}

#     return {"reply": "\n".join(replies)}

# # --------------------------------------------------
# # 9. HEALTH CHECK
# # --------------------------------------------------
# @app.get("/")
# def root():
#     return {"status": "Scrum NLP Chatbot Backend Running"}

import os
import re
os.environ["CUDA_VISIBLE_DEVICES"] = ""  # FORCE CPU

from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import spacy
from sentence_transformers import SentenceTransformer, util

# --------------------------------------------------
# 1. FASTAPI INIT
# --------------------------------------------------
app = FastAPI(title="Scrum NLP Chatbot Backend")
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development only
    allow_credentials=True,
    allow_methods=["*"],  # allows OPTIONS, POST, etc.
    allow_headers=["*"],
)
# --------------------------------------------------
# 2. DATABASE (USE scrumbotdb)
# --------------------------------------------------
client = MongoClient("mongodb://localhost:27017")
db = client["scrumbotdb"]

tasks_col = db["tasks"]
subtasks_col = db["subtasks"]
standups_col = db["standups"]
blockers_col = db["blockers"]

# --------------------------------------------------
# 3. NLP MODELS
# --------------------------------------------------
nlp = spacy.load("en_core_web_sm")
embedder = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")

# --------------------------------------------------
# 4. REQUEST MODEL
# --------------------------------------------------
class ChatRequest(BaseModel):
    developer_id: str
    message: str

# --------------------------------------------------
# 5. NLP HELPERS
# --------------------------------------------------
def detect_status(text: str):
    t = text.lower()

    if any(w in t for w in ["done", "completed", "finished"]):
        return "Done"
    if any(w in t for w in ["blocked", "stuck", "issue", "error","blockers"]):
        return "Blocked"
    return "In Progress"


def extract_percent(text: str):
    t = text.lower()
    if "half" in t:
        return 50
    if "almost" in t:
        return 80
    if any(w in t for w in ["done", "completed", "finished"]):
        return 100
    return None


def clean_blocker_reason(text: str):
    text = re.sub(r"(done|completed|finished)[^,]*,?", "", text, flags=re.I)
    return text.strip().capitalize()


def fetch_all_subtasks():
    return list(subtasks_col.find({}))


def match_subtask(sentence: str):
    subtasks = fetch_all_subtasks()
    if not subtasks:
        return None, 0.0

    titles = [s["title"] for s in subtasks]

    sent_emb = embedder.encode(sentence, convert_to_tensor=True)
    task_emb = embedder.encode(titles, convert_to_tensor=True)

    scores = util.cos_sim(sent_emb, task_emb)[0]
    best_idx = scores.argmax().item()

    return subtasks[best_idx], float(scores[best_idx])

# --------------------------------------------------
# 6. PARSE SENTENCE
# --------------------------------------------------
def parse_sentence(sentence: str):
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

# --------------------------------------------------
# 7. CHAT ENDPOINT
# --------------------------------------------------
@app.post("/chat")
def chat(req: ChatRequest):

    sentences = [
        s.strip()
        for s in re.split(r"[.,]", req.message)
        if s.strip()
    ]

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
                "reported_by": req.developer_id,
                "created_at": datetime.utcnow()
            })

        updates.append(parsed)

        replies.append(
            f"{'⚠️' if parsed['status']=='Blocked' else '✅'} "
            f"{parsed['subtask_title']} → {parsed['status']}"
        )

    standups_col.insert_one({
        "developer_id": req.developer_id,
        "message": req.message,
        "updates": updates,
        "created_at": datetime.utcnow()
    })

    if not replies:
        return {"reply": "❓ I couldn’t confidently match any task."}

    return {
        "reply": "\n".join(replies),
        "updates": updates
    }

# --------------------------------------------------
# 8. HEALTH CHECK
# --------------------------------------------------
@app.get("/")
def root():
    return {"status": "Scrum NLP Chatbot Backend Running"}
