# angular-to-do-app

Developed By: Irvin Gil

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.7.

## Specs

### User story

A corporate todo list facilitates effective workflow management within organizations, enabling tracking of work progress and providing insights into project estimations. Your objective is to develop a web application for this purpose using Angular.

This todo list system defines three key roles:
- Manager: Responsible for adding tasks to the todo list. Tasks added by the manager are initially set to "awaited" status and are displayed in the "Awaited tasks" section.
- Admin: Can update task statuses from "awaited" to either "todo" or "denied". Tasks transition from the "Awaited tasks" section to the "TODO tasks" section upon approval by the admin. Alternatively, tasks can be permanently removed by setting their status to "denied".
- Developer: Tasks assigned as "todo" can be marked as "done" by the developer, causing them to move from the "TODO tasks" section to the "DONE tasks" section.

### Execution flow

#### 1. Manager's Actions:
- Manager logs in to the system.
- Manager adds tasks to the todo list, setting their initial status to "awaited".
#### 2. Admin's Actions:
- Admin logs in to the system.
- Admin reviews tasks in the "Awaited tasks" section.
- Admin can either approve tasks by updating their status to "todo", moving them to the "TODO tasks" section, or reject tasks and delete it from the system.
#### 3. Developer's Actions:
- Developer logs in to the system.
- Developer views tasks assigned as "todo" in the "TODO tasks" section.
- Developer marks tasks as "done", causing them to transition to the "DONE tasks" section upon completion.
#### 4. Admin's Cleanup:
- Admin logs in to the system.
- Admin reviews and deletes tasks from the "DONE tasks" section as needed.


