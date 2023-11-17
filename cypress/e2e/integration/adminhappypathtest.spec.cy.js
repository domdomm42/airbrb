describe('Happy Path', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  });

  it('Happy FLow', () => {
    // SIGN UP
    cy.visit('http://localhost:3000/register');
    const name = 'Jane Doe';
    const email = 'janedoe@gmail.com';
    const password = 'janedoe';
    const confirmPassword = 'janedoe';
    cy.get('input[name="name"]').focus().type(name);
    cy.get('input[name="email"]').focus().type(email);
    cy.get('input[name="password"]').focus().type(password); 
    cy.get('input[name="confirm-password"]').focus().type(confirmPassword);
    cy.get('button[type=submit]').click();

    // LOGGING IN
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').focus().type(email);
    cy.get('input[name="password"]').focus().type(password); 
    cy.get('button[type=submit]').click();

    cy.contains('My Listings').click();
    const title = 'Janes House';
    const updatedTitle = '(NEW)'
    const address = 'janehouse123';
    const city = 'sydney';
    const price = 1;
    const filename = '1kb.png';
    const newFilename = 'aa_end.png';
    const numBath = 1;
    const numBed = 1;


    // CREATING NEW LISTING
    cy.contains('Create a new listing').click();
    cy.get('input[name="title"]').focus().type(title);
    cy.get('input[name="address"]').focus().type(address);
    cy.get('input[name="city"]').focus().type(city); 
    cy.get('input[name="price"]').focus().type(price);
    cy.contains('Upload Thumbnail').click();
    cy.get('input[type="file"]').selectFile('cypress/fixtures/' + filename, { force: true });
    cy.get('#propertyType').click();
    cy.contains('li', 'Condo').click();
    cy.get('input[name="numBedrooms"]').focus().type(numBed); 
    cy.get('input[name="numBathrooms"]').focus().type(numBath); 

    cy.contains('label', 'WiFi').click(); 
    cy.contains('label', 'Pool').click(); 
    cy.contains('button', 'Create Listing').click();

    // EDITING TITLE AND THUMBNAIL
    cy.contains('My Listings').click();
    cy.contains('Edit').click();
    cy.get('input[name="title"]').focus().type(updatedTitle);
    cy.contains('Upload Thumbnail').click();
    cy.contains('Upload Thumbnail').find('input[type="file"]').selectFile('cypress/fixtures/' + newFilename, { force: true });
    cy.contains('button', 'Edit Listing').click();
    cy.visit('http://localhost:3000/');

    // PUBLISH LISTING
    cy.contains('My Listings').click();
    cy.contains(title).click();
    cy.contains('Go Live').click();
    cy.contains('label', 'Start Date 1').parent().find('input').click();
    cy.contains('label', 'Start Date 1').parent().find('input').clear().type('01/11/2023');
    cy.get('body').click(0,0); 


    cy.contains('label', 'End Date 1').parent().find('input').click();
    cy.contains('label', 'End Date 1').parent().find('input').clear().type('01/11/2024');
    cy.get('body').click(0,0); 

    cy.contains('button', 'Publish').click();
    cy.contains('My Listings').click();

    // UNPUBLISHES LISTING
    cy.contains('button', 'Unpublish').click();

    // REPUBLISHES LISTING
    cy.contains('My Listings').click();
    cy.contains('Go Live').click();
    cy.contains('label', 'Start Date 1').parent().find('input').click();
    cy.contains('label', 'Start Date 1').parent().find('input').clear().type('01/11/2023');
    cy.get('body').click(0,0); 


    cy.contains('label', 'End Date 1').parent().find('input').click();
    cy.contains('label', 'End Date 1').parent().find('input').clear().type('02/11/2024');
    cy.get('body').click(0,0); 

    cy.contains('button', 'Publish').click();

    cy.contains('button', 'Logout').click();
    
    // REGISTER ANOTHER USER FOR BOOKING
    cy.visit('http://localhost:3000/register');
    const newName = 'John Doe';
    const newEmail = 'johndoe@gmail.com';
    const newPassword = 'johndoe';
    const newConfirmpassword = 'johndoe';
    cy.get('input[name="name"]').focus().type(newName);
    cy.get('input[name="email"]').focus().type(newEmail);
    cy.get('input[name="password"]').focus().type(newPassword); 
    cy.get('input[name="confirm-password"]').focus().type(newConfirmpassword);
    cy.get('button[type=submit]').click();

    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').focus().type(newEmail);
    cy.get('input[name="password"]').focus().type(newPassword); 
    cy.get('button[type=submit]').click();

    cy.contains(title).click();

    // MAKE A BOOKING
    cy.contains('label', 'Start Date').parent().find('input').click();
    cy.contains('label', 'Start Date').parent().find('input').clear().type('06/11/2023');
    cy.get('body').click(0,0); 


    cy.contains('label', 'End Date').parent().find('input').click();
    cy.contains('label', 'End Date').parent().find('input').clear().type('01/11/2024');
    cy.get('body').click(0,0); 

    cy.contains('button', 'Book').click();

    // LOG OUT
    cy.contains('button', 'Logout').click();

    // RE LOG IN
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').focus().type(email);
    cy.get('input[name="password"]').focus().type(password); 
    cy.get('button[type=submit]').click();

    cy.contains('Hosted Listings').click();
    cy.contains('Accept').click();
    // LOG OUT
    cy.contains('button', 'Logout').click();

    // log back into the app successfully
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').focus().type(email);
    cy.get('input[name="password"]').focus().type(password); 
    cy.get('button[type=submit]').click();

  });
});