from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from parcle import Parcle
import os

load_dotenv()

client = Parcle(
    api_key=os.getenv("PARCLE_API_KEY")
)
app = Flask(__name__)
CORS(app)

def generate_cloud_answer(question):

    q = question.lower()

    if "ec2" in q:
        return "Check Security Groups, NACLs, instance status and whether ports 80/443 are open."

    elif "s3" in q:
        return "Check bucket policy, IAM permissions and public access settings."

    elif "iam" in q:
        return "Review attached policies, trust relationships and permission boundaries."

    elif "rds" in q:
        return "Verify database endpoint, security groups and database availability."

    return "Check logs, permissions, networking and service configuration."


@app.route("/")
def home():
    return "CloudOps Mentor API Running"


@app.route("/ask", methods=["POST"])
def ask():

    data = request.get_json()

    question = data.get("question", "")

    try:

        result = client.search(
            user_id="cloudops",
            query=question
        )

        if result.confidence >= 0.90:

            return jsonify({
                "answer": result.answer,
                "source": "memory"
            })

    except Exception as e:
        print("Search Error:", e)

    answer = generate_cloud_answer(question)

    try:

        client.ingest_dialog(
            user_id="cloudops",
            messages=[
                {
                    "role": "user",
                    "content": question
                },
                {
                    "role": "assistant",
                    "content": answer
                }
            ]
        )

    except Exception as e:
        print("Parcel Error:", e)

    return jsonify({
        "answer": answer,
        "source": "generated"
    })

@app.route("/stats")
def stats():

    return jsonify({
        "total_memories": 0,
        "memory_hits": 0,
        "new_solutions": 0
    })


@app.route("/memories")
def memories():

    return jsonify({
        "memories": []
    })

@app.route("/parcel-test")
def parcel_test():

    result = client.search(
        user_id="cloudops",
        query="EC2 website issue"
    )

    return jsonify({
        "answer": result.answer,
        "confidence": result.confidence
    })

if __name__ == "__main__":
    app.run(
    host="0.0.0.0",
    port=int(os.environ.get("PORT", 8080))
)

