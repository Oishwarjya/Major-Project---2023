import streamlit as st
import plotly.express as px
import matplotlib.pyplot as plt

col1, col2, col3 = st.columns(3)

with col1:
   st.header("Computing Technologies")
   labels = 'Resolved', 'Pending'
   sizes = [20,80]
   explode = (0, 0.1)  # only "explode" the 2nd slice (i.e. 'Hogs')
   fig1, ax1 = plt.subplots()
   ax1.pie(sizes, explode=explode, labels=labels, autopct='%1.1f%%',shadow=True, startangle=90)
   ax1.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
   st.pyplot(fig1)

with col2:
   st.header("Networking and Communications")
   labels = 'Resolved', 'Pending'
   sizes = [40,60]
   explode = (0, 0.1)  # only "explode" the 2nd slice (i.e. 'Hogs')
   fig1, ax1 = plt.subplots()
   ax1.pie(sizes, explode=explode, labels=labels, autopct='%1.1f%%',shadow=True, startangle=90)
   ax1.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
   st.pyplot(fig1)
   
with col3:
   st.header("Computational Intelligence")
   labels = 'Resolved', 'Pending'
   sizes = [10,90]
   explode = (0, 0.1)  # only "explode" the 2nd slice (i.e. 'Hogs')
   fig1, ax1 = plt.subplots()
   ax1.pie(sizes, explode=explode, labels=labels, autopct='%1.1f%%',shadow=True, startangle=90)
   ax1.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
   st.pyplot(fig1)
   