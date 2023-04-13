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
with open('db_resolver.json') as f:
    resolver_data = json.load(f)

@st.cache_data
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

elif st.session_state['Type']!= "Resolver":
    st.title("INVALID LOGIN!!")

else:
    st.write("Resolver Name: ", st.session_state["Name"])  
    st.write("Resolver emp_id: ", st.session_state["status"])   
    st.title("Resolver Dashboard")
    st.write("Below are the queries that need to be resolved")


    logged_in_empid = st.session_state["status"]
    
    resolver_dept = None
    for resolver in resolver_data['resolver']:
        if resolver['empid'] == logged_in_empid:
            resolver_dept = resolver['dept']
            break

    with open('db_student.json', 'r') as f:
        students = json.load(f)

    dept_queries = []
    for student in students['student']:
        if student['dept'] == resolver_dept:
            dept_queries.extend(student['queries'])
            

    # Display filtered queries in a table format
    if dept_queries:
        query_table = []
        for i, query in enumerate(dept_queries):
            query_table.append([f"Query {i+1}", query['student_name'], query['email_id'], query['company'], query['date'], query['query'],query['status']])

        query_table_columns = ["Query No.", "Name", "Email ID", "Company", "Date", "Query", "Status"]
        query_df = pd.DataFrame(query_table, columns=query_table_columns)
        query_table=st.table(query_df)

        #send email to selected query
        selected_row = st.selectbox("Select the Query No you want to resolve", range(1, len(dept_queries) + 1))
        selected_query = dept_queries[selected_row-1]
        st.dataframe(selected_query)
        st.write("Send email to student to rectify query")
        from_email = st.text_input("From", "srmpqh@gmail.com")
        to = st.text_input("To", selected_query['email_id'])
        subject = st.text_input("Subject", selected_query['query'])
        message = st.text_area("Message")


        if st.button("Send Email"):
            
            # Create email message
            msg = MIMEMultipart()
            msg['From'] = from_email
            print(msg['From'])
            msg['To'] = to
            msg['Subject'] = subject
            msg.attach(MIMEText(message, 'plain'))

            # Send email
            server = smtplib.SMTP('smtp.gmail.com', 587)  # Replace with SMTP server and port
            server.starttls()
            server.login('srmpqh@gmail.com', 'fnsuhdjegwzzzurs')  
            server.sendmail(msg['From'], msg['To'], msg.as_string())
            server.quit()
            st.success("Email sent successfully!")

            # Update status in DataFrame
            dept_queries[selected_row - 1]['status'] = 'Resolved'
            query_df.at[selected_row - 1, 'Status'] = 'Resolved'

            # Save the updated students JSON to the file
            with open('db_student.json', 'w') as f:
                json.dump(students, f, indent=4)

            
           
    else:
        st.write("No queries found for your department")

                
               