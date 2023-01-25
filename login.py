"""import streamlit as st
import time
import pandas as pd


col1, col2, col3 = st.columns([3,5,2])

col1.markdown(" #Welcome to SRM PQH")
col2.markdown(" Here is spme info on the app")

col3.metric(label="Tempurature", value ="60 C", delta= "3")
"""
import base64
import streamlit as st
import plotly.express as px

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
background-size: 180%;
background-position: top left;
background-repeat: no-repeat;
background-attachment: local;
}}
[data-testid="stSidebar"] > div:first-child {{
background-image: url("data:image/png;base64,{img}");
background-position: center; 
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
st.sidebar.header("Information")

with st.container():
    st.header("LOGIN")
    st.markdown(
        "Students, Admins and Department head logins"
    )
    st.plotly_chart(px.scatter(df, x="sepal_width", y="sepal_length", color="species"))
