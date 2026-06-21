#!/usr/bin/env python3
"""Minimal VoiceVox mock for CI smoketests. Listens on port 50021."""
import struct
from http.server import BaseHTTPRequestHandler, HTTPServer

# Minimal valid WAV: 44-byte header, 0 samples
WAV = (
    b"RIFF" + struct.pack("<I", 36) + b"WAVE" +
    b"fmt " + struct.pack("<I", 16) + struct.pack("<H", 1) +
    struct.pack("<H", 1) + struct.pack("<I", 22050) +
    struct.pack("<I", 44100) + struct.pack("<H", 2) +
    struct.pack("<H", 16) +
    b"data" + struct.pack("<I", 0)
)


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def _consume_body(self):
        length = int(self.headers.get("Content-Length", 0))
        self.rfile.read(length)

    def do_GET(self):
        self._consume_body()
        self._respond(200, b'"0.0.0"', "application/json")

    def do_POST(self):
        self._consume_body()
        if "/audio_query" in self.path:
            self._respond(200, b"{}", "application/json")
        elif "/synthesis" in self.path:
            self._respond(200, WAV, "audio/wav")
        else:
            self.send_response(404)
            self.end_headers()

    def _respond(self, status, body, content_type):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


HTTPServer(("", 50021), Handler).serve_forever()
