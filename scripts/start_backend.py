#!/usr/bin/env python3
"""
Script to start the FastAPI backend server
"""
import subprocess
import sys
import os

def main():
    # Change to backend directory
    backend_dir = os.path.join(os.path.dirname(__file__), '..', 'backend')
    os.chdir(backend_dir)
    
    print("Starting FastAPI server...")
    print("Backend will be available at: http://localhost:8000")
    print("API docs will be available at: http://localhost:8000/docs")
    
    # Start the FastAPI server
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "fastapi_server:app", 
            "--host", "127.0.0.1", 
            "--port", "8000", 
            "--reload"
        ], check=True)
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"Error starting server: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
