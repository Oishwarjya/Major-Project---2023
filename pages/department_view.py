import base64
import streamlit as st
import plotly.express as px
import matplotlib.pyplot as plt
import pandas as pd
import json

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

if st.session_state.status == "Fail":
    st.title("INVALID LOGIN!!")

elif st.session_state['Type']!= "Department":
    st.title("INVALID LOGIN!!")

else:
    st.write("Department Head Name: ", st.session_state["status"])
    st.title("DEPARTMENT LEVEL DASHBOARD")
    # Read data from files
    with open('db_resolver.json', 'r') as f:
        resolver_data = json.load(f)

    with open('db_student.json', 'r') as f:
        students = json.load(f)

    # Get all department names
    dept_names = ["Computing Technologies", "Networking and Communications", "Computational Intelligence", "Data Science and Business Systems"]

    # Initialize resolved and unresolved counts for all departments
    resolved_counts = [0] * len(dept_names)
    unresolved_counts = [0] * len(dept_names)

    # Loop over all departments
    for i, dept in enumerate(dept_names):
        # Filter queries for the current department
        dept_queries = [query for student in students['student'] for query in student['queries'] if student['dept'] == dept]

        # Count the number of resolved and unresolved queries
        resolved_count = sum([1 for query in dept_queries if  query.get('status', '') == 'Resolved'])
        unresolved_count = sum([1 for query in dept_queries if query.get('status', '') != 'Resolved'])

        # Increment the resolved and unresolved counts for the current department
        resolved_counts[i] = resolved_count
        unresolved_counts[i] = unresolved_count

        # Generate pie chart
        fig, ax = plt.subplots()
        ax.pie([resolved_count, unresolved_count], labels=["Resolved", "Unresolved"], autopct="%1.1f%%")
        ax.set_title(f"{dept} Queries")
        st.pyplot(fig)

    # Generate combined bar graph
    fig, ax = plt.subplots()
    bar_width = 0.35
    x = range(len(dept_names))
    rects1 = ax.bar(x, resolved_counts, bar_width, label='Resolved')
    rects2 = ax.bar([i + bar_width for i in x], unresolved_counts, bar_width, label='Unresolved')
    ax.set_xlabel('Department')
    ax.set_ylabel('Count')
    ax.set_xticks([i + bar_width for i in x])
    ax.set_xticklabels(dept_names)
    ax.legend()
    fig.tight_layout()
    st.pyplot(fig)
