# Role-Based Access Control (RBAC) App

This is a **Role-Based Access Control (RBAC)** application built using the **MERN stack** (MongoDB, Express, React, Node.js). The app allows users with different roles (**Admin, Moderator, User**) to access different parts of the system based on their permissions. Users can register, log in, and view their profiles, with additional features for **Admins** and **Moderators**.

---

## Features

### 1. **User Authentication**
- Users can **register**, **log in**, and **log out** securely.
- The **role** of a newly registered user is **'User'** by default. This role can only be changed by the **Admin** in the **Manage Users** panel.

### 2. **Role-Based Access**
Different views and functionalities based on the user's role:
- **User**: Can only **add** content to the database and cannot **update** or **delete** it.
- **Moderator**: Can **add**, **update**, or **delete** content.
- **Admin**: Can **add**, **update**, or **delete** content, as well as **change roles** of users and **delete other users**.

### 3. **Profile Management**
- Each user can **view** and **manage** their profile.

### 4. **Error Handling**
- Proper **error messages** with **toast** notifications to ensure a smooth user experience.

### 5. **Secure Logout**
- Users can securely **log out**, and their session is properly ended.

### 6. **Protected Routes and APIs**
- Both **frontend routes** and **backend APIs** are well protected to ensure proper access control.

---

## Tech Stack

- **Frontend**:
  - React
  - React Router
  - Axios
  - Tailwind CSS

- **Backend**:
  - Node.js
  - Express

- **Database**:
  - MongoDB

- **Authentication**:
  - JWT (JSON Web Token)

- **Styling**:
  - Tailwind CSS
  - Custom Styles

- **Notifications**:
  - React-Toastify for **toast notifications**

---
