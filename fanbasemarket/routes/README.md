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

    * Code: 200
    * JSON: `{id: 1, username: "vpathak", email: "sample@email.com", money: 10000}`

* **Error response**

    * Code: 400
    * JSON: `{message: "passwords do not match"}`
    OR
    * Code: 400
    * JSON: `{message: "username/email is already in use"}`

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
