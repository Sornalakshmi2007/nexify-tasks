# TaskMaster Pro

Create a professional full-stack Task Management Application for my TiraneX internship Task 2.



This application must satisfy these requirements:



1. User authentication and authorization

2. User registration and login using email and password

3. Each user must only be able to access their own tasks

4. Full CRUD operations for tasks:

   - Create task

   - Read/view tasks

   - Update/edit task

   - Delete task

5. Task tracking with these statuses:

   - Pending

   - In Progress

   - Completed

6. Task fields:

   - Title

   - Description

   - Status

   - Priority

   - Due date

   - Created date

7. Dashboard showing:

   - Total tasks

   - Pending tasks

   - In Progress tasks

   - Completed tasks

8. Search and filter tasks

9. Responsive design for mobile and desktop

10. Clean professional UI suitable for an internship submission

11. Use Supabase for authentication and PostgreSQL database

12. Use Row Level Security so users can only access their own tasks

13. Use Supabase APIs for dynamic database operations

14. Add proper loading states and error messages

15. Add logout functionality

16. Do not use localStorage as the main database

17. Do not create fake/demo task data as the main data source



Database:



Create a tasks table with:

- id

- user_id

- title

- description

- status

- priority

- due_date

- created_at

- updated_at



Use the authenticated user's ID for user_id.



Create appropriate Row Level Security policies for SELECT, INSERT, UPDATE and DELETE so users can only access their own tasks.



Pages/components:



- Login page

- Registration page

- Dashboard

- Add Task form

- Edit Task form

- Task list

- Task details

- User profile/logout area



Make the application mobile-friendly because I will test and demonstrate it from an Android phone.



Use a modern professional design with clear buttons, cards, forms, navigation and responsive layouts.



This is for a TiraneX Task Management Application internship task. Make the implementation functional, not just a visual mockup.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://nexify-tasks.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ebf5a726-1cdd-4ed6-bab7-8471824c241b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
