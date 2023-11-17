describe('Admin Happy Path', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  });

  it('Registers successfully', () => {
    cy.visit('http://localhost:3000/register'); // Navigate to the registration page
    const name = 'Jane Doe';
    const email = 'janedoe@gmail.com'
    const password = 'janedoe'
    const confirmPassword = 'janedoe'
    cy.get('input[name="name"]').focus().type(name);
    cy.get('input[name="email"]').focus().type(email);
    cy.get('input[name="password"]').focus().type(password); 
    cy.get('input[name="confirm-password"]').focus().type(confirmPassword);
    cy.get('button[type=submit]').click();
  });

  it('Creates a new listing successfully', () => {
    cy.visit('http://localhost:3000/mylistings'); // Navigate to the registration page
    const title = 'Janes House'
    const address = 'janehouse123'
    const city = 'sydney'
    const price = 1
    const type = 

    cy.contains('Create a new listing').click();
    cy.get('input[name="title"]').focus().type(title);
    cy.get('input[name="address"]').focus().type(address);
    cy.get('input[name="city"]').focus().type(city); 
    cy.get('input[name="price"]').focus().type(price);
    cy.contains('Upload Thumbnail').click();
    cy.get('input[name="propertyType"]').click();
    cy.contains('Condo').click();
    // Steps to create a new listing
  });

  it('Updates the thumbnail and title of the listing successfully', () => {
    // Steps to update listing thumbnail and title
  });

  it('Publishes a listing successfully', () => {
    // Steps to publish the listing
  });

  it('Unpublishes a listing successfully', () => {
    // Steps to unpublish the listing
  });

  it('Makes a booking successfully', () => {
    // Steps to make a booking
  });

  it('Logs out of the application successfully', () => {
    // Steps to log out
  });

  it('Logs back into the application successfully', () => {
    // Steps to log back in
  });
});