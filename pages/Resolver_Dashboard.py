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

df = px.data.iris()

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

elif st.session_state['Type']!= "Resolver":
    st.title("INVALID LOGIN!!")

else:
    st.write("Resolver ID: ", st.session_state["status"])   
    st.title("Faculty Dashboard")
    st.write("Welcome! Here are the queries that need your attention:")

    # Connect to database
    conn = sqlite3.connect('queries.db')
    c = conn.cursor()

    # Retrieve query data from database
    c.execute('SELECT * FROM queries')
    data = c.fetchall()

    # Display data in a table format with an option to select a particular row
    if data:
        selected_row = st.selectbox("Select the query you want to resolve", range(len(data)))
        selected_data = data[selected_row]
        st.write("Selected row:", selected_row)
        st.write("Name:", selected_data[0])
        st.write("Email:", selected_data[1])
        st.write("Company:", selected_data[2])
        st.write("Date:", selected_data[3])
        st.write("Query:", selected_data[4])
        subject = selected_data[4]
    else:
        st.write("No data found in database.")

    # Display table with all entries from database
    if data:
        st.write("Below are the queries that need to be resolved")
        for row in data:
            st.write(row)

    # Display form to send email
    if data:
        st.write("Send email to student to rectify query")
        from_email = st.text_input("From", "srmpqh3@gmail.com")
        to = st.text_input("To", selected_data[1])
        subject = st.text_input("Subject", selected_data[4])
        message = st.text_area("Message")
        if st.button("Send Email"):
            # Create email message
            msg = MIMEMultipart()
            msg['From'] = from_email
            msg['To'] = to
            msg['Subject'] = subject
            msg.attach(MIMEText(message, 'plain'))

            # Send email
            server = smtplib.SMTP('smtp.gmail.com', 587)  # Replace with SMTP server and port
            server.starttls()
            server.login('srmpqh@gmail.com', 'fnsuhdjegwzzzurs')  # Replace with faculty email and password
            server.sendmail(msg['From'], msg['To'], msg.as_string())
            server.quit()
            st.success("Email sent successfully!")


