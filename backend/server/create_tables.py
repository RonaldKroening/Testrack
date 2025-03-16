import sqlite3
import os
import json
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Get the absolute path to the 'exams' directory
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "exams"))

def get_table_data():
    table_data = {}
    for item in os.listdir(base_dir):
        item_path = os.path.join(base_dir, item)
        if os.path.isdir(item_path):
            tests = []
            tests_dir = os.path.join(item_path, "tests")
            for test in os.listdir(tests_dir):
                exam_file = os.path.join(tests_dir, test)
                if exam_file.endswith(".json"):
                    try:
                        with open(exam_file, "r") as file:
                            data = json.load(file)
                            name = test
                            exam_type = item
                            number_of_questions = len(data)
                            created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                            tests.append({
                                "name": name,
                                "exam_type": exam_type,
                                "number_of_questions": number_of_questions,
                                "created_at": created_at
                            })
                    except (FileNotFoundError, json.JSONDecodeError) as e:
                        logging.error(f"Error reading {exam_file}: {e}")
                        continue
            table_data[item] = tests
    return table_data

def make_tests_table():
    with sqlite3.connect("database.db") as conn:
        cursor = conn.cursor()

        # Drop the existing 'tests' table if it exists
        drop_table_query = "DROP TABLE IF EXISTS tests;"
        cursor.execute(drop_table_query)
        logging.info("Dropped existing 'tests' table (if any).")

        # Create a new 'tests' table
        create_table_query = '''
        CREATE TABLE tests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            exam_type TEXT NOT NULL,
            number_of_questions INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        '''
        cursor.execute(create_table_query)
        logging.info("Created new 'tests' table.")

        # Get table data
        table_data = get_table_data()

        # Prepare the data for batch insertion
        data_to_insert = []
        for exam_type, tests in table_data.items():
            for test in tests:
                data_to_insert.append((test["name"], test["exam_type"], test["number_of_questions"], test["created_at"]))

        # Insert all rows in one go
        insert_query = '''
        INSERT INTO tests (name, exam_type, number_of_questions, created_at) VALUES (?, ?, ?, ?);
        '''
        cursor.executemany(insert_query, data_to_insert)
        conn.commit()
        logging.info(f"Inserted {len(data_to_insert)} rows into the 'tests' table.")

    logging.info("Tests table completed successfully.")

def make_user_table():
    with sqlite3.connect("database.db") as conn:
        cursor = conn.cursor()

        # Drop the existing 'users' table if it exists
        drop_table_query = "DROP TABLE IF EXISTS users;"
        cursor.execute(drop_table_query)
        logging.info("Dropped existing 'users' table (if any).")

        # Create a new 'users' table
        create_table_query = '''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );
        '''
        cursor.execute(create_table_query)
        logging.info("Created new 'users' table.")

    logging.info("Users table completed successfully.")
    
def make_attempt_table():
    with sqlite3.connect("database.db") as conn:    
        cursor = conn.cursor()

        # Drop the existing 'attempts' table if it exists
        drop_table_query = "DROP TABLE IF EXISTS attempts;"
        cursor.execute(drop_table_query)
        logging.info("Dropped existing 'attempts' table (if any).")

        # Create a new 'attempts' table
        create_table_query = '''
        CREATE TABLE attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            exam_id INTEGER NOT NULL,
            score INTEGER NOT NULL
        );
        '''
        cursor.execute(create_table_query)
        logging.info("Created new 'attempts' table.")

def make_all_tables():
    make_tests_table()
    make_user_table()
    make_attempt_table()
    
make_all_tables()