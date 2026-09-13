from flask import Flask, render_template, request, redirect
import os

app = Flask(
    __name__,
    template_folder=os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "templates"
    ),
    static_folder=os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "static"
    )
)


# ==============================
# LOGIN PAGE
# ==============================

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        username = request.form.get("username")
        password = request.form.get("password")

        # Demo username and password
        if username == "admin" and password == "1234":
            return redirect("/")

        else:
            return """
            <script>
                alert("❌ Invalid Username or Password!");
                window.location.href = "/login";
            </script>
            """

    return render_template("login.html")


# ==============================
# DASHBOARD
# ==============================

@app.route("/")
def home():
    return render_template("dashboard.html")


# ==============================
# ROOMS
# ==============================

@app.route("/rooms")
def rooms():
    return render_template("rooms.html")


# ==============================
# START SERVER
# ==============================

if __name__ == "__main__":
    app.run(debug=True)