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
    st.session_state["status"]="Fail"
    st.session_state["Type"]=""
    st.session_state["Section"]=""
    st.session_state["dept"]=""
    st.session_state["Name"]=""

with st.container():
    st.header("LOGIN")
    st.markdown(
        "Students, Resolver , Faculty Advisor and Department head logins"
    )
    with st.form("entry_form", clear_on_submit= True):
        login_type=st.selectbox("Login Type", ("Student", "Resolver", "Department", "Faculty Advisor"))
        unique_id=st.text_input(label="UNIQUE ID: Reg. No./ Employee ID/ Email ID for HOD")  
        password=st.text_input("Password", type='password')
        submitted = st.form_submit_button("Confirm")

        st.session_state.status= "Fail"
        
        if login_type=="Student":
            
            def login():
                f = open('db_student.json')
                data = json.load(f)
                if submitted and unique_id and password:
                    # Validate user credentials
                    for i in data['student']:
                        if i["regno"]==unique_id and i["dob"]==password:
                            st.success("Login successful")
                            st.session_state["status"] = i["regno"]
                            st.session_state["name"]=i["username"]
                            st.session_state["Type"]="Student"
                            return(i["username"], i["regno"])  
                    
                    st.error("Invalid Credentials")
                    st.session_state.status= "Fail"
                    f.close()
                return None
                      
            
            # Define the main page
            def student(name, reg_num):
                
                st.write("Student Name:", name)
                st.write("Register Number:", reg_num)
                st.info("Now you can go to Student Dashboard")
                #st.write("You have entered", st.session_state["status"])

            # Run the app
            if __name__ == "__main__":
                login_result = login()
                if login_result:
                    name, reg_num = login_result
                    student(name, reg_num)


        elif login_type=="Resolver":
            # Define the login page
            def login():
                f = open('db_resolver.json')
                data = json.load(f)
                if submitted and unique_id and password:
                    # Validate user credentials
                    for i in data['resolver']:
                        if i["empid"]==unique_id and i["email"]==password:
                            st.success("Login successful")
                            st.session_state["status"] = i["empid"]
                            st.session_state["Name"] = i["name"]
                            st.session_state["Type"]="Resolver"
                            st.session_state["dept"]=i["dept"]
                            return(i["name"], i["empid"]) 
                    
                st.error("Invalid Credentials")
                st.session_state.status= "Fail"
                f.close()           
                return None
                      
            
            # Define the main page
            def resolver(name, empid):
                
                st.write("Employee Name:", name)
                st.write("Employee Number:", empid)
                #st.write("You have entered", st.session_state["status"])

            # Run the app
            if __name__ == "__main__":
                login_result = login()
                if login_result:
                    name, empid= login_result
                    resolver(name, empid)

        elif login_type=="Faculty Advisor":
            # Define the login page
            def login():
                f = open('db_faculty.json')
                data = json.load(f)
                if submitted and unique_id and password:
                    # Validate user credentials
                    for i in data['faculty']:
                        if i["empid"]==unique_id and i["email"]==password:
                            st.success("Login successful")
                            st.session_state["status"] = i["empid"]
                            st.session_state["Name"] = i["name"]
                            st.session_state["Type"]="Faculty Advisor"
                            st.session_state["Section"]=i["section"]
                            return(i["name"], i["empid"]) 
                    
                st.error("Invalid Credentials")
                st.session_state.status= "Fail"
                f.close()           
                return None
                      
            
            # Define the main page
            def faculty(name, empid):
                
                st.write("Employee Name:", name)
                st.write("Employee Number:", empid)

            # Run the app
            if __name__ == "__main__":
                login_result = login()
                if login_result:
                    name, empid= login_result
                    faculty(name, empid)

        elif login_type=="Department":
            def login():

                if submitted and unique_id and password:
                    # Validate user credentials
                    f = open('db_department.json')
                    data = json.load(f)
                    for i in data['department']:
                        if i["email"]==unique_id and i["name"]==password:
                            st.success("Login successful")
                            st.session_state["status"] = i["name"]
                            st.session_state["Type"]="Department"
                            return(i["name"], i["designation"])
                            
                    
                    st.error("Invalid Credentials")
                    st.session_state.status= "Fail"
                    f.close()
                return None
                      
            
            # Define the main page
            def dept(name, designation):
                
                st.write("Employee Name:", name)
                st.write("Designation:", designation)
                #st.write("You have entered", st.session_state["status"])

            # Run the app
            if __name__ == "__main__":
                login_result = login()
                if login_result:
                    name, designation = login_result
                    dept(name,designation)     