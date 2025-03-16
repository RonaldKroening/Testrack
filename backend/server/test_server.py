import requests
import sqlite3
def get_test_data(id: int):
    url = f"http://127.0.0.1:8000/get_test_data/{id}/"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to retrieve data"}

def showAll():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM tests')
    rows = cursor.fetchall()
    conn.close()
    print(rows)
    
if __name__ == "__main__":
    # Example usage
    data = get_test_data(2)
    print(data)
    
    