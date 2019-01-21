import { assert } from "chai";

import { assign, Assigner, AssignmentNotifier, getAllVisible, ListReader, Reader } from ".";
import Intent from "../authz/intents";
import { assertIsRejectedWith, assertIsResolved } from "../lib/test/promise";
import { Project } from "./Project";
import { User } from "./User";

function newProject(id: string, permissions: object): Project {
  return {
    id,
    creationUnixTs: `${new Date().getTime()}`,
    status: "open",
    displayName: "A test project",
    assignee: "my-user",
    description: "This is a project created for, and during, testing.",
    amount: "1234",
    currency: "EUR",
    thumbnail: "",
    permissions,
  };
}

describe("When listing project,", () => {
  it("filters the list of projects according to the user's permissions.", async () => {
    const user: User = { id: "bob", groups: ["friends"] };

    const viewIntents: Intent[] = ["project.viewSummary", "project.viewDetails"];
    for (const viewIntent of viewIntents) {
      const projectVisibleToBob = newProject("bobProject", { [viewIntent]: ["bob"] });
      const projectVisibleToFriends = newProject("friendsProject", { [viewIntent]: ["friends"] });
      const nonVisibleProject = newProject("hiddenProject", {});

      const projects = [projectVisibleToBob, projectVisibleToFriends, nonVisibleProject];

      const lister: ListReader = () => Promise.resolve(projects);

      const visibleProjects = await getAllVisible(user, { getAllProjects: lister });

      assert.equal(visibleProjects.length, 2);
      assert.equal(visibleProjects[0].id, "bobProject");
      assert.equal(visibleProjects[1].id, "friendsProject");
    }
  });
});

describe("Assigning a project,", () => {
  it("requires a specific permission.", async () => {
    const alice: User = { id: "alice", groups: ["friends"] };

    const assignIntent: Intent = "project.assign";

    const projectAssignableToAlice = newProject("aliceProject", { [assignIntent]: ["alice"] });
    const projectAssignableToFriends = newProject("friendsProject", {
      [assignIntent]: ["friends"],
    });
    const nonAssignableProject = newProject("nonAssignableProject", {});

    const reader: Reader = id => {
      switch (id) {
        case "aliceProject":
          return Promise.resolve(projectAssignableToAlice);
        case "friendsProject":
          return Promise.resolve(projectAssignableToFriends);
        case "nonAssignableProject":
          return Promise.resolve(nonAssignableProject);
        default:
          return Promise.reject(id);
      }
    };

    const calls = new Map<string, number>();
    const assigner: Assigner = (projectId: string, _assignee: string): Promise<void> => {
      calls.set(projectId, (calls.get(projectId) || 0) + 1);
      return Promise.resolve();
    };

    const notifier: AssignmentNotifier = (project: Project, _assigner: string): Promise<void> =>
      Promise.resolve();

    const deps = {
      getProject: reader,
      saveProjectAssignment: assigner,
      notify: notifier,
    };

    await assertIsResolved(assign(alice, "aliceProject", "bob", deps));

    await assertIsResolved(assign(alice, "friendsProject", "bob", deps));

    await assertIsRejectedWith(assign(alice, "nonAssignableProject", "bob", deps), Error);

    assert.equal(calls.get("aliceProject"), 1);
    assert.equal(calls.get("friendsProject"), 1);
    assert.isUndefined(calls.get("nonAssignableProject"));
  });

  it("tells the notifier about the event only if successful.", async () => {
    const alice: User = { id: "alice", groups: ["friends"] };

    const assignIntent: Intent = "project.assign";

    const projectAssignableToAlice = newProject("aliceProject", { [assignIntent]: ["alice"] });
    const projectAssignableToFriends = newProject("friendsProject", {
      [assignIntent]: ["friends"],
    });
    const nonAssignableProject = newProject("nonAssignableProject", {});

    const reader: Reader = id => {
      switch (id) {
        case "aliceProject":
          return Promise.resolve(projectAssignableToAlice);
        case "nonAssignableProject":
          return Promise.resolve(nonAssignableProject);
        default:
          return Promise.reject(id);
      }
    };

    const assigner: Assigner = (projectId: string, _assignee: string): Promise<void> =>
      Promise.resolve();

    const calls = new Map<string, number>();
    const notifier: AssignmentNotifier = (project: Project, _assigner: string): Promise<void> => {
      calls.set(project.id, (calls.get(project.id) || 0) + 1);
      return Promise.resolve();
    };

    const deps = {
      getProject: reader,
      saveProjectAssignment: assigner,
      notify: notifier,
    };

    await assertIsResolved(assign(alice, "aliceProject", "bob", deps));
    await assertIsRejectedWith(assign(alice, "nonAssignableProject", "bob", deps), Error);

    assert.equal(calls.get("aliceProject"), 1);
    assert.isUndefined(calls.get("nonAssignableProject"));
  });
});
