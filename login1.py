import streamlit as st
import requests
import base64
import csv
import matplotlib.pyplot as plt

def login():
    st.write("## Login")
    with st.container():
        st.header("LOGIN")
        st.markdown(
            "Students, Admins and Department head logins"
        )
        with st.form("entry_form", clear_on_submit= True):
            login_type=st.selectbox("Login Type", ("Student", "Admin", "Department"))
            username = st.text_input("Username")
            password = st.text_input("Password", type="password")
            if login_type=='Student':
                if st.button("Login"):
                    response = requests.post("http://localhost:5000/login", json={"username": username, "password": password})
                    if response.status_code == 200:
                        token = response.json()["token"]
                        st.success("Login successful!")
                        return token
                    else:
                        st.error("Invalid username or password.")
