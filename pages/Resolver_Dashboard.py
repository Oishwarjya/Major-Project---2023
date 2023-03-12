import base64
import streamlit as st
import plotly.express as px
import matplotlib.pyplot as plt
import pandas as pd
from st_aggrid import AgGrid
from st_aggrid import AgGrid, GridOptionsBuilder

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
if st.session_state.status == "Fail":
    st.title("INVALID LOGIN!!")

else:
        
    st.markdown(page_bg_img, unsafe_allow_html=True)
    labels = 'Resolved', 'Pending'
    sizes = [20,80]
    explode = (0, 0.1)  # only "explode" the 2nd slice (i.e. 'Hogs')

    fig1, ax1 = plt.subplots()
    ax1.pie(sizes, explode=explode, labels=labels, autopct='%1.1f%%',shadow=True, startangle=90)
    ax1.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.

    st.sidebar.pyplot(fig1)
    #st.sidebar.image("srm.png", use_column_width=True)
    #st.sidebar.title("INFORMATION")
    #st.sidebar.markdown("This website is made to enable easier query and resolution for students ,specific to campus placements.")

    # Load AgGrid data
    data = pd.read_csv('your_data.csv')

    # Display AgGrid table
    # Create AgGrid options with checkbox selector column
    gb = GridOptionsBuilder.from_dataframe(data)
    gb.configure_selection('multiple', use_checkbox=True)
    gridOptions=gb.build()
    AgGrid(data,gridOptions=gridOptions)


    # Define function to send email
    def send_email(student_email, response):
        sender_email = "shreyashukla1203@gmail.com"
        sender_password = "123"
        
        message = MIMEMultipart()
        message['From'] = sender_email
        message['To'] = student_email
        message['Subject'] = "Response to your query"
        message.attach(MIMEText(response, "plain"))

        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            text = message.as_string()
            server.sendmail(sender_email, student_email, text)

    # Define function to save query to a database
    def save_query(name, email, query, priority):
        # This is where you would insert code to save the query to a database
        # For example, you could use SQLite or PostgreSQL to create a database

        # Create a dictionary to hold the query data
        query_data = {'Name': name,
                    'Email': email,
                    'Query': query,
                    'Priority': priority}

        # Append the query data to a Pandas DataFrame
        df = pd.DataFrame(query_data, index=[0])
        return df

    # Define function to display the query management interface
    def query_management(df):
        # Display a table of the queries
        st.write(df)

        # Allow the teacher to set the priority of each query
        for i, row in df.iterrows():
            priority = st.selectbox(f"Set priority for {row['Name']}'s query", ['Low', 'Medium', 'High'])
            df.loc[i, 'Priority'] = priority

        # Allow the teacher to respond to each query and send an email to the student
        for i, row in df.iterrows():
            st.write(f"Query from {row['Name']}: {row['Query']}")
            response = st.text_area(f"Response to {row['Name']}'s query")
            if st.button(f"Send response to {row['Name']}"):
                send_email(row['Email'], response)

        # Save the updated query data to the database
        # You will need to write your own code to save the data to a database
        st.write("Saving query data to database...")

    # Define the main function to run the dashboard
    def main():
        # Set the page title
        st.title("Faculty Dashboard")

        # Display the query submission form
        st.write("### Provide solution")
        name = st.text_input("Name")
        email = st.text_input("Email")
        query = st.text_area("Query")
        priority = st.selectbox("Priority", ['Low', 'Medium', 'High'])
        st.button("Update Priority")
        if st.button("Send Email"):
            query_data = save_query(name, email, query, priority)
            st.write("Query resolved successfully!")
            st.write(query_data)


        # Display the query management interface
        st.write("# Query Management")
        df = pd.read_csv('your_data.csv')

    if __name__ == "__main__":
        main()


