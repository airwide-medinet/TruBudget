describe("Workflowitem's history", function() {
  let projectId;
  let subprojectId;
  let workflowitemId;
  const yesterday = Cypress.moment()
    .add(-1, "days")
    .format("YYYY-MM-DD");
  const tomorrow = Cypress.moment()
    .add(1, "days")
    .format("YYYY-MM-DD");
  const afterTomorrow = Cypress.moment()
    .add(2, "days")
    .format("YYYY-MM-DD");
  before(() => {
    cy.login();
    cy.createProject("p-subp-assign", "history search test").then(({ id }) => {
      projectId = id;
      cy.createSubproject(projectId, "history search test").then(({ id }) => {
        subprojectId = id;
        cy.createWorkflowitem(projectId, subprojectId, "history search test").then(({ id }) => {
          workflowitemId = id;
          // Create an history event in project history
          cy.visit(`/projects`);
          cy.get(`[data-test=project-card-${projectId}]`)
            // select all buttons which has an attribute data-test which value begins with pe-button
            .find("button[data-test^='pe-button']")
            .click();
          cy.get("[data-test=nameinput] input").type("-changed");
          cy.get("[data-test=submit]").click();
          cy.visit(`/projects/${projectId}`);
          cy.get("[data-test=project-history-button]").click();

          // Create an history event in subproject history
          cy.visit(`/projects/${projectId}`);
          cy.get(`[data-test=ssp-table]`)
            // select all buttons which has an attribute data-test which value begins with subproject-edit-button-
            .find("button[data-test^='subproject-edit-button-']")
            .click();
          cy.get("[data-test=nameinput] input").type("-changed");
          cy.get("[data-test=submit]").click();

          cy.visit(`/projects/${projectId}/${subprojectId}`);
          cy.get("[data-test=subproject-history-button]").click();

          // Create an history event in workflowitem history
          cy.visit(`/projects/${projectId}/${subprojectId}`);
          cy.get(`[data-test=workflowitem-table]`)
            // select all buttons which has an attribute data-test which value begins with edit-workflowitem
            .find("button[data-test^='edit-workflowitem']")
            .click();
          cy.get("[data-test=nameinput] input").type("-changed");
          cy.get("[data-test=next]").click();
          cy.get("[data-test=submit]").click();
        });
      });
    });
  });

  // beforeEach(function() {
  //   cy.login();
  //   //root is needed to view workflowitem history
  //   cy.login("root", "asdf");
  // });

  it("Project history: Check if history exists", function() {
    cy.login("root", "asdf");
    //Go to subproject history
    cy.visit(`/projects/${projectId}`);
    cy.get("[data-test=project-history-button]").click();
    cy.get("[data-test=search-history]").click();

    // The oldest entry is the create event
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 2)
      .last()
      .should("contain", "created project");

    // The newest entry is the update event
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .first()
      .should("contain", "changed project");
  });
  it("Project history: Fetch history with different filters", function() {
    // Filter by timeframe that does include both history items
    cy.get("[data-test=datepicker-filter-startat]").type(yesterday);
    cy.get("[data-test=datepicker-filter-endat]").type(tomorrow);
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 2);
    cy.get("[data-test=reset]").click();
    // Filter by timeframe that does not include both history items
    cy.get("[data-test=datepicker-filter-startat]").type(tomorrow);
    cy.get("[data-test=datepicker-filter-endat]").type(afterTomorrow);
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 0);
    cy.get("[data-test=reset]").click();
    // Filter by event type
    cy.get("[data-test=dropdown-filter-eventtype-click]").click();
    cy.get("[data-value=project_created]").click();
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 1);
    cy.get("[data-test=reset]").click();
    cy.get("[data-test=dropdown-filter-eventtype-click]").click();
    cy.get("[data-value=project_closed]").click();
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 0);
    cy.get("[data-test=reset]").click();
    // Filter by publisher (user id)
    cy.get("[data-test=dropdown-filter-publisher-click]").click();
    cy.get("[data-value=mstein]").click();
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 2);
    cy.get("[data-test=dropdown-filter-publisher-click]").click();
    cy.get("[data-value=jdoe]").click();
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 0);
    cy.get("[data-test=reset]").click();
  });

  it("Project history: Search with multiple values and reset search panel correctly", function() {
    // Search panel is collapsed and search values are reseted after closing it
    cy.get("[data-test=dropdown-filter-publisher-click]").click();
    cy.get("[data-value=mstein]").click();
    cy.get("[data-test=dropdown-filter-eventtype-click]").click();
    cy.get("[data-value=project_closed]").click();
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 0);
    // Re-open history
    cy.login("root", "asdf");
    cy.visit(`/projects/${projectId}/`);
    cy.get("[data-test=project-history-button]").click();
    cy.get("[data-test=search-history]").click();

    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 2);
  });

  it("Subproject history: Check if history exists", function() {
    cy.login("root", "asdf");
    //Go to subproject history
    cy.visit(`/projects/${projectId}/${subprojectId}`);
    cy.get("[data-test=subproject-history-button]").click();
    cy.get("[data-test=search-history]").click();

    // The oldest entry is the create event
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 2)
      .last()
      .should("contain", "created subproject");

    // The newest entry is the update event
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .first()
      .should("contain", "changed subproject");
  });
  it("Subproject history: Fetch history with different filters", function() {
    // Filter by timeframe that does include both history items
    cy.get("[data-test=datepicker-filter-startat]").type(yesterday);
    cy.get("[data-test=datepicker-filter-endat]").type(tomorrow);
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 2);
    cy.get("[data-test=reset]").click();
    // Filter by timeframe that does not include both history items
    cy.get("[data-test=datepicker-filter-startat]").type(tomorrow);
    cy.get("[data-test=datepicker-filter-endat]").type(afterTomorrow);
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 0);
    cy.get("[data-test=reset]").click();
    // Filter by event type
    cy.get("[data-test=dropdown-filter-eventtype-click]").click();
    cy.get("[data-value=subproject_created]").click();
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 1);
    cy.get("[data-test=reset]").click();
    cy.get("[data-test=dropdown-filter-eventtype-click]").click();
    cy.get("[data-value=subproject_closed]").click();
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 0);
    cy.get("[data-test=reset]").click();
    // Filter by publisher (user id)
    cy.get("[data-test=dropdown-filter-publisher-click]").click();
    cy.get("[data-value=mstein]").click();
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 2);
    cy.get("[data-test=dropdown-filter-publisher-click]").click();
    cy.get("[data-value=jdoe]").click();
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 0);
    cy.get("[data-test=reset]").click();
  });

  it("Subproject history: Search with multiple values and reset search panel correctly", function() {
    // Search panel is collapsed and search values are reseted after closing it
    cy.get("[data-test=dropdown-filter-publisher-click]").click();
    cy.get("[data-value=mstein]").click();
    cy.get("[data-test=dropdown-filter-eventtype-click]").click();
    cy.get("[data-value=subproject_closed]").click();
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 0);
    // Re-open history
    cy.login("root", "asdf");
    cy.visit(`/projects/${projectId}/${subprojectId}`);
    cy.get("[data-test=subproject-history-button]").click();
    cy.get("[data-test=search-history]").click();

    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 2);
  });

  it("Workflowitem history: Check if history exists", function() {
    cy.login("root", "asdf");
    //Go to workflowitem history
    cy.visit(`/projects/${projectId}/${subprojectId}`);
    cy.get("[data-test=workflowitem-table]")
      .find(`[data-test='workflowitem-info-button-${workflowitemId}']`)
      .click();
    cy.get("[data-test=workflowitem-history-tab]").click();
    cy.get("[data-test=search-history]").click();

    // The oldest entry is the create event
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 2)
      .last()
      .should("contain", "created workflowitem");

    // The newest entry is the update event
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .first()
      .should("contain", "changed workflowitem");
  });
  it("Workflowitem history: Fetch history with different filters", function() {
    // Filter by timeframe that does include both history items
    cy.get("[data-test=datepicker-filter-startat]").type(yesterday);
    cy.get("[data-test=datepicker-filter-endat]").type(tomorrow);
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 2);
    cy.get("[data-test=reset]").click();
    // Filter by timeframe that does not include both history items
    cy.get("[data-test=datepicker-filter-startat]").type(tomorrow);
    cy.get("[data-test=datepicker-filter-endat]").type(afterTomorrow);
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 0);
    cy.get("[data-test=reset]").click();
    // Filter by event type
    cy.get("[data-test=dropdown-filter-eventtype-click]").click();
    cy.get("[data-value=workflowitem_created]").click(); //workflowitem_created
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 1);
    cy.get("[data-test=reset]").click();
    cy.get("[data-test=dropdown-filter-eventtype-click]").click();
    cy.get("[data-value=workflowitem_closed]").click();
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 0); //or: should(not.be.visible)
    cy.get("[data-test=reset]").click();
    // Filter by publisher (user id)
    cy.get("[data-test=dropdown-filter-publisher-click]").click();
    cy.get("[data-value=mstein]").click();
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 2);
    cy.get("[data-test=dropdown-filter-publisher-click]").click();
    cy.get("[data-value=jdoe]").click();
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 0); //or: should(not.be.visible)
    cy.get("[data-test=reset]").click();
  });

  it("Workflowitem history: Search with multiple values and reset search panel correctly", function() {
    // Search panel is collapsed and search values are reseted after closing it
    cy.get("[data-test=dropdown-filter-publisher-click]").click();
    cy.get("[data-value=mstein]").click();
    cy.get("[data-test=dropdown-filter-eventtype-click]").click();
    cy.get("[data-value=workflowitem_closed]").click();
    cy.get("[data-test=search]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 0);
    cy.get("[data-test=workflowdetails-close]").click();
    cy.get(`[data-test^='workflowitem-info-button-${workflowitemId}']`).click();
    cy.get("[data-test=workflowitem-history-tab]").click();
    cy.get("[data-test=history-list]")
      .find("li.history-item")
      .should("have.length", 2);
  });
});
