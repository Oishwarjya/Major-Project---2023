import base64
import streamlit as st
import plotly.express as px
import matplotlib.pyplot as plt
import pandas as pd
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.utils import COMMASPACE
from email import encoders
import sqlite3
import json

f = open('db_resolver.json')
data = json.load(f)

# Connect to database
conn = sqlite3.connect('queries.db')
c = conn.cursor()

# Retrieve query data from database
c.execute('SELECT * FROM queries')
data = c.fetchall()

for i in data:
    if i[5]=="Unresolved" and i[6]==:
        st.write(i)


# Display table with all entries from database
if data:
    st.write("Below are the queries that need to be resolved")
    for row in data:
        st.write(row)