import sqlite3
import json

DB_PATH = 'chat_sessions.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS chat_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            messages TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def save_chat(messages):
    # Only keep first 20 messages
    messages_to_save = messages[:20]
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('INSERT INTO chat_sessions (messages) VALUES (?)', (json.dumps(messages_to_save),))
    conn.commit()
    conn.close()

def get_chats(limit=10):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT id, messages FROM chat_sessions ORDER BY id DESC LIMIT ?', (limit,))
    rows = c.fetchall()
    conn.close()
    return [{'id': row[0], 'messages': json.loads(row[1])} for row in rows]
