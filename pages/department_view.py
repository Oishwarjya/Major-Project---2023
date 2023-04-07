import base64
import streamlit as st
import plotly.express as px
import matplotlib.pyplot as plt
import pandas as pd

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
    st.write("Department Head ID: ", st.session_state["status"])
    st.title("DEPARTMENT LEVEL DASHBOARD")

    
    section_names = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1','G1','H1','I1','J1','K1','L1','M1','N1','O1']
    resolved = [10, 8, 12, 9, 14, 11, 7, 15, 12, 13, 8, 10, 11, 9, 7]
    pending = [5, 4, 6, 7, 2, 5, 9, 1, 4, 3, 8, 6, 5, 7, 9]

    # Set up the plot
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.set_title('Queries by section')

    # Plot the bars side by side
    bar_width = 0.4
    bar_pos = list(range(len(section_names)))
    ax.bar(bar_pos, resolved, width=bar_width, label='Resolved')
    ax.bar([p + bar_width for p in bar_pos], pending, width=bar_width, label='Pending')

    # Set the x-axis labels
    ax.set_xticks([p + bar_width / 2 for p in bar_pos])
    ax.set_xticklabels(section_names, rotation=45, ha='right')

    # Set the legend
    ax.legend()

    # Show the plot
    st.pyplot(fig)
