# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.



# GitHub Desktop: Pull and Push Guide

This guide provides a simple, step-by-step process for pulling (downloading) and pushing (uploading) code using the GitHub Desktop application.

## Prerequisites
* GitHub Desktop installed and linked to your GitHub account.
* A repository cloned to your local machine.

---

## Part 1: How to Pull (Download Latest Changes)
Before making any changes to your code, you should always "pull" to ensure you have the most up-to-date version of the repository from your team.

1. **Open GitHub Desktop:** Launch the application on your computer.
2. **Select Your Repository:** In the top-left corner, click the **Current repository** dropdown and select the project you want to work on.
3. **Select Your Branch:** Next to it, click the **Current branch** dropdown and make sure you are on the correct branch.
4. **Fetch Origin:** Click the **Fetch origin** button located in the top-right corner. This checks the remote server for any new changes without modifying your local files yet.
5. **Pull Origin:** If there are new changes, the "Fetch origin" button will change to **Pull origin** (it will also show a number indicating how many commits you are behind). Click **Pull origin** to download and merge these changes into your local files.

---

## Part 2: How to Push (Upload Your Changes)
Once you have made your edits, saved your files, and are ready to share your work, you will "push" your changes to the remote repository.

1. **Review Your Changes:** Open GitHub Desktop. In the left panel, you will see a list of files you have modified, added, or deleted.
2. **Select Files to Commit:** Ensure the checkboxes next to the files you want to upload are checked.
3. **Write a Commit Message:** 
   * At the bottom left, look for a small form with the placeholder text "Update [filename]" or "Summary (required)".
   * Type a short, descriptive title for your changes (e.g., *Added new navigation bar*).
   * (Optional) Add more details in the "Description" box below it.
4. **Commit to Branch:** Click the blue button at the bottom that says **Commit to [branch name]**. This saves the changes locally to your Git history.
5. **Push Origin:** Look at the top-right corner of the app. The button will now say **Push origin** and show an up arrow with a number (indicating how many commits you are ahead). Click **Push origin** to upload your changes to GitHub.

---

### Pro Tips:
* **Always Pull Before You Push:** This prevents merge conflicts and ensures your work builds smoothly on top of the latest code.
* **Commit Often:** Make small, frequent commits with clear messages rather than one massive commit at the end of the week.