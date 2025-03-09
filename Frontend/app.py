import streamlit as st
import requests

st.title("Ollama Chatbot")

user_input = st.text_input("You:", "")

if st.button("Send"):
    try:
        response = requests.post("http://127.0.0.1:5000/chat", json={"prompt": user_input})
        if response.status_code == 200:
            result = response.json()
            st.text_area("Bot:", result.get("response", "No response"), height=200)
        else:
            st.error(f"Error: {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        st.error(f"Request failed: {e}")
