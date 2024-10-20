# Typo Terminator

"Typo Terminator" is a web-based game for practicing basic text editing using a keyboard.

The main-branch is being automatically deployed here: https://main.d2rz08zw1ht14m.amplifyapp.com/

## Idea / Background

> The idea was to create a game where I myself can practice text editing, both on Windows PCs and Macs. I decided to develop the game using React as I am most familiar and productive with it. However, I chose to use NextJS, which I don't use at work, to get more familiar with it.

## Features

- (should) work on all major browsers on Macs and Windows PCs
- levels have a data structure and are defined as data
- supported keys are backspace, delete and the right and left arrows together with the control/option key
- "the text" is manipulated using a virtual text area/editor
- 5 different levels

## About the code

**The aim was to develop the game as rapidly as possible**, and thus using familiar technologies ([React](https://react.dev/), [Playwright](https://playwright.dev/)). I also, of course, used AI to generate as much as possible of the code and content: mostly just [Github Copilot's](https://github.com/features/copilot) autocomplete, but also [ChatGPT](https://chatgpt.com/) for the level content.

## Developing

Prerequisites:
- Node.js > 20

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

NextJS came with linting but Prettier was added for formatting:

```bash
npm run format
npm run lint
```

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.


## Testing

### E2E Tests

The game is tested using [Playwright](https://playwright.dev/). The tests are located in the `e2e-tests`-folder. You can run the tests using:

```bash
npm run test:e2e
```

You can also run the tests in UI-mode (good while developing):

```bash
npm run test:e2e:ui
```

### Unit Tests

The virtual text area/editor became so complex that it is more specifically tested using [Vitest](https://vitest.dev/) unit tests. Unit tests can of course easily by added wherever needed. These tests are located side-by-side with the production code files in the `src`-folder. You can run the tests using:

```bash
npm run test
```

## Deployment

The game is deployed using [AWS Amplify](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html) (which has support for [NextJS in some degree](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-amplify-support.html)). The deployment is triggered by pushing to the main-branch.

