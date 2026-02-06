-Setting up and running the project-

I have GitHub ignoring the .env file so you will have to figure out what to configure your environment to in order to connect to the MongoDB of your choice. 
My Desktop .env is almost the same as the one on my Laptop but it required extra ports to run.

Once you connect your MongoDB URI and include PORT=3000 and JTW_SECRET=my_json_token in your .env file the rest should fall into place as it adds the schema needed to fetch and compare usernames and passwords.

-How authentication works-
There is a schema in the MongoDB for users that is used for registering and storing users. 
When logging in the User and Password is compared to the ones in the DB and looks for a match if there is one
If there isn't the login fails, and if it can't reach the database it will inform you that an error has occurred
If a login exists the program will let you know it was successful then after a brief delay take you back to the list with CRUD functionality.