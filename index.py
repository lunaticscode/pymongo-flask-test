from flask import Flask, send_file
import account

app = Flask(__name__, static_url_path="/static")
app.register_blueprint(account.bp) # account.py에 작성된 route 들을 불러 들인다.

@app.get("/")
def show_index_page():
    index_page_html_path = 'static/html/index.html'
    return send_file(index_page_html_path)

if __name__ == '__main__':
    app.run()