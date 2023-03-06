import base64
import streamlit as st
import plotly.express as px
import csv

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

st.title("SRM PLACEMENT QUERY HANDLER")
st.sidebar.image("srm.png", use_column_width=True)
st.sidebar.title("Information:")
st.sidebar.markdown("This website is made to enable easier query and resolution for students ,specific to campus placements.")
if 'status' not in st.session_state:
    st.session_state["status"]=""

with st.container():
    st.header("LOGIN")
    st.markdown(
        "Students, Admins and Department head logins"
    )
    with st.form("entry_form", clear_on_submit= True):
        login_type=st.selectbox("Login Type", ("Student", "Resolver", "Department"))
        user_name=st.text_input(label="Username")  
        password=st.text_input("Password", type='password')
        submitted = st.form_submit_button("Confirm") 

        if login_type=="Student":
            def load_data(file):
                with open(file, 'r',encoding='UTF-8') as f:
                    reader = csv.reader(f)
                    header = next(reader)
                    data = [row for row in reader]
                return header, data

            header, data = load_data("student_data - Sheet1.csv")

            # Create a dictionary mapping column names to column index
            col_index = {col: index for index, col in enumerate(header)}
 
            # Define the login page
            def login():

                if submitted and user_name and password:
                    # Validate user credentials
                    for row in data:
                        if row[col_index['Name']] == user_name and row[col_index['Date of Birth']] == password:
                            st.success("Login successful")
                            st.session_state["status"] = row[col_index['Name']]
                            #st.write("You have entered: ",row[col_index['Name']] )
                            return (row[col_index['Name']], row[col_index['Register Number']])
                            
                    
                    st.error("Invalid Credentials")
                    st.session_state.status= "Fail"
                return None
                      
            
            # Define the main page
            def student(name, reg_num):
                
                st.write("Student Name:", name)
                st.write("Register Number:", reg_num)
                #st.write("You have entered", st.session_state["status"])

            # Run the app
            if __name__ == "__main__":
                login_result = login()
                if login_result:
                    name, reg_num = login_result

                    student(name, reg_num)
                 


        elif login_type=="Resolver":
            def load_data(file):
                with open(file, 'r',encoding='UTF-8') as f:
                    reader = csv.reader(f)
                    header = next(reader)
                    data = [row for row in reader]
                return header, data

            header, data = load_data("admin_data.csv")

            # Create a dictionary mapping column names to column index
            col_index = {col: index for index, col in enumerate(header)}
 
            # Define the login page
            def login():

                if submitted and user_name and password:
                    # Validate user credentials
                    for row in data:
                        if row[col_index['Name']] == user_name and row[col_index['Date of Birth']] == password:
                            st.success("Login successful")
                            st.session_state["status"] = row[col_index['Name']]
                            #st.write("You have entered: ",row[col_index['Name']] )
                            return (row[col_index['Name']], row[col_index['Employee Number']])
                            
                    
                    st.error("Invalid Credentials")
                    st.session_state.status= "Fail"
                return None
                      
            
            # Define the main page
            def admin(name, reg_num):
                
                st.write("Employee Name:", name)
                st.write("Employee Number:", reg_num)
                #st.write("You have entered", st.session_state["status"])

            # Run the app
            if __name__ == "__main__":
                login_result = login()
                if login_result:
                    name, reg_num = login_result
                    admin(name, reg_num)

        elif login_type=="Department":
            def load_data(file):
                with open(file, 'r',encoding='UTF-8') as f:
                    reader = csv.reader(f)
                    header = next(reader)
                    data = [row for row in reader]
                return header, data

            header, data = load_data("department_data.csv")

            # Create a dictionary mapping column names to column index
            col_index = {col: index for index, col in enumerate(header)}
             # Define the login page
            def login():

                if submitted and user_name and password:
                    # Validate user credentials
                    for row in data:
                        if row[col_index['Name']] == user_name and row[col_index['Date of Birth']] == password:
                            st.success("Login successful")
                            st.session_state["status"] = row[col_index['Name']]
                            #st.write("You have entered: ",row[col_index['Name']] )
                            return (row[col_index['Name']], row[col_index['Employee Number']])
                            
                    
                    st.error("Invalid Credentials")
                    st.session_state.status= "Fail"
                return None
                      
            
            # Define the main page
            def admin(name, reg_num):
                
                st.write("Employee Name:", name)
                st.write("Employee Number:", reg_num)
                #st.write("You have entered", st.session_state["status"])

            # Run the app
            if __name__ == "__main__":
                login_result = login()
                if login_result:
                    name, reg_num = login_result
                    admin(name, reg_num)

