from flask import Flask, request, jsonify
import ollama
import re

app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        if not data or "prompt" not in data:
            return jsonify({"error": "Missing prompt"}), 400

        user_prompt = data["prompt"]
        response = ollama.chat(model="deepseek-r1:1.5b", messages=[{"role": "user", "content": user_prompt}])

        if not response or "message" not in response:
            return jsonify({"error": "Invalid response from Ollama"}), 500

        bot_response = response["message"]["content"]

        # Remove <think>...</think> using regex
        bot_response_cleaned = re.sub(r"<think>.*?</think>", "", bot_response, flags=re.DOTALL).strip()

        return jsonify({"response": bot_response_cleaned})

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(debug=True)

