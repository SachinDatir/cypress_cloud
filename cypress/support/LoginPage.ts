export class LoginPage {
  private readonly emailSelector: string = "[name=email]";
  private readonly passwordSelector: string = "[name=password]";
  private readonly loginButtonSelector: string = ".login-btn";
  readonly application: string = "#applications";
  readonly tabList: string = 'ul[role="tablist"]';

  get emailField(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.emailSelector);
  }

  get passwordField(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.passwordSelector);
  }

  get loginButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.loginButtonSelector,{timeout:10000});
  }

  get applications() {
    return cy.get("#applications");
  }

  get tabListItems() {
    return cy.get('[role="tablist"]').first().find("li");
  }

  // Page Object method
  enterEmail(email: string): void {
    this.emailField.clear().should("be.empty").type(email);
  }

  enterPassword(password: string) {
    this.passwordField.clear().should("be.empty").type(password);
  }

  onsLogin(email: string, password: string) {
    cy.intercept("GET", "/v1/globals/modelSelectionFilters").as(
      "moduleSelector",
    );
    cy.intercept("POST", "**/login").as("login");
    cy.intercept("POST", "**/checkOAuthUser").as("checkOAuthUser");
    this.loginButton.should("not.have.attr", "disabled");
    this.enterEmail(email);
    this.loginButton.click({ force: true });
    
    cy.wait("@checkOAuthUser", { timeout: 100000 })
      .its("response.body")
      .then(($res) => {
        const authProvider = $res.data.userMaster.authProvider;
        if (authProvider === "NATIVE") {
          expect($res.message).to.eq("Data found");
          this.loginButton.should("not.have.attr", "disabled");
          this.enterPassword(password);
          cy.intercept("POST", "**/login").as("login");
          cy.intercept("GET", "**/profile/**").as("profile");
          this.loginButton.click({ force: true });
          cy.wait("@login", { timeout: 100000 })
            .its("response.body")
            .then(($loginRes) => {
              if ($loginRes.status === "success") {
                expect($loginRes.message).to.eq("Login Success");

                const token = $loginRes.data.token;
                cy.task("setGlobal", { key: "authToken", value: token });
                return cy.wrap(token); // ✅ return
              } else if ($loginRes.status === "error") {
                throw new Error(
                  "Check your password or your account is not present or INACTIVE",
                );
              }
            });
        } else if (authProvider === "MICROSOFT") {
          this.loginButton.click({ force: true });
          cy.wait("@checkOAuthUser", { timeout: 100000 });
        }
      });
    cy.wait("@moduleSelector");
    cy.wait(1000);
  }
}
