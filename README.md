# cerebral-module-router POC

This is a repository for a proof of concept for `cerebral-module-router`. It is also a second bid for inclusion of this PR: https://github.com/cerebral/cerebral-module-router/pull/92

Note! This repository is currently using a forked version of `cerebral-module-router` https://github.com/awei01/cerebral-module-router/

## Motivation

Sometimes you want to open a modal window from a variety of routes. See here: https://github.com/cerebral/cerebral-module-router/issues/96

Sometimes you want to perform a check before changing routes. See here: https://github.com/cerebral/cerebral-module-router/issues/93. Note that this does not handle a manual change of the URL. I'm sure that this could be handled by incorprating something like this: http://stackoverflow.com/questions/2029343/how-to-stop-window-unloading. I'll probably explore in future versions.

## Suggestions?
Code is kind of messy. I didn't spend much time on organization. But, should be fairly easy to grok. If you have any questions, please create an issue. If you have any suggestions or ideas to make this more `cerebral`, please submit an issue.

If you notice any use cases that I have missed, please submit an issue.

## General Concepts
1. If you want to add a check to ensure that a route can be routed or not, use the service `addRouteCheck` with a callback. The callback will be called with `state.get`
1. If you want to remove the route check, use the service `removeRouteCheck` with the same callback.
1. Before each route, check that the route is allowed to be routed by looping through all added route checks.
1. If it's okay, then proceed and `storeRoute` so that we can look back at previous route. (This is why I am using my fork of `cerebral-module-router`. I have a `getMatchedRoute` method)
1. If it's not okay, then reject the route and replace the browser history with the previous route. Optionally add some message for the UI. Also, store a flag in `state` noting that we've been rejected.
1. If the route has been rejected, you can optionally perform some other actions. Clear out the flag in `state`, so we can once again deny the route if necessary.

## Bonus Question
On lines 28-39 of `modules/App/index.js`. I cannot understand WTF is going on. The input gets messed up in the second function of the signal. If anyone can offer any insight, I'd greatly appreciate it.

Anyway, hope this helps someone.
