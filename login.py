import base64
import streamlit as st
import plotly.express as px
import csv
import json

df = px.data.iris()

@st.cache_data
def get_img_as_base64(file):
    with open(file, "rb") as f:
        data = f.read()
    return base64.b64encode(data).decode()

#Connecting to db 
#f = open('db_resolver.json')
#data = json.load(f)

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
    st.session_state["Name"]=""
    st.session_state["status"]="Fail"
    st.session_state["Type"]=""

with st.container():
    st.header("LOGIN")
    st.markdown(
        "Students, Admins and Department head logins"
    )

    with st.form("entry_form", clear_on_submit= True):
        login_type=st.selectbox("Login Type", ("Student", "Resolver", "Department"))
        unique_id=st.text_input(label="UniqueID")  
        password=st.text_input("Password", type='password')
        submitted = st.form_submit_button("Confirm")

        status_placeholder = st.empty() 

        st.session_state.status= "Fail"

        if login_type=="Student":
            status_placeholder.info("Enter your registration number as unique_id and Date of birth as password in dd-mm-yyyy format")
            def login():
                f = open('db_student.json')
                data = json.load(f)
                if submitted and unique_id and password:
                    # Validate user credentials
                    for i in data['student']:
                        if i["regno"]==unique_id and i["dob"]==password:
                            st.success("Login successful")
                            st.session_state["status"] = i["username"]
                            st.session_state["Type"]="Student"
                            return(i["username"], i["regno"])  
                    
                    st.error("Invalid Credentials")
                    st.session_state.status= "Fail"
                    f.close()
                return None
                      
            
            # Define the main page
            def student(name, reg_num):
                
                st.write("Student Name:", name)
                st.write("Register Number:", regno)
                #st.write("You have entered", st.session_state["status"])

            # Run the app
            if __name__ == "__main__":
                login_result = login()
                if login_result:
                    name, regno = login_result
                    student(name, regno)


        elif login_type=="Resolver":
            status_placeholder.info("Enter your empid as unique_id and your email id as password to login")
            # Define the login page
            def login():
                f = open('db_resolver.json')
                data = json.load(f)
                if submitted and unique_id and password:
                   
                    # Validate user credentials
                    for i in data['resolver']:
                        if i["__EMPTY"]==unique_id and i["emailid"]==password:
                            st.success("Login successful")
                            st.session_state["status"] = i["__EMPTY"]
                            st.session_state["Type"]="Resolver"
                            st.session_state["Name"]=i["name"]
                            return(i["name"], i["__EMPTY"]) 
                    
                st.error("Invalid Credentials")
                st.session_state.status= "Fail"
                f.close()           
                return None
                      
            
            # Define the main page
            def resolver(name,__EMPTY ):
                
                st.write("Employee Name:", name)
                st.write("Employee Number:", __EMPTY)
                #st.write("You have entered", st.session_state["status"])

            # Run the app
            if __name__ == "__main__":
                login_result = login()
                if login_result:
                    name, __EMPTY= login_result
                    resolver(name, __EMPTY)

        elif login_type=="Department":
            def login():

                if submitted and unique_id and password:
                    # Validate user credentials
                    f = open('DB_combined.json')
                    data = json.load(f)
                    for i in data['department']:
                        if i["empid"]==unique_id and i["name"]==password:
                            st.success("Login successful")
                            st.session_state["status"] = i["name"]
                            st.session_state["Type"]="Department"
                            return(i["name"], i["empid"])
                            
                    
                    st.error("Invalid Credentials")
                    st.session_state.status= "Fail"
                    f.close()
                return None
                      
            
            # Define the main page
            def dept(name, empid):
                
                st.write("Employee Name:", name)
                st.write("Employee Number:", empid)
                #st.write("You have entered", st.session_state["status"])

            # Run the app
            if __name__ == "__main__":
                login_result = login()
                if login_result:
                    name, empid = login_result
                    dept(name,empid)     