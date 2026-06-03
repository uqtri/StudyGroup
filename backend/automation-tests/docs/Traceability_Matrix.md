# Traceability Matrix

Maps each API **Function Code** to Decision Table UTCIDs, unit tests (Service / API / E2E), and coverage status.

**UTCID key:** 01=Happy | 02=Validation | 03=Business Rule | 04=Authorization | 05=Exception | 06+=Extra branches

| Module | Function Code | UTCIDs Tested | Service Tests | API Tests | E2E Tests | Decision Table | Status |
|--------|---------------|---------------|---------------|-----------|-----------|----------------|--------|
| Auth | `register` | 01,03,04,05 | auth.service.test.js | auth.controller.test.js | auth.e2e.test.js | Yes | Passed |
| Auth | `login` | 01,02,03,04,06 | auth.service.test.js | auth.controller.test.js | auth.e2e.test.js | Yes | Passed |
| Auth | `me` | 01,04,05 | auth.service.test.js | auth.controller.test.js | — | Yes | Passed |
| Auth | `refresh` | 03,04 | auth.service.test.js | auth.controller.test.js | — | Yes | Partial |
| Auth | `logout` | 01,02 | auth.service.test.js | auth.controller.test.js | — | Yes | Passed |
| Users | `listUsers` | 01,05 | users.service.test.js | users.controller.test.js | — | Yes | Passed |
| Users | `getUserById` | 01,02,03 | users.service.test.js | users.controller.test.js | — | Yes | Passed |
| Users | `updateUser` | 01,02,04,06 | users.service.test.js | users.controller.test.js | — | Yes | Passed |
| Users | `setUserStatus` | 01,03,04,06 | users.service.test.js | users.controller.test.js | — | Yes | Passed |
| Users | `removeUser` | 01,05 | users.service.test.js | users.controller.test.js | — | Yes | Passed |
| Groups | `listGroups` | 01,05 | groups.service.test.js | groups.controller.test.js | groups.e2e.test.js | Yes | Passed |
| Groups | `getGroupById` | 01,02,06,07 | groups.service.test.js | groups.controller.test.js | — | Yes | Passed |
| Groups | `createGroup` | 01,02,04,05 | groups.service.test.js | groups.controller.test.js | groups.e2e.test.js | Yes | Passed |
| Groups | `updateGroup` | 01,02,04 | groups.service.test.js | groups.controller.test.js | — | Yes | Passed |
| Groups | `setGroupStatus` | 01,04 | groups.service.test.js | groups.controller.test.js | — | Yes | Passed |
| Groups | `removeGroup` | 01,04 | groups.service.test.js | groups.controller.test.js | — | Yes | Passed |
| Groups | `requestJoin` | 01,03,06 | groups.service.test.js | groups.controller.test.js | groups.e2e.test.js | Yes | Passed |
| Groups | `cancelJoinRequest` | 01,03 | groups.service.test.js | groups.controller.test.js | — | Yes | Passed |
| Groups | `approveJoinRequest` | 01 | groups.service.test.js | groups.controller.test.js | groups.e2e.test.js | Yes | Passed |
| Groups | `rejectJoinRequest` | 06 | groups.service.test.js | groups.controller.test.js | — | Yes | Passed |
| Groups | `handleJoinRequest` | 01,04,06 | groups.service.test.js | groups.controller.test.js | groups.e2e.test.js | Yes | Passed |
| Sessions | `listSessions` | 01,05 | sessions.service.test.js | sessions.controller.test.js | — | Yes | Passed |
| Sessions | `getSessionById` | 01,02,03 | sessions.service.test.js | sessions.controller.test.js | — | Yes | Passed |
| Sessions | `createSession` | 01,02,04,05 | sessions.service.test.js | sessions.controller.test.js | — | Yes | Passed |
| Sessions | `updateSession` | 01,04 | sessions.service.test.js | sessions.controller.test.js | — | Yes | Passed |
| Sessions | `endSession` | 01,05,06 | sessions.service.test.js | sessions.controller.test.js | — | Yes | Passed |
| Sessions | `notifyMembers` | 01 | sessions.service.test.js | sessions.controller.test.js | — | Yes | Passed |
| Sessions | `getLiveKitToken` | 01,03,04,05 | sessions.service.test.js | sessions.controller.test.js | — | Yes | Passed |
| Sessions | `removeSession` | 01 | sessions.service.test.js | sessions.controller.test.js | — | Yes | Partial |
| Attendance | `markAttendance` | 01,02,03,04,05 | attendance.service.test.js | attendance.controller.test.js | attendance.e2e.test.js | Yes | Passed |
| Attendance | `recordJoin` | 01,03,04,05 | attendance.service.test.js | attendance.controller.test.js | — | Yes | Passed |
| Attendance | `listAttendance` | 01,05 | attendance.service.test.js | attendance.controller.test.js | — | Yes | Passed |
| Resource Folders | `listResourceFolders` | 01,03,04,05 | resource-folders.service.test.js | resource-folders.controller.test.js | — | Yes | Passed |
| Resource Folders | `getResourceFolderById` | 01,03,04 | resource-folders.service.test.js | resource-folders.controller.test.js | — | Yes | Passed |
| Resource Folders | `createResourceFolder` | 01,02,04,05 | resource-folders.service.test.js | resource-folders.controller.test.js | — | Yes | Passed |
| Resource Folders | `updateResourceFolder` | 01,04 | resource-folders.service.test.js | resource-folders.controller.test.js | — | Yes | Passed |
| Resources | `listResources` | 01,03,04,05 | resources.service.test.js | resources.controller.test.js | — | Yes | Passed |
| Resources | `getResourceById` | 01,02,03 | resources.service.test.js | resources.controller.test.js | — | Yes | Passed |
| Resources | `createResource` | 01,02,03,05 | resources.service.test.js | resources.controller.test.js | resources.e2e.test.js | Yes | Passed |
| Resources | `toggleStarResource` | 01,02 | resources.service.test.js | resources.controller.test.js | — | Yes | Passed |
| Resources | `removeResource` | 01,02,04 | resources.service.test.js | resources.controller.test.js | — | Yes | Passed |
| Posts | `listPosts` | 01,02,05 | posts.service.test.js | posts.controller.test.js | — | Yes | Passed |
| Posts | `getPostById` | 01,03 | posts.service.test.js | posts.controller.test.js | — | Yes | Passed |
| Posts | `createPost` | 01,02,04,05 | posts.service.test.js | posts.controller.test.js | posts.e2e.test.js | Yes | Passed |
| Posts | `updatePost` | 01,03,04 | posts.service.test.js | posts.controller.test.js | — | Yes | Passed |
| Posts | `votePost` | 01,02 | posts.service.test.js | posts.controller.test.js | — | Yes | Passed |
| Posts | `removePost` | 01 | posts.service.test.js | posts.controller.test.js | — | Yes | Passed |
| Comments | `listCommentsByPost` | 01,03,04 | comments.service.test.js | comments.controller.test.js | — | Yes | Passed |
| Comments | `createComment` | 01,02,03,05 | comments.service.test.js | comments.controller.test.js | posts.e2e.test.js | Yes | Passed |
| Comments | `updateComment` | 01,04 | comments.service.test.js | comments.controller.test.js | — | Yes | Passed |
| Comments | `voteComment` | 01,02 | comments.service.test.js | comments.controller.test.js | — | Yes | Passed |
| Comments | `removeComment` | 01 | comments.service.test.js | comments.controller.test.js | — | Yes | Passed |
| Notifications | `listNotifications` | 01,05 | notifications.service.test.js | notifications.controller.test.js | — | Yes | Passed |
| Notifications | `getUnreadCount` | 01,05 | notifications.service.test.js | notifications.controller.test.js | — | Yes | Passed |
| Notifications | `markNotificationRead` | 01 | notifications.service.test.js | notifications.controller.test.js | — | Yes | Passed |
| Notifications | `markAllNotificationsRead` | 01 | notifications.service.test.js | notifications.controller.test.js | — | Yes | Passed |
| Dashboard | `getStats` | 01,02,03,05 | dashboard.service.test.js | dashboard.controller.test.js | — | Yes | Passed |
| Dashboard | `getGroupStats` | 01,03,04,05 | dashboard.service.test.js | dashboard.controller.test.js | — | Yes | Passed |
| Upload | `getCloudinarySignature` | 01,02,05 | — | upload.controller.test.js | — | Yes | Passed |
| Reports | `listReports` | 01,04,05 | reports.service.test.js | reports.controller.test.js | — | Yes | Passed |
| Reports | `createReport` | 01,02,05 | reports.service.test.js | reports.controller.test.js | — | Yes | Passed |
| Reports | `updateReportStatus` | 01,03,04 | reports.service.test.js | reports.controller.test.js | — | Yes | Passed |

---

## Related Artifacts

| Artifact | Path | Purpose |
|----------|------|---------|
| API Inventory | `API_Inventory_Table.md` | Function codes and pre-conditions |
| Decision Tables | `Decision_Tables.md` | Full condition decomposition + Confirm matrices |
| Coverage Report | `Coverage_Report.md` | UTCID coverage summary |
| Defect Report | `Defect_Report.md` | Defects mapped to UTCIDs |
| Test annotation script | `scripts/annotate-tests.mjs` | Applies UTCID prefixes to test names |
| Decision table generator | `scripts/generate-decision-tables.mjs` | Regenerates Decision_Tables.md from source definitions |

*Critical flows are covered end-to-end (E2E), capturing cross-module lifecycles. Decision tables are source-code driven per Phase 3 Strategy.*
