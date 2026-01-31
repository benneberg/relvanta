"""Firebase Admin SDK initialization for backend token verification."""
import os
import json
import logging
from typing import Optional
import firebase_admin
from firebase_admin import credentials, auth

logger = logging.getLogger(__name__)

_firebase_app = None


def initialize_firebase() -> Optional[firebase_admin.App]:
    """
    Initialize Firebase Admin SDK.
    
    Supports two methods:
    1. Service account JSON file path (FIREBASE_CREDENTIALS_PATH)
    2. Service account JSON string (FIREBASE_CREDENTIALS_JSON) - for serverless
    
    Returns:
        Firebase app instance or None if initialization fails
    """
    global _firebase_app
    
    if _firebase_app is not None:
        return _firebase_app
    
    # Check if already initialized
    if len(firebase_admin._apps) > 0:
        _firebase_app = firebase_admin.get_app()
        return _firebase_app
    
    try:
        # Method 1: Use credentials from file
        creds_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
        if creds_path and os.path.exists(creds_path):
            logger.info(f"Initializing Firebase from file: {creds_path}")
            cred = credentials.Certificate(creds_path)
            _firebase_app = firebase_admin.initialize_app(cred)
            logger.info("✅ Firebase Admin SDK initialized from file")
            return _firebase_app
        
        # Method 2: Use credentials from environment variable (JSON string)
        creds_json = os.getenv('FIREBASE_CREDENTIALS_JSON')
        if creds_json:
            logger.info("Initializing Firebase from environment variable")
            cred_dict = json.loads(creds_json)
            cred = credentials.Certificate(cred_dict)
            _firebase_app = firebase_admin.initialize_app(cred)
            logger.info("✅ Firebase Admin SDK initialized from JSON")
            return _firebase_app
        
        # No credentials found
        logger.warning(
            "⚠️ Firebase credentials not found. "
            "Set FIREBASE_CREDENTIALS_PATH or FIREBASE_CREDENTIALS_JSON. "
            "Authentication will not work until configured."
        )
        return None
        
    except Exception as e:
        logger.error(f"❌ Firebase initialization failed: {e}")
        return None


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
