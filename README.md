# Full Stack Blog

A full-stack blog application built with Node.js, Express.js, MongoDB, and EJS for creating, updating, deleting, and viewing blog posts. This project demonstrates CRUD (Create, Read, Update, Delete) operations along with dynamic rendering using EJS templating.

## Website
[Live Demo](https://fullstack-blog-ruby.vercel.app)

## Features
- **Create, Read, Update, and Delete (CRUD)** blog posts
- **EJS templating** for rendering server-side HTML with dynamic content
- **Responsive design** to ensure usability across various devices
- **User-friendly interface** with a minimalistic approach

## Technologies Used
- **Frontend**: HTML, CSS, EJS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deployment**: Vercel

## Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/SURAJ-K-GUPTA/FULLSTACK-BLOG.git
    cd FULLSTACK-BLOG
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Configure environment variables**
   - Create a `.env` file in the root directory.
   - Add the following environment variables:
     ```plaintext
     MONGO_URL=<your-mongodb-uri>
     SESSION_KEY=<your-session-key>
     CLOUDINARY_NAME=<your-cloudinary-name>
     CLOUDINARY_KEY=<your-cloudinary-key>
     CLOUDINARY_SECRET_KEY=<your-cloudinary-secret-key>
     PORT=<your-port>
     ```

4. **Run the application**
    ```bash
    npm start
    ```

5. **Visit the app**
   - Open [http://localhost:3000](http://localhost:3000) in your browser to view the app locally.
