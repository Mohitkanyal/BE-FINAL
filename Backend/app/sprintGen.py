from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from dotenv import load_dotenv
from langchain_core.output_parsers import JsonOutputParser
from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel, Field
from typing import List, Optional
import psycopg2
import os

conn = psycopg2.connect(
    dbname="scrumbotdb",
    user="postgres",
    password="123456",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()




load_dotenv()

llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task="text-generation",
)
model = ChatHuggingFace(llm=llm)



class SubTask(BaseModel):
    subtask_id: int = Field(..., description="AI-generated unique subtask ID, starts with (task id*100)+ subtask id starting from 1 per task")
    title: str = Field(..., description="Short title of the subtask")
    description: str = Field(..., description="Detailed description of the subtask")

class Task(BaseModel):
    task_id: int = Field(..., description="AI-generated unique task ID, starts from 1 per sprint")
    title: str = Field(..., description="Title of the task")
    description: str = Field(..., description="Detailed description of the task")
    subtasks: List[SubTask] = Field(default_factory=list, description="List of subtasks under this task")

class Sprint(BaseModel):
    sprint_id: int = Field(..., description="AI-generated unique sprint ID, starts from 1")
    sprint_name: str = Field(..., description="Name of the sprint")
    goal: str = Field(..., description="Goal or focus of the sprint")
    tasks: List[Task] = Field(..., description="Tasks included in this sprint")

parser = PydanticOutputParser(pydantic_object=Sprint)

name = "Agile automation tool"
description = "An AI-powered tool to automate and streamline Agile project management tasks, including sprint planning, task tracking, and team collaboration."
prompt_template = PromptTemplate(
    input_variables=["project_name", "project_description"],
    partial_variables={"format_instructions": """
Expected JSON format:
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
        {
          "subtask_id": 101,
          "title": "Subtask Title",
          "description": "Subtask Description"
        }
      ]
    }
  ]
}
"""},

    template="""
You are an expert Agile project planner AI.
Generate a sprint plan for the given project.

Project Name: {project_name}
Project Description: {project_description}

Instructions:
1. Generate AI IDs for hierarchy:
   - Sprint ID: unique per sprint, starting from 1
   - Task ID: unique per sprint, starting from 1
   - Subtask ID: unique per task, starting from (task id * 100) + subtask id starting from 1 (eg: 101, 102 for first task's subtasks)
2. Include sprint_name, goal, start_date, end_date.
3. Include tasks with title, description, task_id.
4. Include subtasks with title, description, subtask_id.
5. DO NOT generate database-specific fields (Status, Progress, Employee_ID, Planned_for_Date).
6. Maintain the hierarchy: Sprint → Tasks → Subtasks.
7. Output must be in structured JSON according to the format instructions.
Respond with only the JSON object. Do not add explanations, markdown, or text outside the JSON.


{format_instructions}
"""
)

prompt = prompt_template.invoke({
    "project_name": name,
    "project_description": description
})
# print(prompt)

response = model.invoke(prompt)


import re

def extract_json(text):
    match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    return match.group(1) if match else text.strip()

raw_output = response.content
# print("Raw Output:\n", raw_output)  
import json
try:
    cleaned = extract_json(raw_output)
    parsed_sprint_plan = parser.parse(cleaned)


    # print("Parsed Sprint Plan:\n", json.dumps(parsed_sprint_plan.model_dump(), indent=2))
    sprint_record = json.dumps(parsed_sprint_plan.model_dump(), indent=2)
    print(sprint_record)

except Exception as e:
    print("Parsing Error:", e)

sprint_name = parsed_sprint_plan.sprint_name
sprint_goal = parsed_sprint_plan.goal
start_date = '2025-10-10'
end_date = '2025-10-20'
project_id = 1  

cursor.execute("""
    INSERT INTO sprints (name, goal, start_date, end_date, project_id, progress)
    VALUES (%s, %s, %s, %s, %s, 0)
    RETURNING sprint_id
""", (sprint_name, sprint_goal, start_date, end_date, project_id))

db_sprint_id = cursor.fetchone()[0]
conn.commit()
task_id_map = {}  

for task in parsed_sprint_plan.tasks:
    
    cursor.execute("""
        INSERT INTO tasks (title, description, sprint_id, status, progress)
        VALUES (%s, %s, %s, 'incomplete', 0)
        RETURNING task_id
    """, (task.title, task.description, db_sprint_id))
    
    db_task_id = cursor.fetchone()[0]
    conn.commit()
    task_id_map[task.task_id] = db_task_id

    
    for subtask in task.subtasks:
        cursor.execute("""
            INSERT INTO tasks (title, description, sprint_id, parent_task_id, status, progress)
            VALUES (%s, %s, %s, %s, 'incomplete', 0)
            RETURNING task_id
        """, (subtask.title, subtask.description, db_sprint_id, db_task_id))
        
        db_subtask_id = cursor.fetchone()[0]
        conn.commit()
