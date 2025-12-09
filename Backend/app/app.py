from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel
from typing import List
import psycopg2, json, re, os
from dotenv import load_dotenv
from datetime import date
from psycopg2.extras import RealDictCursor

# ----------------------------------------------------
#  Flask + Database Setup
# ----------------------------------------------------
app = Flask(__name__)
load_dotenv()
CORS(app)

def get_connection():
    return psycopg2.connect(
        dbname="scrumbotdb",
        user="postgres",
        password="123456",  # change if needed
        host="localhost",
        port="5432"
    )

# ----------------------------------------------------
#  LLM Setup
# ----------------------------------------------------
llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task="text-generation"
)
model = ChatHuggingFace(llm=llm)

# ----------------------------------------------------
#  1. Sprint Generation
# ----------------------------------------------------
class SubTask(BaseModel):
    subtask_id: int
    title: str
    description: str

class Task(BaseModel):
    task_id: int
    title: str
    description: str
    subtasks: List[SubTask] = []

class Sprint(BaseModel):
    sprint_id: int
    sprint_name: str
    goal: str
    tasks: List[Task]

parser = PydanticOutputParser(pydantic_object=Sprint)

sprint_prompt = PromptTemplate(
    input_variables=["project_name", "project_description"],
    partial_variables={
        "format_instructions": """
Expected JSON:
{
  "sprint_id": 1,
  "sprint_name": "Sprint Name",
  "goal": "Sprint Goal",
  "tasks": [
    {
      "task_id": 1,
      "title": "Task Title",
      "description": "Task Description",
      "subtasks": [
        {"subtask_id": 101, "title": "Subtask Title", "description": "Subtask Description"}
      ]
    }
  ]
}
"""
    },
    template="""
You are an expert Agile Project Planner AI.
Generate a sprint plan for the following project:

Project: {project_name}
Description: {project_description}

Rules:
1. Maintain JSON hierarchy: Sprint → Tasks → Subtasks.
2. Generate unique task_id and subtask_id values.
3. Output only the JSON object — no markdown.

{format_instructions}
"""
)

def extract_json(text):
    match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    return match.group(1) if match else text.strip()

@app.route("/generate_sprint", methods=["POST"])
def generate_sprint():
    try:
        payload = request.json
        project_name = payload.get("project_name")
        project_description = payload.get("project_description")

        if not project_name or not project_description:
            return jsonify({"error": "Missing project_name or project_description"}), 400

        prompt = sprint_prompt.invoke({
            "project_name": project_name,
            "project_description": project_description
        })

        response = model.invoke(prompt)
        raw_output = extract_json(response.content)
        parsed_sprint = parser.parse(raw_output)

        conn = get_connection()
        cursor = conn.cursor()

        # Insert sprint
        cursor.execute("""
            INSERT INTO sprints (name, goal, start_date, end_date, project_id, progress)
            VALUES (%s, %s, %s, %s, %s, 0) RETURNING sprint_id
        """, (parsed_sprint.sprint_name, parsed_sprint.goal, date.today(), date.today(), 1))
        sprint_id = cursor.fetchone()[0]
        conn.commit()

        # Insert tasks and subtasks
        for task in parsed_sprint.tasks:
            cursor.execute("""
                INSERT INTO tasks (title, description, sprint_id, status, progress)
                VALUES (%s, %s, %s, 'incomplete', 0) RETURNING task_id
            """, (task.title, task.description, sprint_id))
            task_id = cursor.fetchone()[0]
            conn.commit()

            for sub in task.subtasks:
                cursor.execute("""
                    INSERT INTO tasks (title, description, sprint_id, parent_task_id, status, progress)
                    VALUES (%s, %s, %s, %s, 'incomplete', 0)
                """, (sub.title, sub.description, sprint_id, task_id))
                conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "message": "Sprint generated successfully",
            "sprint_id": sprint_id,
            "sprint_details": parsed_sprint.model_dump()
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------------------------------------------
#  2. Report Generation
# ----------------------------------------------------
report_prompt = PromptTemplate(
    input_variables=["type_of_report", "data"],
    template="""
You are an AI report generator.
Generate a professional report for {type_of_report} data below:

{data}

Rules:
1. Include Title, Summary, Observations, and Recommendations.
2. Use a professional, factual tone.
3. Output plain text only (no markdown).
"""
)

@app.route("/generate_report", methods=["POST"])
def generate_report():
    try:
        payload = request.json
        report_type = payload.get("type")
        report_id = payload.get("id")

        if report_type not in ["sprint", "standup", "employee"]:
            return jsonify({"error": "Invalid report type"}), 400

        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        if report_type == "sprint":
            cursor.execute("SELECT * FROM sprints WHERE sprint_id = %s", (report_id,))
        elif report_type == "standup":
            cursor.execute("SELECT * FROM standups WHERE standup_id = %s", (report_id,))
        else:
            cursor.execute("SELECT * FROM tasks WHERE employee_id = %s", (report_id,))

        rows = cursor.fetchall()
        if not rows:
            return jsonify({"error": f"No data found for {report_type} ID {report_id}"}), 404

        prompt = report_prompt.invoke({
            "type_of_report": report_type,
            "data": json.dumps(rows, default=str)
        })

        response = model.invoke(prompt)
        report_text = response.content.strip()

        cursor.execute("""
            INSERT INTO reports (date, content, project_id)
            VALUES (%s, %s, 1)
        """, (date.today(), report_text))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Report generated successfully", "report": report_text}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------------------------------------------
#  3. Dashboards (Database-driven)
# ----------------------------------------------------
@app.route('/get_sprints', methods=['GET'])
def get_sprints():
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT s.sprint_id, s.name AS sprint_name, s.progress, s.goal, 
                   p.name AS project_name, s.start_date, s.end_date
            FROM sprints s
            JOIN projects p ON s.project_id = p.project_id
            ORDER BY s.sprint_id DESC;
        """)
        data = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify({"sprints": data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_reports', methods=['GET'])
def get_reports():
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT r.report_id, r.date, r.content, p.name AS project_name
            FROM reports r
            JOIN projects p ON r.project_id = p.project_id
            ORDER BY r.date DESC;
        """)
        data = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify({"reports": data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_employees', methods=['GET'])
def get_employees():
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT e.employee_id, e.name, e.role, p.name AS project_name,
                   COUNT(t.task_id) FILTER (WHERE t.status IN ('complete', 'completed')) AS completed_tasks,
                   COUNT(t.task_id) AS total_tasks
            FROM employees e
            LEFT JOIN projects p ON e.project_id = p.project_id
            LEFT JOIN tasks t ON e.employee_id = t.employee_id
            GROUP BY e.employee_id, e.name, e.role, p.name
            ORDER BY e.employee_id;
        """)
        data = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify({"employees": data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_projects', methods=['GET'])
def get_projects():
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT p.project_id, p.name AS project_name, sm.name AS scrum_master,
                   COUNT(s.sprint_id) AS sprint_count,
                   ROUND(AVG(s.progress), 2) AS avg_progress
            FROM projects p
            LEFT JOIN scrum_masters sm ON p.scrum_master_id = sm.id
            LEFT JOIN sprints s ON s.project_id = p.project_id
            GROUP BY p.project_id, p.name, sm.name;
        """)
        projects = cur.fetchall()

        # Fetch team members for each project
        for project in projects:
            cur.execute("SELECT e.name FROM employees e WHERE e.project_id = %s", (project['project_id'],))
            team = [r['name'] for r in cur.fetchall()]
            project['team'] = team

        cur.close()
        conn.close()
        return jsonify({"projects": projects}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------------------------------------------
#  Run the app
# ----------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
