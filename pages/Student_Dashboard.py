import streamlit as st 
import base64
import csv
import matplotlib.pyplot as plt
import sqlite3
import json
import pandas as pd


#Connecting to db 
f = open('db_student.json')
data = json.load(f)


#@st.cache_data
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

print(st.session_state)

if st.session_state.status == "Fail":
    st.title("INVALID LOGIN!!")

elif st.session_state['Type']!= "Student":
    st.title("INVALID LOGIN!!")

else:
    st.markdown("<h1 style='color:#202A44;font-family: Cooper Black;font-size:30px;'>HAVE A PLACEMENT RELATED QUERY ? RESOLVE IT WITH SRM PQH !</h1>", unsafe_allow_html=True)  
    #student details
    #st.markdown("<div style='display:flex; justify-content:space-between;'><p style='text-align:left;font-size:20px;'> Student Name: </p><p style='text-align:right;font-size:20px;'> Registration Number: </p></div>",unsafe_allow_html=True)
    st.write("Student Name: ", st.session_state["status"])
    for i in data['student']:
        if st.session_state["status"] == i['regno']:
            st.write("Student Number: ", i['username'])
    st.markdown("<div style='text-align:center;color:#202A44;font-family: Cooper Black;font-size:23px;'>RAISE YOUR QUERY </div>", unsafe_allow_html=True)


    # Create FAQ dropdown
    st.markdown("<div style='text-align:left;font-size:20px;'> FAQ's (Frequently Asked Questions) </div>",unsafe_allow_html=True)
    faq = {
        "Test Related Issue": ["Did not receive the test link?","Test link provided is no more active?","Got logged out of the test?"],
        "Interview Related Issue": ["Did not receive the interview link?","Interviewer did not join for the interview?","Did not recieve the results of the interview round?"],
        "Results Related Issue": ["Results not declared yet(over 15 days)?"],
        "Post-Offer Related Issue": ["Did not receive the offer letter?","Date of joining for internship not informed yet?"],
        "Superset Related Issue": ["Unable to apply to a specific company?","Cannot find company in the list anymore on superset?","Unable to accept offer on superset?","Information regarding superset unfreeze?","Insufficient information about a specific company?","Verification of superset profile not done yet?"],
        "Eligibility Related Issue": ["Eligibilty criteria not given for a specific company?"],
        
    }

    category = st.selectbox("Select Category", list(faq.keys()))
    question = st.selectbox("Select Question", faq[category])

    if question == "Did not receive the test link?":
        st.write("Check personal & SRM ID and spam folder, if not working please email:help@srmist.edu.in")
    elif question == "Test link provided is no more active?":
        st.write("Contact helpline number: 1234")
    elif question =="Got logged out of the test?":
        st.write("A3")
    elif question =="Did not receive the interview link?":
        st.write("A4")

   
    any_other_query = st.radio("Any other query?", ["Yes", "No"], key="query")

    # Define custom CSS style to increase font size
    style = """
        <style>
        .streamlit-radio label {
            font-size: 20px;
        }
        </style>
    """

    # Render custom CSS
    st.markdown(style, unsafe_allow_html=True)
    
    # Define the function to load student data from the JSON file
    def load_students():
        with open('db_student.json', 'r') as f:
            students = json.load(f)
        return students

    # Define the function to save student data to the JSON file
    def save_students(students):
        with open('db_student.json', 'w') as f:
            json.dump(students, f, indent=4)

    # Define the function to add a query to a student's record
    def add_query_to_student(student, query):
        student['queries'].append(query)

    # Connect to the database
    conn = sqlite3.connect('queries.db')
    c = conn.cursor()

    # Create the table if it doesn't exist
    c.execute('''CREATE TABLE IF NOT EXISTS queries
                (student_name TEXT, email_id TEXT, company TEXT, date DATE, query TEXT)''')

    # Read the Excel file and extract the company names
    df = pd.read_excel('Company Database.xlsx')
    companies = list(df['Company Name'])


    # Display the input fields
    student_name = st.text_input("Enter your name")
    email_id = st.text_input("Enter your email id")
    company = st.selectbox("Select company", companies)
    date = st.date_input("Select date")
    query = st.text_area("Enter your query")

    if st.button("Submit"):
        # Save the query data to the database
        c.execute('INSERT INTO queries (student_name, email_id, company, date, query) VALUES (?, ?, ?, ?, ?)', (student_name, email_id, company, date, query))
        conn.commit()
        st.success("Query submitted successfully!")

        # Load the list of students from the JSON file
        students = load_students()

        # Find the student record based on the email ID
        student = next((s for s in students['student'] if s['email'] == email_id), None)

        if student:
            # Add the query to the student's record
            query_data = {
                "student_name": student_name,
                "email_id": email_id,
                "company": company,
                "date": str(date),
                "query": query
            }
            add_query_to_student(student, query_data)

            # Save the updated student data to the JSON file
            save_students(students)

            st.success("Query added to student record successfully!")
        else:
            st.error("No student record found for this email ID.")