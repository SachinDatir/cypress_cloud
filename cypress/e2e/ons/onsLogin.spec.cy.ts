/// <reference types="cypress" />
import { LoginPage } from "../../support/LoginPage";
describe("Verify the ONs login", () => {
  let loginPage: LoginPage;
  beforeEach(() => {
    loginPage = new LoginPage();
    cy.visit("/");
  });
  it("Login on oneselect", () => {
    cy.env(["email", "password"]).then(({ email, password }) => {
      cy.visit("/");
     
      loginPage.onsLogin(email, password);
    });
    cy.url().should("include", "/module-selector");
    loginPage.applications.should("exist");
    loginPage.tabListItems.should("have.length.above", 3);
  });
});
