import base64
import streamlit as st
import plotly.express as px
import matplotlib.pyplot as plt

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

if st.session_state.status == "Fail":
    st.title("INVALID LOGIN!!")

elif st.session_state['Type']!= "Department":
    st.title("INVALID LOGIN!!")

else:
    st.write("Department Head ID: ", st.session_state["status"])
    st.title("DEPARTMENT LEVEL DASHBOARD")
    col1, col2, col3 = st.columns(3)
    with col1:
         st.write("Computing Technologies")
         labels = 'Resolved', 'Pending'
         sizes = [20,80]
         explode = (0, 0.1)  # only "explode" the 2nd slice (i.e. 'Hogs')
         fig1, ax1 = plt.subplots()
         ax1.pie(sizes, explode=explode, labels=labels, autopct='%1.1f%%',shadow=True, startangle=90)
         ax1.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
         st.pyplot(fig1)

    with col2:
         st.write("Networking and Communications")
         labels = 'Resolved', 'Pending'
         sizes = [40,60]
         explode = (0, 0.1)  # only "explode" the 2nd slice (i.e. 'Hogs')
         fig1, ax1 = plt.subplots()
         ax1.pie(sizes, explode=explode, labels=labels, autopct='%1.1f%%',shadow=True, startangle=90)
         ax1.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
         st.pyplot(fig1)

    with col3:
         st.write("Computational Intelligence")
         labels = 'Resolved', 'Pending'
         sizes = [10,90]
         explode = (0, 0.1)  # only "explode" the 2nd slice (i.e. 'Hogs')
         fig1, ax1 = plt.subplots()
         ax1.pie(sizes, explode=explode, labels=labels, autopct='%1.1f%%',shadow=True, startangle=90)
         ax1.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
         st.pyplot(fig1)