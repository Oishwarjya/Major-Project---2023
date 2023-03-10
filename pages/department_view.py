import base64
import streamlit as st
import plotly.express as px
import matplotlib.pyplot as plt

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
st.title("DEPARTMENT LEVEL DASHBOARD")

import matplotlib.pyplot as plt
import pandas as pd

# Retrieve data from the faculty dashboard (replace with your actual code)
resolved_data = {'Department 1': 50, 'Department 2': 70, 'Department 3': 40}
pending_data = {'Department 1': 20, 'Department 2': 30, 'Department 3': 50}

# Create a Pandas DataFrame from the data
resolved_df = pd.DataFrame.from_dict(resolved_data, orient='index', columns=['Resolved Queries'])
pending_df = pd.DataFrame.from_dict(pending_data, orient='index', columns=['Pending Queries'])
df = resolved_df.join(pending_df)

# Create a grouped bar chart
fig, ax = plt.subplots()
bar_width = 0.35
opacity = 0.8

# Plot the bars for resolved queries
rects1 = ax.bar(df.index.astype(str) + str(bar_width), df['Resolved Queries'], bar_width, alpha=opacity, color='b', label='Resolved Queries')

# Plot the bars for pending queries
rects2 = ax.bar(df.index.astype(str) + str(bar_width), df['Pending Queries'], bar_width, alpha=opacity, color='r', label='Pending Queries')

# Add labels and legend
ax.set_xlabel('Department')
ax.set_ylabel('Number of Queries')
ax.set_title('Queries Resolved vs. Pending by Department')
ax.set_xticks(pd.RangeIndex(len(df)) + (bar_width / 2))
ax.set_xticklabels(df.index)
ax.legend()

# Display the chart
plt.show()