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
type_of_report = input("Enter the type of report you want to generate (sprint, standup, employee): ").strip().lower()

prompt_template = PromptTemplate(
    input_variables=["type_of_report","data"],
    template="""
You are an expert report writer AI.

Your task is to generate a detailed and professional report based on the following input data:

{data}

Instructions:
1. If the data appears incomplete or indicates the start of a project, write a sample report and mention that the project has just begun or no significant data is available yet.
2. Include all relevant insights, observations, and summaries based on the data.
3. Use a clear and professional tone.
4. Structure the report with appropriate sections, such as: Title, Summary, Key Points, Observations, and Recommendations (as applicable).
5. Output must be plain text. Do not use markdown, bullet points, or JSON format.
6. Do not add any explanation before or after the report. Only return the full report text.



"""
)

# if type_of_report not in ["sprint", "standup", "employee"]:
#     print("Invalid report type. Please enter 'sprint', 'standup', or 'employee'.")
#     exit(1)

if "sprint" in type_of_report or "sprints" in type_of_report or "sprint_id" in type_of_report:
    table_name = "sprints"
    id = input("Enter the sprint ID for the report (or press Enter to include all sprints): ").strip()
    if id:
        data = cursor.execute(f"SELECT * FROM sprints WHERE sprint_id = {id};")
        data = cursor.fetchall()
        if not data:
            print(f"No sprint found with ID {id}.")
            exit(1)
        # data = cursor.fetchall()

elif "standup" in type_of_report or "standup_id" in type_of_report:
    id = input("Enter the standup ID for the report (or press Enter to include all standups): ").strip()
    if id:
        data = cursor.execute(f"SELECT * FROM standups WHERE standup_id = {id};")
        data = cursor.fetchall()
        if not data:
            print(f"No standup found with ID {id}.")
            exit(1)
    table_name = "standups"
    # data = cursor.fetchall()

elif "employee" in type_of_report or "employee_id" in type_of_report:
    id = input("Enter the employee ID for the report: ").strip()
    data = cursor.execute(f"SELECT * FROM tasks WHERE employee_id = {id};")
    data = cursor.fetchall()
    if not data:
        print(f"No employee found with ID {id}.")
        exit(1)
    

# data = cursor.execute(f"SELECT * FROM {table_name};")
# data = cursor.fetchall()
prompt = prompt_template.invoke({'type_of_report':type_of_report,'data':data})

# print("Generated Prompt:\n", prompt)

result = model.invoke(prompt)
print("Model Response:\n", result.content)