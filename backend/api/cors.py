"""
Mirror of Tomorrow - CORS Configuration
---------------------------------------
Allows the frontend dashboard to communicate with the backend API.
"""

from fastapi.middleware.cors import CORSMiddleware

def apply_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],          # You can restrict this later if needed
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
