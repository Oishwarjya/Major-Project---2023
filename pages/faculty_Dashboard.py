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

df = px.data.iris()

# Load resolver data from JSON file
with open('db_faculty.json') as f:
    faculty_data = json.load(f)

@st.experimental_memo
def get_img_as_base64(file):
    with open(file, "rb") as f:
        data = f.read()
    return base64.b64encode(data).decode()


img = get_img_as_base64("image.jpg")

page_bg_img = f"""
<style>
[data-testid="stAppViewContainer"] > .main {{
background-image: url("https://images.unsplash.com/photo-1589810264340-0ce27bfbf751?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80");
background-size: 100%;
background-position: top left;
background-repeat: no-repeat;
background-attachment: local;
}}
[data-testid="stSidebar"] > div:first-child {{
background-image: url("data:image/png;base64,{img}");
background-position: centre; 
background-repeat: no-repeat;
background-attachment: fixed;
}}
[data-testid="stHeader"] {{
background: rgba(0,0,0,0);
}}
[data-testid="stToolbar"] {{
right: 2rem;
}}
</style>
"""
st.markdown(page_bg_img, unsafe_allow_html=True)

if st.session_state["status"] == "Fail":
    st.title("INVALID LOGIN!!")

elif st.session_state['Type']!= "Faculty Advisor":
    st.title("INVALID LOGIN!!")

else:
    st.write("Faculty Name: ", st.session_state["Name"])  
    st.write("Faculty emp_id: ", st.session_state["status"])   
    st.title("Faculty Advisor Dashboard")
    st.write("Below are the queries Submitted under your section")


    logged_in_empid = st.session_state["status"]
    print (logged_in_empid)
    
    faculty_sec = None
    for faculty in faculty_data['faculty']:
        if faculty['empid'] == logged_in_empid:
            faculty_sec = faculty['section']
            break

    with open('db_student.json', 'r') as f:
        students = json.load(f)

    sec_queries = []
    for student in students['student']:
        if student['section'] == faculty_sec:
            sec_queries.extend(student['queries'])

    # Display filtered queries in a table format
    if sec_queries:
        query_table = []
        for i, query in enumerate(sec_queries):
            query_table.append([f"Query {i+1}", query['student_name'], query['email_id'], query['company'], query['date'], query['query']])
        query_table_columns = ["Query No.", "Name", "Email ID", "Company", "Date", "Query"]
        query_df = pd.DataFrame(query_table, columns=query_table_columns)
        st.table(query_df)
    
    else:
        st.write("No queries found for your Section.")