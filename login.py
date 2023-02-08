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
st.sidebar.markdown("This website is made to enable easier query and resolution for students specific to campus placements.")



with st.container():
    st.header("LOGIN")
    st.markdown(
        "Students, Admins and Department head logins"
    )
    with st.form("entry_form", clear_on_submit= True):
        st.selectbox("Login Type", ("Student", "Admin", "Department"))
        st.text_input(label="Username")  
        st.text_input(label="Password")
        submitted = st.form_submit_button("Confirm") 
