import streamlit as st
import requests
import base64
import csv
import matplotlib.pyplot as plt

def student_interface(token):
    # Authenticate the user using the token
    if not authenticate(token):
        st.error("Access denied. Please login first.")
        return

    st.write("## Student Interface")
    def student_page():
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

        st.sidebar.image("srm.png", use_column_width=True)
    


        st.markdown("<h1 style='color:#202A44;text-align:center;font-family: Cooper Black;font-size:30px;'>HAVE A PLACEMENT RELATED QUERY ? RESOLVE IT WITH SRM PQH !</h1>", unsafe_allow_html=True)  
        #student details
        st.markdown("<div style='display:flex; justify-content:space-between;'><p style='text-align:left;font-size:20px;'> Student Name:</p><p style='text-align:right;font-size:20px;'> Registration Number: </p></div>",unsafe_allow_html=True)

        st.markdown("<div style='text-align:center;color:#202A44;font-family: Cooper Black;font-size:23px;'>RAISE YOUR QUERY </div>", unsafe_allow_html=True)


        # Create FAQ dropdown
        st.markdown("<div style='text-align:left;font-size:20px;'> FAQ's (Frequently Asked Questions) </div>",unsafe_allow_html=True)
        faq = {
            "Test Related Issue": ["Did not receive the test link?","Test link provided is no more active?","Got logged out of the test?"],
            "Interview Related Issue": ["Did not receive the interview link?","Interviewer did not join for the interview?","Did not recieve the results of the interview round?"],
            "Results Related Issue": ["Results not declared yet(over 15 days)?"],
            "Post-Offer Related Issue": ["Did not receive the offer letter?","Date of joining for internship not informed yet?"],
            "Superset Related Issue": ["Unable to apply to a specific company?","Cannot find company in the list anymore on superset?","Unable to accept offer on superset?","Information regarding superset unfreeze?","Insufficient information about a specific company?","Verification of superset profile not done yet?"],
            "Eligibility Related Issue": ["Eligibilty criteria not given for a specific company?"],
            
        }

        category = st.selectbox("Select Category", list(faq.keys()))
        question = st.selectbox("Select Question", faq[category])

        if question == "Did not receive the test link?":
            st.write("A1")
        elif question == "Test link provided is no more active?":
            st.write("A2")
        elif question =="Got logged out of the test?":
            st.write("A3")
        elif question =="Did not receive the interview link?":
            st.write("A4")



        query = st.text_input("Any other Query ? Enter it in the box below:")
        submitted=st.form_submit_button("Submit")
        if submitted:
            st.write("Redirecting...")
        pass



        raised = 20
        resolved = 15

        st.markdown("<div style='text-align:center;color:#202A44;font-family: Cooper Black;font-size:20px;'>YOUR QUERY STATUS </div>", unsafe_allow_html=True)

        # Pie chart, where the slices will be ordered and plotted counter-clockwise:
        labels = 'Queries Raised', 'Queries Resolved'
        sizes = [raised, resolved]
        explode = (0, 0.1)  # only "explode" the 2nd slice (i.e. 'Queries Resolved')

        fig1, ax1 = plt.subplots()
        ax1.pie(sizes, explode=explode, labels=labels, autopct='%1.1f%%',
                shadow=True, startangle=90)
        ax1.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle

        st.pyplot(fig1)

    def authenticate(token):
        # Send a GET request to the Flask app to authenticate the user
        response = requests.get("http://localhost:5000/authenticate", headers={"Authorization": f"Bearer {token}"})
        if response.status_code == 200:
            return True
        else:
            return False
