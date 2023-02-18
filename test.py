import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
from st_aggrid import AgGrid

# Load AgGrid data
data = pd.read_csv('your_data.csv')

# Create Streamlit app
st.title('AgGrid Data Visualization')
st.write('Here is the AgGrid data:')

# Display AgGrid table
AgGrid(data)

# Create chart
fig, ax = plt.subplots()
ax.bar(data['x'], data['y'])

# Set chart parameters
ax.set_title('Bar Chart')
ax.set_xlabel('X Label')
ax.set_ylabel('Y Label') 

# Display chart
st.pyplot(fig)