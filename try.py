import sqlite3
#Connect to database
conn = sqlite3.connect('queries.db')
c = conn.cursor()
c.execute('INSERT INTO queries (student_name, email_id, company, date, query) VALUES (?, ?, ?, ?, ?)', ("name", "email_id", "company", "date", "query"))
conn.commit()
print(c.execute('select * from queries'))
