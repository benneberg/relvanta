"""Firebase Admin SDK initialization for backend token verification."""
import base64
import os
import json
import logging
from typing import Optional
import firebase_admin
from firebase_admin import credentials, auth

logger = logging.getLogger(__name__)

def initialize_firebase():
    if firebase_admin._apps:
        return

    # Option 1: JSON via env (recommended)
    b64_json = os.getenv("FIREBASE_CREDENTIALS_JSON")
    if b64_json:
        cred_dict = json.loads(base64.b64decode(b64_json))
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
        logger.info("✅ Firebase initialized using FIREBASE_CREDENTIALS_JSON")
        return

    # Option 2: Path to file (only useful locally)
    path = os.getenv("FIREBASE_CREDENTIALS_PATH")
    if path and os.path.exists(path):
        cred = credentials.Certificate(path)
        firebase_admin.initialize_app(cred)
        logger.info("✅ Firebase initialized using FIREBASE_CREDENTIALS_PATH")
        return

    # No credentials
    logger.warning(
        "⚠️ Firebase credentials not found. "
        "Set FIREBASE_CREDENTIALS_PATH or FIREBASE_CREDENTIALS_JSON. "
        "Authentication will not work until configured."
    )

def verify_firebase_token(id_token: str) -> Optional[dict]:
    """
    Verify Firebase ID token.
    
    Args:
        id_token: The Firebase ID token to verify
        
    Returns:
        Decoded token claims or None if verification fails
    """
    app = initialize_firebase()
    
    if not app:
        logger.error("Cannot verify token: Firebase not initialized")
        return None
    
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except auth.InvalidIdTokenError:
        logger.warning("Invalid Firebase ID token")
        return None
    except auth.ExpiredIdTokenError:
        logger.warning("Expired Firebase ID token")
        return None
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        return None


def get_firebase_user(uid: str) -> Optional[dict]:
    """
    Get Firebase user by UID.
    
    Args:
        uid: The Firebase user ID
        
    Returns:
        User record or None if not found
    """
    app = initialize_firebase()
    
    if not app:
        return None
    
    try:
        user_record = auth.get_user(uid)
        return {
            'uid': user_record.uid,
            'email': user_record.email,
            'email_verified': user_record.email_verified,
            'display_name': user_record.display_name,
            'photo_url': user_record.photo_url,
            'disabled': user_record.disabled,
        }
    except Exception as e:
        logger.error(f"Error fetching user {uid}: {e}")
        return None
