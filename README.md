# BatteryCellify-Django

BatteryCellify-Django is a fullstack React and Python app that lets users upload and visualize battery cell data. Users can upload CSV spreadsheet files with thousands of rows and get graph data in seconds. Battery cell data is visualized with Plotly.js and React Charts. The Python backend uses Django, the Django REST Framework, and Django ORM to query the MySQL database. This project is also BatteryCellify 2.0, as it's an upgrade from a previous version of BatteryCellify that used a FastAPI Python backend. The focus for this new version was to clean up code, and to use more efficient database queries. With the help of Django and Django REST, the Python code is structured in a cleaner way.

View the live app here: https://batterycellify-django.vercel.app/

### Backend:

- Python (Django & Django REST Framework)
- MySQL (PlanetScale)
- Django ORM
- Pytest - Unit Testing
- JSON Web Tokens (JWT) - Auth
- Pandas - Handling spreadsheet data (.csv)

### Frontend:

- React.js (Javascript ES6+)
- Redux (Toolkit) - State management
- Material UI (MUI v5) - Minimal React Kit Theme
- Plotly.js & React Charts - Visualizing data in charts
- React Toastify - Notifications
- Prettier - Formatting
- ESLint - Linting
- Cypress - E2E/Integration tests

![landing page](https://github.com/jonathanleejono/BatteryCellify-Django/blob/main/assets/landing.png)
![landing page](https://github.com/jonathanleejono/BatteryCellify-Django/blob/main/assets/dashboard_app.png)
![landing page](https://github.com/jonathanleejono/BatteryCellify-Django/blob/main/assets/add_battery_cell.png)
![landing page](https://github.com/jonathanleejono/BatteryCellify-Django/blob/main/assets/all_battery_cells.png)
![landing page](https://github.com/jonathanleejono/BatteryCellify-Django/blob/main/assets/manage_csv.png)
![landing page](https://github.com/jonathanleejono/BatteryCellify-Django/blob/main/assets/battery_cell_graphs.png)
![landing page](https://github.com/jonathanleejono/BatteryCellify-Django/blob/main/assets/profile.png)
