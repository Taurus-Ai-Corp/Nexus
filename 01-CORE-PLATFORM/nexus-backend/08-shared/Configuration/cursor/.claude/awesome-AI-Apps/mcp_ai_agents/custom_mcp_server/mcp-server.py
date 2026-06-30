import smtplib
from email.message import EmailMessage
from typing import Any

from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server
mcp = FastMCP("email")

# Global variables for email configuration
SENDER_NAME: str | None = None
SENDER_EMAIL: str | None = None
SENDER_PASSKEY: str | None = None

@mcp.tool()
def configure_email(
    sender_name: str,
    sender_email: str,
    sender_passkey: str
) -> dict[str, Any]:
    """Configure email sender details.
    
    Args:
        sender_name: Name of the email sender
        sender_email: Email address of the sender
        sender_passkey: App password or passkey for email authentication
    """
    global SENDER_NAME, SENDER_EMAIL, SENDER_PASSKEY
    SENDER_NAME = sender_name
    SENDER_EMAIL = sender_email
    SENDER_PASSKEY = sender_passkey

    return {
        "success": True,
        "message": "Email configuration updated successfully"
    }

@mcp.tool()
def send_email(
    receiver_email: str,
    subject: str,
    body: str
) -> dict[str, Any]:
    """Send an email to specified recipient.
    
    Args:
        receiver_email: Email address of the recipient
        subject: Subject line of the email
        body: Main content/body of the email
    
    Returns:
        Dictionary containing success status and message
    """
    if not all([SENDER_NAME, SENDER_EMAIL, SENDER_PASSKEY]):
        return {
            "success": False,
            "message": "Email sender not configured. Use configure_email first."
        }

    try:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = f"{SENDER_NAME} <{SENDER_EMAIL}>"
        msg["To"] = receiver_email
        msg.set_content(body)

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(SENDER_EMAIL, SENDER_PASSKEY)
            smtp.send_message(msg)

        return {
            "success": True,
            "message": "Email sent successfully"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error sending email: {str(e)}"
        }

if __name__ == "__main__":
    mcp.run(transport='stdio')
