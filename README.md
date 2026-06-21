# CloudOps Mentor AI

CloudOps Mentor AI is a memory-powered DevOps assistant built for Quackathon 2026.  
It acts as an AI engineering teammate that remembers past cloud issues, fixes, and architectural decisions using Parcle memory, enabling context-aware troubleshooting.

The system is deployed using Enter Pro and demonstrates an agentic workflow where the AI improves over time through stored memory.

---

## Features

- Persistent memory using Parcle
- Cloud troubleshooting assistant (AWS, EC2, S3, IAM, Load Balancer, etc.)
- Memory retrieval for past incidents and fixes
- Context-aware AI responses using historical data
- Simple chat-based interface
- Deployed using Enter Pro platform

---

## System Architecture

User Query → Frontend → Backend (Flask API) → AI Engine → Parcle Memory → Response

Parcle is used to:
- Store cloud issues and solutions
- Retrieve similar past incidents
- Improve response quality over time

---

## Tech Stack

- Frontend: HTML, CSS, JavaScript  
- Backend: Flask (Python)   
- Memory Layer: Parcle API  
- Deployment: Enter Pro  

---

## How It Works

1. User asks a cloud/DevOps question  
2. System checks Parcle for similar past issues  
3. If found, previous solution is returned  
4. If not found, AI generates a new solution  
5. The new issue and solution are stored in Parcle  
6. Future queries benefit from accumulated memory  

---

## Live Demo

Enter Pro Deployment Link:  
https://f5103f9600ce4e4b9a7d63d36defeb42.prod.enterapp.pro/

---

## Running Locally

### Install dependencies
```bash
pip install -r requirements.txt
```
### Set environment variables
  PARCLE_API_KEY=your_key
### Run backend
  python app.py
### Open application
  http://localhost:8000

### Project Purpose

Most AI assistants are stateless and do not retain knowledge across sessions.
This project solves that limitation by introducing persistent memory for DevOps troubleshooting, allowing the system to learn from past incidents and improve over time.

### Future Improvements

-Multi-cloud support (AWS, Azure, GCP)
-Automated incident detection from logs
-Shared team memory system using Parcle
-Real-time monitoring

### Built by team Byte_Builders
Quackathon 2026 Submission
