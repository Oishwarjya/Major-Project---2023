import base64
import streamlit as st
import plotly.express as px
import csv
import student
from student import student_page


df = px.data.iris()

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
st.title("SRM PLACEMENT QUERY HANDLER")
st.sidebar.image("srm.png", use_column_width=True)
st.sidebar.title("Information:")
st.sidebar.markdown("This website is made to enable easier query and resolution for students ,specific to campus placements.")
if 'status' not in st.session_state:
    st.session_state["status"]=""

@st.cache_data
def load_data(file):
    with open(file, 'r', encoding='UTF-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        data = [row for row in reader]
    return header, data

header, data = load_data("student_data - Sheet1.csv")
col_index = {col: index for index, col in enumerate(header)}
def login(user_name, password):
    for row in data:
        if row[col_index['Name']] == user_name and row[col_index['Date of Birth']] == password:
            return row[col_index['Name']], row[col_index['Register Number']]
    return None

from flask import Blueprint, request, redirect, url_for

login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=['GET', 'POST'])
def login_page():
    if request.method == 'POST':

        with st.container():
            st.header("LOGIN")
            st.markdown(
                "Students, Admins and Department head logins"
            )
            with st.form("entry_form", clear_on_submit= True):
                login_type = st.selectbox("Login Type", ("Student", "Admin", "Department"))

                if login_type == "Student":
                    user_name = st.text_input("Username")
                    password = st.text_input("Password", type='password')
                    submitted = st.form_submit_button("Login")

                    if submitted:
                        student_data = login(user_name, password)
                        if student_data:
                            return redirect(url_for('student.student_page'))
                        else:
                            st.error("invalid credentials")            
                                
if __name__ == "__main__":
    login_page()