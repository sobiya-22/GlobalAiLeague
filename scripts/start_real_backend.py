#!/usr/bin/env python3
import subprocess
import sys
import os

def main():
    """Start the real FastAPI backend server"""
    backend_dir = os.path.join(os.path.dirname(__file__), "..", "backend")
    server_file = os.path.join(backend_dir, "fastapi_server.py")
    
    print("🚀 Starting Real AI Analysis Backend...")
    print("📡 Server will be available at: http://localhost:8000")
    print("🔗 API Documentation: http://localhost:8000/docs")
    print("💡 Make sure your API keys are configured in backend/agents.py")
    print("-" * 60)
    
    try:
        subprocess.run([sys.executable, server_file], cwd=backend_dir, check=True)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    main()
