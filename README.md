[![Build Status](https://travis-ci.org/DashboardHub/TribeDashboard.svg?branch=develop)](https://travis-ci.org/DashboardHub/TribeDashboard)

# TribeDashboard

An Open Source Dashboard for my social tribe. A simple and FREE dashboard that displays my GitHub, Twitter, YouTube and Instagram tribe (subscribers / followers etc). With the ability to upgrade to PRO that gives the history of how your tribe has changed today since yesterday and to see historically who has unsubscribe / unfollowed.

## Screenshots

![Sign in](https://user-images.githubusercontent.com/624760/56564339-b5771400-65a5-11e9-8ff1-aac6c8c8680c.jpg)
![Dashboard](https://user-images.githubusercontent.com/624760/56564299-a09a8080-65a5-11e9-9a85-732ae80e2099.jpeg)
![Detailed Activity](https://user-images.githubusercontent.com/624760/56564325-ae500600-65a5-11e9-9dc7-62e87f577b25.jpg)
![settings](https://user-images.githubusercontent.com/624760/56564310-a85a2500-65a5-11e9-8b72-abc267a315ed.jpg)

## Project guidelines

- Use issues for **epics** and **stories**. **Epics** are high level and **stories** are epics broken down into actual work actions. Use the **epics** and **stories** to discuss high level and more details respectively 
- **Stories** should be branched from `develop` with the issue as the name (e.g. `issue-123`) and go via a **pull request** and be reviewed by another team member. Once merged, branches are to be deleted
- **Stories** should be placed on the **sprint** milestone and the **project** board where they can be progressed (the smaller the better, ideally bite size and less that 1 day)
- **Commits** should have the `angular` [changelog](https://github.com/bcoe/conventional-changelog-standard/blob/master/convention.md) style **commits** and contain the issue number 

   Commit message example `feat(twitter): #123 My changes are ...`

- `master` automatically deploys to **production** and `develop` automatically deploys to **develop**

Any questions please just ask :)

## Technologies

- Angular (typescript)
- Material Design
- Firebase (typescript)

## Platforms

- GitHub
- TravisCI
- Firebase

## Run Cloud functions

  Make sure you have service account configured with your firebase account before starting with the below steps
- login using your firebase account `firbease login`
- To list the project associated with the account, use `firebase list`
- To use the credentials associated with your project, use `firebase use project-name`
- To run the cloud function use  `firebase serve`
- To deploy the cloud function use `firebase deploy`

## Quickstart

- Navigate to the `web` directory for the Angular project, then run `npm start`
- Navigate to the `functions` directory for Firebase cloud functions (typescript)

## Milestones / Project boards

- [Sprint 1 Milestone](https://github.com/DashboardHub/TribeDashboard/milestone/1) / [Sprint 1 Project board](https://github.com/DashboardHub/TribeDashboard/projects/1)
- [Sprint 2](https://github.com/DashboardHub/TribeDashboard/milestone/2)
