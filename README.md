# Online-Grocery-Store
Online Grocery Store is an eCommerce based web application for our Web Programming project. We had developed a sample in which user can search and find necessary information about any grocery item, can proceed to checkout to buy products. User can create an account, update personal information, can check its past activities, orders and transactions, and cart items.

# GitHub Repository
https://github.com/ParasGarg/Online-Grocery-Store/

# Project Presentation
https://drive.google.com/file/d/0B79vfV-wa7EZME9WVmsxTEpzMjg/view?usp=sharing

# Technologies Used
Frontend Languages: HTML, CSS, and Client-Side JavaScript
Frontend Framework: Bootstrap
Frontend Library: jQuery
Backend: Server-Side JavaScript
Backend Framework: NodeJS and NPM
Database: MongoDB
Other Libraries: Tota11y, and HTML Validator
Tools: MS Visual Code, MS Command Panel

# System Configuration
1. Install NodeJs 
2. Install MongoDB 3.4 Stable Version
3. Install Code Editor (Recommended MS Visual Code)
4. Install NPM Packages

# NPM Packages
"bcrypt": "^1.0.2",
"body-parser": "^1.17.1",
"connect-flash": "^0.1.1",
"cookie-parser": "^1.4.3",
"cookie-session": "^2.0.0-beta.1",
"express": "^4.15.2",
"express-handlebars": "^3.0.0",
"express-passport": "^0.1.0",
"express-passport-logout": "^0.1.0",
"express-session": "^1.15.2",
"handlebars-intl": "^1.1.2",
"handlebars-paginate": "^0.1.0",
"mongodb": "^2.2.26",
"passport": "^0.3.2",
"passport-local": "^1.0.0",
"path": "^0.12.7",
"randomstring": "^1.1.5",
"uuid": "^3.0.1",
"validator": "^7.0.0",
"xss": "^0.3.3"

# Project Initialization
After installing and configuration of system and environment. Follow steps to run the project - 
1. Import the "products" collection from database folder to get sample database. (Note: You can also import other collections if you  want to restore data of users and users other activities but for fresh deployment no need to import other collections as it would be created at the run-time).
2. Make sure you have install all node packages in the root folder to deploy the project.
3. Express server has to be initialed by npm manager on localhost:3000 by prompting commnad "npm start".

# Project Core Features
1. User SignUp/SignIn: User need to create account to make any kind of purchases but to check projects and other searches does not require user to be logged in. First user need to be get registered and logged in to check for recent activities, transactions, access e-wallet and items cart. For creating account user need to click on signup button fulfill all the create an account form requirement to get registered with us. In case your wants to be logged in, he need to go to sign in and provide its credentials which has been set up with us. In case user has forgot its password, we provide an module to regenerate a new password. The link for forgot module it can be found in sign in.

2. User Dashboard: To change user information and other settings we have developed modules in dashboard panel but user can also find all these options on the top right corner of the page when user click on his/her name.

	2.1 Account Settings: This module provide a panel to change users profile and password information.
	2.2 Payment Settings: This modules helps the user to store its card information with us for easy pay and order functionality.
	2.3 Wallet Settings: In this module user can maintain its e-cash by adding more cash or purchasing items without using any card information. User can add cash from saved cards, or use other than save card but user can add maximum of $1000 at one transaction and overall $10000 are allowed. At the same time user can check for its wallet activities and details on the same page.
	2.4 Order History: This feature helps the user to check all the past purchases and other details such as, date of purchase, products purchased, and  payment information.
	2.5 Newsletters: User can manage and subscribe or unsubscribe to our neweletters.
	2.6 Logout: User can successfully loggout to avoid exploitation of its account.

3. User Cart: User can add items or removed items or edit the quatity for each item (maximum 5 quantities per product is allowed). Here user can check for total payment information and proceed to checkout. 

4. Seach Product: User can seach by typing product's, id, name, brand, and category in the search bar that is present on the top of the page.

5. Filtered Search: USer can refine its search according to price range and category. This feature will be available in search results.

6. Category Search: User can directly search for products according to its category by selecting categories on the left top corner of the page right next to logo.

7. Product Information: User can check for the product information by clicking on the heading or a given view button on each product thumbnail and discover more about the product and can add it to it's cart by clicking on Add to Cart button under the display picture of an item.

8. Others: We have implemented fake gateway where user can select the mode of payment ie saved card, new card and wallet. User can pay for the amount by any of the listed modes and also and review its payment information at the bottom and then can pay and proceed to the final step which is confirmation where a confirmation message will be displayed and generate a transaction or order it (which would also be available in user dashboard).
