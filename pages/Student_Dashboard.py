import streamlit as st 
import base64
import csv
import matplotlib.pyplot as plt
import sqlite3
import json

#Connecting to db 
f = open('db_student.json')
data = json.load(f)

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
    

    # Connect to database
    conn = sqlite3.connect('queries.db')
    c = conn.cursor()

    # Create table if it doesn't exist
    c.execute('''CREATE TABLE IF NOT EXISTS queries
                (student_name TEXT, email_id TEXT, company TEXT, date DATE, query TEXT, status TEXT,section TEXT)''')

    # Display input fields and submit button
    companies = ["Adobe", "Affinsys AI", "Afford Medical Technologies","Agumentik Software","Aidash","Alstom","Amadeus","Amazon WOW"]

    student_name= st.text_input("Enter your name")
    email_id= st.text_input("Enter your email id")
    company= st.selectbox("Select company", companies)
    date= st.date_input("Select date")
    query= st.text_area("Enter your query")
    sections=["A1-α","A1-β","B1-α","B1-β","C1-α","C1-β","D1-α","D1-β","E1-α","E1-β","F1-α","F1-","G1-α","G1-β","H1-α","H1-β","I1-α","I1-β","J1-α","J1-β","K1-α","K1-β","L1-α","L1-β","M1-α","M1-β","N1-α","N1-β"]
    section=st.selectbox("Select you section",sections)

    if st.button("Submit"):
        # Save query data to database
        c.execute('INSERT INTO queries (student_name, email_id, company, date, query, status, section) VALUES (?, ?, ?, ?, ?, ?, ?)', (student_name, email_id, company, date, query, "Unresolved", section))
        conn.commit()
        st.success("Query submitted successfully!")
                
    
    raised = 20
    resolved = 15

    st.markdown("<div style='text-align:center;color:#202A44;font-family: Cooper Black;font-size:20px;'>YOUR QUERY STATUS </div>", unsafe_allow_html=True)

    # Pie chart, where the slices will be ordered and plotted counter-clockwise:
    labels = 'Queries Raised', 'Queries Resolved'
    sizes = [raised, resolved]
    explode = (0, 0.1)  # only "explode" the 2nd slice (i.e. 'Queries Resolved')

    fig1, ax1 = plt.subplots()
    ax1.pie(sizes, explode=explode, labels=labels, autopct='%1.1f%%',
            shadow=True, startangle=90)
    ax1.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle

    st.pyplot(fig1)