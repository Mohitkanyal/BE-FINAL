import psycopg2
from psycopg2.extras import RealDictCursor

def get_connection():
    try:
        conn = psycopg2.connect(
            dbname="scrumbotdb",
            user="postgres",
            password="123456",
            host="localhost",
            port="5432",
            cursor_factory=RealDictCursor
        )
        return conn
    except Exception as e:
        print("❌ Error connecting to PostgreSQL:", e)
        raise
