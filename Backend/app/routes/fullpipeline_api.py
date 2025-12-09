from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from transformers import (
    pipeline,
    AutoModelForSequenceClassification,
    AutoModelForTokenClassification,
    AutoTokenizer
)
from collections import defaultdict
from datetime import date
import psycopg2
from pathlib import Path

router = APIRouter()

# --- 1. Model paths ---
BASE_DIR = Path(__file__).resolve().parent.parent
intent_path = str(BASE_DIR / "bert-intent")
ner_path = str(BASE_DIR / "ner1_final")

# --- 2. Load models safely ---
intent_model = AutoModelForSequenceClassification.from_pretrained(intent_path, local_files_only=True)
intent_tokenizer = AutoTokenizer.from_pretrained(intent_path, local_files_only=True)
intent_pipeline = pipeline("text-classification", model=intent_model, tokenizer=intent_tokenizer)

ner_model = AutoModelForTokenClassification.from_pretrained(ner_path, local_files_only=True)
ner_tokenizer = AutoTokenizer.from_pretrained(ner_path, local_files_only=True)
ner_pipeline = pipeline("token-classification", model=ner_model, tokenizer=ner_tokenizer, aggregation_strategy="simple")

# --- 3. Database connection helper ---
def get_conn():
    return psycopg2.connect(
        dbname="scrumbotdb",
        user="postgres",
        password="123456",
        host="localhost",
        port="5432"
    )

# --- 4. Request schema ---
class FullPipelineRequest(BaseModel):
    sentence: str
    employee_id: int = 1
    confirm_insert: int = 0   # 1 = perform DB action, 0 = just detect

class StandupEditRequest(BaseModel):
    employee_id: int
    date: str
    yesterday_work: str
    today_plan: str
    blockers: str = ""

# --- 5. Intent + NER full pipeline ---
@router.post("/run")
def full_pipeline(req: FullPipelineRequest):
    try:
        sentence = req.sentence.strip()
        employee_id = req.employee_id
        confirm_insert = req.confirm_insert

        # --- Step 1: Intent prediction ---
        intent_label_map = {
            "LABEL_0": "log_update",
            "LABEL_1": "query_update",
            "LABEL_2": "update_entry",
            "LABEL_3": "unknown"
        }
        intent_pred = intent_pipeline(sentence)[0]
        intent_label = intent_label_map.get(intent_pred["label"], "unknown")

        # --- Step 2: NER ---
        predictions = ner_pipeline(sentence)
        merged_entities = defaultdict(str)
        for ent in predictions:
            merged_entities[ent["entity_group"]] += ent["word"] + " "
        merged_entities = {k: v.strip() for k, v in merged_entities.items()}

        # --- Step 3: Default response ---
        response = {
            "intent": intent_label,
            "entities": merged_entities,
            "message": "Intent & entities detected successfully. To perform DB action, set confirm_insert=1."
        }

        if confirm_insert != 1:
            return response

        conn = get_conn()
        cur = conn.cursor()

        # Get latest sprint
        cur.execute("SELECT sprint_id FROM sprints ORDER BY start_date DESC LIMIT 1;")
        sprint_row = cur.fetchone()
        if not sprint_row:
            raise HTTPException(status_code=404, detail="No sprint found.")
        sprint_id = sprint_row[0]

        today = date.today()

        # --- Intent actions ---
        if intent_label == "log_update":
            cur.execute("""
                INSERT INTO standups (date, yesterday_work, today_plan, blockers, employee_id, sprint_id)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING standup_id;
            """, (
                today,
                merged_entities.get("YESTERDAY", ""),
                merged_entities.get("TODAY", ""),
                merged_entities.get("BLOCKERS", ""),
                employee_id,
                sprint_id
            ))
            standup_id = cur.fetchone()[0]
            conn.commit()
            response.update({
                "standup_id": standup_id,
                "message": "✅ New standup logged successfully."
            })

        elif intent_label == "update_entry":
            cur.execute("""
                UPDATE standups
                SET yesterday_work=%s, today_plan=%s, blockers=%s
                WHERE employee_id=%s AND date=%s
                RETURNING standup_id;
            """, (
                merged_entities.get("YESTERDAY", ""),
                merged_entities.get("TODAY", ""),
                merged_entities.get("BLOCKERS", ""),
                employee_id,
                today
            ))
            updated = cur.fetchone()
            if not updated:
                raise HTTPException(status_code=404, detail="No standup found for today to update.")
            conn.commit()
            response.update({
                "standup_id": updated[0],
                "message": "✏️ Standup updated successfully."
            })

        elif intent_label == "query_update":
            cur.execute("""
                SELECT standup_id, date, yesterday_work, today_plan, blockers
                FROM standups
                WHERE employee_id=%s AND date=%s;
            """, (employee_id, today))
            row = cur.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="No standup found for today.")
            response.update({
                "standup_id": row[0],
                "date": row[1],
                "yesterday_work": row[2],
                "today_plan": row[3],
                "blockers": row[4],
                "message": "📄 Retrieved today's standup."
            })
        else:
            response.update({"message": "🤷 Unknown or unsupported intent."})

        return response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if "cur" in locals():
            cur.close()
        if "conn" in locals():
            conn.close()

# --- 6. View Standup ---
@router.get("/view")
def view_standup(employee_id: int = Query(...), date: str = Query(...)):
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            SELECT standup_id, date, yesterday_work, today_plan, blockers
            FROM standups
            WHERE employee_id=%s AND date=%s;
        """, (employee_id, date))
        row = cur.fetchone()
        if not row:
            return {"message": "No standup found for this date."}
        return {
            "standup_id": row[0],
            "date": str(row[1]),
            "yesterday_work": row[2],
            "today_plan": row[3],
            "blockers": row[4],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if "cur" in locals():
            cur.close()
        if "conn" in locals():
            conn.close()

# --- 7. Edit Standup ---
@router.put("/edit")
def edit_standup(req: StandupEditRequest):
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            UPDATE standups
            SET yesterday_work=%s, today_plan=%s, blockers=%s
            WHERE employee_id=%s AND date=%s
            RETURNING standup_id;
        """, (
            req.yesterday_work,
            req.today_plan,
            req.blockers,
            req.employee_id,
            req.date
        ))
        updated = cur.fetchone()
        if not updated:
            raise HTTPException(status_code=404, detail="No standup found for this date to update.")
        conn.commit()
        return {"message": "✅ Standup updated successfully.", "standup_id": updated[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if "cur" in locals():
            cur.close()
        if "conn" in locals():
            conn.close()
