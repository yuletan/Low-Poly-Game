import http.server
import socketserver
import webbrowser
import threading

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    url = f"http://localhost:{PORT}"
    print(f"\nServing at {url}")
    print("Press Ctrl+C to stop.\n")
    webbrowser.open(url + "/index.html")
    webbrowser.open(url + "/test.html")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print(f"\nServer stopped on port {PORT}.")
        httpd.shutdown()
