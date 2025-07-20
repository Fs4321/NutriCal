# NutriCal – Calorie Tracker (React Native App)

Written by Fariha Shahrin

## Purpose
The **NutriCal** is a mobile app for tracking calories and nutrition. It is built using **React Native with Expo**. It allows users to manage track calories per meals, create own recipes to track calories and view personalized health summaries. This assessment was done using the REST API backend developed in Assessment 2.

## Features
- **User Authentication:** Register and log in to access the app features.
- **Calorie Tracking:** User can log predefined recipes or can create their own recipes from the ingredient list. Then they can log their meal. This way users could track calories and macros properly
- **Order healthy meal boxes:** Order specialized mealboxes and can access cart and checkout 

## Server side

**NutriCal API** is a backend calorie tracking system built using **Express.js**. It allows users to:
1. Track their daily caloric intake via Meal Logs.
2. Create and manage recipes  using real ingredients.
3. View and order predefined Meal Boxes.
4. Register as a user or admin.
5. Benefit from personalized calorie summaries and secure access.

This app is designed for people who aim to do track their nutrition and calorie intake and for administrators to manage the user, ingredient recipe and meal inventory.

## API Endpoints

### **User Management**
- `POST /api/users/register` – Register a new user.
- `POST /api/users/login` – Login existing user.
- `GET /api/users/current` – Fetch current logged-in user's profile.
- `GET /api/users` – [Admin] View all registered users.
- `PUT /api/users/:id` – Update user profile.
- `DELETE /api/users/:id` – Delete user account.

### **Ingredients**
- `GET /api/ingredient` – View all ingredients (supports search, sort, pagination).
- `GET /api/ingredient/:id` – Get a specific ingredient.
- `POST /api/ingredient` – [Admin] Add a new ingredient.
- `PUT /api/ingredient/:id` – [Admin] Update an ingredient.
- `DELETE /api/ingredient/:id` – [Admin] Delete an ingredient.

### **Recipes**
- `POST /api/recipe` – Create new recipe.
- `GET /api/recipe` – Get all recipes (with filtering, pagination).
- `GET /api/recipe/:id` – Get a specific recipe.
- `PUT /api/recipe/:id` – Update a recipe (creator or admin only).
- `DELETE /api/recipe/:id` – Delete recipe (creator or admin only).

### **Meal Logs**
- `POST /api/meallog` – Create a new meal log.
- `GET /api/meallog` – View logged-in user's meal logs (with filtering, pagination).
- `GET /api/meallog/:id` – View a specific meal log.
- `PUT /api/meallog/:id` – Update own meal log.
- `DELETE /api/meallog/:id` – Delete own meal log.

### **Meal Boxes**
- `GET /api/mealbox` – View all meal boxes (search, sort, pagination).
- `GET /api/mealbox/:id` – Get specific meal box.
- `POST /api/mealbox/create` – [Admin] Create a new meal box.
- `PUT /api/mealbox/:id` – [Admin] Update meal box.
- `DELETE /api/mealbox/:id` – [Admin] Delete meal box.
- `PATCH /api/mealbox/order/:id` – Place an order (decreases stock).
- `PATCH /api/mealbox/request/:id` – Request restock 

---

## Features

### Core
- User registration and login
- Create, Read, update, delete meal logs
- Recipe management
- Ingredient and user management (admin only)
- Meal box listing and order system

### Additional Implemented Features (Server & Client)
- **User Authentication:** Allows users to register, log in, and authenticate using JWT tokens.
- **Input Validation** Checks email format, password strength, age 
- **Pagination** 
- **Search + Sort Filtering**
- **Role-Based Access Control** (admin vs regular user) 


## Dependencies and Installation
The **NutriCal API** has the following dependencies, listed in the `package.json` file:

### Backend (Node.js / Express)

- **express**: The web framework used to handle HTTP requests and routing.
- **mongoose**: MongoDB Object Data Modeling (ODM) library used to interact with the database.
- **bcryptjs**: For hashing and verifying user passwords during authentication.
- **jsonwebtoken**: For creating and validating JWT tokens for user authentication.
- **dotenv**: For managing environment variables securely.
- **helmet**: Secures Express apps by setting various HTTP headers.
- **express-async-handler**: Simplifies error handling in async Express route handlers.
- **cors**: Enables Cross-Origin Resource Sharing for API access across different domains.
- **express-validator**: Validates and sanitizes user input in Express routes.

To install these dependencies, simply run `npm install` in the root directory of the project.

## Application Architecture

**NutriCal** follows a **RESTful architecture** with the following structure:
- **Express.js** handles HTTP requests, routes, and middleware to control the flow of data.
- **MongoDB** is used as the database for storing user and meal tracking related information, accessed through **Mongoose**.
- **JWT Authentication** is used to secure API endpoints. Users must log in to receive a JWT token, which is required to access protected routes.
- The application is divided into modules, such as **controllers** for managing business logic, **models** for interacting with the database, and **middleware** for tasks like authentication and error handling.
---

