"""Security Headers Middleware for TAURUS AI BizFlow Backend"""

import os
from collections.abc import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Adds comprehensive security headers to all responses."""

    def __init__(
        self,
        app,
        hsts_max_age: int = 31536000,
        hsts_include_subdomains: bool = True,
        hsts_preload: bool = True,
        frame_options: str = "DENY",
        csp_report_uri: str | None = None,
    ):
        super().__init__(app)
        self.hsts_max_age = hsts_max_age
        self.hsts_include_subdomains = hsts_include_subdomains
        self.hsts_preload = hsts_preload
        self.frame_options = frame_options
        self.csp_report_uri = csp_report_uri
        self.is_production = os.getenv("ENVIRONMENT", "development") == "production"
        self.api_url = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:8000")
        self.csp = self._build_csp()

    def _build_csp(self) -> str:
        directives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: https: blob:",
            "font-src 'self' https://fonts.gstatic.com",
            f"connect-src 'self' {self.api_url} wss: https:",
            "frame-src 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
        ]
        if self.is_production:
            directives.append("upgrade-insecure-requests")
        if self.csp_report_uri:
            directives.append(f"report-uri {self.csp_report_uri}")
        return "; ".join(directives)

    def _build_hsts(self) -> str:
        hsts = f"max-age={self.hsts_max_age}"
        if self.hsts_include_subdomains:
            hsts += "; includeSubDomains"
        if self.hsts_preload:
            hsts += "; preload"
        return hsts

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)

        # Content-Security-Policy (report-only in dev, enforced in prod)
        csp_header = (
            "Content-Security-Policy-Report-Only"
            if not self.is_production
            else "Content-Security-Policy"
        )
        response.headers[csp_header] = self.csp

        # Strict-Transport-Security (only for HTTPS)
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = self._build_hsts()

        # X-Content-Type-Options
        response.headers["X-Content-Type-Options"] = "nosniff"

        # X-Frame-Options
        response.headers["X-Frame-Options"] = self.frame_options

        # X-XSS-Protection (deprecated but for legacy browsers)
        response.headers["X-XSS-Protection"] = "0"

        # Referrer-Policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Permissions-Policy
        response.headers["Permissions-Policy"] = (
            "accelerometer=(), ambient-light-sensor=(), autoplay=(), "
            "battery=(), camera=(), display-capture=(), "
            "document-domain=(), encrypted-media=(), "
            "execution-while-not-rendered=(), "
            "execution-while-out-of-viewport=(), "
            "fullscreen=(self), gamepad=(), geolocation=(), "
            "gyroscope=(), magnetometer=(), microphone=(), "
            "midi=(), navigation-override=(), "
            "oversized-images=(self), payment=(), "
            "picture-in-picture=(), "
            "publickey-credentials-get=(), sync-xhr=(self), "
            "usb=(), wake-lock=(), xr-spatial-tracking=()"
        )

        # Cross-Origin policies (Spectre/Meltdown mitigation)
        response.headers["Cross-Origin-Resource-Policy"] = "same-origin"
        response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
        response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"

        # Remove server identification
        response.headers.pop("Server", None)
        response.headers.pop("X-Powered-By", None)

        return response
