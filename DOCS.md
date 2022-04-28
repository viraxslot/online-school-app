## Online school API docs

**Document version**: v1.0.0 \
**Summary**: The purpose of this document is to briefly describe how Online School REST API works.
We will use `OSA` (stands for Online School API) abbreviation here and below.

### Common description

`OSA` allows you:

-   create different types of users
-   login with these users
-   create categories/courses/materials
-   enroll courses
-   ban users
-   etc

Please find more information in the following sections.

### Roles

There are 3 roles in `OSA`:

1. Admin
2. Teacher
3. Student

These roles have different permissions.
Please see the swagger documentation for more details. If an action is not permitted you'll receive an error message.

### About API methods

**Authentication**

Almost all `OSA` endpoints use JWT authentication. It means you'll receive a 401 HTTP code if you didn't pass an auth token.
Several endpoints don't require authentication.

For example `health` method will return you some system information: \
URL: `host/api/v1/health`\
Method: `GET`

```JSON
{
    "result": {
        "status": "OK",
        "currentDate": "2022-04-27T12:34:16.541Z"
    }
}
```

But in most cases, you'll need to register a user and log in first. Please keep it in mind.

**Swagger** \
Please use `swagger` to get detailed information about API methods. This document has only several examples and doesn't cover all business cases.

Swagger URL: `host/api/v1/api-docs`

### Common business flows

NB: Please replace "host" in the examples below and use the actual hostname.

**Register a user**

1. You can register a new admin with another admin credentials only
2. You can register student/teacher users without any credentials

Example: \
URL: `host/api/v1/users`\
Method: `POST`

Request body:

```JSON
{
    "login": "john-teacher",
    "firstName": "John",
    "lastName": "Smith",
    "email": "jsmith@gmail.com",
    "password": "StrongPassword123!",
    "role": "teacher"
}
```

Response body:

```JSON
{
    "id": 971,
    "login": "john-teacher",
    "email": "jsmith@gmail.com",
    "firstName": "John",
    "lastName": "Smith",
    "role": 2,
    "updatedAt": "2022-04-27T12:27:04.336Z",
    "createdAt": "2022-04-27T12:27:04.336Z"
}
```

**Get logged in**

You can log in with the username and password of the registered user.

Example: \
URL: `host/api/v1/session`\
Method: `POST`

Request body:

```JSON
{
    "username": "john-teacher",
    "password": "StrongPassword123!"
}
```

Response body: \
You'll receive an access token. You can use it to access other endpoints.

```JSON
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjk3MSwicm9sZUlkIjoyLCJpYXQiOjE2NTEwNjI2OTcsImV4cCI6MTY1MTA2OTg5N30.JbK3fEOObSA_oOdgAm4jPoWjp2DMTZ2q5ij4EgDS111"
}
```

**Create a category under an admin role**

Prerequisites: you've logged in under an admin.

Example: \
URL: `host/api/v1/categories`\
Method: `POST`\
Auth: Admin Bearer token

Request body:

```JSON
{
    "title": "Automation courses"
}
```

Response body:

```JSON
{
    "id": 372,
    "title": "Automation courses",
    "updatedAt": "2022-04-27T12:43:53.502Z",
    "createdAt": "2022-04-27T12:43:53.502Z"
}
```

Now we can use this category id for creating the courses.

**Create course and materials under a teacher role**

Prerequisites: you've logged in under a teacher.

Example: \
URL: `host/api/v1/courses`\
Method: `POST`\
Auth: Teacher Bearer token

Please pay attention that we used category id from the previous example in the request body.

Request body:

```JSON
{
    "title": "How to automate on javascript",
    "description": "Basic course about javascript automation",
    "visible": true,
    "categoryId": 372
}
```

Response body:

```JSON
{
    "id": 233,
    "title": "How to automate on javascript",
    "categoryId": 372,
    "description": "Basic course about javascript automation",
    "visible": true,
    "updatedAt": "2022-04-27T12:46:18.232Z",
    "createdAt": "2022-04-27T12:46:18.232Z"
}
```

Now we can use this course id for creating the materials.

Please pay attention that we used the course id from the previous example in the request URL.

Example: \
URL: `host/api/v1/courses/233/materials`\
Method: `POST`\
Auth: Teacher Bearer token

Request body:

```JSON
{
    "title": "My first material",
    "data": "Please understand how to use Postman",
    "order": 1
}

```

Response body:

```JSON
{
    "id": 209,
    "title": "My first material",
    "data": "Please understand how to use Postman",
    "order": 1,
    "courseId": 233,
    "updatedAt": "2022-04-27T12:49:25.756Z",
    "createdAt": "2022-04-27T12:49:25.756Z"
}

```

**Enroll the course under a student role**

Please pay attention that we used the course id from the previous example in the request URL.

Example: \
URL: `host/api/v1/courses/233/enroll`\
Method: `POST`\
Auth: Student Bearer token

Request body:

```JSON
empty
```

Response body:

```JSON
{
    "result": "You've successfully enrolled the course"
}
```

Now you can get the list of your courses.\
Please pay attention that we changed the HTTP method from POST to GET.

Example: \
URL: `host/api/v1/courses`\
Method: `GET`\
Auth: Student Bearer token

Request body:

```JSON
empty
```

Response body:

```JSON
[
    {
        "id": 233,
        "title": "How to automate on javascript",
        "description": "Basic course about javascript automation",
        "visible": true,
        "categoryId": 372
    }
]
```