### Folder Structure:
```
/controllers     # Controller files handling business logic for user and calorie track related management
/models          # Mongoose models for the user, recipe,ingredient,meallog,mealbox
/routes          # API route definitions for user and task endpoints
/middleware      # Middlewares for authentication, error handling, and validation
/utils           # Helper-functions that are not middleware nor belong elsewhere
```

---
## App (Client side)

## Components
- **MealBoxCard** – Used in MealBoxesScreen to render each meal box with user for order.
- **MealLogCard** – Used in MealLogScreen to render meal logs per type with long press delete support.
- **RecipeCard** – Used in RecipeScreen to render each recipe with details and add-to-meal log capability.

## How to Contribute
To contribute to the development of this project:

1. **Fork** the repository and clone it to your local machine.
2. **Create a new branch** for your feature or bug fix.
3. Make your changes, ensuring you follow the existing code style and structure.
4. **Commit** your changes with clear and descriptive commit messages.
5. **Push** your changes to your forked repository.
6. **Submit a Pull Request** for review.


## Dependencies

The **NutriCal- Calorie tracker Frontend** is built using React Native and Expo and relies on the following dependencies, listed in the `package.json` file:

- **expo**: Framework for building universal React Native apps.
- **react**: Provides library for building user interfaces.
- **react-native**: Used for core runtime for native app development.
- **@react-navigation/native**: Enables screen-based navigation.
- **@react-navigation/native-stack**: Native stack navigation with smooth transitions.
- **@react-navigation/bottom-tabs** – Bottom tab navigator 
- **@react-native-safe-area-context:**: Ensures layouts respect notches and system UI.
- **@react-native-async-storage/async-storage:**: Used for storing the JWT token for session persistence.
- **@react-native-picker/picker** Provides dropdown picker UI.
- **expo-location:** for accessing device GPS/location to personalize user experience..
- **expo-status-bar:** Customize the status bar’s appearance.
- **react-native-reanimated** Enables gesture animations.
- **react-native-gesture-handler** for advanced gesture support like pinch and long press.

To install these dependencies, simply run:

```bash
npm install
```

To run the app, run:

```bash
npx expo start
```

## Application Architecture

The **NutriCal – Calorie Tracker (React Native App)** built with **React Native** components serving as the building blocks of the user interface. The application is organized into several screens, each with a specific responsibility:

- **Component:** Reusable UI elements for consistency and modularity across screens
- **Context:** is used for state sharing anywhere in the app
- **Screens:** Components that correspond to specific views in the application.
  - **Home:** The main landing page of the app.
  - **Login:** The login page for users to access the app.
  - **Register:** The registration page for new users.
  - **Dashboard:** The page for seeing summary of health, location , tips and navigation buttons to go to other pages
  - **Mealboxes:** The page where users can see specialized mealboxes and place orders for users only
  - **MealLogs:** The page where users log their daily meal and can see how much calories and macros each meal consists of. Also, on the top can see the summary of total consumed calories and macros.
  - **Recipes:** The page for selecting food for meallog. users can log predefined food or can create their own meal choosing ingredients and then log the meal to the meallog. Users can only see their own created and predefined meals
- **Services:** A centralized API utility module that sends a POST request to your backend's login endpoint.


### Folder Structure:
```           
/app
 /assets
  favicon.svg                # Application's favicon
  splash-icon.png 
  /components
    /GlobalLayout.js          #For shared layout with SafeAreaView
    /BottomTabs.js            # Main bottom tab navigator
    /MealBoxCard.js           # Renders each meal box
    /MealLogCard.js           # Renders each meal log
    /RecipeCard.js            # Renders each recipe
  /context
    /Cart.js                 # For CartScreen
  /screens                   # For screens that are the main pages of the app
    /CartScreen.js
    /CheckoutScreen.js
    /DashboardScreen.js
    /HomeScreen.js
    /LoginScreen.js
    /MealBoxScreen.js
    /MealLogScreen.js
    /RecipeScreen.js
    /RegisterScreen.js
  /services
    /api.js
  App.js                      # Main application component
  index.js
```

## How to Report Issues

If you encounter any issues with the **NutriCal- Calorie tracker App**, please follow these steps to report them:

1. Check the **Issues** page on the repository to see if your issue has already been reported.
2. If the issue has not been reported, **create a new issue** with the following details:
   - A clear description of the problem.
   - Steps to reproduce the issue, including any relevant code or error messages.
   - The expected behavior vs. the actual behavior.
   - Screenshots or logs (if applicable).
3. We will review the issue and provide updates as necessary.
