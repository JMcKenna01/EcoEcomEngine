# EcoEcomEngine

## Description

The E-Commerce Back End project is a server-side application that enables the fundamental operations of an e-commerce website. It utilizes Express.js and Sequelize to interact with a MySQL database, allowing users to perform CRUD operations on products, categories, and tags.

## Usage

To run the E-Commerce Back End, follow these steps:

1. Clone the repository to your local machine.
2. Run `npm install` to install dependencies.
3. Create a `.env` file to store your MySQL username, password, and database name.
4. Use the `schema.sql` file in the `db` folder to create your database using MySQL shell commands.
5. Run `npm run seed` to seed data to your database.
6. Start the server using `npm start`.
7. Use Insomnia or a similar tool to test the API routes.

## Features

- Connect to a MySQL database using Sequelize.
- Store sensitive data like MySQL username, password, and database name in environment variables.
- Sync Sequelize models to a MySQL database on server start.
- Perform CRUD operations on categories, products, and tags through API routes.

## Technologies Used

- Node.js
- Express.js
- MySQL
- Sequelize
- dotenv

## Walkthrough Video

[Click here to view the walkthrough video.](#)

<!-- Replace # with the link to your walkthrough video -->

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes to your branch.
4. Push your branch to your fork.
5. Open a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License.


