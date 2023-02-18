import streamlit as st 
import base64
import csv

@st.experimental_memo
def get_img_as_base64(file):
    with open(file, "rb") as f:
        data = f.read()
    return base64.b64encode(data).decode()

def load_data(file):
    with open(file, 'r',encoding='UTF-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        data = [row for row in reader]
        return header, data

header, data = load_data("student_data - Sheet1.csv")
col_index = {col: index for index, col in enumerate(header)}

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

if st.session_state.status == "Fail":
    st.title("INVALID LOGIN!!")

else:

    st.markdown("<h1 style='color:#202A44;font-family: Cooper Black;font-size:30px;'>HAVE A PLACEMENT RELATED QUERY ? RESOLVE IT WITH SRM PQH !</h1>", unsafe_allow_html=True)  
    #student details
    #st.markdown("<div style='display:flex; justify-content:space-between;'><p style='text-align:left;font-size:20px;'> Student Name: </p><p style='text-align:right;font-size:20px;'> Registration Number: </p></div>",unsafe_allow_html=True)
    #st.write("Student Name: ", st.session_state["status"])
    st.write("Student Name: ", st.session_state["status"])
    for row in data:
        if st.session_state["status"] == row[col_index['Name']]:
            st.write("Registration Number: ", row[col_index['Register Number']])
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



    query = st.text_input("Any other Query ? Enter it in the box below:")
    if st.button("Submit"):
        st.write("Redirecting...")
        # store the query in a database or data structure
        # code to redirect to another page for resolving queries
