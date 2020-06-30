# Routes

## API Routes

### Register User
* **URL**

    /api/register

* **Method**

    `POST`

* **JSON fields**

    * `username :: String`
    * `password :: String`
    * `confirm_password :: String`
    * `email`

* **Success response**

    * Code: 201
    * JSON: `{access_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTM0NzI4NDksIm5iZiI6MTU5MzQ3Mjg0OSwianRpIjoiY2YxNzYyYmMtY2Q0YS00YjdmLWI3ZTctYjQ4MWZjMmVhYzJiIiwiZXhwIjoxNTkzNDczNzQ5LCJpZGVudGl0eSI6InZwYXRoYWsyIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.dNW6qI9bdQcgH1GdbZfEzYwS9qVzVywC1peURip1h6E"}`
    * Cookies: `{name: "refresh_token", value: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTM0NzI4NDksIm5iZiI6MTU5MzQ3Mjg0OSwianRpIjoiYzdkODg2NjMtMmJkNC00OTRlLTgxZGYtYTBiYTkzMTM5ZGNiIiwiZXhwIjoxNTk2MDY0ODQ5LCJpZGVudGl0eSI6InZwYXRoYWsyIiwidHlwZSI6InJlZnJlc2gifQ.HFmrl0dcJLe6fdRTdV7epD4OTOMUCRT3mQUZID4G4Wk"}`

* **Error response**

    * Code: 400 <br />
      JSON: `{message: "passwords do not match"}`

    OR

    * Code: 400 <br />
      JSON: `{message: "username/email is already in use"}`

* **Sample call**

    ```
    fetch('https://fanbasemarket.com/api/register/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: 'vpathak',
            email: 'sample@email.com',
            password: 'samplepassword',
            confirm_password: 'samplepassword'
        })
    })
    ```

### Login User
* **URL**

    /api/login

* **Method**

    `POST`

* **JSON fields**

    * `username :: String`
    * `password :: String`

* **Success response**

    * Code: 200
    * JSON: `{access_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTM0NzI4NDksIm5iZiI6MTU5MzQ3Mjg0OSwianRpIjoiY2YxNzYyYmMtY2Q0YS00YjdmLWI3ZTctYjQ4MWZjMmVhYzJiIiwiZXhwIjoxNTkzNDczNzQ5LCJpZGVudGl0eSI6InZwYXRoYWsyIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.dNW6qI9bdQcgH1GdbZfEzYwS9qVzVywC1peURip1h6E"}`
    * Cookies: `{name: "refresh_token", value: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTM0NzI4NDksIm5iZiI6MTU5MzQ3Mjg0OSwianRpIjoiYzdkODg2NjMtMmJkNC00OTRlLTgxZGYtYTBiYTkzMTM5ZGNiIiwiZXhwIjoxNTk2MDY0ODQ5LCJpZGVudGl0eSI6InZwYXRoYWsyIiwidHlwZSI6InJlZnJlc2gifQ.HFmrl0dcJLe6fdRTdV7epD4OTOMUCRT3mQUZID4G4Wk"}`

* **Error response**

    * Code: 400 <br />
      JSON: `{message: "invalid username"}`

    OR

    * Code: 400 <br />
      JSON: `{message: "invalid password"}`

* **Sample call**

    ```
    fetch('https://fanbasemarket.com/api/register/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: 'vpathak',
            password: 'samplepassword'
        })
    })
    ```
